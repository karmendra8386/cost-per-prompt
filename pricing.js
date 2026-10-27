// Pricing — public list prices, USD per 1M tokens, checked Oct 2026.
// Estimates only. Edit in Options; recheck provider pages before decisions.
// Source model: tokenecon pricing.py (ModelTier.call_cost).
window.CPP_PRICING = [
  { id: 'gpt-5-nano',        name: 'GPT-5 nano',          vendor: 'OpenAI',    input: 0.05, output: 0.40 },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', vendor: 'Google', input: 0.10, output: 0.40 },
  { id: 'gpt-5-mini',        name: 'GPT-5 mini',          vendor: 'OpenAI',    input: 0.25, output: 2.00 },
  { id: 'gemini-2.5-flash',  name: 'Gemini 2.5 Flash',    vendor: 'Google',    input: 0.30, output: 2.50 },
  { id: 'claude-haiku-4.5',  name: 'Claude Haiku 4.5',    vendor: 'Anthropic', input: 1.00, output: 5.00 },
  { id: 'gpt-5',             name: 'GPT-5',               vendor: 'OpenAI',    input: 1.25, output: 10.00 },
  { id: 'gemini-2.5-pro',    name: 'Gemini 2.5 Pro',      vendor: 'Google',    input: 1.25, output: 10.00 },
  { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5',   vendor: 'Anthropic', input: 3.00, output: 15.00 },
  { id: 'claude-opus-4.6',   name: 'Claude Opus 4.6',     vendor: 'Anthropic', input: 5.00, output: 25.00 }
];
window.CPP_DEFAULT_MODEL_BY_HOST = {
  'chatgpt.com': 'gpt-5', 'chat.openai.com': 'gpt-5',
  'claude.ai': 'claude-sonnet-4.5',
  'gemini.google.com': 'gemini-2.5-flash', 'aistudio.google.com': 'gemini-2.5-flash'
};
window.CPP_callCost = function (model, inputTokens, outputTokens) {
  return inputTokens / 1e6 * model.input + outputTokens / 1e6 * model.output;
};
window.CPP_formatCost = function (v) {
  if (v === 0) return '$0.00';
  if (v >= 0.01) return '$' + v.toFixed(2);
  if (v >= 0.0001) return '$' + v.toFixed(4);
  return '$' + v.toFixed(6);
};
