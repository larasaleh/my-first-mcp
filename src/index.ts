import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

const MY_NAME = "Lara Saleh Jadallah Nassar";

function createServer(): McpServer {
  const server = new McpServer({ name: "notes-faq-mcp", version: "0.2.0" });

  // P0 — add_note: saves a new note with optional tags
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
    async (input) => {
      // Week 2: stub only — Week 3 replaces this with real data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, stub: true, tool: "add_note" }, null, 2),
          },
        ],
      };
    },
  );

  // P0 — search_notes: searches saved notes by keyword or tag
  server.registerTool(
    "search_notes",
    {
      title: "Search Notes",
      description: "Searches saved notes by keyword or tag",
      inputSchema: z.object({
        query: z.string().describe("Search text to look for across your notes"),
      }),
    },
    async (input) => {
      // Week 2: stub only — Week 3 replaces this with real data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, stub: true, tool: "search_notes" }, null, 2),
          },
        ],
      };
    },
  );

  // P0 — get_faq_answer: looks up a previously saved question
  server.registerTool(
    "get_faq_answer",
    {
      title: "Get FAQ Answer",
      description: "Looks up a previously saved question and returns its stored answer",
      inputSchema: z.object({
        question: z.string().describe("The question to look up in saved FAQ entries"),
      }),
    },
    async (input) => {
      // Week 2: stub only — Week 3 replaces this with real data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, stub: true, tool: "get_faq_answer" }, null, 2),
          },
        ],
      };
    },
  );

  // P1 — add_faq: saves a question and its answer as a reusable FAQ entry
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
      // Week 2: not implemented yet — this is a P1 tool
      return {
        content: [
          {
            type: "text",
            text: "not implemented yet",
          },
        ],
      };
    },
  );

  // P1 — list_notes: lists all saved notes, optionally filtered by tag
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
      // Week 2: not implemented yet — this is a P1 tool
      return {
        content: [
          {
            type: "text",
            text: "not implemented yet",
          },
        ],
      };
    },
  );

  // P1 — delete_note: removes a note by its ID
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
      // Week 2: not implemented yet — this is a P1 tool
      return {
        content: [
          {
            type: "text",
            text: "not implemented yet",
          },
        ],
      };
    },
  );

  return server;
}

void serveStdio(createServer);
console.error("notes-faq-mcp MCP server running on stdio");