# 第八章：示例和模板

## 8.1 实用示例

### 8.1.1 开发工作流示例

#### React 项目初始化
```markdown
# 使用 Cascade 创建 React 项目

## 用户提示
创建一个现代化的 React TypeScript 项目，包含以下功能：
- 使用 Vite 作为构建工具
- 集成 Tailwind CSS
- 配置 ESLint 和 Prettier
- 设置测试环境（Vitest + Testing Library）
- 创建基础组件结构
- 配置路由系统
- 添加状态管理（Zustand）

## Cascade 生成的项目结构
```
my-react-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   └── features/
│   │       ├── auth/
│   │       └── dashboard/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── types/
│   │   ├── auth.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── eslint.config.js
├── prettier.config.js
└── README.md
```

## 核心文件示例

### package.json
```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "format": "prettier --write ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "zustand": "^4.3.6"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@typescript-eslint/eslint-plugin": "^5.57.1",
    "@typescript-eslint/parser": "^5.57.1",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.38.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "postcss": "^8.4.23",
    "prettier": "^2.8.7",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.2",
    "vite": "^4.3.2",
    "vitest": "^0.30.1",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3"
  }
}
```

### App.tsx
```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './components/features/auth/Login';
import { Dashboard } from './components/features/dashboard/Dashboard';
import { Profile } from './components/features/profile/Profile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Login />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
```
```

#### Node.js API 项目创建
```markdown
# 用户提示
创建一个企业级 Node.js Express API 项目，包含：
- TypeScript 支持
- RESTful API 设计
- JWT 身份验证
- 数据库集成（PostgreSQL + Prisma）
- API 文档（Swagger）
- 错误处理中间件
- 日志系统
- 测试框架（Jest + Supertest）
- Docker 支持
- 环境配置

## Cascade 生成的项目结构
```
my-api/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   └── healthController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── models/
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── health.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   └── emailService.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── validation.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── swagger.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/
│   └── api/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 核心 API 示例

