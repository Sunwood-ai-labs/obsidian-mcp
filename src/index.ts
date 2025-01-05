#!/usr/bin/env node

import { createServer, startServer } from "./server.js";

async function main() {
  const server = createServer();
  await startServer(server);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
