---
name: CLAUDE.md docs list state
description: Current state of the documentation file list in the CLAUDE.md Documentation First section
type: project
---

The `## IMPORTANT: Documentation First` section in CLAUDE.md currently references these docs:

- docs/ui.md
- docs/data-fetching.md
- docs/auth.md
- docs/data-mutations.md
- docs/routing.md

**Why:** This list must stay in sync with files added to /docs so that all agents consult the correct documentation before generating code.

**How to apply:** When a new file is added to /docs, append it to this list in CLAUDE.md and update this memory record.

## Notes on known docs

- `docs/routing.md` — covers route structure standards; all app routes must be nested under `/dashboard`. Added 2026-03-21.
