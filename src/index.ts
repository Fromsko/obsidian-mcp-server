#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import { glob } from "glob";
import matter from "gray-matter";
import * as path from "path";

// 解析命令行参数
function parseArgs(): { vaultPath: string } {
    const args = process.argv.slice(2);
    let vaultPath = "";

    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--vault" && args[i + 1]) {
            vaultPath = args[i + 1];
            break;
        }
    }

    if (!vaultPath) {
        console.error("错误: 请使用 --vault 参数指定 Obsidian 笔记库路径");
        console.error("用法: node dist/index.js --vault \"/path/to/your/vault\"");
        process.exit(1);
    }

    return { vaultPath };
}

const { vaultPath: VAULT_PATH } = parseArgs();

interface NoteMeta {
    path: string;
    name: string;
    category?: string;
    tags?: string[];
    summary?: string;
    folder?: string;
    created?: string;
}

// 解析 Markdown 文件的 Frontmatter
async function parseNote(filePath: string): Promise<NoteMeta | null> {
    try {
        const content = await fs.readFile(filePath, "utf-8");
        const { data } = matter(content);
        const relativePath = path.relative(VAULT_PATH, filePath);

        return {
            path: relativePath,
            name: path.basename(filePath, ".md"),
            category: data.category,
            tags: data.tags,
            summary: data.summary,
            folder: data.folder,
            created: data.created,
        };
    } catch {
        return null;
    }
}

// 获取所有笔记
async function getAllNotes(): Promise<NoteMeta[]> {
    const files = await glob("**/*.md", {
        cwd: VAULT_PATH,
        ignore: [".obsidian/**", ".smart-env/**", ".windsurf/**"],
    });

    const notes: NoteMeta[] = [];
    for (const file of files) {
        const meta = await parseNote(path.join(VAULT_PATH, file));
        if (meta) notes.push(meta);
    }
    return notes;
}

// 搜索笔记
async function searchNotes(query: string, tag?: string, category?: string): Promise<NoteMeta[]> {
    const allNotes = await getAllNotes();

    return allNotes.filter((note) => {
        const matchesQuery = !query ||
            note.name.toLowerCase().includes(query.toLowerCase()) ||
            note.summary?.toLowerCase().includes(query.toLowerCase());
        const matchesTag = !tag || note.tags?.includes(tag);
        const matchesCategory = !category || note.category === category;

        return matchesQuery && matchesTag && matchesCategory;
    });
}

// 读取笔记内容
async function readNote(notePath: string): Promise<string> {
    const fullPath = path.join(VAULT_PATH, notePath);
    try {
        return await fs.readFile(fullPath, "utf-8");
    } catch {
        throw new Error(`笔记不存在: ${notePath}`);
    }
}

// 列出文件夹内容
async function listFolder(folderPath: string = ""): Promise<{ folders: string[]; notes: NoteMeta[] }> {
    const targetPath = path.join(VAULT_PATH, folderPath);
    const entries = await fs.readdir(targetPath, { withFileTypes: true });

    const folders: string[] = [];
    const notes: NoteMeta[] = [];

    for (const entry of entries) {
        if (entry.name.startsWith(".")) continue;

        if (entry.isDirectory()) {
            folders.push(entry.name);
        } else if (entry.name.endsWith(".md")) {
            const meta = await parseNote(path.join(targetPath, entry.name));
            if (meta) notes.push(meta);
        }
    }

    return { folders, notes };
}

// 获取笔记库结构
async function getNoteStructure(): Promise<Record<string, any>> {
    const rootContent = await listFolder("");
    const structure: Record<string, any> = { _notes: rootContent.notes.map(n => n.name) };

    for (const folder of rootContent.folders) {
        try {
            const subContent = await listFolder(folder);
            structure[folder] = {
                folders: subContent.folders,
                notes: subContent.notes.map(n => n.name),
            };
        } catch {
            structure[folder] = { error: "无法读取" };
        }
    }

    return structure;
}

