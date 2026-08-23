# Final Reflection — Smart Notes & FAQ Assistant

## Wins

- Shipped a working MCP server with 3 fully functional P0 tools
  (`add_note`, `search_notes`, `get_faq_answer`) backed by real local
  JSON data — no stubs, no placeholders.
- Learned and applied a full security hardening pass: path traversal
  protection, strict Zod input validation, output caps, and a
  documented threat model — then had it verified by two independent
  peer reviews.
- Built a real automated test suite (Node's built-in test runner) on
  top of a full manual test plan with 8 documented test cases, all
  passing.
- Fixed a real bug found during peer review (false-positive matching
  in `get_faq_answer`) and re-verified the fix live in Inspector.
- Verified the project actually works for a stranger: cloned it into a
  completely separate folder, ran `npm install` and `npm run dev` from
  scratch, and confirmed a live tool call worked — before tagging it
  `v1.0.0`.

## Blockers (what was genuinely hard)

- Git and the command line were completely new to me at the start of
  this cohort — early sessions were spent just learning how to
  navigate folders, tell CMD apart from PowerShell, and understand
  what a branch actually was.
- Connecting the server to Claude Desktop (Week 5.6) took significant
  debugging — the `cwd` setting in the Claude config didn't resolve
  file paths the way expected, causing the server to look for data
  files in the wrong folder. Fixed by switching `DATA_DIR` to resolve
  relative to the source file itself (`import.meta.dirname`) instead
  of relying on the process's working directory.
- Understanding the difference between input validation happening in
  the Inspector UI versus the actual Zod schema on the server took a
  few rounds of testing to fully see (the UI sometimes truncates or
  blocks invalid input before it even reaches the server).

## Resume Bullet

> Built and shipped an MCP (Model Context Protocol) server in
> TypeScript with Zod-validated tools for note-taking and FAQ lookup,
> backed by local JSON data with path-traversal protection and
> peer-reviewed security hardening; published as a public GitHub repo
> (v1.0.0) with 3 working tools, an automated + manual test suite, and
> a live Claude Desktop integration.

## LinkedIn Draft (optional to publish)

> I just wrapped up a 6-week hands-on training building an MCP (Model
> Context Protocol) server from scratch — the same kind of tool that
> lets AI assistants like Claude interact directly with real
> applications and data.
>
> Starting from literally not knowing how to use the command line, I
> ended up shipping a working notes-and-FAQ assistant with input
> validation, security hardening (including protection against path
> traversal attacks), peer code reviews, a full test suite, and a live
> integration with Claude Desktop — all documented and tagged as a
> public v1.0.0 release on GitHub.
>
> The biggest lesson: building something that works on your own
> machine is very different from building something a stranger can
> clone and run in five minutes. That gap is where most of the real
> learning happened.

## One Improvement for the Next Two Weeks

If I kept going, I'd implement the 3 remaining P1 tools (`add_faq`,
`list_notes`, `delete_note`) with the same level of validation and
testing as the P0 tools, and reorganize the tool registrations into
separate files under `src/tools/` (one file per tool) to match the
suggested project skeleton, as recommended in mentor feedback during
Week 3.