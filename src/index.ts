import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const MY_NAME = "Lara Saleh Jadallah Nassar";

const server = new McpServer({ name: "my-first-mcp", version: "0.1.0" });

server.registerTool(
  "greet",
  {
    title: "Greet",
    description: "Say hello to someone by name",
    inputSchema: z.object({
      name: z.string().describe("The person's name to greet"),
    }),
  },
  async ({ name }) => {
    return {
      content: [
        { type: "text", text: `Hello, ${name}! This is ${MY_NAME}'s MCP server.` },
      ],
    };
  },
);

server.registerTool(
  "introduce_me",
  {
    title: "Introduce Me",
    description: "Introduces the server owner by name",
    inputSchema: z.object({
      greeting: z.string().describe("A greeting word to use, e.g. 'Hi' or 'Hello'"),
    }),
  },
  async ({ greeting }) => {
    return {
      content: [
        { type: "text", text: `${greeting}! My name is ${MY_NAME}, and this is my first MCP server.` },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);