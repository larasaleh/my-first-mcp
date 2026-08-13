# Security Policy

## Supported Versions

This project has a single active version — the latest code on the `main`
branch of this repository. There are no older versions maintained.

## Reporting a Security Issue

If you find a security issue in this project, please report it directly
to the project mentor by email rather than opening a public GitHub issue:

**Contact:** info@nextflows.ai

Please include a description of the issue and steps to reproduce it if
possible. Do not include real secrets or sensitive data in your report.

## What This Project Hardens Against

This is a student learning project (Notes & FAQ Assistant, an MCP server).
As of Week 4, the following protections are in place:

- **Path traversal**: all file reads/writes are restricted to the local
  `./data` folder. Any resolved path that would escape it is rejected
  (`src/lib/files.ts`).
- **Input validation**: every tool argument is validated with Zod before
  use — string length limits (`.min()`/`.max()`), required fields, and
  array size caps. Validation is enforced both by the tool's declared
  schema and manually inside each handler (`.safeParse()`) for stronger
  guarantees.
- **Output caps**: `search_notes` returns at most 10 results. If more
  matches exist, the response explicitly says so instead of returning an
  unbounded list.
- **No secrets in this project**: no API keys or tokens are used. A
  `.env.example` file documents this, and `.gitignore` excludes any future
  `.env` files from being committed.
- **SSRF**: not currently applicable — no tool makes outbound network
  requests. If a network-calling tool is added later, it must use the
  shared `fetchJson` helper (`src/lib/http.ts`), which enforces an 8-second
  timeout, and must allowlist specific hosts rather than accepting
  arbitrary URLs.
- **Error handling**: tool errors return short, user-facing messages only
  (e.g. "Invalid input: ..."). Raw stack traces or internal error objects
  are never returned to the model — only logged to stderr for debugging.