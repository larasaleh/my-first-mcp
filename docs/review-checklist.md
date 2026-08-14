# Week 4 Peer Review Checklist

**Reviewer:** Roa Makhtoob
**Project:** Smart Notes & FAQ Assistant (my-first-mcp)
**Student:** Lara Saleh Jadallah Nassar
**Date:** August 2026
**Method:** Live testing via MCP Inspector + review of schemas/implementation

## What the reviewer actually tested

The reviewer ran each of the 3 P0 tools directly in MCP Inspector, using
both valid and invalid inputs, and observed the actual responses:

### add_note
- **Valid input tested:** `{ content: "test note", tags: ["work"] }` → note saved successfully with a generated ID
- **Invalid input tested:** empty `content` (`""`) → correctly rejected by Zod
- **Invalid input tested:** `tags` sent as a string instead of an array → correctly rejected
- **Security test:** path-traversal-looking content (`../../outside-data/test.txt`) sent as note text → treated as plain text, not interpreted as a file path (no traversal occurred)

### search_notes
- **Valid input tested:** keyword search (e.g. "git") → returned the correct matching note(s)
- **Case sensitivity tested:** confirmed search is case-insensitive
- **Tag search tested:** confirmed searching by tag also works
- **Invalid input tested:** empty query (`""`) → correctly rejected
- **Boundary tested:** query longer than 200 characters → correctly rejected
- **Volume tested:** searched with more than 10 matching notes present → correctly capped at 10 results with a truncation message shown

### get_faq_answer
- **Valid input tested:** exact and reworded questions matching a stored FAQ → correct stored answer returned
- **Invalid input tested:** empty question (`""`) → correctly rejected
- **Boundary tested:** question longer than 300 characters → correctly rejected
- **Bug found (see below):** unrelated questions sharing a single common word with a stored FAQ incorrectly returned that FAQ's answer

## Review Summary

| Area | Status |
|------|--------|
| Schemas (validation, bounds) | ✅ Good |
| Error handling | ✅ Good — no stack traces or internal errors exposed |
| Secrets | ✅ Not applicable — no API keys, nothing leaked |
| Data allowlists (path traversal) | ✅ Tested — attack-like input treated as plain text, not a path |
| Output caps | ✅ Confirmed working (10-result limit + truncation message) |
| FAQ matching logic | 🔴 Must-fix — false positives found (see below) |

## Detailed Findings

### 1. add_note — ✅ Working well
Content and tags are properly validated (required string, max 2000 chars;
optional array of 1–30 char strings, max 10 tags). Empty content and
invalid tag types are correctly rejected. Errors don't expose internal
implementation details.

**Minor observation:** the `tags` field description said "Optional list of
tags" without an example — could confuse users about the expected format.

### 2. search_notes — ✅ Working well
Case-insensitive keyword/tag search works correctly, with the 10-result
cap and truncation message confirmed by testing with >10 matches.

**Minor observation:** `searchNotesInputSchema` (in `src/schemas/notes.ts`)
defined an optional `limit` field that the registered `search_notes` tool
in `index.ts` didn't actually use — a mismatch between the documented
schema and real tool behavior.

### 3. get_faq_answer — 🔴 Must-fix found
**False-positive matching:** the original logic matched an FAQ if *any*
single word longer than 3 characters from the stored question appeared
anywhere in the user's question. This caused incorrect matches:
- "Tell me something about branch" incorrectly matched the git-branch FAQ
- "What is Inspector?" incorrectly matched the Zod `.describe()` FAQ

**Recommendation:** require multiple meaningful keyword matches (a
relevance threshold) rather than any single word.

## Action Items

| # | Item | Owner | Due Date | Status |
|---|------|-------|----------|--------|
| 1 | Fix false-positive matching in `findFaqAnswer` — require ≥50% of meaningful keywords to match instead of any single word | Lara | Aug 13, 2026 (end of Week 4) | ✅ Done |
| 2 | Update `tags` field description to include an example format (`["work", "important"]`) | Lara | Aug 13, 2026 | ✅ Done |
| 3 | Resolve inconsistency between `searchNotesInputSchema` (had `limit`) and the actual registered `search_notes` tool — `limit` is now wired into the tool | Lara | Aug 13, 2026 | ✅ Done |
| 4 | Update README to reflect the current project instead of Week 1 boilerplate (flagged separately by a second reviewer, Leena Abd Alrahman) | Lara | Aug 13, 2026 | ✅ Done |

## Peer Feedback (full text, Roa Makhtoob)

> I completed my Week 4 peer review of the P0 tools in your MCP project,
> focusing on add_note, search_notes, and get_faq_answer. I tested the
> tools through MCP Inspector and reviewed the relevant schemas and
> implementation to verify the observed behavior.
>
> Overall, the P0 tools have good input validation, clear error handling,
> and appropriate basic protections. The main issue I recommend addressing
> is the false-positive matching behavior in get_faq_answer, as it can
> directly affect the correctness of responses. The tags description and
> the unused limit schema are smaller usability and consistency
> improvements.
>
> Thank you for your work, and I hope this feedback helps with the Week 4
> hardening.
>
> — Roa Makhtoob

## Verification after fixes

All fixes were re-tested live in MCP Inspector after implementation:
- `get_faq_answer("Tell me something about branch")` → now correctly returns "No saved answer found" instead of the wrong FAQ
- `get_faq_answer("What is Inspector?")` → now correctly returns "No saved answer found"
- `get_faq_answer("how do I create a new branch in git?")` → still correctly returns the real stored answer (confirms the fix didn't break valid matches)