---
description: Close a phase — verify, update docs, commit and tag
---
# /phase-done
1. Run the /verify workflow and fix anything it finds that belongs to the phase just built.
2. Update docs/DEVELOPMENT_PLAN.md: tick completed items, set "Current phase", "Last completed task" and "Next 3 tasks".
3. Append an entry to docs/CHANGELOG.md (date, phase, files changed, what was built, how it was verified — name the commands and the browser checks you actually ran).
4. Append to docs/DECISIONS.md if you interpreted or deviated from the brief. Update docs/KNOWN_ISSUES.md.
5. Regression check: list the earlier phases' features you re-checked and confirm they still work.
6. git add -A, commit with a conventional message (feat:/fix:/chore:), and tag phase-N. Never commit .env.local.
7. Reply with a 3-5 line summary and any open issues.
