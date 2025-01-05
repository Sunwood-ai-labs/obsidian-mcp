import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { obsidianClient } from "./api-client.js";
import axios from "axios";

export function setupToolHandlers(server: Server) {
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
                description: "Vault内のパス（デフォルト: 空文字列でルートディレクトリを取得）",
                default: ""
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
        const path: string = typeof request.params.arguments?.path === 'string'
          ? request.params.arguments.path
          : "";
        let normalizedPath = path;
        // Windowsパスの正規化
        if (normalizedPath.includes("\\")) {
          normalizedPath = normalizedPath.replace(/\\/g, "/");
        }
        // URLエンコード
        const encodedPath = encodeURIComponent(normalizedPath);
        try {
          const response = await obsidianClient.get(`/vault/${encodedPath}`);
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
            if (error.response?.status === 404) {
              return {
                content: [
                  {
                    type: "text",
                    text: `Directory not found: ${path}`,
                  },
                ],
                isError: true,
              };
            }
            throw new Error(`Failed to get vault contents: ${error.response?.data.message ?? error.message}`);
          }
          throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      default:
        throw new Error("Unknown tool");
    }
  });
}
