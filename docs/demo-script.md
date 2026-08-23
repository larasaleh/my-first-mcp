# Demo Script — Smart Notes & FAQ Assistant

**Total time: 5 minutes**

## 0:00–0:40 — The Problem

Students and self-learners take notes across many study sessions and often
forget where they wrote something down, or end up re-answering the same
question multiple times because they don't remember writing it before.
This project is an MCP server that lets an AI assistant save notes,
search them by keyword, and instantly return answers to questions that
have already been recorded — instead of the user searching from scratch
every time.

## 0:40–1:10 — Architecture (one slide)

Show the architecture slide: a simple diagram —
`AI Assistant (Claude) → MCP Server (this project) → Local JSON files
(data/notes.json, data/faqs.json)`.
No external API, no database, no internet required — runs fully offline
using local fixture files, validated with Zod on every read and write.

## 1:10–3:30 — Live Tool Calls

Open MCP Inspector (`npx @modelcontextprotocol/inspector npx tsx src/index.ts`).

**Live prompt 1 (from `examples/conversations.md`, Conversation A):**
> "Save a note that Git branches let you work on features separately
> from the main codebase, and tag it with 'git' and 'week2'."

Call `add_note` live, show the note saved with a generated ID.

**Live prompt 2 (from `examples/conversations.md`, Conversation B):**
> "What did I write down about Zod?"

Call `search_notes` live, show it returning the real saved note about
Zod schemas.

**Backup prompt (in case something above doesn't cooperate):**
Call `get_faq_answer` with: "How do I create a new branch in git?" —
this reads from a small, unchanging fixture (`data/faqs.json`) and is
the most reliable of the three P0 tools to demo live.

## 3:30–4:30 — What I'd Build Next

- Implement the 3 remaining P1 tools (`add_faq`, `list_notes`,
  `delete_note`) — currently honest stubs that return
  "not implemented yet".
- Add the optional Resources feature (read-only FAQ list exposed
  directly to the model without a tool call), deferred from Week 3.
- Split `registerTool` calls into separate files under `src/tools/`
  to match the course's suggested skeleton, per mentor feedback in
  Week 3.

## 4:30–5:00 — Ready for Questions

Recap: 3 working P0 tools, real local data, input validation with Zod,
path traversal protection, peer-reviewed and hardened in Week 4, fully
tested in Week 5. Open the floor for questions.

## Backup Plan (if Wi-Fi fails)

This entire demo runs 100% offline already — MCP Inspector and the
server both run locally over stdio, with no network calls of any kind.
If, for any reason, MCP Inspector itself fails to launch, the fallback
is to show the pre-captured screenshots in `docs/evidence/` (happy path,
validation rejection, and empty/error case) instead of a live call.