---
description: Lint, format, and commit changes with version bump using bun (manual trigger only)
---

1. Check if there are any changes to commit using `git status`
   - If no changes, exit with message "No changes to commit"

2. Run linting using bun:
   ```bash
   bun run lint 2>/dev/null || echo "No lint script found"
   ```

3. Run formatting using bun:
   ```bash
   bun run format 2>/dev/null || echo "No format script found"
   ```

4. Update package.json version:
   - Read current version from package.json
   - Increment patch version (x.x.Z -> x.x.Z+1)
   - Update package.json with new version

5. Stage all changes:
   ```bash
   bun run build 2>/dev/null || echo "No build script found"
   git add .
   ```

6. Ask user for confirmation before committing:
   - Show staged files with `git status --porcelain`
   - Ask "Do you want to commit these changes? (y/n)"
   - If user says no, exit with `git reset`

7. Generate commit message and commit:
   - Use git skill to automatically generate appropriate commit message
   - Commit with the generated message

8. Show commit summary:
   - Display last commit with `git log --oneline -1`
   - Show new version number


<commit-rules>
Must using chinese commit message

## Format
```
<emoji> <type>: <description>
```

## Commit Types

| Emoji | Type | 用途 |
|-------|------|------|
| ✨ | feat | 新功能 |
| 🐛 | fix | Bug 修复 |
| 📝 | docs | 文档更新 |
| 🎨 | style | 代码格式 |
| ♻️ | refactor | 重构 |
| ⚡ | perf | 性能优化 |
| ✅ | test | 测试 |
| 📦 | build | 构建/依赖 |
| 👷 | ci | CI/CD |
| 🔧 | chore | 杂项 |
| ⏪ | revert | 回滚 |

## Examples
```
✨ feat: add user authentication
🐛 fix: resolve login timeout issue
📝 docs: update API documentation
🎨 style: format code with prettier
♻️ refactor: simplify user service logic
⚡ perf: optimize database queries
✅ test: add unit tests for auth module
📦 build: upgrade webpack to v5
👷 ci: add GitHub Actions workflow
🔧 chore: update dependencies
⏪ revert: remove deprecated feature
```

## Guidelines
- Keep the description concise and clear
- Use imperative mood (e.g., "add" not "added")
- Limit the first line to 50 characters
- Reference issues in the description if applicable
</commit-rules>
