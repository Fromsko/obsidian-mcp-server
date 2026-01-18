import * as fs from "fs/promises";
import { glob } from "glob";
import matter from "gray-matter";
import * as path from "path";

export interface NoteMeta {
  path: string;
  name: string;
  category?: string;
  tags?: string[];
  summary?: string;
  folder?: string;
  created?: string;
}

export function createNoteService(vaultPath: string) {
  async function parseNote(filePath: string): Promise<NoteMeta | null> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const { data } = matter(content);
      const relativePath = path.relative(vaultPath, filePath);

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

  async function getAllNotes(): Promise<NoteMeta[]> {
    const files = await glob("**/*.md", {
      cwd: vaultPath,
      ignore: [".obsidian/**", ".smart-env/**", ".windsurf/**"],
    });

    const notes: NoteMeta[] = [];
    for (const file of files) {
      const meta = await parseNote(path.join(vaultPath, file));
      if (meta) notes.push(meta);
    }
    return notes;
  }

  async function searchNotes(
    query: string,
    tag?: string,
    category?: string
  ): Promise<NoteMeta[]> {
    const allNotes = await getAllNotes();

    return allNotes.filter((note) => {
      const matchesQuery =
        !query ||
        note.name.toLowerCase().includes(query.toLowerCase()) ||
        note.summary?.toLowerCase().includes(query.toLowerCase());
      const matchesTag = !tag || note.tags?.includes(tag);
      const matchesCategory = !category || note.category === category;

      return matchesQuery && matchesTag && matchesCategory;
    });
  }

  async function readNote(notePath: string): Promise<string> {
    const fullPath = path.join(vaultPath, notePath);
    try {
      return await fs.readFile(fullPath, "utf-8");
    } catch {
      throw new Error(`笔记不存在: ${notePath}`);
    }
  }

  async function listFolder(
    folderPath: string = ""
  ): Promise<{ folders: string[]; notes: NoteMeta[] }> {
    const targetPath = path.join(vaultPath, folderPath);
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

  async function getNoteStructure(): Promise<Record<string, any>> {
    const rootContent = await listFolder("");
    const structure: Record<string, any> = {
      _notes: rootContent.notes.map((n) => n.name),
    };

    for (const folder of rootContent.folders) {
      try {
        const subContent = await listFolder(folder);
        structure[folder] = {
          folders: subContent.folders,
          notes: subContent.notes.map((n) => n.name),
        };
      } catch {
        structure[folder] = { error: "无法读取" };
      }
    }

    return structure;
  }

  async function createNote(notePath: string, content: string): Promise<string> {
    const fullPath = path.join(vaultPath, notePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    try {
      await fs.access(fullPath);
      throw new Error(`笔记已存在: ${notePath}`);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }

    await fs.writeFile(fullPath, content, "utf-8");
    return `笔记创建成功: ${notePath}`;
  }

  async function updateNote(notePath: string, content: string): Promise<string> {
    const fullPath = path.join(vaultPath, notePath);

    try {
      await fs.access(fullPath);
    } catch {
      throw new Error(`笔记不存在: ${notePath}`);
    }

    await fs.writeFile(fullPath, content, "utf-8");
    return `笔记更新成功: ${notePath}`;
  }

  async function deleteNote(notePath: string): Promise<string> {
    const fullPath = path.join(vaultPath, notePath);

    try {
      await fs.access(fullPath);
    } catch {
      throw new Error(`笔记不存在: ${notePath}`);
    }

    await fs.unlink(fullPath);
    return `笔记删除成功: ${notePath}`;
  }

  async function createFolder(folderPath: string): Promise<string> {
    const fullPath = path.join(vaultPath, folderPath);

    try {
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        throw new Error(`文件夹已存在: ${folderPath}`);
      }
      throw new Error(`路径已存在但不是文件夹: ${folderPath}`);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }

    await fs.mkdir(fullPath, { recursive: true });
    return `文件夹创建成功: ${folderPath}`;
  }

  async function fullTextSearch(
    keyword: string
  ): Promise<Array<{ path: string; matches: string[] }>> {
    const files = await glob("**/*.md", {
      cwd: vaultPath,
      ignore: [".obsidian/**", ".smart-env/**", ".windsurf/**"],
    });

    const results: Array<{ path: string; matches: string[] }> = [];

    for (const file of files) {
      try {
        const content = await fs.readFile(path.join(vaultPath, file), "utf-8");
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
        // ignore
      }
    }

    return results.slice(0, 20);
  }

  async function moveNote(oldPath: string, newPath: string): Promise<string> {
    const fullOldPath = path.join(vaultPath, oldPath);
    const fullNewPath = path.join(vaultPath, newPath);

    try {
      await fs.access(fullOldPath);
    } catch {
      throw new Error(`原笔记不存在: ${oldPath}`);
    }

    const dir = path.dirname(fullNewPath);
    await fs.mkdir(dir, { recursive: true });

    await fs.rename(fullOldPath, fullNewPath);
    return `笔记已移动: ${oldPath} -> ${newPath}`;
  }

  async function getTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(vaultPath, "Obsidian-体系", "Templates", `${templateName}模板.md`);
    try {
      return await fs.readFile(templatePath, "utf-8");
    } catch {
      throw new Error(`模板不存在: ${templateName}`);
    }
  }

  return {
    searchNotes,
    readNote,
    listFolder,
    getNoteStructure,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    fullTextSearch,
    moveNote,
    getTemplate,
  };
}
