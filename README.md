<div align="center">
  <img src="https://github.com/user-attachments/assets/58897c99-bc54-4a88-8c7a-b04233d688a1" alt="Header Image" width="800">

  <h1>obsidian-mcp MCP Server</h1>

  <p>
    <a href="https://github.com/Sunwood-ai-labs/obsidian-mcp">
      <img src="https://img.shields.io/github/stars/Sunwood-ai-labs/obsidian-mcp?style=social" alt="GitHub Stars">
    </a>
    <a href="https://github.com/Sunwood-ai-labs/obsidian-mcp/issues">
      <img src="https://img.shields.io/github/issues/Sunwood-ai-labs/obsidian-mcp" alt="GitHub Issues">
    </a>
    <a href="https://github.com/Sunwood-ai-labs/obsidian-mcp/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/Sunwood-ai-labs/obsidian-mcp" alt="License">
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Obsidian-7C3AED?logo=obsidian&logoColor=white" alt="Obsidian">
    <img src="https://img.shields.io/badge/MCP-FF6F61?logo=data:image/svg+xml;base64,..." alt="MCP">
  </p>
</div>

A Model Context Protocol server for Obsidian integration

This is a TypeScript-based MCP server that implements integration with Obsidian. It demonstrates core MCP concepts by providing:

- Resources representing Obsidian vault contents
- Tools for accessing vault data
- API integration with Obsidian

## Project Statistics

- Total lines of code: 345
- Main files:
  - `src/tool-handlers.ts` (76 lines)
  - `src/resource-handlers.ts` (45 lines)
  - `src/server.ts` (32 lines)
  - `src/api-client.ts` (25 lines)

## Directory Structure

```
obsidian-mcp/
├── .codegpt/
│   └── head
├── src/
│   ├── api-client.ts
│   ├── index.ts
│   ├── resource-handlers.ts
│   ├── server.ts
│   └── tool-handlers.ts
├── .SourceSageignore
├── package.json
├── README.md
└── tsconfig.json
```

## Features

### Resources
- Access Obsidian server info via `obsidian://server-info` URI
- Get vault contents with metadata
- JSON format for easy integration

### Tools
- `get_vault_contents` - Retrieve contents of Obsidian vault
  - Takes path as optional parameter (default: root directory)
  - Returns structured JSON response

### API Integration
- Secure HTTPS connection with Obsidian API
- Custom axios client with error handling
- Windows path normalization support

## Development

### Prerequisites
- Node.js v18+
- TypeScript 5.3+
- Obsidian API key (set as OBSIDIAN_API_KEY environment variable)

### Setup
```bash
# Install dependencies
npm install

# Build the server
npm run build

# Start development server with auto-rebuild
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "/path/to/obsidian-mcp/build/index.js",
      "env": {
        "OBSIDIAN_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Debugging

We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Dependencies

### Runtime
- @modelcontextprotocol/sdk: MCP server implementation
- axios: HTTP client for API communication

### Development
- @types/node: TypeScript definitions for Node.js
- typescript: TypeScript compiler