// 创建笔记
async function createNote(notePath: string, content: string): Promise<string> {
    const fullPath = path.join(VAULT_PATH, notePath);

    // 确保目录存在
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    // 检查文件是否已存在
    try {
        await fs.access(fullPath);
        throw new Error(`笔记已存在: ${notePath}`);
    } catch (err: any) {
        if (err.code !== 'ENOENT') throw err;
    }

    // 写入文件
    await fs.writeFile(fullPath, content, 'utf-8');
    return `笔记创建成功: ${notePath}`;
}

// 更新笔记
async function updateNote(notePath: string, content: string): Promise<string> {
    const fullPath = path.join(VAULT_PATH, notePath);

    // 检查文件是否存在
    try {
        await fs.access(fullPath);
    } catch {
        throw new Error(`笔记不存在: ${notePath}`);
    }

    // 写入文件
    await fs.writeFile(fullPath, content, 'utf-8');
    return `笔记更新成功: ${notePath}`;
}

// 创建文件夹
async function createFolder(folderPath: string): Promise<string> {
    const fullPath = path.join(VAULT_PATH, folderPath);

    // 检查文件夹是否已存在
    try {
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
            throw new Error(`文件夹已存在: ${folderPath}`);
        } else {
            throw new Error(`路径已存在但不是文件夹: ${folderPath}`);
        }
    } catch (err: any) {
        if (err.code !== 'ENOENT') throw err;
    }

    // 创建文件夹
    await fs.mkdir(fullPath, { recursive: true });
    return `文件夹创建成功: ${folderPath}`;
}

// 删除笔记
async function deleteNote(notePath: string): Promise<string> {
    const fullPath = path.join(VAULT_PATH, notePath);

    // 检查文件是否存在
    try {
        await fs.access(fullPath);
    } catch {
        throw new Error(`笔记不存在: ${notePath}`);
    }

    // 删除文件
    await fs.unlink(fullPath);
    return `笔记删除成功: ${notePath}`;
}

