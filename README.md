# Smart Notes & FAQ Assistant

An MCP (Model Context Protocol) server that helps students and self-learners
save notes and quickly retrieve answers to questions they've asked before,
instead of digging through scattered notes or re-answering the same
question twice.

## Requirements

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes bundled with Node.js)
- No API keys, no internet connection required — the server runs fully offline using local JSON files.

## Install

```bash
git clone https://github.com/larasaleh/my-first-mcp.git
cd my-first-mcp
npm install
```

## Run

```bash
npm run dev
```

This starts the server on stdio using `serveStdio`. The process stays alive
waiting for requests — stop it with `Ctrl+C`.

## Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

This opens a browser-based UI where you can call each tool directly with
sample input and see the response.

## Tools

| Tool | Status | Description |
|------|--------|-------------|
| `add_note` | ✅ P0 | Saves a new note with optional tags. Persists to `data/notes.json`. |
| `search_notes` | ✅ P0 | Searches saved notes by keyword or tag, returns up to 10 matches. |
| `get_faq_answer` | ✅ P0 | Looks up a previously saved question and returns its stored answer. |
| `add_faq` | 🚧 P1 (not implemented) | Saves a question and its answer as a reusable FAQ entry. |
| `list_notes` | 🚧 P1 (not implemented) | Lists all saved notes, optionally filtered by tag. |
| `delete_note` | 🚧 P1 (not implemented) | Removes a note by its ID. |

## Example Prompts

See [`examples/conversations.md`](./examples/conversations.md) for full 
example conversations showing tool calls and expected responses.


Once connected to an AI assistant, you can say things like:

- "Save a note that Git branches let you work on features separately, tag it 'git'."
- "Search my notes for anything about Zod."
- "What did I write down about how to create a new branch in git?"

## Architecture

- `src/index.ts` — server entry point, registers all 6 tools
- `src/lib/notes.ts` — pure functions for loading, searching, and creating notes/FAQs
- `src/lib/files.ts` — safe file reading, restricted to the `data/` folder (protects against path traversal)
- `src/schemas/notes.ts` — Zod schemas for tool input and stored data validation
- `data/notes.json` / `data/faqs.json` — local JSON fixtures, no external API or database required

## Troubleshooting

**1. `npm run dev` fails with "npm.ps1 cannot be loaded" (PowerShell error)**
This is a Windows PowerShell script-execution restriction, unrelated to
this project. Use Command Prompt (`cmd`) instead of PowerShell, or run
`npm install` and `npm run dev` from a plain CMD window.

**2. Inspector shows "Disconnected" and tools don't appear**
Make sure you clicked the toggle switch next to "Disconnected" in the top
right of the Inspector UI to actually connect to the server.

**3. A tool call returns "Invalid arguments" / a Zod validation error**
This is expected behavior, not a bug — it means the input didn't match
the tool's schema (e.g. an empty string, or `tags` sent as a string
instead of an array like `["work", "important"]`). Check the field
description shown in Inspector for the expected format.

## Security

See [`SECURITY.md`](./SECURITY.md) for details on input validation, path
traversal protection, and how to report a security issue.

## Documentation

- [`docs/design.md`](./docs/design.md) — project pitch, tool inventory, and design decisions
- [`docs/data-plan.md`](./docs/data-plan.md) — data sources and failure modes for each P0 tool
- [`docs/threat-model.md`](./docs/threat-model.md) — security threat model and mitigations
- [`docs/review-checklist.md`](./docs/review-checklist.md) — peer review notes and action items
- [`docs/test-plan.md`](./docs/test-plan.md) — manual test plan and results

## License

This project is part of the NextFlows Academy training cohort and is
intended for educational purposes.

---

Built by Lara Saleh Jadallah Nassar.
