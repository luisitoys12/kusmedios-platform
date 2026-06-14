#!/usr/bin/env node
/**
 * KusMedios MCP Server — beta v0.1
 *
 * Exposes KusMedios platform capabilities as MCP tools so that
 * AI agents (Claude, Copilot, Cursor, etc.) can interact with
 * the platform programmatically.
 *
 * Transport: stdio (default) | SSE (set MCP_TRANSPORT=sse)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools } from './tools/index.js';
import { dispatch } from './handlers/index.js';

const server = new Server(
  {
    name: 'kusmedios-mcp',
    version: '0.1.0-beta',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Dispatch tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return dispatch(name, args ?? {});
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅  KusMedios MCP server running (stdio)');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
