# Manual Test Plan — Week 5

Test cases for the 3 P0 tools, covering happy path, invalid input, empty
data, and offline/timeout scenarios. `result` and `evidence` are left
blank here and filled in during the next section (5.2) after running
each test.

| id | tool | setup | input | expected | result | evidence |
|----|------|-------|-------|----------|--------|----------|
| T1 | add_note | fresh `data/notes.json` with existing fixture notes | `examples/add_note.json` (valid content + tags) | Note saved successfully, returns new note id | | |
| T2 | add_note | same as above | `{ "content": "" }` (empty content) | Rejected with a clear validation error, no note saved | | |
| T3 | search_notes | fixture notes loaded, includes a note tagged "git" | `examples/search_notes.json` (`query: "git branches"`) | Returns the matching note about Git branches | | |
| T4 | search_notes | fixture notes loaded | `{ "query": "" }` (empty query) | Rejected with a clear validation error | | |
| T5 | search_notes | `data/notes.json` temporarily emptied to `[]` | `{ "query": "git" }` | Returns "No notes found matching..." — no crash | | |
| T6 | get_faq_answer | fixture faqs loaded | `examples/get_faq_answer.json` (valid question) | Returns the correct stored FAQ answer | | |
| T7 | get_faq_answer | fixture faqs loaded | `{ "question": "" }` (empty question) | Rejected with a clear validation error | | |
| T8 | get_faq_answer | `data/faqs.json` temporarily renamed/moved (simulates file unavailable / "offline" data source) | `{ "question": "how do I create a new branch in git?" }` | Tool handles the missing file gracefully — returns an empty result or clear error, does not crash the server | | |

## Fixture reset notes

- Tests T5 and T8 require temporarily modifying the fixture files
  (`data/notes.json` → `[]`, `data/faqs.json` → renamed/missing). After
  each of these tests, the original fixture content must be restored
  before running the next test, to avoid one test's setup affecting
  another test's result.
- `examples/*.json` files are used as-is for happy-path inputs (T1, T3, T6)
  to keep test inputs consistent with what's already documented and
  committed in the repo.