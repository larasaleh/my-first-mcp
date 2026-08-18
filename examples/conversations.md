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