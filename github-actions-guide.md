---
category: backend
tags: [GitHub-Actions, CI-CD, npm, 自动化, 工作流]
summary: GitHub Actions 工作流配置规范，包含步骤命名、npm 发布、版本检测等最佳实践
folder: 知识点/05-后端知识/
created: 2024-12-19
---

# GitHub Actions 工作流规范

## 文件位置

- 工作流文件放在 `.github/workflows/` 目录下
- 文件格式为 YAML (.yml)

## 步骤命名规范

- 使用中文命名
- 每个步骤名称前添加相关表情符号
- 格式：`name: <emoji> <中文描述>`

### 常用表情对照表

| 操作类型 | 表情 | 示例 |
|---------|------|------|
| 检出代码 | 📥 | 📥 检出代码 |
| 检测/检查 | 🔍 | 🔍 检测版本变化 |
| 配置环境 | 🟢 | 🟢 配置 Node.js |
| 安装依赖 | 📦 | 📦 安装依赖 |
| 构建 | 🔨 | 🔨 构建项目 |
| 测试 | ✅ | ✅ 运行测试 |
| 发布/部署 | 🚀 | 🚀 发布到 npm |
| 标签/版本 | 🏷️ | 🏷️ 创建 Git 标签 |
| 缓存 | 💾 | 💾 缓存依赖 |
| 清理 | 🧹 | 🧹 清理临时文件 |
| 通知 | 📢 | 📢 发送通知 |
| 上传 | ⬆️ | ⬆️ 上传产物 |
| 下载 | ⬇️ | ⬇️ 下载产物 |

## npm 发布规范

### Trusted Publishing（推荐）

使用 OIDC 而非 NPM_TOKEN，更安全：

```yaml
permissions:
  contents: write  # 如需创建 tag
  id-token: write  # Trusted Publishing 必需
```

发布命令添加 `--provenance` 标志：

```yaml
- name: 🚀 发布到 npm
  run: npm publish --access public --provenance
```

### npm 配置 Trusted Publishing

1. 打开 https://www.npmjs.com/package/你的包名/access
2. 点击 **Configure Trusted Publishing**
3. 选择 **GitHub Actions**
4. 填写仓库信息和工作流文件名

## 版本检测自动发布模式

监听 `package.json` 变化，仅版本号变化时发布：

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'package.json'
```

### 版本检测脚本

```yaml
- name: 🔍 检测版本变化
  id: version
  run: |
    OLD_VERSION=$(git show HEAD^:package.json | grep '"version"' | sed 's/.*"version": "\(.*\)".*/\1/')
    NEW_VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
    echo "old=$OLD_VERSION" >> $GITHUB_OUTPUT
    echo "new=$NEW_VERSION" >> $GITHUB_OUTPUT
    if [ "$OLD_VERSION" != "$NEW_VERSION" ]; then
      echo "changed=true" >> $GITHUB_OUTPUT
    else
      echo "changed=false" >> $GITHUB_OUTPUT
    fi
```

后续步骤使用条件判断：

```yaml
- name: 🚀 发布到 npm
  if: steps.version.outputs.changed == 'true'
  run: npm publish --access public --provenance
```

## 完整示例

```yaml
name: 发布到 npm

on:
  push:
    branches:
      - main
    paths:
      - 'package.json'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - name: 📥 检出代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: 🔍 检测版本变化
        id: version
        run: |
          OLD_VERSION=$(git show HEAD^:package.json | grep '"version"' | sed 's/.*"version": "\(.*\)".*/\1/')
          NEW_VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
          echo "old=$OLD_VERSION" >> $GITHUB_OUTPUT
          echo "new=$NEW_VERSION" >> $GITHUB_OUTPUT
          if [ "$OLD_VERSION" != "$NEW_VERSION" ]; then
            echo "changed=true" >> $GITHUB_OUTPUT
          else
            echo "changed=false" >> $GITHUB_OUTPUT
          fi

      - name: 🟢 配置 Node.js
        if: steps.version.outputs.changed == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: 📦 安装依赖
        if: steps.version.outputs.changed == 'true'
        run: npm ci

      - name: 🔨 构建项目
        if: steps.version.outputs.changed == 'true'
        run: npm run build

      - name: 🚀 发布到 npm
        if: steps.version.outputs.changed == 'true'
        run: npm publish --access public --provenance

      - name: 🏷️ 创建 Git 标签
        if: steps.version.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git tag v${{ steps.version.outputs.new }}
          git push origin v${{ steps.version.outputs.new }}
```

## 使用流程

只需修改 `package.json` 版本号并推送：

```bash
# 修改版本号后
git add .
git commit -m "✨ feat: 新功能描述"
git push origin main
```

GitHub Actions 会自动：
1. 检测版本变化
2. 构建并发布到 npm
3. 创建对应的 git tag
