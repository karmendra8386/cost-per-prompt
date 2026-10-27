const $ = (s) => document.querySelector(s);
function renderTable() {
  const text = $('#text').value;
  const inp = window.CPP_estimateTokens(text);
  const out = Math.max(0, Math.round(inp * 2));
  $('#tokens').textContent = inp.toLocaleString() + ` in · ~${out.toLocaleString()} out`;
  const rows = window.CPP_PRICING.map(m => ({ m, cost: window.CPP_callCost(m, inp, out) })).sort((a, b) => a.cost - b.cost);
  const cheapest = rows.length ? rows[0].cost : 0;
  document.querySelector('#table tbody').innerHTML = rows.map(({ m, cost }) =>
    `<tr><td>${m.name}</td><td>${window.CPP_formatCost(cost)}</td><td>${cheapest > 0 ? (cost / cheapest).toFixed(1) + '×' : '—'}</td></tr>`).join('');
}
$('#text').addEventListener('input', renderTable);
chrome.storage.local.get(['cppSessions'], (res) => {
  const s = res.cppSessions || [];
  $('#sessions').innerHTML = s.slice(0, 6).map(x =>
    `<li>${new Date(x.ts).toLocaleString()} — ${x.host} · ${x.model} · ${x.conversationTokens.toLocaleString()} tok · ~${window.CPP_formatCost(x.estCostUSD)}</li>`
  ).join('') || '<li>No sessions yet. Open ChatGPT, Claude, or Gemini.</li>';
});
$('#export').addEventListener('click', () => {
  chrome.storage.local.get(['cppSessions'], (res) => {
    const blob = new Blob([JSON.stringify(res.cppSessions || [], null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cost-per-prompt-sessions.json'; a.click();
  });
});
$('#clear').addEventListener('click', () => chrome.storage.local.set({ cppSessions: [] }, () => location.reload()));
$('#options').addEventListener('click', () => chrome.runtime.openOptionsPage());
renderTable();
