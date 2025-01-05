import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { obsidianClient } from "./api-client.js";
import axios from "axios";

export function setupResourceHandlers(server: Server) {
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
}
