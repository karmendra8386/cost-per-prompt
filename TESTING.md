# Testing

## What was tested (Oct 27, 2026, before first publish)

1. **Manifest** — valid JSON, Manifest V3, all referenced files present.
2. **JS syntax** — `node --check` passes on every script.
3. **Pricing / tokenizer logic (Node)** — sample prompt estimates and per-model costs reproduce the tokenecon formula `in/1e6 × in_price + out/1e6 × out_price` for all 9 models, cheapest-first ordering correct.
4. **DOM integration (jsdom, `tests/dom-test.js`)** — simulated chat page:
   - Badge is created and renders
   - Live prompt cost updates as text is typed (32 tok → ~$0.0007 on the sample)
   - Cheapest-vs-selected spread shows (25.0×)
   - Conversation tokens counted from visible messages
   - Result: **14/14 passed** across both extensions. The run caught one real bug — conversation counting relied only on `innerText`; fixed to fall back to `textContent`.

## What was NOT tested here

- Loading unpacked in a signed-in Chrome profile on the live chatgpt.com / claude.ai / gemini.google.com DOMs (this sandbox's headless Chromium cannot surface `chrome://extensions` or the live sites' signed-in DOM). Message selectors in `content.js` may need a tweak after a site redesign.
- Chrome Web Store review.

Run the DOM test: `npm i jsdom` then `node tests/dom-test.js`.

## Live install test (Oct 27, 2026, v0.1.2) — PASSED

First real-browser verification: Chromium 152 (headless) with the extension loaded
via --load-extension, driven by puppeteer-core against a ChatGPT-shaped page served
for the chatgpt.com origin. Verified end-to-end:
- MV3 service worker registered; extension ID assigned; zero console/page errors.
- Content script injected the badge; conversation counter read 34 tok from two
  visible messages; model dropdown listed all 9 models.
- Typing a prompt updated the badge live: "18 tok in", cheapest GPT-5 nano
  $0.000021, spread 25.0x.
- Clicking Export downloaded cost-per-prompt-session.json WITHOUT the downloads
  permission (Blob + anchor click) — JSON parsed with correct totals.
- Popup page rendered the 9-model comparator, responded to typed input, and listed
  the session snapshot persisted via chrome.storage by the content script.
- Screenshot: ../store-assets/cpp-live-install-test.png (real capture).
Still untested: the live sites' own logged-in DOMs (selectors target their current
prompt-box markup; the same selectors fired correctly on the shaped page).
