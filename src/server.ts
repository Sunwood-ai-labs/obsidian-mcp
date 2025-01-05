import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupResourceHandlers } from "./resource-handlers.js";
import { setupToolHandlers } from "./tool-handlers.js";

export function createServer() {
  const server = new Server(
    {
      name: "obsidian-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    }
  );

  setupResourceHandlers(server);
  setupToolHandlers(server);

  return server;
}

export async function startServer(server: Server) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Obsidian MCP server running on stdio");
}