// 获取提示词使用指南
async function getPromptGuide(): Promise<string> {
    const guide = `# 🗂️ Obsidian 知识库整理助手 - 使用指南

## 一、提示词简介

这是一个用于将杂乱笔记整理为标准 Obsidian Markdown 文档的提示词。它可以：
- 自动生成标准的 Frontmatter（YAML）
- 根据内容智能分类并推荐存放路径
- 规范化 Markdown 结构
- 自动推荐相关笔记链接

## 二、如何添加提示词

### 方法 1：在 AI 对话中直接使用

1. 复制下方提示词内容
2. 在与 AI 的对话中粘贴提示词
3. 在提示词末尾粘贴你要整理的笔记内容
4. AI 会返回整理好的 Markdown 文档

### 方法 2：保存为 Obsidian 模板

1. 在 Obsidian 中创建一个模板文件夹（如 Templates/）
2. 创建新笔记，命名为「知识库整理助手提示词.md」
3. 将提示词内容粘贴进去
4. 需要时复制使用

### 方法 3：配置为 AI 工具的系统提示词

如果你使用的 AI 工具支持自定义系统提示词（如 ChatGPT、Claude 等）：
1. 进入设置/偏好设置
2. 找到「自定义指令」或「系统提示词」选项
3. 将提示词粘贴到相应位置
4. 保存后，AI 会自动按照提示词格式整理笔记

## 三、提示词内容

\`\`\`
你是一个 Obsidian 知识库整理助手。

请将下面杂乱的笔记内容，整理为「Obsidian 可直接使用的 Markdown 文档」，要求：

## 一、生成标准 Obsidian Frontmatter（YAML）

---
category: <主分类>
tags: [tag1, tag2, tag3]
summary: <一句话总结>
icon: <lucide图标名或emoji>
status: <draft | active | archived>
folder: <推荐存放路径>
created: <YYYY-MM-DD>
---

### 分类规则（category → folder 映射）

| category | 说明 | 对应文件夹路径 |
|----------|------|----------------|
| frontend | 前端开发（JS/TS/React/Vue/CSS等） | 知识点/02-前端知识/ |
| backend | 后端开发（Rust/Java/Scala等） | 知识点/05-后端知识/ |
| hardware | 硬件/嵌入式（STM32/SystemRDL/FPGA） | 知识点/03-硬件学习/ |
| ai | 人工智能/LLM/MCP/提示词 | 知识点/04-人工智能/ |
| docker | Docker/容器化 | 知识点/01-Docker/ |
| devops | CI/CD/Git/部署 | 知识点/00-闲置笔记/git/ |
| linux | Linux 系统/命令 | 知识点/00-闲置笔记/Liunx/ |
| database | 数据库相关 | 知识点/00-闲置笔记/数据库/ |
| server | 服务器环境配置 | 知识点/00-闲置笔记/服务器安装环境/ |
| security | 密钥/认证/安全 | 知识点/密钥/ |
| music | 乐理/吉他/音乐学习 | 乐理/ |
| misc | 杂项/临时笔记 | 知识点/00-闲置笔记/ |

## 二、正文结构要求

- 使用清晰的 Markdown 标题（# / ## / ###）
- 合并重复或相近内容
- 技术笔记优先结构化（列表 / 步骤 / 代码块）
- 保留原始想法，不要过度改写语义
- 代码块必须标注语言类型

## 三、文件命名规范

- 格式：主题-子主题.md 或 序号-主题.md
- 示例：Gitea-Actions-部署方案.md、01-吉他谱寻找.md
- 避免特殊字符，使用中划线连接

## 四、在文末新增「🔗 Related Notes」章节

- 推测 3~5 个可能相关的笔记标题
- 使用 Obsidian 双链格式：[[笔记名称]]

## 五、输出要求

- 只输出整理后的 Markdown
- 不要解释整理过程
- 不要输出多余说明
- **必须在 Frontmatter 中包含 folder 字段，精确到子目录**

---

下面是需要整理的原始笔记内容：
\`\`\`

## 四、使用示例

### 输入示例

\`\`\`
react hooks 学习笔记
useState 用来管理状态
useEffect 处理副作用，比如请求数据
自定义hook要用use开头
\`\`\`

### 输出示例

\`\`\`markdown
---
category: frontend
tags: [react, hooks, useState, useEffect]
summary: React Hooks 核心概念学习笔记
icon: ⚛️
status: active
folder: 知识点/02-前端知识/React/
created: 2024-12-26
---

# React Hooks 学习笔记

## useState

用于管理组件状态。

## useEffect

处理副作用，常见用途：
- 请求数据
- 订阅事件
- 操作 DOM

## 自定义 Hook

- 命名必须以 \`use\` 开头
- 可以复用状态逻辑

---

## 🔗 Related Notes

- [[React 基础入门]]
- [[useState 详解]]
- [[useEffect 最佳实践]]
- [[自定义 Hook 封装技巧]]
\`\`\`

## 五、注意事项

1. **保持原意**：提示词会保留你的原始想法，只做结构化整理
2. **智能分类**：根据内容自动判断分类和存放路径
3. **灵活调整**：生成的 folder 路径可以根据实际情况手动调整
4. **批量处理**：可以一次性粘贴多段笔记内容进行整理
`;
    return guide;
}

