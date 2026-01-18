#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import { parseArgs } from "./utils/args.js";
import { buildTools } from "./tools/registry.js";

const { vaultPath: VAULT_PATH } = parseArgs();

const { tools, handleTool } = buildTools(VAULT_PATH);

// 创建 MCP 服务器
const server = new Server(
  {
    name: "obsidian-notes-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleTool(name, args as Record<string, unknown>);
    const text =
      typeof result === "string" ? result : JSON.stringify(result, null, 2);
    return { content: [{ type: "text", text }] };
  } catch (error) {
    return {
      content: [{ type: "text", text: `错误: ${error}` }],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  // 验证笔记库路径是否存在
  try {
    await fs.access(VAULT_PATH);
  } catch {
    console.error(`错误: 笔记库路径不存在: ${VAULT_PATH}`);
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Obsidian MCP Server 已启动，笔记库: ${VAULT_PATH}`);
}

main().catch(console.error);
