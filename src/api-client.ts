import axios from "axios";
import { Agent } from "node:https";

const OBSIDIAN_API_KEY = process.env.OBSIDIAN_API_KEY;
if (!OBSIDIAN_API_KEY) {
  throw new Error("OBSIDIAN_API_KEY environment variable is required");
}

const OBSIDIAN_API_URL = "https://127.0.0.1:27124";

// HTTPSエージェントの作成
const httpsAgent = new Agent({
  rejectUnauthorized: false
});

// Obsidian APIクライアント
export const obsidianClient = axios.create({
  baseURL: OBSIDIAN_API_URL,
  headers: {
    Authorization: `Bearer ${OBSIDIAN_API_KEY}`,
    Accept: "application/json",
  },
  httpsAgent: httpsAgent,
});
