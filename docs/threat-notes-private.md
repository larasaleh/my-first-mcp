# Private Threat Notes (Week 4 prep)

## My P0 tools and what they touch:

- **add_note**: touches disk (writes to data/notes.json), takes user input 
  (content, tags) — no network.
- **search_notes**: touches disk (reads data/notes.json), takes user input 
  (query) — no network.
- **get_faq_answer**: touches disk (reads data/faqs.json), takes user input 
  (question) — no network.

## Risk mapping:

- **Path traversal**: HIGH relevance — all 3 tools read/write files. 
  Already mitigated in Week 3 (src/lib/files.ts restricts reads to data/).
- **SSRF**: NOT applicable — no tool makes network/fetch calls currently.
- **Secret leaks**: LOW risk — no API keys used yet, but should double-check 
  logs don't leak raw file contents or paths unnecessarily.
- **Runaway responses**: MEDIUM risk — search_notes could return too many 
  results if the fixture grows large. Already capped at 10 results, but 
  should confirm this is enforced consistently.

## Next: formalize this into docs/threat-model.md (section 4.2)