// 全文搜索
async function fullTextSearch(keyword: string): Promise<Array<{ path: string; matches: string[] }>> {
    const files = await glob("**/*.md", {
        cwd: VAULT_PATH,
        ignore: [".obsidian/**", ".smart-env/**", ".windsurf/**"],
    });

    const results: Array<{ path: string; matches: string[] }> = [];

    for (const file of files) {
        try {
            const content = await fs.readFile(path.join(VAULT_PATH, file), "utf-8");
            const lines = content.split("\n");
            const matches: string[] = [];

            lines.forEach((line, index) => {
                if (line.toLowerCase().includes(keyword.toLowerCase())) {
                    matches.push(`L${index + 1}: ${line.trim().substring(0, 100)}`);
                }
            });

            if (matches.length > 0) {
                results.push({ path: file, matches: matches.slice(0, 5) });
            }
        } catch {
            // 忽略读取错误
        }
    }

    return results.slice(0, 20);
}

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
    tools: [
        {
            name: "search_notes",
            description: "搜索 Obsidian 笔记库中的笔记，支持关键词、标签、分类过滤",
            inputSchema: {
                type: "object",
                properties: {
                    query: { type: "string", description: "搜索关键词（匹配笔记名称和摘要）" },
                    tag: { type: "string", description: "按标签过滤" },
                    category: { type: "string", description: "按分类过滤（如 hardware, ai, backend 等）" },
                },
            },
        },
        {
            name: "read_note",
            description: "读取指定笔记的完整内容",
            inputSchema: {
                type: "object",
                properties: {
                    path: { type: "string", description: "笔记的相对路径（如 知识点/03-硬件学习/STM32系列选型速查.md）" },
                },
                required: ["path"],
            },
        },
        {
            name: "list_folder",
            description: "列出指定文件夹下的子文件夹和笔记",
            inputSchema: {
                type: "object",
                properties: {
                    folder: { type: "string", description: "文件夹路径（留空则列出根目录）" },
                },
            },
        },
        {
            name: "get_note_structure",
            description: "获取整个笔记库的目录结构概览",
            inputSchema: { type: "object", properties: {} },
        },
        {
            name: "full_text_search",
            description: "在所有笔记中进行全文搜索",
            inputSchema: {
                type: "object",
                properties: {
                    keyword: { type: "string", description: "要搜索的关键词" },
                },
                required: ["keyword"],
            },
        },
        {
            name: "create_note",
            description: "创建新笔记",
            inputSchema: {
                type: "object",
                properties: {
                    path: { type: "string", description: "笔记的相对路径（如 知识点/04-人工智能/MCP/自己制作的MCP/新笔记.md）" },
                    content: { type: "string", description: "笔记内容（支持 Markdown 和 Frontmatter）" },
                },
                required: ["path", "content"],
            },
        },
        {
            name: "update_note",
            description: "更新已存在的笔记内容",
            inputSchema: {
                type: "object",
                properties: {
                    path: { type: "string", description: "笔记的相对路径" },
                    content: { type: "string", description: "新的笔记内容" },
                },
                required: ["path", "content"],
            },
        },
        {
            name: "delete_note",
            description: "删除指定笔记",
            inputSchema: {
                type: "object",
                properties: {
                    path: { type: "string", description: "笔记的相对路径" },
                },
                required: ["path"],
            },
        },
        {
            name: "create_folder",
            description: "创建新文件夹",
            inputSchema: {
                type: "object",
                properties: {
                    path: { type: "string", description: "文件夹的相对路径（如 知识点/04-人工智能/MCP/新文件夹）" },
                },
                required: ["path"],
            },
        },
        {
            name: "get_prompt_guide",
            description: "获取 Obsidian 知识库整理助手提示词的使用指南，展示如何添加和使用这个提示词",
            inputSchema: {
                type: "object",
                properties: {},
            },
        },
    ],
}));

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "search_notes": {
                const results = await searchNotes(
                    args?.query as string,
                    args?.tag as string,
                    args?.category as string
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
                };
            }

            case "read_note": {
                const content = await readNote(args?.path as string);
                return {
                    content: [{ type: "text", text: content }],
                };
            }

            case "list_folder": {
                const result = await listFolder(args?.folder as string || "");
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }

            case "get_note_structure": {
                const structure = await getNoteStructure();
                return {
                    content: [{ type: "text", text: JSON.stringify(structure, null, 2) }],
                };
            }

            case "full_text_search": {
                const results = await fullTextSearch(args?.keyword as string);
                return {
                    content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
                };
            }

            case "create_note": {
                const result = await createNote(args?.path as string, args?.content as string);
                return {
                    content: [{ type: "text", text: result }],
                };
            }

            case "update_note": {
                const result = await updateNote(args?.path as string, args?.content as string);
                return {
                    content: [{ type: "text", text: result }],
                };
            }

            case "delete_note": {
                const result = await deleteNote(args?.path as string);
                return {
                    content: [{ type: "text", text: result }],
                };
            }

            case "create_folder": {
                const result = await createFolder(args?.path as string);
                return {
                    content: [{ type: "text", text: result }],
                };
            }

            case "get_prompt_guide": {
                const guide = await getPromptGuide();
                return {
                    content: [{ type: "text", text: guide }],
                };
            }

            default:
                throw new Error(`未知工具: ${name}`);
        }
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
