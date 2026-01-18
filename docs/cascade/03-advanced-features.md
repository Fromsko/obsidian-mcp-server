# 第三章：高级功能详解

## 3.1 技能系统 (Skills)

### 技能概述
技能帮助 Cascade 处理复杂的多步骤任务，将参考脚本、模板、清单等支持文件捆绑到文件夹中，Cascade 可以调用和使用。

### 技能工作原理
- **渐进式披露**: Cascade 智能地仅在相关时调用技能
- **手动调用**: 用户也可以手动调用技能
- **多步骤执行**: 确保复杂工作流程的一致性执行

### 创建技能

#### 方法一：使用 UI（最简单）
1. 在 Cascade 中点击"技能"选项
2. 选择"创建新技能"
3. 按向导完成设置

#### 方法二：手动创建
```
技能文件夹结构:
my-skill/
├── SKILL.md          # 技能定义文件
├── template.py       # 模板文件
├── checklist.md      # 清单文件
└── helper.sh        # 辅助脚本
```

### SKILL.md 文件格式
```markdown
---
name: deploy-to-staging
description: 部署应用到测试环境
scope: workspace
---

# 部署到测试环境

这个技能帮助您将应用部署到测试环境。

## 步骤
1. 检查代码质量
2. 运行测试
3. 构建应用
4. 部署到测试环境
5. 验证部署

## 使用方法
在 Cascade 中输入: `/deploy-to-staging`
```

### 必需的前置字段
- `name`: 技能名称（有效格式：deploy-to-staging, code-review, setup-dev-environment）
- `description`: 向模型显示的简要说明
- `scope`: 技能范围（workspace, global, system）

### 技能调用方式
- **自动调用**: Cascade 根据任务相关性自动调用
- **手动调用**: 使用 `/skill-name` 命令
- **@ 提及**: 使用 `@skill-name` 直接引用

### 技能示例用例
- **部署工作流**: 自动化部署流程
- **代码审查指南**: 标准化代码审查
- **测试程序**: 自动化测试流程

## 3.2 工作流系统 (Workflows)

### 工作流概述
工作流允许用户定义一系列步骤来指导 Cascade 完成重复性任务，如部署服务或响应 PR 评论。

### 工作流创建
工作流保存为 markdown 文件，提供简单可重复的方式运行关键流程。

### 工作流调用
```
/[workflow-name]
```

### 工作流嵌套
工作流可以调用其他工作流：
```markdown
# workflow-1.md
## 步骤
1. 调用 /workflow-2
2. 调用 /workflow-3
3. 整合结果
```

### 工作流存储位置
- 工作区级别: `.windsurf/workflows/`
- 全局级别: `~/.windsurf/workflows/`
- 系统级别: 企业管理员配置

### 示例工作流

#### PR 审查工作流
```markdown
---
name: pr-review
description: 完整的 PR 审查流程
---

# PR 审查工作流

## 1. 代码检查
- [ ] 检查代码风格
- [ ] 验证测试覆盖率
- [ ] 检查安全性

## 2. 功能验证
- [ ] 运行单元测试
- [ ] 验证集成测试
- [ ] 手动测试关键功能

## 3. 部署测试
- [ ] 部署到测试环境
- [ ] 验证部署成功
- [ ] 运行端到端测试
```

#### 部署工作流
```markdown
---
name: deploy-production
description: 生产环境部署流程
---

# 生产部署工作流

## 准备阶段
1. 确认所有测试通过
2. 检查版本号
3. 备份当前版本

## 部署阶段
1. 构建生产版本
2. 部署到生产环境
3. 运行健康检查

## 验证阶段
1. 验证关键功能
2. 监控系统指标
3. 通知团队
```

## 3.3 模型上下文协议 (MCP)

### MCP 概述
MCP (Model Context Protocol) 是一个开放标准，使 AI 代理如 Cascade 能够无缝连接外部工具、数据源和服务。

### MCP 解决的问题
- 减少上下文切换
- 增强 Cascade 能力
- 保持流程状态
- 扩展工具生态系统

### 内置 MCP 服务器
- **文件系统**: 访问本地文件
- **数据库**: 连接各种数据库
- **API 客户端**: 调用外部 API
- **文档系统**: 访问文档库

### 添加新的 MCP 服务器

#### 方法一：从插件商店
1. 点击插件商店
2. 浏览可用的 MCP 服务器
3. 点击安装

