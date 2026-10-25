---
description: Run build, lint, typecheck, tests and browser checks for CineScope
---
# /verify
1. In the terminal run: npm run typecheck, npm run lint, npm test, npm run build. Report failures and fix those that belong to current work.
2. Start the dev server in the background. Use the browser subagent to open every route that exists so far at 1440x900 and again at 390x844. Check: no console errors or warnings, no horizontal scroll, no layout overflow, focus rings visible, keyboard navigation works for header and primary controls. Capture screenshots for the walkthrough.
3. Compare each screen with .agents/rules/03-design-system.md. Anything that looks like a default template or breaks the tokens counts as a defect — fix it.
4. If the credential in .env.local is empty, verify the "credential missing" state instead of data screens and say so. Never print the credential.
5. For Discover, open the Network panel and confirm the exact TMDB query parameters; for Search, confirm one request after the debounce pause.
6. Stop the dev server. Report what passed, what failed, and what could not be verified.
