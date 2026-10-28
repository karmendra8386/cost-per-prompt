# Privacy Policy — CostPerPrompt

_Last updated: October 27, 2026_

CostPerPrompt is a Chrome extension by Karmendra Pandey, powered by the open-source tokenecon project (https://pypi.org/project/tokenecon/).

## What the extension does

CostPerPrompt estimates token counts and costs for text you type or view on AI chat websites (chatgpt.com, chat.openai.com, claude.ai, gemini.google.com, aistudio.google.com), **locally in your browser**, and displays a cost badge and model comparison.

## Data collection: none

- **No data is collected, transmitted, sold, or shared.** The extension has no server, no analytics, and makes no network requests of its own.
- Token estimation and cost math happen entirely on your device.
- Lightweight session snapshots (site host, selected model, estimated conversation tokens and cost, timestamp) are stored only in your browser's local extension storage (`chrome.storage.local`) so the popup can show your recent sessions. They never leave your device and can be cleared at any time from the popup (**Clear**).
- Exports are files you explicitly generate and download to your own device.

## Permissions and why

- `storage` — to save your per-site model choice and the local session snapshots described above.
- Host access to the five AI chat sites listed above — so the badge can read message text on those pages to estimate tokens. The extension does not run on any other website.

## Limited use disclosure

CostPerPrompt does not use or transfer user data for any purpose unrelated to its single purpose (cost estimation). It does not use or transfer data to determine creditworthiness or for lending purposes.

## Changes

Any change to this policy will be published in this document in the extension's public repository, with an updated date.

## Contact

Karmendra Pandey — via the GitHub repository: https://github.com/karmendra8386/cost-per-prompt/issues
