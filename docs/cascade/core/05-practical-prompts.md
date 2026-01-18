# 实战 Prompt & 模板（Stage 1）

## 高质量 Prompt 结构
1. 明确目标（输出类型）
2. 提供关键上下文（@mention 文件/函数）
3. 给出限制条件（技术栈/安全/性能/格式）

## Prompt 模板（需求澄清）
```
目标：请先输出需求澄清清单，再给实施计划。
上下文：@repo:frontend  @file:src/pages/Home.tsx
约束：使用现有 design tokens；不引入新依赖。
输出：1) 澄清问题 2) 方案计划 3) 影响面列表
```

## Prompt 模板（代码规范化）
```
目标：重构 @file:src/utils/date.ts 为纯函数，并补充单测。
约束：TypeScript，eslint 规则不变。
输出：1) 变更摘要 2) 新函数签名 3) 单测覆盖说明
```

## Prompt 模板（UI 美化）
```
目标：优化 @file:src/components/Card.tsx 的视觉层级
约束：保持现有布局结构，不改 props API
输出：1) 样式策略 2) 修改点清单 3) 可复用样式变量
```

## Prompt 模板（流程清晰化）
```
目标：将“发布流程”整理为 workflow 步骤，可重复执行
输出：Workflow markdown（包含步骤、检查清单、失败回滚）
```

## Prompt 模板（DeepWiki → Cascade）
```
目标：基于 DeepWiki 对 @symbol 的解释，给出重构建议与风险点
输出：1) 风险列表 2) 可拆分的重构步骤 3) 需要补充的测试
```

## Prompt 模板（Previews UI 调优）
```
目标：根据 @element 的 DOM 与 @error 的日志修复 UI
约束：不改现有布局结构，只调样式与轻量结构
输出：1) 样式策略 2) 修改文件列表 3) 预期视觉效果
```

## Prompt 模板（Vibe and Replace 批量规范化）
```
目标：对所有匹配项执行批量替换
查询："className=\"btn\""
指令：替换为符合 design tokens 的按钮样式
输出：替换统计 + 风险文件列表
```

## Prompt 模板（终端安全执行）
```
目标：只生成可安全自动执行的命令
约束：避免 rm/curl/sh 等高风险指令
输出：命令列表 + 风险说明
```

## 参考来源
- https://docs.windsurf.com/best-practices/prompt-engineering
- https://docs.windsurf.com/windsurf/deepwiki
- https://docs.windsurf.com/windsurf/previews
- https://docs.windsurf.com/windsurf/vibe-and-replace
- https://docs.windsurf.com/windsurf/terminal
