\# My First MCP Server



A simple MCP (Model Context Protocol) server built as a learning exercise.



\## Tools



\- \*\*greet\*\* — takes a `name` and returns a personalized greeting.

\- \*\*introduce\_me\*\* — takes a `greeting` word and introduces the server owner.



\## Setup



```bash

npm install

npm run dev

```



\## Testing with MCP Inspector



```bash

npx @modelcontextprotocol/inspector npx tsx src/index.ts

```



Built by Lara Saleh Jadallah Nassar.
## Week 2

### Tools (Multi-tool Skeleton)

Registered 6 planned tools for the Notes & FAQ Assistant project:

**P0 (working stubs, return placeholder JSON):**
- **add_note** — saves a new note with optional tags.
- **search_notes** — searches saved notes by keyword or tag.
- **get_faq_answer** — looks up a previously saved question and returns its answer.

**P1 (not implemented yet):**
- **add_faq** — saves a question and its answer as a reusable FAQ entry.
- **list_notes** — lists all saved notes, optionally filtered by tag.
- **delete_note** — removes a note by its ID.

### Running the server

```bash
npm run dev
```

This starts the server on stdio using `serveStdio`. The process stays alive
waiting for requests — stop it with `Ctrl+C`.

### Schemas

Zod input schemas for the P0 tools live in `src/schemas/notes.ts`, each field
documented with `.describe(...)`.

