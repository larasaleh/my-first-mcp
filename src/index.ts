import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { loadNotes, loadFaqs, searchNotes, findFaqAnswer, createNote } from "./lib/notes.js";
import { readJsonFile } from "./lib/files.js";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const MY_NAME = "Lara Saleh Jadallah Nassar";

function createServer(): McpServer {
  const server = new McpServer({ name: "notes-faq-mcp", version: "0.2.0" });

  // P0 — add_note: saves a new note with optional tags (REAL DATA)
  server.registerTool(
    "add_note",
    {
      title: "Add Note",
      description: "Saves a new note with optional tags",
      inputSchema: z.object({
        content: z.string().describe("The text content of the note to save"),
        tags: z.array(z.string()).optional().describe("Optional list of tags"),
      }),
    },
    async ({ content, tags }) => {
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
        console.error("[add_note] failed:", err);
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
      inputSchema: z.object({
        query: z.string().describe("Search text to look for across your notes"),
      }),
    },
    async ({ query }) => {
      try {
        const notes = await loadNotes();
        const results = searchNotes(notes, query);

        if (results.length === 0) {
          return {
            content: [{ type: "text", text: `No notes found matching "${query}".` }],
          };
        }

        const summary = results
          .map((n) => `- [${n.id}] ${n.content}${n.tags ? ` (tags: ${n.tags.join(", ")})` : ""}`)
          .join("\n");

        return {
          content: [{ type: "text", text: `Found ${results.length} note(s):\n${summary}` }],
        };
      } catch (err) {
        console.error("[search_notes] failed:", err);
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
      inputSchema: z.object({
        question: z.string().describe("The question to look up in saved FAQ entries"),
      }),
    },
    async ({ question }) => {
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
        console.error("[get_faq_answer] failed:", err);
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
        question: z.string().describe("The question text"),
        answer: z.string().describe("The answer text"),
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
        tag: z.string().optional().describe("Optional tag to filter notes by"),
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
        id: z.string().describe("The ID of the note to delete"),
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