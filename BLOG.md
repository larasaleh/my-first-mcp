# Building an MCP Server From Scratch: My Six-Week Journey

*By Lara Saleh Jadallah Nassar — NextFlows Academy*

## Where It Started

I began this cohort not knowing how to use a terminal. I didn't know the
difference between Command Prompt and PowerShell, I'd never created a Git
branch, and the words "MCP server" meant nothing to me. Six weeks later,
I had shipped a public, tagged, working project. Here's how that happened,
week by week.

## Week 1–2: Picking an Idea and Learning to Speak "Tool"

The first real decision was choosing what to build. From a list of
starter ideas, I picked **Notes & FAQ Search** — a tool to help students
save notes and quickly find answers to questions they'd already asked
before. It felt manageable, and it solved a problem I actually related
to: forgetting where I'd written something down.

Before writing any code, I learned the discipline of designing first:
writing a one-page `design.md` with the pitch, the user story, a full
tool inventory table (which tools, what they take in, what they return,
and their priority), an explicit "out of scope" section, and success
criteria. I also studied an official MCP server's README to learn naming
conventions — tools should read like verbs a model can say out loud:
`add_note`, not `doThing`.

Then came the technical build: registering a multi-tool skeleton with
`McpServer`, writing Zod schemas for input validation, and testing
everything live in MCP Inspector — a browser tool that lets you call
your own server's tools directly and see the raw response.

## Week 3: From Stubs to Real Data

Week 2's tools all returned placeholder JSON. Week 3 was about replacing
that with real behavior. I chose local JSON fixture files
(`data/notes.json`, `data/faqs.json`) instead of a database or external
API — partly because the project didn't need the complexity, and partly
because of a hard requirement: the server had to work even if the Wi-Fi
died on Demo Day.

I wrote a `data-plan.md` documenting exactly where each tool's data would
come from, what could go wrong (empty files, malformed JSON), and what a
successful response looked like — before touching the handler code. Then
I built pure helper functions (`loadNotes`, `searchNotes`, `findFaqAnswer`)
separately from the tool registration itself, and wired three tools
(`add_note`, `search_notes`, `get_faq_answer`) to actually read and write
real data.

## Week 4: Learning to Think Like an Attacker

This week reframed how I saw my own code. Every tool argument, I learned,
should be treated like untrusted input from a public web form — because
that's effectively what it is, coming from a model rather than a
verified human.

I wrote a threat model covering four categories: path traversal, SSRF,
secret leaks, and runaway responses. Then I implemented real protections:
restricting all file access to the `data/` folder (rejecting any path
that tried to escape it with `..`), tightening every Zod schema with
length limits, and capping search results at 10 with a clear
"more results exist" message instead of silently returning everything.

The most valuable part of this week was peer review. Two classmates,
Roa Makhtoob and Leena Abd Alrahman, tested my server independently and
found a real bug I'd missed: my FAQ-matching logic was too loose — it
matched an FAQ if a single common word overlapped, which meant unrelated
questions sometimes returned the wrong saved answer. I fixed it by
requiring at least half of a question's meaningful words to match, and
verified the fix live in Inspector before merging.

## Week 5: Proving It Actually Works

Writing code that works on your own machine is one thing. Proving it
works is another. I wrote a manual test plan with eight cases — happy
path, invalid input, empty data, and a simulated offline scenario — for
each of the three working tools, then executed every case live and
recorded the real results.

One test initially failed in a confusing way, and tracking down why
taught me something I didn't expect: the failure wasn't in my
application code at all — it was because I'd used PowerShell's `echo`
command to set up test data, which wrote the file in the wrong text
encoding. My code was correct the whole time; my test setup wasn't.

I also rewrote the README from scratch — problem, requirements, install,
run, a tools table, example prompts, troubleshooting for three real
errors I'd hit, and a license — and had Roa clone the repo into a fresh
folder and set it up using only that README, with no help from me. She
succeeded in about 18 minutes and flagged two small gaps, which I fixed
immediately.

## Week 6: Shipping It for Real

The final week was about turning a working repo into a finished,
public project. I added a proper MIT license, cleaned up `.gitignore`,
and — critically — tested the entire project from a stranger's
perspective one more time: cloning it into a completely separate temp
folder, running `npm install` from zero, starting the server, and
calling a tool in Inspector, before tagging the release `v1.0.0`.

I also connected the server to Claude Desktop for the first time, which
surfaced a subtle bug: the server was looking for its data files
relative to wherever Claude Desktop happened to launch it from, instead
of relative to the project itself. Fixing it meant switching the data
path to resolve from the source file's own location
(`import.meta.dirname`) rather than the process's working directory —
a small change with a real lesson about not assuming your working
directory is what you think it is.

## What I'd Tell Someone Starting This Cohort

Build the boring parts first — validation, error handling, a real test
plan — before adding anything clever. Ask a peer to break your project
on purpose; they will find things you can't see because you already
know how it's supposed to work. And when something fails in a confusing
way, don't assume your code is wrong before checking your assumptions
about the environment around it.

Six weeks ago I didn't know what a branch was. Now there's a public,
tagged, tested MCP server with my name on it — and three peer reviews,
one real fixed bug, and a working integration with Claude Desktop to
show for it.

**Repo:** [github.com/larasaleh/my-first-mcp](https://github.com/larasaleh/my-first-mcp)
**Release:** v1.0.0