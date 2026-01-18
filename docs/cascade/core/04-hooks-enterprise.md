# Hooks 与企业治理

## Cascade Hooks 核心能力
- 记录审计（读写文件、命令、prompt、响应）
- 安全控制（阻止危险命令/敏感文件访问）
- 质量保证（自动运行 lint/test/format）
- 工作流集成（通知、工单、部署）

## Hooks 执行方式
- Hooks 是 shell 命令，读取 JSON 输入
- **pre-hook** 可用 exit code 2 阻断操作

### 常见 Hook 事件
- `pre_read_code` / `post_read_code`
- `pre_write_code` / `post_write_code`
- `pre_run_command` / `post_run_command`
- `pre_user_prompt` / `post_cascade_response`
- `post_setup_worktree`（新 worktree 初始化）

## Hooks 配置位置
- 系统级（组织统一治理）
- 用户级（个人偏好）
- 工作区级（项目策略）

## 企业治理要点
- System-level rules & workflows 可通过 MDM 分发
- Admin Portal 可管理 MCP、Web Search、Deploys 等开关
- 角色权限与最小权限策略

### Hook 分发与审计
- System-level hooks 适合安全审计与合规强制。
- 支持验证与审计流程（可记录每次 hook 执行结果）。
- Workspace hooks 适合团队级规范。

## 示例（hooks.json）
```
{
  "hooks": {
    "pre_read_code": [
      {"command": "python3 /path/to/audit.py", "show_output": true}
    ],
    "post_write_code": [
      {"command": "python3 /path/to/format.py", "show_output": true}
    ]
  }
}
```

## Worktree 初始化示例（post_setup_worktree）
```
{
  "hooks": {
    "post_setup_worktree": [
      {
        "command": "bash $ROOT_WORKSPACE_PATH/hooks/setup_worktree.sh",
        "show_output": true
      }
    ]
  }
}
```

## 参考来源
- https://docs.windsurf.com/windsurf/cascade/hooks
- https://docs.windsurf.com/llms-full.txt (Cascade Hooks)
- https://windsurf.com/changelog (System-level Rules & Workflows)
- https://docs.windsurf.com/windsurf/guide-for-admins
- https://docs.windsurf.com/windsurf/cascade/worktrees
