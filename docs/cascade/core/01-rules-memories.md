# 规则与记忆（Rules & Memories）

## 规则体系要点
- 规则用于长期约束与标准化提示。
- 规则存储位置：
  - `.windsurf/rules`（当前工作区/子目录/向上到 git root）
- 规则激活方式：
  1. **Manual**（@mention）
  2. **Always On**
  3. **Model Decision**
  4. **Glob**（文件匹配）

### 规则最佳实践
- 简洁、具体、用列表/标题
- 避免泛泛规则（如“写好代码”）
- 可用 XML 分组（结构化约束）

### 企业级系统规则
- System-level rules 由 IT/安全团队管理。
- 可通过 MDM/配置管理统一分发，确保全员一致的安全与合规约束。

### AGENTS.md vs Rules（适用场景）
- **AGENTS.md**：目录级自动生效，适合局部规范（如 frontend/components）。
- **Rules**：跨目录/跨场景约束，支持 Glob/Always On/Model Decision 等激活逻辑。

示例（官方风格）：
```
# Coding Guidelines
- My project's programming language is python
- Use early returns when possible
- Always add documentation when creating new functions and classes
```

## Memories（记忆）
- 记忆用于跨对话保持上下文
- 支持自动生成/手动触发
- 可在面板中删除

### 建议的记忆内容
- 项目结构约定、技术栈与依赖约束
- UI 设计系统（颜色/间距/组件规范）
- 测试与发布流程（必跑命令）

## 本质拆解
- **规则 = 稳态约束**：为模型提供稳定行为边界
- **记忆 = 经验缓存**：保留任务偏好/上下文

## 推荐模板
```
<project_rules>
- 技术栈：React + TypeScript + Tailwind
- 组件命名：PascalCase
- API：使用 /api/v1 前缀
- UI：保持 8px spacing 体系
</project_rules>
```

## 目录级规范模板（AGENTS.md）
```
# Component Guidelines
- 只使用函数组件 + hooks
- 组件命名：ComponentName.tsx
- 必须有 ComponentName.test.tsx
- 使用 CSS Modules
```

## 参考来源
- https://docs.windsurf.com/windsurf/cascade/memories
- https://docs.windsurf.com/llms-full.txt (Memories & Rules)
- https://docs.windsurf.com/windsurf/cascade/agents-md
