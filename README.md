# Obsidian MCP Server

将你的 Obsidian 笔记库暴露为 MCP 服务，让 AI 助手可以搜索和读取你的笔记。

## ✨ 功能

| 工具 | 描述 |
|------|------|
| `search_notes` | 按关键词、标签、分类搜索笔记 |
| `read_note` | 读取指定笔记的完整内容 |
| `list_folder` | 列出文件夹下的笔记和子文件夹 |
| `get_note_structure` | 获取笔记库目录结构 |
| `full_text_search` | 在所有笔记中全文搜索 |
| `create_note` | 创建新笔记 |
| `update_note` | 更新已存在的笔记 |
| `delete_note` | 删除指定笔记 |
| `create_folder` | 创建新文件夹 |
| `get_prompt_guide` | 获取知识库整理助手提示词的使用指南 |

## 🚀 安装

### 方式一：直接使用（推荐）

无需安装，直接在 MCP 配置中使用 `npx`：

```json
{
  "mcpServers": {
    "obsidian-notes": {
      "command": "npx",
      "args": [
        "-y",
        "@andysama/obsidian-mcp-server",
        "--vault",
        "/path/to/your/obsidian/vault"
      ]
    }
  }
}
```

### 方式二：全局安装

```bash
npm install -g @andysama/obsidian-mcp-server
```

### 方式三：从源码构建

```bash
git clone https://github.com/andysama-work/obsidian-mcp-server.git
cd obsidian-mcp-server
npm install
npm run build
```

## ⚙️ 配置

### Claude Desktop

编辑 `%APPDATA%\Claude\claude_desktop_config.json`（Windows）或 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）：

```json
{
  "mcpServers": {
    "obsidian-notes": {
      "command": "node",
      "args": [
        "/path/to/obsidian-mcp-server/dist/index.js",
        "--vault",
        "/path/to/your/obsidian/vault"
      ]
    }
  }
}
```

### Windsurf / Cursor

在 MCP 配置文件中添加：

```json
{
  "mcpServers": {
    "obsidian-notes": {
      "command": "node",
      "args": [
        "/path/to/obsidian-mcp-server/dist/index.js",
        "--vault",
        "/path/to/your/obsidian/vault"
      ]
    }
  }
}
```

> ⚠️ 请将 `/path/to/your/obsidian/vault` 替换为你的 Obsidian 笔记库实际路径

## 📖 使用示例

配置完成后，AI 助手可以：

- 搜索笔记：`搜索关于 STM32 的笔记`
- 读取内容：`读取 STM32系列选型速查.md`
- 浏览结构：`列出硬件学习文件夹的内容`
- 全文搜索：`在笔记中搜索 "定时器"`
- 创建文件夹：`在知识点目录下创建一个新文件夹`
- 获取提示词指南：`告诉我如何使用知识库整理助手提示词`

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 测试运行（需指定 vault 路径）
node dist/index.js --vault "/path/to/vault"
```

## 📝 Frontmatter 支持

本工具会解析笔记的 YAML Frontmatter，支持以下字段：

```yaml
---
category: hardware
tags: [STM32, 嵌入式]
summary: 笔记摘要
folder: 知识点/03-硬件学习/
created: 2024-12-18
---
```

## 📄 License

MIT
