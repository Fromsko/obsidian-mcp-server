# Skills & Workflows

## Skills（复杂任务包）
Skills 用于打包复杂任务（脚本、模板、检查清单等），支持渐进式调用。

### SKILL.md 结构（概念版）
```
---
name: api-review
description: Review API changes for backward compatibility
---
# When to use
- Use for PRs touching /api
# Steps
1. Read OpenAPI spec
2. Compare endpoints
3. Generate risk report
```

### Agent Skills 规范（简要）
- 目录包含 `SKILL.md`
- 可包含 scripts/ references/ assets/
- 具备 progressive disclosure（按需加载）

### Skills 实战要点
- **description 关键**：描述清楚“何时用”，有助于自动触发。
- 支持手动调用：输入 `@skill-name` 强制触发。
- 尽量拆成步骤化指令，避免长段落。

## Workflows（可重复流程）
- Workflow 是步骤化任务，用 `/workflow-name` 调用。
- 存储在 `.windsurf/workflows/` 目录，可被自动发现。
- 可嵌套调用其他 workflow。

### Workflow 发现与优先级
- 系统自动加载所有目录下的 `.md` 文件。
- 同名 workflow 冲突时，**系统级最高优先级**（企业管理）。

### Workflow 模板（示例）
```
# PR Review
## Step 1
读取变更摘要并列出风险点
## Step 2
按模块生成建议
## Step 3
输出检查清单
```

### Workflow 模板（部署/回滚）
```
# Deploy Preview
## Step 1
检查环境变量与构建脚本
## Step 2
运行测试与 lint
## Step 3
执行部署并输出 URL
## Step 4
若失败，回滚并记录原因
```

## 本质拆解
- **Skills = 能力包**（“把复杂能力打包成文件化知识+资源”）
- **Workflows = 执行链**（“把任务流程化并可重复调用”）

## 参考来源
- https://docs.windsurf.com/windsurf/cascade/skills
- https://docs.windsurf.com/windsurf/cascade/workflows
- https://agentskills.io/specification
- https://agentskills.io/what-are-skills
