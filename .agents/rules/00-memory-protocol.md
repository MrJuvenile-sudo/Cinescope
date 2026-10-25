---
trigger: always_on
description: CineScope memory protocol — read docs before work, update docs after work
---
# Memory protocol (highest priority)
The project's memory is the repository, not the chat. Chat context can be lost; these files cannot.

BEFORE any task:
1. Read docs/PROJECT_BRIEF.md, docs/DEVELOPMENT_PLAN.md, docs/DECISIONS.md, docs/KNOWN_ISSUES.md and the last 3 entries of docs/CHANGELOG.md.
2. State in one line: current phase, what is complete, what is next.
3. If the code and the docs disagree, say so before continuing.

AFTER any task (or run the /phase-done workflow):
1. Update statuses in docs/DEVELOPMENT_PLAN.md ([ ] todo, [~] in progress, [x] done; keep "Current phase / Last completed / Next 3 tasks" accurate).
2. Append a dated entry to docs/CHANGELOG.md: phase, files changed, what was built, how it was verified.
3. Append to docs/DECISIONS.md whenever you interpreted or deviated from the brief.
4. Update docs/KNOWN_ISSUES.md.
5. Commit with a conventional message and tag completed phases as phase-N.

Rules for the memory files:
- CHANGELOG and DECISIONS are append-only. Never delete or rewrite history.
- Do not edit docs/PROJECT_BRIEF.md or the design rule (03) unless the user starts a message with "UPDATE BRIEF:" (use /update-brief).
- Regression guard: never remove, rename or regenerate working code from earlier phases unless the task requires it. Make minimal, targeted edits. Before finishing, name the earlier features you re-checked and confirm they still work.
- Never claim something works unless you ran it (build, tests, or browser verification) and say how.
