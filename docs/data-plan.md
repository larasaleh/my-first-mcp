# Week 3 Data Plan

| tool | source | fixture path | auth | failure modes | example response |
|------|--------|--------------|------|----------------|-------------------|
| add_note | local JSON file | `data/notes.json` | none | file missing, file not writable, malformed JSON | `{ "id": "note-4", "content": "...", "tags": ["..."] }` |
| search_notes | local JSON file | `data/notes.json` | none | empty file (no notes yet), no matches found | `{ "results": [{ "id": "note-1", "content": "...", "tags": ["git"] }], "matchType": "partial" }` |
| get_faq_answer | local JSON file | `data/faqs.json` | none | empty file, question not found | `{ "found": true, "answer": "Use the command: git checkout -b branch-name..." }` |

## Failure modes (detail)

- **Empty file**: if `data/notes.json` or `data/faqs.json` is empty or missing,
  the tool should return an empty result (e.g. `{ "results": [] }`) instead of
  crashing.
- **No matches found**: `search_notes` should return an empty `results` array
  with a clear message, not an error.
- **Question not found**: `get_faq_answer` should return `{ "found": false }`
  rather than throwing, so the caller can handle it gracefully.
- **Malformed JSON**: if the fixture file has invalid JSON syntax, the tool
  should catch the parse error and return a clear error message instead of
  crashing the whole server.

## Notes

- All three P0 tools use local JSON fixtures under `data/`, no external API
  or authentication required.
- No rate limits apply since there is no external network call.
- This satisfies the "Demo Day must work if Wi-Fi dies" rule from section 3.1.