### authController.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../types/auth';
import { ApiResponse } from '../types/api';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registerData: RegisterRequest = req.body;
      const result = await this.authService.register(registerData);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: '用户注册成功'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginRequest = req.body;
      const result = await this.authService.login(loginData);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: '登录成功'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: '令牌刷新成功'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);

      const response: ApiResponse = {
        success: true,
        message: '登出成功'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
```

### middleware/auth.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt';
import { UserService } from '../services/userService';
import { AuthenticatedRequest } from '../types/auth';

export class AuthMiddleware {
  private jwtUtils: JwtUtils;
  private userService: UserService;

  constructor() {
    this.jwtUtils = new JwtUtils();
    this.userService = new UserService();
  }

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: '缺少认证令牌'
        });
        return;
      }

      const token = authHeader.substring(7);
      const decoded = this.jwtUtils.verifyAccessToken(token);

      const user = await this.userService.findById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }
  };

  authorize = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '未认证'
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: '权限不足'
        });
        return;
      }

      next();
    };
  };
}
```
```

### 8.1.2 技能示例

#### 代码审查技能
```markdown
# SKILL.md - 代码审查技能

---
name: code-review
description: 全面的代码审查技能，检查代码质量、安全性、性能和最佳实践
scope: workspace
---

# 代码审查技能

这个技能提供全面的代码审查服务，包括代码质量、安全性、性能和最佳实践检查。

## 审查检查清单

### 1. 代码质量
- [ ] 代码风格一致性
- [ ] 命名规范遵循
- [ ] 代码复杂度检查
- [ ] 重复代码检测
- [ ] 注释和文档完整性

### 2. 安全性检查
- [ ] 输入验证和清理
- [ ] SQL 注入防护
- [ ] XSS 攻击防护
- [ ] 敏感信息泄露检查
- [ ] 身份验证和授权

### 3. 性能分析
- [ ] 算法复杂度分析
- [ ] 内存使用优化
- [ ] 数据库查询优化
- [ ] 缓存策略建议
- [ ] 并发处理优化

### 4. 最佳实践
- [ ] 设计模式应用
- [ ] SOLID 原则遵循
- [ ] 错误处理机制
- [ ] 测试覆盖率
- [ ] 可维护性评估

## 使用方法

在 Cascade 中输入：
```
/code-review
```

然后提供要审查的代码或文件路径。

## 输出格式

技能将提供：
1. 总体评分（1-10分）
2. 详细问题列表
3. 改进建议
4. 重构代码示例
5. 优先级排序的修复计划
```

#### 部署自动化技能
```markdown
# SKILL.md - 部署自动化技能

---
name: auto-deploy
description: 自动化部署流程，支持多环境部署和回滚
scope: workspace
---

# 自动化部署技能

这个技能提供完整的自动化部署解决方案，支持多环境部署、健康检查和自动回滚。

## 部署流程

### 1. 预部署检查
- [ ] 代码质量检查通过
- [ ] 所有测试通过
- [ ] 安全扫描无高危问题
- [ ] 版本号更新
- [ ] 变更日志生成

### 2. 环境准备
- [ ] 备份当前版本
- [ ] 准备部署环境
- [ ] 配置环境变量
- [ ] 数据库迁移准备
- [ ] 依赖安装

### 3. 部署执行
- [ ] 构建应用
- [ ] 部署到目标环境
- [ ] 数据库迁移
- [ ] 静态资源更新
- [ ] 服务重启

### 4. 部署验证
- [ ] 健康检查
- [ ] 功能测试
- [ ] 性能测试
- [ ] 安全验证
- [ ] 监控告警设置

### 5. 回滚机制
- [ ] 自动回滚条件
- [ ] 手动回滚流程
- [ ] 数据回滚策略
- [ ] 通知机制

## 支持的环境

- **开发环境**: dev.example.com
- **测试环境**: staging.example.com
- **生产环境**: prod.example.com

## 使用方法

```bash
# 部署到测试环境
/auto-deploy --env=staging

# 部署到生产环境
/auto-deploy --env=production --confirm

# 回滚到上一个版本
/auto-deploy --rollback --env=production
```

## 配置文件

### deploy.config.json
```json
{
  "environments": {
    "staging": {
      "host": "staging.example.com",
      "user": "deploy",
      "path": "/var/www/staging",
      "healthCheck": "https://staging.example.com/health",
      "rollbackEnabled": true
    },
    "production": {
      "host": "prod.example.com",
      "user": "deploy",
      "path": "/var/www/production",
      "healthCheck": "https://prod.example.com/health",
      "rollbackEnabled": true,
      "requireConfirmation": true
    }
  },
  "notifications": {
    "slack": {
      "webhook": "https://hooks.slack.com/...",
      "channel": "#deployments"
    },
    "email": {
      "recipients": ["team@example.com"]
    }
  }
}
```
```

### 8.1.3 工作流示例

#### CI/CD 工作流
```markdown
# WORKFLOW.md - CI/CD 工作流

---
name: cicd-pipeline
description: 完整的 CI/CD 管道工作流，从代码提交到生产部署
---

# CI/CD 管道工作流

这个工作流自动化了从代码提交到生产部署的完整流程。

## 工作流阶段

### 阶段 1: 代码检查
1. **代码格式检查**
   - 运行 Prettier 格式化检查
   - 验证代码风格一致性
   - 检查文件编码和换行符

2. **静态代码分析**
   - ESLint 规则检查
   - TypeScript 类型检查
   - 代码复杂度分析
   - 安全漏洞扫描

3. **依赖检查**
   - 检查依赖更新
   - 许可证合规检查
   - 漏洞扫描

### 阶段 2: 测试执行
1. **单元测试**
   - 运行所有单元测试
   - 检查测试覆盖率
   - 生成测试报告

2. **集成测试**
   - API 接口测试
   - 数据库集成测试
   - 第三方服务集成测试

3. **端到端测试**
   - 用户界面测试
   - 业务流程测试
   - 性能基准测试

### 阶段 3: 构建准备
1. **环境配置**
   - 加载环境变量
   - 配置构建参数
   - 准备构建环境

2. **代码构建**
   - 编译 TypeScript
   - 打包资源文件
   - 优化构建产物

3. **质量检查**
   - 构建产物大小检查
   - 性能指标检查
   - 安全扫描

### 阶段 4: 部署执行
1. **测试环境部署**
   - 自动部署到测试环境
   - 运行冒烟测试
   - 验证部署成功

2. **预生产环境部署**
   - 部署到预生产环境
   - 运行完整测试套件
   - 性能测试验证

3. **生产环境部署**
   - 蓝绿部署或滚动更新
   - 健康检查验证
   - 监控告警设置

### 阶段 5: 部署后验证
1. **功能验证**
   - 关键功能测试
   - 用户体验验证
   - 数据一致性检查

2. **性能监控**
   - 响应时间监控
   - 错误率监控
   - 资源使用监控

3. **通知发送**
   - 部署成功通知
   - 团队成员通知
   - 文档更新

## 使用方法

```bash
# 触发完整 CI/CD 流水线
/cicd-pipeline

# 只执行到测试环境
/cicd-pipeline --target=staging

# 强制部署到生产环境
/cicd-pipeline --target=production --force

# 回滚到上一个版本
/cicd-pipeline --rollback
```

## 配置要求

### .github/workflows/ci-cd.yml
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

      - name: Type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # 部署脚本

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # 部署脚本
```
```

## 8.2 模板集合

### 8.2.1 项目模板

#### 全栈 Web 应用模板
```markdown
# 全栈 Web 应用项目模板

## 技术栈
- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Node.js + Express + TypeScript
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + bcrypt
- **测试**: Jest + Testing Library + Supertest
- **部署**: Docker + GitHub Actions

## 项目结构
```
fullstack-app/
├── frontend/                 # React 前端
├── backend/                  # Node.js 后端
├── shared/                   # 共享类型定义
├── docker-compose.yml        # Docker 配置
├── .github/workflows/        # CI/CD 配置
└── docs/                     # 项目文档
```

## 快速开始
```bash
# 克隆模板
git clone <template-url> my-app
cd my-app

# 安装依赖
npm run install:all

# 启动开发环境
npm run dev

# 运行测试
npm run test

# 构建生产版本
npm run build
```

## 可用脚本
- `npm run dev`: 启动开发环境
- `npm run build`: 构建生产版本
- `npm run test`: 运行所有测试
- `npm run lint`: 代码检查
- `npm run format`: 代码格式化
- `npm run docker:dev`: 启动 Docker 开发环境
- `npm run docker:prod`: 构建生产镜像
```

#### 微服务架构模板
```markdown
# 微服务架构项目模板

## 架构概览
- **API Gateway**: Kong/Nginx
- **服务发现**: Consul
- **消息队列**: RabbitMQ
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack
- **服务**: Node.js/Go/Python 微服务

## 服务模板
```
microservices/
├── api-gateway/              # API 网关
├── user-service/             # 用户服务
├── order-service/            # 订单服务
├── payment-service/          # 支付服务
├── notification-service/     # 通知服务
├── shared/                   # 共享库
├── infrastructure/           # 基础设施配置
└── monitoring/               # 监控配置
```

## 服务标准结构
```
service-template/
├── src/
│   ├── controllers/          # 控制器
│   ├── services/            # 业务逻辑
│   ├── repositories/        # 数据访问
│   ├── models/              # 数据模型
│   ├── middleware/          # 中间件
│   ├── utils/               # 工具函数
│   ├── types/               # 类型定义
│   └── config/              # 配置文件
├── tests/                   # 测试文件
├── docs/                    # 服务文档
├── Dockerfile               # Docker 配置
├── package.json             # 依赖配置
└── README.md                # 服务说明
```

## 开发工作流
1. **本地开发**: Docker Compose
2. **集成测试**: 测试环境
3. **生产部署**: Kubernetes
4. **监控告警**: Prometheus + Grafana
5. **日志聚合**: ELK Stack
```

### 8.2.2 配置文件模板

#### TypeScript 配置模板
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"],
      "@/hooks/*": ["hooks/*"]
    }
  },
  "include": [
    "src/**/*",
    "types/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

#### ESLint 配置模板
```javascript
// eslint.config.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
    'jsx-a11y',
  ],
  rules: {
    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // React 规则
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 导入规则
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // 通用规则
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
```

#### Prettier 配置模板
```json
// prettier.config.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  insertPragma: false,
  proseWrap: 'preserve',
  requirePragma: false,
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
};
```

### 8.2.3 Docker 模板

#### Node.js 应用 Dockerfile
```dockerfile
# 多阶段构建 Dockerfile
FROM node:18-alpine AS base

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 开发阶段
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 构建阶段
FROM base AS builder
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner
WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 设置用户权限
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动应用
CMD ["npm", "start"]
```

#### React 应用 Dockerfile
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码并构建
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine AS runner

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose 模板
```yaml
# docker-compose.yml
version: '3.8'

services:
  # 应用服务
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # 数据库服务
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis 服务
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## 8.3 实用脚本

### 8.3.1 自动化脚本

#### 项目初始化脚本
```bash
#!/bin/bash
# init-project.sh - 项目初始化脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查系统依赖..."

    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装，请先安装 npm"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        log_error "Git 未安装，请先安装 Git"
        exit 1
    fi

    log_info "依赖检查通过"
}

