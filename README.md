# CostPerPrompt — AI Chat Cost Tracker (Chrome Extension)

Powered by [tokenecon](https://pypi.org/project/tokenecon/). See what your AI chats actually cost — live, in the page, across models.

On ChatGPT, Claude, Gemini, and AI Studio a badge (bottom-right) shows:

- **This prompt:** estimated tokens in + estimated cost incl. a ~2× reply
- **Conversation (visible):** total tokens of messages on the page
- **Cheapest alternative** for the same prompt, and the **spread** vs your current model — the 28× model spread from the Cost Per Correct research, live on your own prompts
- **Export session** as Cost Per Correct JSON (`total_cost_usd`, model, tokens; `tasks_solved` is null because browser chats are ungraded — fill it to compute cost-per-correct)

The popup is a standalone comparator: paste any prompt and see its cost on 9 models instantly, cheapest first.

## Prices & honesty

Public list prices, USD per 1M tokens, checked Oct 2026 (GPT-5 nano $0.05/$0.40 → Claude Opus 4.6 $5/$25). Token counts use a dependency-free heuristic (±10–15% vs a real tokenizer) — good for comparison, not billing. Edit prices in `pricing.js`. Full table in Options.

## Install (developer mode, 1 minute)

1. Unzip `cost-per-prompt.zip` (or use this folder)
2. Chrome → `chrome://extensions` → **Developer mode** on
3. **Load unpacked** → select the `cost-per-prompt` folder
4. Open any supported chat — the green badge appears. Or click the toolbar icon and paste a prompt to compare models with no chat open.

## Chrome Web Store (next step, needs you)

Same $5 developer account as Argus Lens covers both. Upload `cost-per-prompt.zip`, disclose: "No data collected or transmitted; session snapshots are stored locally in the browser only."

## Files

`pricing.js` (9 models, tokenecon call_cost) · `tokenizer.js` (heuristic estimator) · `content.js` (badge + session log + export) · `popup/` (comparator) · `options/` (price table + method)
Version 0.1.0 — MIT.
