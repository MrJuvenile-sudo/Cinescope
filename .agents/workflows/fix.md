---
description: Fix one bug minimally without regressions, then log it
---
# /fix
Ask the user for: Bug, Where (route/component/steps), Expected behaviour (per the brief) if not already provided.
1. Read memory files. Reproduce the bug (terminal or browser subagent) before changing code.
2. Fix only this issue with the smallest safe change. Do not refactor or regenerate unrelated code. Add or update a unit test when the logic is pure.
3. Run /verify. 4. Append to docs/CHANGELOG.md and docs/KNOWN_ISSUES.md, commit "fix: ...", and report which files changed and how it was verified.