# 创建项目结构
create_project_structure() {
    log_info "创建项目结构..."

    mkdir -p src/{components,services,utils,types,hooks,config}
    mkdir -p tests/{unit,integration,e2e}
    mkdir -p docs/{api,user-guide}
    mkdir -p scripts
    mkdir -p .github/workflows

    log_info "项目结构创建完成"
}

# 初始化 package.json
init_package_json() {
    log_info "初始化 package.json..."

    cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "$PROJECT_DESCRIPTION",
  "main": "dist/index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist",
    "prepare": "husky install"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^8.0.0",
    "eslint-plugin-prettier": "^4.0.0",
    "husky": "^8.0.0",
    "jest": "^29.0.0",
    "lint-staged": "^13.0.0",
    "prettier": "^2.0.0",
    "typescript": "^4.9.0",
    "vite": "^4.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
EOF

    log_info "package.json 初始化完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."

    npm install

    log_info "依赖安装完成"
}

# 初始化 Git
init_git() {
    log_info "初始化 Git 仓库..."

    git init

    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Coverage
coverage/

# Temporary files
*.tmp
*.temp
EOF

    git add .
    git commit -m "Initial commit"

    log_info "Git 仓库初始化完成"
}

# 主函数
main() {
    echo "🚀 项目初始化脚本"
    echo "=================="

    # 获取项目信息
    read -p "请输入项目名称: " PROJECT_NAME
    read -p "请输入项目描述: " PROJECT_DESCRIPTION

    if [ -z "$PROJECT_NAME" ]; then
        log_error "项目名称不能为空"
        exit 1
    fi

    # 执行初始化步骤
    check_dependencies
    create_project_structure
    init_package_json
    install_dependencies
    init_git

    log_info "项目初始化完成！"
    log_info "运行 'npm run dev' 启动开发服务器"
}

