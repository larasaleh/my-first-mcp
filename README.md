# Smart Notes & FAQ Assistant

An MCP (Model Context Protocol) server that helps students and self-learners
save notes and quickly retrieve answers to questions they've asked before,
instead of digging through scattered notes or re-answering the same
question twice.

## Tools

**P0 — working with real data:**
- **add_note** — saves a new note with optional tags. Persists to `data/notes.json`.
- **search_notes** — searches saved notes by keyword or tag, returns up to 10 matches.
- **get_faq_answer** — looks up a previously saved question and returns its stored answer, using keyword-overlap matching to avoid false positives.

**P1 — not implemented yet:**
- **add_faq** — saves a question and its answer as a reusable FAQ entry.
- **list_notes** — lists all saved notes, optionally filtered by tag.
- **delete_note** — removes a note by its ID.

## Architecture

- `src/index.ts` — server entry point, registers all 6 tools
- `src/lib/notes.ts` — pure functions for loading, searching, and creating notes/FAQs
- `src/lib/files.ts` — safe file reading, restricted to the `data/` folder (protects against path traversal)
- `src/schemas/notes.ts` — Zod schemas for tool input and stored data validation
- `data/notes.json` / `data/faqs.json` — local JSON fixtures, no external API or database required

## Setup

```bash
npm install
npm run dev
```

This starts the server on stdio using `serveStdio`. The process stays alive
waiting for requests — stop it with `Ctrl+C`.

## Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

## Example Payloads

Sample input payloads matching each tool's schema are available in the
[`examples/`](./examples) folder (one JSON file per tool) — useful for
testing each tool directly in MCP Inspector.

## Security

See [`SECURITY.md`](./SECURITY.md) for details on input validation, path
traversal protection, and how to report a security issue.

## Documentation

- [`docs/design.md`](./docs/design.md) — project pitch, tool inventory, and design decisions
- [`docs/data-plan.md`](./docs/data-plan.md) — data sources and failure modes for each P0 tool
- [`docs/threat-model.md`](./docs/threat-model.md) — security threat model and mitigations
- [`docs/review-checklist.md`](./docs/review-checklist.md) — peer review notes and action items

---

Built by Lara Saleh Jadallah Nassar.

