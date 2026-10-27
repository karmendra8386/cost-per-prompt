// Tokenizer approximation — no external deps.
// English text averages ~4 chars/token and ~0.75 tokens/word for GPT/Claude
// tokenizers. This heuristic splits on words + punctuation and corrects for
// long words, numbers, code, and non-Latin scripts. Expect ±10-15% vs a real
// tokenizer — good for cost comparison, not for billing.
window.CPP_estimateTokens = function (text) {
  if (!text) return 0;
  let tokens = 0;
  // CJK chars are roughly 1 token each
  const cjk = (text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) || []).length;
  tokens += cjk;
  const rest = text.replace(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g, ' ');
  // Words, numbers, and individual punctuation marks
  const pieces = rest.match(/[A-Za-z]+|\d+(?:[.,]\d+)?|[^\sA-Za-z\d]/g) || [];
  for (const p of pieces) {
    if (/^[A-Za-z]+$/.test(p)) tokens += Math.max(1, Math.ceil(p.length / 5)) * (p.length > 10 ? 1.3 : 1);
    else if (/^\d/.test(p)) tokens += Math.ceil(p.length / 3);
    else tokens += 1;
  }
  return Math.max(0, Math.round(tokens));
};
