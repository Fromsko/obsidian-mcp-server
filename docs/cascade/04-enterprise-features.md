# 第四章：企业功能详解

## 4.1 Cascade Hooks 系统

### Hooks 概述
Hooks 是在特定 Cascade 操作发生时自动运行的 shell 命令，为自动化和治理提供了强大能力。

### 可构建的功能
- **日志记录和分析**: 跟踪每个文件读取、代码更改、命令执行、用户提示或 Cascade 响应
- **安全控制**: 阻止 Cascade 访问敏感文件、运行危险命令或处理违反策略的提示
- **质量保证**: 在代码修改后自动运行 linters、格式化程序或测试
- **自定义工作流**: 与问题跟踪器、通知系统或部署管道集成
- **团队标准化**: 在整个组织中强制执行编码标准和最佳实践

### Hooks 工作原理
1. **接收上下文**: 通过 JSON 标准输入接收操作详情
2. **执行脚本**: 运行 Python、Bash、Node.js 或任何可执行文件
3. **返回结果**: 通过退出代码和输出流返回结果

### 阻塞操作
对于 pre-hooks（在操作前执行），脚本可以通过退出代码 `2` 来**阻塞操作**。这使得 pre-hooks 非常适合实现安全策略或验证检查。

### Hooks 配置

#### 系统级 Hooks
适用于在共享开发机器上强制执行的组织级策略。

**配置位置**:
- **macOS**: `/Library/Application Support/Windsurf/hooks.json`
- **Linux/WSL**: `/etc/windsurf/hooks.json`
- **Windows**: `C:\ProgramData\Windsurf\hooks.json`

#### 用户级 Hooks
适合个人偏好和可选工作流。

**配置位置**:
- **Windsurf IDE**: `~/.codeium/windsurf/hooks.json`
- **JetBrains Plugin**: `~/.codeium/hooks.json`

#### 工作区级 Hooks
允许团队将项目特定策略与代码一起进行版本控制。

**配置位置**: `.windsurf/hooks.json` 在工作区根目录

### Hooks 合并
来自所有三个位置的 Hooks 会**合并在一起**。如果在多个位置配置了相同的钩子事件，所有 hooks 将按顺序执行：系统 → 用户 → 工作区。

### Hooks 配置结构

#### 基本结构
```json
{
  "hooks": {
    "pre_read_code": [
      {
        "command": "python",
        "args": ["scripts/check-file-access.py"],
        "enabled": true
      }
    ],
    "post_write_code": [
      {
        "command": "npm",
        "args": ["run", "format"],
        "enabled": true
      }
    ]
  }
}
```

#### 配置选项
- `command`: 要执行的命令
- `args`: 命令参数数组
- `enabled`: 是否启用此 hook
- `timeout`: 超时时间（秒）
- `workingDirectory`: 工作目录

### Hook 事件

#### 通用输入结构
```json
{
  "event": "hook_event_name",
  "timestamp": "2026-01-18T04:43:00Z",
  "workspace": "/path/to/workspace",
  "user": "user@example.com",
  "data": {
    // 事件特定数据
  }
}
```

#### 可用 Hook 事件

##### pre_read_code
在读取代码前执行
```json
{
  "event": "pre_read_code",
  "data": {
    "filePath": "/path/to/file.js",
    "fileSize": 1024,
    "reason": "user_request"
  }
}
```

##### post_read_code
在读取代码后执行
```json
{
  "event": "post_read_code",
  "data": {
    "filePath": "/path/to/file.js",
    "content": "文件内容...",
    "success": true
  }
}
```

##### pre_write_code
在写入代码前执行
```json
{
  "event": "pre_write_code",
  "data": {
    "filePath": "/path/to/file.js",
    "content": "要写入的内容...",
    "operation": "create"
  }
}
```

##### post_write_code
在写入代码后执行
```json
{
  "event": "post_write_code",
  "data": {
    "filePath": "/path/to/file.js",
    "content": "已写入的内容...",
    "success": true,
    "size": 2048
  }
}
```

##### pre_run_command
在运行命令前执行
```json
{
  "event": "pre_run_command",
  "data": {
    "command": "npm install",
    "args": ["express"],
    "cwd": "/path/to/project"
  }
}
```

##### post_run_command
在运行命令后执行
```json
{
  "event": "post_run_command",
  "data": {
    "command": "npm install",
    "args": ["express"],
    "exitCode": 0,
    "stdout": "安装输出...",
    "stderr": ""
  }
}
```

