---
description: Read-only senior audit of CineScope against the brief, rules and design system
---
# /audit
First read all memory files. Do NOT modify code until the user approves.
A. Spec violations with file paths (brief + rules 01-03).
B. Bugs and risks: race conditions, missing abort cleanup, null-field crashes, Retry not refetching, pagination edge cases (page 1, last page, >500, empty), malformed localStorage, console errors, any types, regressions from earlier phases.
C. Evidence from code or the browser: (1) exact TMDB query for default Discover, (2) debounce delay and min-length logic, (3) watchlist key and stored fields, (4) SPA rewrites for Netlify and Vercel, (5) .env.local ignored by git and no credential anywhere in the repo or bundle source.
D. Design gaps versus rule 03 and accessibility/responsiveness gaps (check 360/768/1024/1440).
E. Whether /docs matches the real code.
F. Prioritised fix list: Critical / Important / Nice-to-have.
Log a summary in docs/CHANGELOG.md, then wait for approval.