# 执行主函数
main "$@"
```

#### 部署脚本
```bash
#!/bin/bash
# deploy.sh - 部署脚本

set -e

# 配置变量
ENVIRONMENT=${1:-staging}
PROJECT_NAME="my-app"
DOCKER_REGISTRY="registry.example.com"
VERSION=${2:-latest}

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境
check_environment() {
    log_info "检查部署环境: $ENVIRONMENT"

    case $ENVIRONMENT in
        staging|production)
            ;;
        *)
            log_error "不支持的环境: $ENVIRONMENT"
            exit 1
            ;;
    esac

    if [ "$ENVIRONMENT" = "production" ]; then
        read -p "确认要部署到生产环境吗？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
    fi
}

# 运行测试
run_tests() {
    log_info "运行测试..."

    npm run test

    if [ $? -ne 0 ]; then
        log_error "测试失败，部署中止"
        exit 1
    fi

    log_info "测试通过"
}

# 构建应用
build_application() {
    log_info "构建应用..."

    npm run build

    if [ $? -ne 0 ]; then
        log_error "构建失败，部署中止"
        exit 1
    fi

    log_info "构建完成"
}

# 构建 Docker 镜像
build_docker_image() {
    log_info "构建 Docker 镜像..."

    docker build -t $DOCKER_REGISTRY/$PROJECT_NAME:$VERSION .
    docker build -t $DOCKER_REGISTRY/$PROJECT_NAME:latest .

    log_info "Docker 镜像构建完成"
}