##### pre_mcp_tool_use
在 MCP 工具使用前执行
```json
{
  "event": "pre_mcp_tool_use",
  "data": {
    "tool": "postgres-query",
    "parameters": {
      "query": "SELECT * FROM users"
    }
  }
}
```

##### post_mcp_tool_use
在 MCP 工具使用后执行
```json
{
  "event": "post_mcp_tool_use",
  "data": {
    "tool": "postgres-query",
    "parameters": {
      "query": "SELECT * FROM users"
    },
    "result": {
      "rows": [...],
      "success": true
    }
  }
}
```

##### pre_user_prompt
在用户提示前执行
```json
{
  "event": "pre_user_prompt",
  "data": {
    "prompt": "创建一个新的 API 端点",
    "context": {
      "selectedText": "",
      "currentFile": "/path/to/file.js"
    }
  }
}
```

##### post_cascade_response
在 Cascade 响应后执行
```json
{
  "event": "post_cascade_response",
  "data": {
    "prompt": "创建一个新的 API 端点",
    "response": "响应内容...",
    "model": "swe-1.5",
    "tokensUsed": 1500
  }
}
```

##### post_setup_worktree
在设置工作树后执行
```json
{
  "event": "post_setup_worktree",
  "data": {
    "worktreePath": "/path/to/worktree",
    "branch": "feature-branch",
    "success": true
  }
}
```

### 退出代码
- `0`: 成功，继续操作
- `1`: 警告，记录但继续操作
- `2`: 阻塞，停止当前操作
- `其他`: 错误，记录并继续操作

### 示例用例

#### 记录所有 Cascade 操作
```json
{
  "hooks": {
    "post_read_code": [
      {
        "command": "python",
        "args": ["scripts/log-file-access.py"],
        "enabled": true
      }
    ],
    "post_write_code": [
      {
        "command": "python",
        "args": ["scripts/log-file-write.py"],
        "enabled": true
      }
    ],
    "post_cascade_response": [
      {
        "command": "python",
        "args": ["scripts/log-response.py"],
        "enabled": true
      }
    ]
  }
}
```

#### 限制文件访问
```json
{
  "hooks": {
    "pre_read_code": [
      {
        "command": "python",
        "args": ["scripts/check-sensitive-files.py"],
        "enabled": true
      }
    ],
    "pre_write_code": [
      {
        "command": "python",
        "args": ["scripts/check-write-permissions.py"],
        "enabled": true
      }
    ]
  }
}
```

#### 阻塞危险命令
```json
{
  "hooks": {
    "pre_run_command": [
      {
        "command": "python",
        "args": ["scripts/block-dangerous-commands.py"],
        "enabled": true
      }
    ]
  }
}
```

#### 阻塞违反策略的提示
```json
{
  "hooks": {
    "pre_user_prompt": [
      {
        "command": "python",
        "args": ["scripts/check-prompt-compliance.py"],
        "enabled": true
      }
    ]
  }
}
```

#### 运行代码格式化程序
```json
{
  "hooks": {
    "post_write_code": [
      {
        "command": "npm",
        "args": ["run", "format"],
        "enabled": true
      }
    ]
  }
}
```

### 最佳实践

#### 安全
- 验证所有输入参数
- 使用最小权限原则
- 定期审查 hook 脚本
- 记录所有 hook 活动

#### 性能考虑
- 保持 hook 脚本轻量
- 避免阻塞操作
- 使用适当的超时设置
- 并行执行独立的 hooks

#### 错误处理
- 提供有意义的错误消息
- 实现优雅的降级
- 记录错误详情
- 测试失败场景

#### 测试 Hooks
- 单元测试 hook 脚本
- 集成测试 hook 流程
- 性能测试 hook 影响
- 安全测试 hook 验证

### 企业分发

#### 部署方法
- **配置管理工具**: 使用 Ansible、Puppet 等
- **系统镜像**: 预配置在系统镜像中
- **网络共享**: 从网络共享分发
- **包管理器**: 通过包管理器分发

#### 验证和审计
- 验证 hook 配置完整性
- 审计 hook 执行日志
- 监控 hook 性能影响
- 定期安全审查

#### 工作区 Hooks 团队项目
- 版本控制 hook 配置
- 团队标准化 hook 规则
- 项目特定 hook 集成
- 持续集成 hook 验证

## 4.2 分析和 API

### Cascade 分析 API

#### 获取 Cascade 分析
```http
POST https://server.codeium.com/api/v1/CascadeAnalytics
```

