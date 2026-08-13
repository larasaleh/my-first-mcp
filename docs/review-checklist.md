# Week 4 Peer Review Checklist

**Reviewer:** Roa Makhtoob
**Reviewed:** add_note, search_notes, get_faq_answer (P0 tools)
**Method:** Tested live via MCP Inspector + reviewed schemas/implementation

## Review Summary

| Area | Status |
|------|--------|
| Schemas (validation, bounds) | ✅ Good |
| Error handling | ✅ Good |
| Secrets | ✅ Not applicable / clean |
| Data allowlists (path traversal) | ✅ Tested — attack-like input treated as plain text, not a path |
| Output caps | ✅ Confirmed working (10-result limit + truncation message) |
| FAQ matching logic | 🔴 Must-fix — false positives found |

## Detailed Findings

### add_note — ✅ Working well
- `content`: required string, max 2000 chars, empty input correctly rejected
- `tags`: optional array, each tag 1–30 chars, max 10 tags, invalid types rejected
- Tested a path-traversal-looking value (`../../outside-data/test.txt`) as note
  content — treated as plain text, not interpreted as a filesystem path
- Errors don't expose internal implementation details

**Minor observation:** `tags` description should include an example format,
e.g. `["work", "important"]`, to make the expected input clearer.

### search_notes — ✅ Working well
- Case-insensitive keyword and tag search works correctly
- Empty queries rejected; queries over 200 chars prevented by schema
- Tested with >10 matching notes — correctly capped at 10 results with a
  truncation message

**Minor observation:** `searchNotesInputSchema` (in `src/schemas/notes.ts`)
defines an optional `limit` field, but the tool actually registered in
`index.ts` only accepts `query`. This is an inconsistency between the
documented schema and actual tool behavior.

### get_faq_answer — 🔴 Must-fix found
- Input validation, empty-question rejection, and length limits all work
  correctly
- **False-positive matching:** the current logic matches an FAQ if any
  single word longer than 3 characters from the stored question appears
  anywhere in the user's question. This causes incorrect matches — e.g.
  "Tell me something about branch" incorrectly matched the git-branch FAQ,
  and "What is Inspector?" incorrectly matched the Zod `.describe()` FAQ.

## Action Items

| # | Item | Owner | Due Date |
|---|------|-------|----------|
| 1 | Fix false-positive matching in `findFaqAnswer` — require multiple keyword matches or a stronger relevance check | Lara | End of Week 4 |
| 2 | Update `tags` field description to include an example format | Lara | End of Week 4 |
| 3 | Resolve inconsistency between `searchNotesInputSchema` (has `limit`) and the actual registered `search_notes` tool (no `limit`) | Lara | End of Week 4 |

## Peer Feedback (full text)

> Overall, the P0 tools have good input validation, clear error handling,
> and appropriate basic protections. The main issue I recommend addressing
> is the false-positive matching behavior in get_faq_answer, as it can
> directly affect the correctness of responses. The tags description and
> the unused limit schema are smaller usability and consistency
> improvements.
>
> — Roa Makhtoob