#### 方法二：手动配置
创建 `mcp_config.json` 文件：
```json
{
  "mcpServers": {
    "postgres": {
      "command": "postgres-mcp-server",
      "args": ["--connection-string", "postgresql://..."]
    },
    "notion": {
      "command": "notion-mcp-server",
      "args": ["--token", "your-notion-token"]
    }
  }
}
```

### 配置插值
```json
{
  "mcpServers": {
    "database": {
      "command": "db-server",
      "args": ["--url", "${DATABASE_URL}"]
    }
  }
}
```

### 远程 HTTP MCP
```json
{
  "mcpServers": {
    "remote-api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

### 企业管理控制
- **服务器匹配**: 通过正则表达式匹配工作区
- **配置选项**: 集中管理 MCP 配置
- **常见模式**: 预定义的匹配规则

### MCP 使用示例

#### 数据库访问
```
用户: "查询用户表中的活跃用户"
Cascade: [使用 postgres-mcp 查询数据库]
```

#### 文档访问
```
用户: "查找产品需求文档"
Cascade: [使用 notion-mcp 搜索 Notion 数据库]
```

## 3.4 记忆和规则系统

### 记忆系统
记忆是在 Cascade 对话中共享和持久化上下文的系统。

#### 记忆类型
- **自动生成记忆**: Cascade 自动创建的上下文
- **用户定义规则**: 手动定义的本地和全局规则

#### 记忆管理
1. **访问记忆**: 点击"记忆"选项卡
2. **编辑记忆**: 修改现有记忆内容
3. **创建规则**: 定义新的上下文规则

#### 规则发现位置
- 工作区级别: `.windsurf/rules/`
- 全局级别: `~/.windsurf/rules/`
- 系统级别: 企业管理员配置

### 规则系统
规则为 Cascade 提供持久化的上下文指导。

#### 规则示例
```markdown
---
name: coding-standards
description: 项目编码标准
scope: workspace
---

# 编码标准

## Python 代码风格
- 使用 Black 格式化
- 遵循 PEP 8
- 类型提示必须包含

## JavaScript 代码风格
- 使用 Prettier 格式化
- 使用 ESLint 检查
- 优先使用 const 而非 let
```

#### 激活模式
- **自动激活**: 基于上下文自动应用
- **手动激活**: 用户明确调用
- **混合模式**: 结合自动和手动激活

## 3.5 Web 和文档搜索

### 搜索功能概述
Cascade 可以搜索网络和文档以获取最新信息。

### 快速开始
1. 在对话中提及需要搜索的内容
2. Cascade 自动执行搜索
3. 返回相关结果和链接

### 搜索类型
- **网络搜索**: 搜索互联网资源
- **文档搜索**: 搜索技术文档
- **代码搜索**: 搜索代码示例

### 搜索示例
```
用户: "如何实现 React 性能优化？"
Cascade: [搜索网络和文档，提供最佳实践]
```

## 3.6 工作树 (Worktrees)

### 基本工作树使用
工作树允许您在同一个仓库中同时处理多个分支。

### 位置
工作树通常位于主仓库的 `../` 目录中。

### 设置钩子
```bash
#!/bin/bash
# setup-worktree-hook.sh
git worktree add ../feature-branch feature-branch
cd ../feature-branch
npm install
```

### 清理
```bash
# 清理不需要的工作树
git worktree prune
```

### 源代码管理面板
在 VS Code 的源代码管理面板中管理工作树。

## 3.7 代码地图 (Codemaps) - Beta

### 什么是代码地图
代码地图是代码库的可视化表示，帮助理解代码结构和关系。

### 访问代码地图
1. 打开命令面板
2. 搜索"创建代码地图"
3. 选择要映射的文件或目录

### 创建代码地图
```typescript
// 自动生成代码地图
const codemap = {
  structure: 'hierarchical',
  includeTests: true,
  showDependencies: true
};
```

### 共享代码地图
- 导出为图片
- 分享链接
- 嵌入文档

### 与 Cascade 一起使用
```
用户: "为这个项目创建代码地图"
Cascade: [生成并显示代码地图]
```

## 3.8 高级配置

### 启用 Cascade 访问 .gitignore 文件
```json
{
  "cascade": {
    "accessGitignore": true
  }
}
```

### SSH 支持
```json
{
  "ssh": {
    "keyPath": "~/.ssh/id_rsa",
    "knownHosts": "~/.ssh/known_hosts"
  }
}
```

### 开发容器支持
```dockerfile
# .devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/python:3.9
# 安装 Cascade 支持的工具
```

---

*本章介绍了 Cascade 的高级功能，帮助用户充分利用系统的强大能力。*