查询 Cascade 特定的使用指标，包括建议/接受的行数、模型使用、信用消耗和工具使用统计。

#### 数据源
- `cascade_lines`: 代码行指标
- `cascade_runs`: Cascade 运行指标
- `cascade_tool_usage`: 工具使用统计

#### 工具使用映射
```json
{
  "search": "代码搜索操作",
  "analyze": "代码分析操作",
  "terminal": "终端命令执行",
  "web_search": "网络搜索操作",
  "mcp": "MCP 工具调用"
}
```

#### 示例请求
```json
{
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "filters": {
    "teamId": "team-123",
    "userId": "user-456"
  },
  "metrics": [
    "lines_suggested",
    "lines_accepted",
    "credits_used",
    "tool_usage"
  ]
}
```

#### 示例响应
```json
{
  "data": {
    "cascade_lines": {
      "suggested": 50000,
      "accepted": 35000,
      "acceptance_rate": 0.7
    },
    "cascade_runs": {
      "total": 1200,
      "successful": 1150,
      "failed": 50
    },
    "cascade_tool_usage": {
      "search": 300,
      "analyze": 250,
      "terminal": 150,
      "web_search": 100,
      "mcp": 80
    }
  },
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  }
}
```

### 自定义分析查询

#### 查询请求结构
```json
{
  "selections": [
    {
      "field": "user_id",
      "alias": "userId"
    },
    {
      "field": "cascade_lines_suggested",
      "alias": "linesSuggested",
      "aggregation": "sum"
    }
  ],
  "filters": [
    {
      "field": "date",
      "operator": ">=",
      "value": "2026-01-01"
    }
  ],
  "aggregations": [
    {
      "field": "user_id",
      "type": "group_by"
    }
  ]
}
```

#### 可用字段

##### 用户数据
- `user_id`: 用户 ID
- `user_email`: 用户邮箱
- `team_id`: 团队 ID
- `plan_type`: 计划类型

##### 聊天数据
- `chat_id`: 聊天 ID
- `message_count`: 消息数量
- `token_usage`: 令牌使用量
- `model_used`: 使用的模型

##### 命令数据
- `command_type`: 命令类型
- `execution_time`: 执行时间
- `success_rate`: 成功率

##### PCW 数据
- `prompt_credit_worth`: 提示信用价值
- "credit_consumption": 信用消耗

### 使用配置 API

#### 获取使用配置
```http
GET https://server.codeium.com/api/v1/UsageConfiguration
```

#### 设置使用配置
```http
POST https://server.codeium.com/api/v1/UsageConfiguration
```

##### 信用上限配置
```json
{
  "scope": "team",
  "scopeId": "team-123",
  "creditCap": 10000,
  "period": "monthly"
}
```

## 4.3 团队和企业功能

### 身份和访问管理

#### 单点登录 (SSO)
- 支持 SAML 2.0
- 支持 OIDC
- 自动用户配置

#### SCIM 配置
- 自动用户配置
- 组同步
- 权限管理

### 用户和团队管理

#### 角色管理
- 创建自定义角色
- 权限分配
- 角色继承

#### 用户组
- 批量用户管理
- 权限分组
- 策略应用

### 企业级配置

#### 系统级规则
企业级规则在组织范围内强制执行：

```json
{
  "systemRules": {
    "security": {
      "blockSensitiveFiles": true,
      "allowedDomains": ["company.com"],
      "auditLogEnabled": true
    },
    "compliance": {
      "dataRetention": "90 days",
      "exportControls": true,
      "gdprCompliance": true
    }
  }
}
```

#### 系统规则工作原理
1. **自动发现**: Cascade 自动发现和应用系统规则
2. **优先级**: 系统规则覆盖用户和工作区规则
3. **强制执行**: 无法绕过系统级规则

### 高级分析

#### 内置分析
- 使用趋势
- 性能指标
- 用户行为分析
- 成本分析

#### API 访问
- 自定义查询
- 数据导出
- 第三方集成
- 实时监控

## 4.4 安全和合规

### 安全功能
- 端到端加密
- 数据隔离
- 访问控制
- 审计日志

### 合规功能
- GDPR 合规
- SOC 2 认证
- 数据驻留
- 导出控制

### 企业安全
- 私有部署
- 网络隔离
- 密钥管理
- 漏洞扫描

---

*本章详细介绍了 Cascade 的企业级功能，为大型组织提供了完整的解决方案。*
