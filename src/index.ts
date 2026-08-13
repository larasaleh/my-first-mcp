import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { loadNotes, loadFaqs, searchNotes, findFaqAnswer, createNote } from "./lib/notes.js";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const MY_NAME = "Lara Saleh Jadallah Nassar";

// Schemas defined here so we can call .safeParse() manually inside each
// handler — this guarantees validation runs even if the framework itself
// doesn't enforce every Zod refinement (like .max()) automatically.
const addNoteSchema = z.object({
  content: z.string().min(1).max(2000).describe("The text content of the note to save"),
  tags: z.array(z.string().min(1).max(30)).max(10).optional().describe("Optional list of tags"),
});

const searchNotesSchema = z.object({
  query: z.string().min(1).max(200).describe("Search text to look for across your notes"),
});

const getFaqAnswerSchema = z.object({
  question: z.string().min(1).max(300).describe("The question to look up in saved FAQ entries"),
});

function createServer(): McpServer {
  const server = new McpServer({ name: "notes-faq-mcp", version: "0.3.0" });

  // P0 — add_note: saves a new note with optional tags (REAL DATA)
  server.registerTool(
    "add_note",
    {
      title: "Add Note",
      description: "Saves a new note with optional tags",
      inputSchema: addNoteSchema,
    },
    async (input) => {
      const parsed = addNoteSchema.safeParse(input);
      if (!parsed.success) {
        console.error("[add_note] validation failed:", parsed.error.message);
        return {
          content: [{ type: "text", text: `Invalid input: ${parsed.error.issues[0]?.message ?? "validation failed"}` }],
        };
      }
      const { content, tags } = parsed.data;

      try {
        const notes = await loadNotes();
        const newNote = createNote(content, tags, notes.length);
        const updated = [...notes, newNote];
        const dataPath = resolve(process.cwd(), "data", "notes.json");
        await writeFile(dataPath, JSON.stringify(updated, null, 2), "utf-8");

        return {
          content: [
            { type: "text", text: `Note saved with id ${newNote.id}: "${newNote.content}"` },
          ],
        };
      } catch (err) {
        console.error("[add_note] failed:", err instanceof Error ? err.message : "unknown error");
        return {
          content: [{ type: "text", text: "Sorry, something went wrong while saving the note." }],
        };
      }
    },
  );

  // P0 — search_notes: searches saved notes by keyword or tag (REAL DATA)
  server.registerTool(
    "search_notes",
    {
      title: "Search Notes",
      description: "Searches saved notes by keyword or tag",
      inputSchema: searchNotesSchema,
    },
    async (input) => {
      const parsed = searchNotesSchema.safeParse(input);
      if (!parsed.success) {
        console.error("[search_notes] validation failed:", parsed.error.message);
        return {
          content: [{ type: "text", text: `Invalid input: ${parsed.error.issues[0]?.message ?? "validation failed"}` }],
        };
      }
      const { query } = parsed.data;

      try {
        const notes = await loadNotes();
        const { results, truncated } = searchNotes(notes, query);

        if (results.length === 0) {
          return {
            content: [{ type: "text", text: `No notes found matching "${query}".` }],
          };
        }

        const summary = results
          .map((n) => `- [${n.id}] ${n.content}${n.tags ? ` (tags: ${n.tags.join(", ")})` : ""}`)
          .join("\n");

        const truncationNote = truncated
          ? "\n\n(Showing the first 10 matches; more results were found but not shown.)"
          : "";

        return {
          content: [
            { type: "text", text: `Found ${results.length} note(s):\n${summary}${truncationNote}` },
          ],
        };
      } catch (err) {
        console.error("[search_notes] failed:", err instanceof Error ? err.message : "unknown error");
        return {
          content: [{ type: "text", text: "Sorry, something went wrong while searching notes." }],
        };
      }
    },
  );

  // P0 — get_faq_answer: looks up a previously saved question (REAL DATA)
  server.registerTool(
    "get_faq_answer",
    {
      title: "Get FAQ Answer",
      description: "Looks up a previously saved question and returns its stored answer",
      inputSchema: getFaqAnswerSchema,
    },
    async (input) => {
      const parsed = getFaqAnswerSchema.safeParse(input);
      if (!parsed.success) {
        console.error("[get_faq_answer] validation failed:", parsed.error.message);
        return {
          content: [{ type: "text", text: `Invalid input: ${parsed.error.issues[0]?.message ?? "validation failed"}` }],
        };
      }
      const { question } = parsed.data;

      try {
        const faqs = await loadFaqs();
        const match = findFaqAnswer(faqs, question);

        if (!match) {
          return {
            content: [{ type: "text", text: `No saved answer found for: "${question}"` }],
          };
        }

        return {
          content: [{ type: "text", text: match.answer }],
        };
      } catch (err) {
        console.error("[get_faq_answer] failed:", err instanceof Error ? err.message : "unknown error");
        return {
          content: [{ type: "text", text: "Sorry, something went wrong while looking up the FAQ." }],
        };
      }
    },
  );

  // P1 stub — add_faq: saves a question and its answer as a reusable FAQ entry
  server.registerTool(
    "add_faq",
    {
      title: "Add FAQ",
      description: "Saves a question and its answer as a reusable FAQ entry",
      inputSchema: z.object({
        question: z.string().min(1).max(300).describe("The question text"),
        answer: z.string().min(1).max(2000).describe("The answer text"),
      }),
    },
    async (input) => {
      // P1 stub
      return {
        content: [{ type: "text", text: "not implemented yet" }],
      };
    },
  );

  // P1 stub — list_notes: lists all saved notes, optionally filtered by tag
  server.registerTool(
    "list_notes",
    {
      title: "List Notes",
      description: "Lists all saved notes, optionally filtered by tag",
      inputSchema: z.object({
        tag: z.string().min(1).max(30).optional().describe("Optional tag to filter notes by"),
      }),
    },
    async (input) => {
      // P1 stub
      return {
        content: [{ type: "text", text: "not implemented yet" }],
      };
    },
  );

  // P1 stub — delete_note: removes a note by its ID
  server.registerTool(
    "delete_note",
    {
      title: "Delete Note",
      description: "Removes a note by its ID",
      inputSchema: z.object({
        id: z.string().min(1).max(50).describe("The ID of the note to delete"),
      }),
    },
    async (input) => {
      // P1 stub
      return {
        content: [{ type: "text", text: "not implemented yet" }],
      };
    },
  );

  return server;
}

void serveStdio(createServer);
console.error("notes-faq-mcp MCP server running on stdio");