# 推送镜像
push_docker_image() {
    log_info "推送 Docker 镜像..."

    docker push $DOCKER_REGISTRY/$PROJECT_NAME:$VERSION
    docker push $DOCKER_REGISTRY/$PROJECT_NAME:latest

    log_info "Docker 镜像推送完成"
}

# 部署应用
deploy_application() {
    log_info "部署应用到 $ENVIRONMENT 环境..."

    # 这里可以调用具体的部署命令
    # 例如：kubectl apply -f k8s/$ENVIRONMENT/
    # 或者：ansible-playbook deploy.yml -e env=$ENVIRONMENT

    log_info "应用部署完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."

    # 获取服务 URL
    if [ "$ENVIRONMENT" = "staging" ]; then
        SERVICE_URL="https://staging.example.com"
    else
        SERVICE_URL="https://example.com"
    fi

    # 等待服务启动
    sleep 30

    # 检查服务健康状态
    if curl -f $SERVICE_URL/health > /dev/null 2>&1; then
        log_info "健康检查通过"
    else
        log_error "健康检查失败"
        exit 1
    fi
}

# 发送通知
send_notification() {
    log_info "发送部署通知..."

    # Slack 通知
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 $PROJECT_NAME 已成功部署到 $ENVIRONMENT 环境 (版本: $VERSION)\"}" \
            $SLACK_WEBHOOK
    fi

    # 邮件通知
    # 这里可以添加邮件发送逻辑

    log_info "通知发送完成"
}

# 主函数
main() {
    echo "🚀 部署脚本"
    echo "============"
    echo "环境: $ENVIRONMENT"
    echo "版本: $VERSION"
    echo ""

    check_environment
    run_tests
    build_application
    build_docker_image
    push_docker_image
    deploy_application
    health_check
    send_notification

    log_info "部署完成！"
    log_info "应用已成功部署到 $ENVIRONMENT 环境"
}

# 执行主函数
main "$@"
```

### 8.3.2 测试脚本

#### 测试数据生成脚本
```typescript
// scripts/generate-test-data.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function generateUsers(count: number) {
  console.log(`生成 ${count} 个用户...`);

  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      email: faker.internet.email(),
      name: faker.name.fullName(),
      avatar: faker.image.avatar(),
      role: faker.helpers.arrayElement(['user', 'admin']),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log(`${count} 个用户生成完成`);
}

async function generatePosts(userCount: number, postsPerUser: number) {
  console.log(`为 ${userCount} 个用户各生成 ${postsPerUser} 篇文章...`);

  const users = await prisma.user.findMany({
    take: userCount,
  });

  for (const user of users) {
    const posts = [];
    for (let i = 0; i < postsPerUser; i++) {
      posts.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        published: faker.datatype.boolean(),
        authorId: user.id,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    await prisma.post.createMany({
      data: posts,
    });
  }

  console.log(`${userCount * postsPerUser} 篇文章生成完成`);
}

async function generateComments(postCount: number, commentsPerPost: number) {
  console.log(`为 ${postCount} 篇文章各生成 ${commentsPerPost} 条评论...`);

  const posts = await prisma.post.findMany({
    take: postCount,
  });

  const users = await prisma.user.findMany();

  for (const post of posts) {
    const comments = [];
    for (let i = 0; i < commentsPerPost; i++) {
      comments.push({
        content: faker.lorem.paragraph(),
        postId: post.id,
        authorId: faker.helpers.arrayElement(users).id,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    await prisma.comment.createMany({
      data: comments,
    });
  }

  console.log(`${postCount * commentsPerPost} 条评论生成完成`);
}

async function main() {
  console.log('🚀 开始生成测试数据...');

  try {
    await generateUsers(100);
    await generatePosts(50, 10);
    await generateComments(200, 5);

    console.log('✅ 测试数据生成完成');
  } catch (error) {
    console.error('❌ 测试数据生成失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
```

---

*本章提供了丰富的示例和模板，帮助用户快速上手并应用到实际项目中。*
