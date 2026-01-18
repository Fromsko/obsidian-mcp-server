import { createNoteService } from "../services/notes.js";
import { getPromptGuide, suggestFolder, fillTemplate } from "../services/prompt.js";

export function buildTools(vaultPath: string) {
  const notes = createNoteService(vaultPath);

  const tools = [
    {
      name: "search_notes",
      description: "搜索 Obsidian 笔记库中的笔记，支持关键词、标签、分类过滤",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词（匹配笔记名称和摘要）",
          },
          tag: { type: "string", description: "按标签过滤" },
          category: {
            type: "string",
            description: "按分类过滤（如 hardware, ai, backend 等）",
          },
        },
      },
    },
    {
      name: "read_note",
      description: "读取指定笔记的完整内容",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              "笔记的相对路径（如 知识点/03-硬件学习/STM32系列选型速查.md）",
          },
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
          folder: {
            type: "string",
            description: "文件夹路径（留空则列出根目录）",
          },
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
          path: {
            type: "string",
            description:
              "笔记的相对路径（如 知识点/04-人工智能/MCP/自己制作的MCP/新笔记.md）",
          },
          content: {
            type: "string",
            description: "笔记内容（支持 Markdown 和 Frontmatter）",
          },
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
          path: {
            type: "string",
            description:
              "文件夹的相对路径（如 知识点/04-人工智能/MCP/新文件夹）",
          },
        },
        required: ["path"],
      },
    },
    {
      name: "get_prompt_guide",
      description:
        "获取 Obsidian 知识库整理助手提示词的使用指南，展示如何添加和使用这个提示词",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "auto_archive_note",
      description: "根据分类自动归档笔记到建议的文件夹",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "当前笔记路径" },
          category: { type: "string", description: "笔记分类" },
        },
        required: ["path", "category"],
      },
    },
    {
      name: "generate_from_template",
      description: "使用指定模板生成新笔记",
      inputSchema: {
        type: "object",
        properties: {
          templateName: {
            type: "string",
            description: "模板名称（如：概念卡、读书笔记、问题链、本质拆解、扩展思路、灵感启发、复盘行动）"
          },
          noteName: { type: "string", description: "新笔记的文件名（不含路径，如：React学习笔记）" },
          data: {
            type: "object",
            description: "要填充到模板中的键值对数据",
            additionalProperties: { type: "string" }
          },
          category: { type: "string", description: "分类（可选，用于自动决定存放路径）" },
          folder: { type: "string", description: "显式指定的文件夹路径（可选）" }
        },
        required: ["templateName", "noteName", "data"],
      },
    },
  ];

  async function handleTool(name: string, args?: Record<string, unknown>) {
    switch (name) {
      case "search_notes":
        return notes.searchNotes(
          (args?.query as string) || "",
          args?.tag as string,
          args?.category as string
        );
      case "read_note":
        return notes.readNote(args?.path as string);
      case "list_folder":
        return notes.listFolder((args?.folder as string) || "");
      case "get_note_structure":
        return notes.getNoteStructure();
      case "full_text_search":
        return notes.fullTextSearch(args?.keyword as string);
      case "create_note":
        return notes.createNote(args?.path as string, args?.content as string);
      case "update_note":
        return notes.updateNote(args?.path as string, args?.content as string);
      case "delete_note":
        return notes.deleteNote(args?.path as string);
      case "create_folder":
        return notes.createFolder(args?.path as string);
      case "get_prompt_guide":
        return getPromptGuide();
      case "auto_archive_note": {
        const folder = suggestFolder(args?.category as string);
        const fileName = (args?.path as string).split("/").pop();
        const newPath = `${folder}${fileName}`;
        return notes.moveNote(args?.path as string, newPath);
      }
      case "generate_from_template": {
        const template = await notes.getTemplate(args?.templateName as string);
        const filledContent = fillTemplate(template, args?.data as Record<string, string>);

        let targetFolder = (args?.folder as string) || "";
        if (!targetFolder && args?.category) {
          targetFolder = suggestFolder(args?.category as string);
        }

        const finalPath = `${targetFolder}${args?.noteName}.md`;
        return notes.createNote(finalPath, filledContent);
      }
      default:
        throw new Error(`未知工具: ${name}`);
    }
  }

  return { tools, handleTool };
}
