// CostPerPrompt content script — live badge overlay on AI chat sites.
(function () {
  'use strict';
  const pricing = window.CPP_PRICING;
  const estimate = window.CPP_estimateTokens;
  const callCost = window.CPP_callCost;
  const fmt = window.CPP_formatCost;
  let selectedId = window.CPP_DEFAULT_MODEL_BY_HOST[location.hostname] || 'gpt-5';
  let sessionLoggedFor = '';

  chrome.storage.local.get(['cppSettings'], (res) => {
    if (res.cppSettings && res.cppSettings.modelByHost && res.cppSettings.modelByHost[location.hostname]) {
      selectedId = res.cppSettings.modelByHost[location.hostname];
    }
    render();
  });

  function findPromptBox() {
    const sels = ['#prompt-textarea','textarea[data-testid="chat-input"]','div.ProseMirror[contenteditable="true"]','rich-textarea div[contenteditable="true"]','div[contenteditable="true"]','textarea'];
    for (const s of sels) { const el = document.querySelector(s); if (el && el.offsetParent !== null) return el; }
    return null;
  }
  function getText(el) { if (!el) return ''; return el.tagName === 'TEXTAREA' ? el.value : (el.innerText || el.textContent || ''); }

  function conversationTokens() {
    // Sum visible message text — a proxy for conversation context size.
    const nodes = document.querySelectorAll('[data-message-author-role], .font-claude-message, model-response, .model-response-text, article');
    let total = 0, seen = new Set();
    nodes.forEach(n => { const t = ((n.innerText || n.textContent || '')).trim(); if (t.length > 1 && !seen.has(t)) { seen.add(t); total += estimate(t); } });
    return total;
  }

  function ensureBadge() {
    let b = document.getElementById('cpp-badge');
    if (b) return b;
    b = document.createElement('div');
    b.id = 'cpp-badge';
    b.innerHTML = `
      <div class="cpp-head"><span>💲 CostPerPrompt</span><button class="cpp-min" aria-label="Minimize">–</button></div>
      <div class="cpp-body">
        <label>Model <select id="cpp-model"></select></label>
        <div class="cpp-row"><span>This prompt</span><strong id="cpp-prompt">0 tok · $0.00</strong></div>
        <div class="cpp-row"><span>Conversation (visible)</span><strong id="cpp-conv">0 tok</strong></div>
        <div class="cpp-row"><span>If sent on cheapest model</span><strong id="cpp-cheap">—</strong></div>
        <div class="cpp-row"><span>Spread cheapest → this model</span><strong id="cpp-spread">—</strong></div>
        <div class="cpp-note">Estimate (±10–15%). Output cost assumes a reply ~2× prompt length until a reply appears. Prices: public list, Oct 2026.</div>
        <button id="cpp-export">Export session (Cost Per Correct JSON)</button>
      </div>`;
    document.body.appendChild(b);
    const sel = b.querySelector('#cpp-model');
    sel.innerHTML = pricing.map(m => `<option value="${m.id}">${m.name} — $${m.input}/$${m.output} per 1M</option>`).join('');
    sel.value = selectedId;
    sel.addEventListener('change', () => {
      selectedId = sel.value;
      chrome.storage.local.get(['cppSettings'], (res) => {
        const s = res.cppSettings || {}; s.modelByHost = s.modelByHost || {}; s.modelByHost[location.hostname] = selectedId;
        chrome.storage.local.set({ cppSettings: s });
      });
      render();
    });
    b.querySelector('.cpp-min').addEventListener('click', () => b.classList.toggle('min'));
    b.querySelector('#cpp-export').addEventListener('click', exportSession);
    return b;
  }

  function currentModel() { return pricing.find(m => m.id === selectedId) || pricing[0]; }

  function render() {
    const badge = ensureBadge();
    const box = findPromptBox();
    const promptText = getText(box);
    const promptTokens = estimate(promptText);
    const convTokens = conversationTokens();
    const model = currentModel();
    const assumedOutput = Math.max(50, Math.round(promptTokens * 2));
    const cost = callCost(model, promptTokens + Math.round(convTokens * 0.0), assumedOutput);
    const cheapest = [...pricing].sort((a, b) => callCost(a, promptTokens, assumedOutput) - callCost(b, promptTokens, assumedOutput))[0];
    const cheapCost = callCost(cheapest, promptTokens, assumedOutput);
    badge.querySelector('#cpp-prompt').textContent = `${promptTokens.toLocaleString()} tok in · ~${fmt(cost)} incl. est. reply`;
    badge.querySelector('#cpp-conv').textContent = `${convTokens.toLocaleString()} tok`;
    badge.querySelector('#cpp-cheap').textContent = promptTokens ? `${cheapest.name}: ${fmt(cheapCost)}` : '—';
    badge.querySelector('#cpp-spread').textContent = promptTokens && cheapCost > 0 ? `${(cost / cheapCost).toFixed(1)}×` : '—';
    badge.dataset.tokens = promptTokens;
    badge.dataset.convTokens = convTokens;
    // Persist a lightweight daily/session snapshot once per conversation size
    const key = location.pathname + ':' + convTokens;
    if (convTokens > 0 && key !== sessionLoggedFor) {
      sessionLoggedFor = key;
      chrome.storage.local.get(['cppSessions'], (res) => {
        const sessions = res.cppSessions || [];
        sessions.unshift({ ts: Date.now(), host: location.hostname, model: model.id, conversationTokens: convTokens, estCostUSD: callCost(model, convTokens, Math.round(convTokens * 0.4)) });
        chrome.storage.local.set({ cppSessions: sessions.slice(0, 100) });
      });
    }
  }

  function exportSession() {
    const badge = ensureBadge();
    const model = currentModel();
    const conv = Number(badge.dataset.convTokens || 0);
    const payload = {
      tool: 'CostPerPrompt (tokenecon)', exported_at: new Date().toISOString(),
      host: location.hostname, model: model.id,
      tasks_total: 1, tasks_solved: null,
      note: 'tasks_solved is null — browser sessions are ungraded. Fill it in to compute cost-per-correct = total_cost_usd / tasks_solved.',
      total_input_tokens_est: conv, total_cost_usd: Number(callCost(model, conv, Math.round(conv * 0.4)).toFixed(6))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'cost-per-prompt-session.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  let t;
  document.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 300); }, true);
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(render, 800); }).observe(document.body, { childList: true, subtree: true, characterData: false });
  setTimeout(render, 1200);
})();
