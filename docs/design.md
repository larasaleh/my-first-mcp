
# Smart Notes & FAQ Assistant

## Pitch
Students and self-learners take notes across many sessions and often forget
where they wrote something down, or end up re-answering the same question
twice. This MCP server exposes a small set of tools that let a user save
notes, search them by keyword, and store reusable FAQ-style question/answer
pairs. Instead of digging through scattered files, the user (or an AI
assistant on their behalf) can add, search, and retrieve notes and answers
through simple tool calls. The goal is fast, reliable retrieval of things
the user has already written, not new knowledge generation.

## User & Demo Story
Sara is a student reviewing for an exam. Two weeks ago she saved a note
explaining how Git branches work, tagged "git". During Demo Day, she asks:
"What did I write about git branches?" The assistant calls `search_notes`
with the keyword "git", which returns her saved note along with its tags.
Later she asks the same conceptual question again in different words —
"how do I create a new branch in git?" — and this time the assistant finds
a matching FAQ entry via `get_faq_answer` and returns the exact answer she
saved before, instantly, without her having to search or retype it.

## Tool Inventory

| tool_name        | description (1 line)                                              | inputs                            | output (shape)                                     | priority |
|-------------------|---------------------------------------------------------------------|-------------------------------------|-------------------------------------------------------|----------|
| add_note          | Saves a new note with optional tags.                                | content: string, tags?: string[]    | { id: string, note: object }                          | P0       |
| search_notes      | Searches saved notes by keyword or tag.                             | query: string                       | { results: Note[], matchType: "exact" or "partial" }  | P0       |
| get_faq_answer    | Looks up a previously saved question and returns its stored answer. | question: string                    | { found: boolean, answer?: string }                   | P0       |
| add_faq           | Saves a question and its answer as a reusable FAQ entry.            | question: string, answer: string    | { id: string, faq: object }                           | P1       |
| list_notes        | Lists all saved notes, optionally filtered by tag.                  | tag?: string                        | { notes: Note[] }                                     | P1       |
| delete_note       | Removes a note by its ID.                                           | id: string                          | { deleted: boolean }                                  | P1       |

## Out of Scope
- No AI-generated answers or external knowledge lookup, only stored
  user notes/FAQs are searched.
- No authentication or multi-user accounts, single-user local tool only.
- No paid APIs or external services of any kind.
- No mobile UI or cloud sync, runs and demos locally.

## Success Criteria
- [ ] search_notes returns a correct hit when searching fixture notes
      by keyword.
- [ ] get_faq_answer returns the exact saved answer for a previously
      stored question.
- [ ] All P0 tools (add_note, search_notes, get_faq_answer) appear
      in the MCP Inspector with clear names, descriptions, and working
      schemas.

## Risks
1. Search matching may be too strict or too loose (missing real
   matches, or returning irrelevant ones). Mitigation: start with
   simple keyword/substring matching on fixture data, test with 5-6
   sample notes before Demo Day, and adjust matching logic based on
   results.
2. Running out of time to finish all P1 tools. Mitigation: P0
   tools are prioritized first and fully tested; P1 tools can remain
   stubs (defined schema, placeholder response) without blocking the
   demo.