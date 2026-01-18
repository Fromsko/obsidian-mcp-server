# MCP 集成指南（Stage 1）

## MCP 是什么
MCP（Model Context Protocol）是开放标准，用于让 AI 应用连接外部工具、数据源与服务。

- 架构：Host → Client → Server
- 基于 JSON-RPC，支持 stdio/HTTP/SSE 等传输

## Windsurf 中的 MCP
- Cascade 原生支持 MCP
- 企业版需管理员手动开启
- 配置通过 `mcp_config.json`

### 实战配置示例（GitHub MCP）
```
{
  "mcpServers": {
    "github": {
      "serverUrl": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_GITHUB_PAT"
      }
    }
  }
}
```

> 注意：Windsurf 目前支持 PAT 鉴权；不要把 PAT 写入代码仓库。

## 实战用法（官方教程要点）
- 连接 Supabase / Notion 等服务，实现数据库与文档接入
- 提升需求理解与上下文整合能力

## MCP 安全建议
- API Key 权限最小化
- 定期更新 MCP 服务
- 对外部 MCP 服务进行白名单管理

## MCP 生态与发现
- **官方 Registry**：统一目录，支持公开/企业子 registry。
- **参考服务器**：Everything/Filesystem/Git/Memory 等示例帮助理解协议能力。
- **Roadmap**：异步任务、Server Identity、Registry GA 等。

## MCP 关键概念图谱
```
MCP
├─ Host (IDE/Chat app)
├─ Client (协议实例)
├─ Server (工具/资源/提示)
├─ Transports (stdio/HTTP/SSE)
└─ Security (auth, scopes, trust)
```

## 参考来源
- https://docs.windsurf.com/windsurf/cascade/mcp
- https://windsurf.com/university/tutorials/configuring-first-mcp-server
- https://modelcontextprotocol.io/docs/getting-started/intro
- https://modelcontextprotocol.io/docs/learn/architecture
- https://modelcontextprotocol.io/specification/2025-11-25/architecture/index
- https://registry.modelcontextprotocol.io/
- http://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/
- https://github.com/modelcontextprotocol/servers
- https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-windsurf.md
