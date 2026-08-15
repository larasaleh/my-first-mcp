# Manual Test Plan — Week 5

Test cases for the 3 P0 tools, covering happy path, invalid input, empty
data, and offline/timeout scenarios. All 8 cases were executed live in
MCP Inspector.

| id | tool | setup | input | expected | result | evidence |
|----|------|-------|-------|----------|--------|----------|
| T1 | add_note | fresh `data/notes.json` with existing fixture notes | `{ "content": "Remember to review the Week 2 design doc before the mentor meeting", "tags": ["week2", "reminder"] }` | Note saved successfully, returns new note id | PASS | `Note saved with id note-4: "Remember to review the Week 2 design doc before the mentor meeting"` |
| T2 | add_note | same as above | `{ "content": "" }` (empty content) | Rejected with a clear validation error, no note saved | PASS | `Invalid input: expected string, received undefined` |
| T3 | search_notes | fixture notes loaded, includes a note tagged "git" | `{ "query": "git branches" }` | Returns the matching note about Git branches | PASS | `Found 1 note(s): [note-1] Git branches let you work...` |
| T4 | search_notes | fixture notes loaded | `{ "query": "" }` (empty query) | Rejected with a clear validation error | PASS | `Too small: expected string to have >=1 characters` |
| T5 | search_notes | `data/notes.json` temporarily emptied to `[]` | `{ "query": "git" }` | Returns "No notes found matching..." — no crash | PASS (after fixing test setup) | `No notes found matching "git".` — see note below |
| T6 | get_faq_answer | fixture faqs loaded | `{ "question": "how do I create a new branch in git?" }` | Returns the correct stored FAQ answer | PASS | `Use the command: git checkout -b branch-name...` |
| T7 | get_faq_answer | fixture faqs loaded | `{ "question": "" }` (empty question) | Rejected with a clear validation error | PASS | `Too small: expected string to have >=1 characters` |
| T8 | get_faq_answer | `data/faqs.json` temporarily renamed (simulates missing/offline data source) | `{ "question": "how do I create a new branch in git?" }` | Tool handles the missing file gracefully — returns a clear message, does not crash the server | PASS | `No saved answer found for: "how do I create a new branch in git?"` |

## Note on T5

T5 initially returned an unexpected error ("Sorry, something went wrong
while searching notes.") instead of the expected empty-result message.
Investigation showed this was **not a bug in the application code** —