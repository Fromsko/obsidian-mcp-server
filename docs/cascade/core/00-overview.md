# Cascade 概览与认知框架（Stage 1）

## 核心定位
Cascade 是 Windsurf 的 agentic 编程引擎，可在 Chat/Write 两种模式中理解代码库并执行任务。支持工具调用、终端、上下文自动检索、规则/工作流/技能/Hook 等体系。

- **Chat Mode**：探索、检索、问答，不修改代码。
- **Write Mode**：执行改动、跨文件编辑、生成文档/测试、运行命令。

> 大任务建议流程：先让 Cascade 规划 → 审核计划 → 允许执行。

## Cascade 基础能力
- 工具调用（搜索、终端、Web Search、MCP 等）。
- 任务队列：可在执行时追加消息排队执行。
- 语音输入、可回滚的步骤。
- 文件忽略（.codeiumignore / .windsurf）避免误读/误改。

## 实战补充：上下文与可视化工具
- **@-Mentions**：可强制把文件/函数/终端内容拉入上下文，保证进入模型上下文。
- **DeepWiki**：悬停符号后 `Cmd+Shift+Click` 获取解释，并可一键 `Add to Cascade` 作为 @-mention。
- **Previews**：让 Cascade 通过工具调用打开本地预览；可选中 DOM 元素或错误并发回 Cascade 作为上下文。
- **Vibe and Replace**：用自然语言批量替换匹配项，适合规范化重构。

## 快速上手流程（建议）
1. Chat：明确目标 + @-mention 关键文件 → 生成计划。
2. Write：批准计划 → 执行改动。
3. Preview：打开预览 → 发送元素/错误 → 迭代优化 UI。

## 学习图谱（简化）
```
Cascade
├─ 交互模式
│  ├─ Chat (探索/问答)
│  └─ Write (执行/改动)
├─ 规则与记忆
│  ├─ Rules (全局/工作区/系统级)
│  └─ Memories (自动/手动)
├─ 自动化层
│  ├─ Workflows (多步流程)
│  └─ Skills (复杂任务包)
├─ 扩展能力
│  ├─ MCP (外部工具/数据)
│  └─ Hooks (治理/审计/自动化)
└─ 企业治理
   ├─ System Rules/Workflows
   ├─ Admin Controls
   └─ 日志/审计/权限
```

## 参考来源（节选）
- https://docs.windsurf.com/plugins/cascade/cascade-overview
- https://windsurf.com/university/general-education/intro-to-cascade
- https://docs.windsurf.com/windsurf/cascade/cascade
- https://docs.windsurf.com/windsurf/deepwiki
- https://docs.windsurf.com/windsurf/previews
- https://docs.windsurf.com/windsurf/vibe-and-replace
