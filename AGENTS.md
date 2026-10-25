# CineScope — Agent Guide
CineScope is a premium dark, TMDB-powered movie discovery SPA (React + Vite + TypeScript + React Router + Tailwind CSS).

Always-on rules live in .agents/rules/ (00 memory protocol, 01 stack & architecture, 02 TMDB & data layer, 03 design system).
The product spec and project status live in /docs. Read them before every task:
docs/PROJECT_BRIEF.md, docs/DEVELOPMENT_PLAN.md, docs/DECISIONS.md, docs/KNOWN_ISSUES.md, docs/CHANGELOG.md.
Workflows (slash commands) live in .agents/workflows/: /resume, /phase-done, /verify, /audit, /fix, /update-brief.
Never print, log, hardcode or commit the TMDB credential (.env.local only).
