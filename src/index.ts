#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const OBSIDIAN_API_KEY = process.env.OBSIDIAN_API_KEY;
if (!OBSIDIAN_API_KEY) {
  throw new Error("OBSIDIAN_API_KEY environment variable is required");
}

const OBSIDIAN_API_URL = "https://127.0.0.1:27124";

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

// Obsidian APIクライアント
const obsidianClient = axios.create({
  baseURL: OBSIDIAN_API_URL,
  headers: {
    Authorization: `Bearer ${OBSIDIAN_API_KEY}`,
    Accept: "application/json",
  },
  httpsAgent: new (require("https").Agent)({
    rejectUnauthorized: false,
  }),
});

// Obsidianサーバー情報を取得するリソース
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "obsidian://server-info",
        mimeType: "application/json",
        name: "Obsidian Server Info",
        description: "Obsidianサーバーの基本情報",
      },
    ],
  };
});

// Obsidianサーバー情報を読み取る
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "obsidian://server-info") {
    try {
      const response = await obsidianClient.get("/");
      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Obsidian API error: ${error.response?.data.message ?? error.message}`);
      }
      throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new Error(`Unknown resource: ${request.params.uri}`);
});

// 利用可能なツールをリスト
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_vault_contents",
        description: "Obsidian Vaultの内容を取得",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Vault内のパス（オプション）",
            },
          },
        },
      },
    ],
  };
});

// ツールを実行
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_vault_contents": {
      const path = request.params.arguments?.path || "";
      try {
        const response = await obsidianClient.get(`/vault/${path}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(`Failed to get vault contents: ${error.response?.data.message ?? error.message}`);
        }
        throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    default:
      throw new Error("Unknown tool");
  }
});

// サーバーを起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Obsidian MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
