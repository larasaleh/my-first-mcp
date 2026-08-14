# Threat Model — Smart Notes & FAQ Assistant

## Assets
- **data/notes.json** — user-created notes (content + tags)
- **data/faqs.json** — stored question/answer pairs
- The MCP server process itself and its stdio channel

## Trust Boundaries
- Tool arguments come from the model, not a verified human — treated as
  untrusted input, same as a public web form.
- The server only trusts files inside the local `./data` folder; nothing
  outside that boundary is considered readable or writable.
- No external network calls are made by any P0 tool, so there is currently
  no trust boundary with third-party APIs.

## Top 5 Risks & Mitigations

1. **Path traversal** — a malicious `content`/`id` value could try to make
   file operations escape `./data` (e.g. via `..`).
   *Mitigation:* `src/lib/files.ts` resolves every file path and rejects
   any path that resolves outside `./data`. (Implemented in Week 3.)

2. **Runaway responses** — `search_notes` could return an unbounded number
   of results if the fixture data grows, overflowing the model's context.
   *Mitigation:* results are capped at 10 matches (`.slice(0, 10)`) in
   `searchNotes()`. Will confirm this cap is enforced consistently across
   all list-returning tools this week.

3. **Malformed/oversized input** — a very long `content` string in
   `add_note` could bloat the data file or the tool response.
   *Mitigation:* add a `.max()` length bound on the `content` field in the
   Zod schema so oversized notes are rejected before they're written.

4. **Secret leaks** — although no API keys are used yet, error logs
   (`console.error`) could accidentally print full file contents or
   internal paths if not written carefully.
   *Mitigation:* keep error logs limited to the tool name + short reason,
   never dump full file contents or stack traces with file paths to logs
   that could be shared.

5. **SSRF** — not currently applicable, since no P0 tool calls `fetch` or
   any external URL. Documented here so it's revisited if a future tool
   (e.g. a weather or quote API) is added.
   *Mitigation (if added later):* use the shared `fetchJson` helper in
   `src/lib/http.ts`, which enforces a timeout, and restrict allowed
   domains explicitly rather than accepting arbitrary URLs from input.

   ## Out of Scope

The following are deliberately not addressed in this threat model, since
they go beyond what's reasonable for a student learning project at this
stage:

- **Authentication / authorization** — this is a single-user local tool
  with no user accounts, so access control is not implemented. This is
  acceptable because the server only runs locally on the developer's own
  machine for demo purposes, not as a hosted multi-user service.
- **Denial of Service (DoS) protection** — no rate limiting is implemented
  on tool calls. This is acceptable because the server runs locally via
  stdio for a single client (the model/Inspector), not exposed to the
  public internet where DoS attacks would be a realistic threat.
- **Encryption at rest** — `data/notes.json` and `data/faqs.json` are
  stored as plain text on disk. This is acceptable because the data is
  non-sensitive (student's own study notes/FAQs) and the project has no
  requirement to protect against local disk access, which would require
  physical or OS-level access already.
- **Formal penetration testing / third-party security audit** — out of
  scope for a course project; testing here is limited to manual attack
  simulation (path traversal, oversized/empty input) via MCP Inspector and
  direct schema testing, which is proportional to the project's size and
  risk profile.