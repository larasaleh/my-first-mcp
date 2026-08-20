# Example Conversations

These examples show how a user might talk to an AI assistant that has
access to this MCP server's tools, and what happens behind the scenes.

---

## Conversation A — Saving a note

**User prompt:**
> "Save a note that Git branches let you work on features separately from
> the main codebase, and tag it with 'git' and 'week2'."

**Expected tool call:**
```json
{
  "tool": "add_note",
  "arguments": {
    "content": "Git branches let you work on features separately from the main codebase",
    "tags": ["git", "week2"]
  }
}
```

**Good final answer (what the user reads):**
> "Got it — I've saved that note for you, tagged with 'git' and 'week2'."

---

## Conversation B — Searching for a note

**User prompt:**
> "What did I write down about Zod?"

**Expected tool call:**
```json
{
  "tool": "search_notes",
  "arguments": {
    "query": "Zod"
  }
}
```

**Good final answer (what the user reads):**
> "You have a note about this: Zod schemas validate input shape before
> your tool handler runs, catching bad data early with clear error
> messages."

---

## Conversation C — Multi-step: search first, then fall back to saving

**User prompt:**
> "Did I ever write anything about deploying to production? If not, save
> a note that we deploy using `npm run build` then `npm start`."

**Why the model does this in two steps:** the user's request has a
condition ("if not") — the model needs to check for an existing answer
*before* deciding whether a new note is needed, rather than guessing.

**Expected tool calls, in order:**

1. First, check if anything relevant already exists:
```json
{
  "tool": "search_notes",
  "arguments": {
    "query": "deploying to production"
  }
}
```

2. Since no existing note matches (empty `results`), the model then
   saves the new information as instructed:
```json
{
  "tool": "add_note",
  "arguments": {
    "content": "We deploy using npm run build then npm start",
    "tags": ["deployment"]
  }
}
```

**Good final answer (what the user reads):**
> "I didn't find anything about that in your notes, so I've saved it for
> you: 'We deploy using npm run build then npm start'."

**What this demonstrates:** the model chaining two tool calls based on
the result of the first one (search returned empty → note gets added),
rather than treating each tool as an isolated one-off action.

---

## Notes

- These conversations cover 3 of the 6 tools: `add_note`, `search_notes`,
  and `get_faq_answer`-adjacent workflows (all P0, working with real
  data).
- In each case, the model's final answer is a natural sentence built from
  the tool's JSON/text response — not the raw output shown directly to
  the user.
- Conversation C demonstrates multi-step tool chaining based on an
  intermediate result, not just isolated single-tool calls.