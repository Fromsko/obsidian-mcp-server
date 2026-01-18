# 第七章：API 参考文档

## 7.1 API 概述

### 基础信息
- **基础 URL**: `https://server.codeium.com/api/v1`
- **认证方式**: Service Key
- **数据格式**: JSON
- **HTTP 方法**: GET, POST, PUT, DELETE

### 认证

#### 创建服务密钥
```http
POST https://server.codeium.com/api/v1/service-keys
```

**请求体**:
```json
{
  "name": "analytics-service",
  "description": "用于分析数据访问的服务密钥",
  "permissions": [
    "analytics:read",
    "usage:read"
  ],
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**响应**:
```json
{
  "serviceKeyId": "sk_1234567890abcdef",
  "name": "analytics-service",
  "permissions": [
    "analytics:read",
    "usage:read"
  ],
  "createdAt": "2026-01-18T04:43:00Z",
  "expiresAt": "2026-12-31T23:59:59Z",
  "key": "ck_live_1234567890abcdef"
}
```

#### 使用服务密钥
```http
Authorization: Bearer ck_live_1234567890abcdef
```

### 必需权限
- **analytics:read**: 读取分析数据
- **usage:read**: 读取使用数据
- **usage:write**: 管理使用配置
- **team:read**: 读取团队信息
- **user:read**: 读取用户信息

## 7.2 Cascade 分析 API

### 获取 Cascade 分析

#### 端点
```http
POST https://server.codeium.com/api/v1/CascadeAnalytics
```

#### 请求参数
```json
{
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "filters": {
    "teamId": "team-123",
    "userId": "user-456",
    "model": "swe-1.5"
  },
  "metrics": [
    "lines_suggested",
    "lines_accepted",
    "credits_used",
    "tool_usage"
  ],
  "groupBy": ["user_id", "date"]
}
```

#### 响应示例
```json
{
  "data": {
    "cascade_lines": {
      "suggested": 50000,
      "accepted": 35000,
      "acceptance_rate": 0.7,
      "by_user": {
        "user-1": {
          "suggested": 25000,
          "accepted": 18000
        },
        "user-2": {
          "suggested": 25000,
          "accepted": 17000
        }
      }
    },
    "cascade_runs": {
      "total": 1200,
      "successful": 1150,
      "failed": 50,
      "success_rate": 0.958
    },
    "cascade_tool_usage": {
      "search": 300,
      "analyze": 250,
      "terminal": 150,
      "web_search": 100,
      "mcp": 80,
      "total": 880
    },
    "credits_consumed": {
      "total": 15000,
      "by_model": {
        "swe-1.5": 8000,
        "swe-grep": 3000,
        "swe-1": 4000
      }
    }
  },
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "metadata": {
    "totalUsers": 25,
    "activeUsers": 20,
    "requestId": "req_1234567890"
  }
}
```

#### 工具使用映射
```json
{
  "search": "代码搜索操作",
  "analyze": "代码分析操作",
  "terminal": "终端命令执行",
  "web_search": "网络搜索操作",
  "mcp": "MCP 工具调用",
  "file_read": "文件读取操作",
  "file_write": "文件写入操作",
  "command": "命令执行操作"
}
```

### 自定义分析查询

#### 端点
```http
POST https://server.codeium.com/api/v1/CustomAnalyticsQuery
```

#### 查询结构
```json
{
  "selections": [
    {
      "field": "user_id",
      "alias": "userId"
    },
    {
      "field": "date",
      "alias": "date"
    },
    {
      "field": "cascade_lines_suggested",
      "alias": "linesSuggested",
      "aggregation": "sum"
    },
    {
      "field": "cascade_lines_accepted",
      "alias": "linesAccepted",
      "aggregation": "sum"
    }
  ],
  "filters": [
    {
      "field": "date",
      "operator": ">=",
      "value": "2026-01-01"
    },
    {
      "field": "date",
      "operator": "<=",
      "value": "2026-01-31"
    },
    {
      "field": "team_id",
      "operator": "=",
      "value": "team-123"
    }
  ],
  "aggregations": [
    {
      "field": "user_id",
      "type": "group_by"
    },
    {
      "field": "date",
      "type": "group_by"
    }
  ],
  "orderBy": [
    {
      "field": "date",
      "direction": "asc"
    },
    {
      "field": "linesSuggested",
      "direction": "desc"
    }
  ],
  "limit": 1000
}
```

#### 选择字段示例
```json
{
  "user_data": ["user_id", "user_email", "team_id", "plan_type"],
  "chat_data": ["chat_id", "message_count", "token_usage", "model_used"],
  "command_data": ["command_type", "execution_time", "success_rate"],
  "pcw_data": ["prompt_credit_worth", "credit_consumption"]
}
```

#### 过滤器示例
```json
{
  "date_range": {
    "field": "date",
    "operator": "between",
    "value": ["2026-01-01", "2026-01-31"]
  },
  "team_filter": {
    "field": "team_id",
    "operator": "in",
    "value": ["team-1", "team-2", "team-3"]
  },
  "model_filter": {
    "field": "model_used",
    "operator": "=",
    "value": "swe-1.5"
  }
}
```

#### 聚合示例
```json
{
  "daily_usage": {
    "field": "date",
    "type": "group_by"
  },
  "user_summary": {
    "field": "user_id",
    "type": "group_by"
  },
  "total_lines": {
    "field": "cascade_lines_suggested",
    "type": "sum"
  },
  "avg_acceptance": {
    "field": "acceptance_rate",
    "type": "avg"
  }
}
```

## 7.3 使用配置 API

### 获取使用配置

#### 端点
```http
GET https://server.codeium.com/api/v1/UsageConfiguration
```

#### 查询参数
- `scope`: 配置范围 (`team`, `group`, `user`)
- `scopeId`: 范围 ID
- `includeHistory`: 是否包含历史记录 (`true`, `false`)

#### 示例请求
```http
GET https://server.codeium.com/api/v1/UsageConfiguration?scope=team&scopeId=team-123&includeHistory=true
```

#### 响应示例
```json
{
  "configuration": {
    "scope": "team",
    "scopeId": "team-123",
    "creditCap": {
      "amount": 50000,
      "period": "monthly",
      "resetDay": 1
    },
    "autoRefill": {
      "enabled": true,
      "amount": 10000,
      "threshold": 5000
    },
    "alerts": {
      "lowCreditThreshold": 10000,
      "emailNotifications": true
    }
  },
  "currentUsage": {
    "creditsUsed": 35000,
    "creditsRemaining": 15000,
    "periodStart": "2026-01-01",
    "periodEnd": "2026-01-31"
  },
  "history": [
    {
      "timestamp": "2026-01-15T10:00:00Z",
      "action": "credit_cap_set",
      "details": {
        "amount": 50000,
        "period": "monthly"
      }
    }
  ]
}
```

### 设置使用配置

#### 端点
```http
POST https://server.codeium.com/api/v1/UsageConfiguration
```

#### 信用上限配置
```json
{
  "scope": "team",
  "scopeId": "team-123",
  "creditCap": {
    "amount": 50000,
    "period": "monthly",
    "resetDay": 1
  },
  "autoRefill": {
    "enabled": true,
    "amount": 10000,
    "threshold": 5000
  },
  "alerts": {
    "lowCreditThreshold": 10000,
    "emailNotifications": true
  }
}
```

#### 清除信用上限
```json
{
  "scope": "team",
  "scopeId": "team-123",
  "creditCap": null
}
```

#### 响应示例
```json
{
  "success": true,
  "configuration": {
    "scope": "team",
    "scopeId": "team-123",
    "creditCap": {
      "amount": 50000,
      "period": "monthly",
      "resetDay": 1
    }
  },
  "message": "使用配置已成功更新"
}
```

## 7.4 用户页面分析 API

### 获取用户页面分析

#### 端点
```http
GET https://server.codeium.com/api/v1/UserPageAnalytics
```

#### 查询参数
- `userId`: 用户 ID
- `startDate`: 开始日期
- `endDate`: 结束日期
- `metrics`: 指标列表（逗号分隔）

#### 示例请求
```http
GET https://server.codeium.com/api/v1/UserPageAnalytics?userId=user-456&startDate=2026-01-01&endDate=2026-01-31&metrics=lines_suggested,credits_used,tool_usage
```

#### 响应示例
```json
{
  "userId": "user-456",
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "metrics": {
    "cascade_lines": {
      "suggested": 5000,
      "accepted": 3500,
      "acceptance_rate": 0.7
    },
    "credits_consumed": {
      "total": 1500,
      "by_model": {
        "swe-1.5": 800,
        "swe-grep": 400,
        "swe-1": 300
      }
    },
    "tool_usage": {
      "search": 30,
      "analyze": 25,
      "terminal": 15,
      "web_search": 10,
      "mcp": 8
    },
    "activity": {
      "active_days": 20,
      "total_sessions": 45,
      "avg_session_duration": 1800
    }
  },
  "trends": {
    "daily_usage": [
      {
        "date": "2026-01-01",
        "lines_suggested": 150,
        "credits_used": 45
      }
    ]
  }
}
```

## 7.5 错误处理

### 错误响应格式
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "请求参数无效",
    "details": {
      "field": "startDate",
      "reason": "日期格式无效"
    },
    "requestId": "req_1234567890",
    "timestamp": "2026-01-18T04:43:00Z"
  }
}
```

### 常见错误代码

#### 认证错误
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "认证失败",
    "details": {
      "reason": "服务密钥无效或已过期"
    }
  }
}
```

#### 权限错误
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "权限不足",
    "details": {
      "required": ["analytics:read"],
      "missing": ["analytics:read"]
    }
  }
}
```

#### 请求错误
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "请求参数无效",
    "details": {
      "errors": [
        {
          "field": "startDate",
          "message": "日期格式必须为 YYYY-MM-DD"
        },
        {
          "field": "endDate",
          "message": "结束日期必须晚于开始日期"
        }
      ]
    }
  }
}
```

#### 速率限制错误
```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "请求过于频繁",
    "details": {
      "limit": 1000,
      "window": "1h",
      "retryAfter": 3600
    }
  }
}
```

## 7.6 速率限制

### 限制规则
- **默认限制**: 1000 请求/小时
- **企业限制**: 根据订阅计划调整
- **突发限制**: 100 请求/分钟

### 限制头信息
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642579200
X-RateLimit-Retry-After: 60
```

### 处理速率限制
```javascript
// JavaScript 示例
async function makeRequest(url, options) {
  const response = await fetch(url, options);

  if (response.status === 429) {
    const retryAfter = response.headers.get('X-RateLimit-Retry-After');
    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;

    console.log(`速率限制，等待 ${waitTime/1000} 秒...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));

    return makeRequest(url, options);
  }

  return response;
}
```

## 7.7 SDK 和工具

### Python SDK
```python
from codeium_api import CodeiumClient

client = CodeiumClient(
    api_key="ck_live_1234567890abcdef",
    base_url="https://server.codeium.com/api/v1"
)

# 获取 Cascade 分析
analytics = client.get_cascade_analytics(
    start_date="2026-01-01",
    end_date="2026-01-31",
    team_id="team-123"
)

print(f"建议代码行数: {analytics.cascade_lines.suggested}")
print(f"接受代码行数: {analytics.cascade_lines.accepted}")
```

### Node.js SDK
```javascript
const { CodeiumClient } = require('@codeium/api');

const client = new CodeiumClient({
  apiKey: 'ck_live_1234567890abcdef',
  baseURL: 'https://server.codeium.com/api/v1'
});

async function getAnalytics() {
  const analytics = await client.getCascadeAnalytics({
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    teamId: 'team-123'
  });

  console.log(`建议代码行数: ${analytics.cascadeLines.suggested}`);
  console.log(`接受代码行数: ${analytics.cascadeLines.accepted}`);
}
```

### CLI 工具
```bash
# 安装 CLI 工具
npm install -g @codeium/cli

# 配置认证
codeium config set api_key ck_live_1234567890abcdef

# 获取分析数据
codeium analytics cascade \
  --start-date 2026-01-01 \
  --end-date 2026-01-31 \
  --team-id team-123

# 设置使用配置
codeium config usage-cap \
  --scope team \
  --scope-id team-123 \
  --amount 50000 \
  --period monthly
```

## 7.8 最佳实践

### 请求优化
```javascript
// 批量请求优化
const requests = [
  { userId: 'user-1', metrics: ['lines_suggested'] },
  { userId: 'user-2', metrics: ['lines_suggested'] },
  { userId: 'user-3', metrics: ['lines_suggested'] }
];

// 使用单个批量请求而非多个单独请求
const batchResponse = await client.getBatchUserAnalytics(requests);
```

### 缓存策略
```python
# 实现缓存以减少 API 调用
import time
from functools import lru_cache

class CachedAnalyticsClient:
    def __init__(self, client, cache_ttl=3600):
        self.client = client
        self.cache_ttl = cache_ttl
        self._cache = {}

    @lru_cache(maxsize=128)
    def get_analytics(self, start_date, end_date, team_id):
        cache_key = f"{start_date}_{end_date}_{team_id}"

        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if time.time() - timestamp < self.cache_ttl:
                return cached_data

        data = self.client.get_cascade_analytics(start_date, end_date, team_id)
        self._cache[cache_key] = (data, time.time())
        return data
```

### 错误处理
```javascript
// 完善的错误处理
async function robustApiCall(apiFunction, ...args) {
  try {
    const response = await apiFunction(...args);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError') {
      // 网络错误
      console.error('网络连接失败:', error.message);
      throw new Error('无法连接到 API 服务器');
    } else if (error.message.includes('401')) {
      // 认证错误
      console.error('认证失败:', error.message);
      throw new Error('API 密钥无效，请检查配置');
    } else {
      // 其他错误
      console.error('API 调用失败:', error.message);
      throw error;
    }
  }
}
```

---

*本章提供了完整的 API 参考文档，包括所有端点、参数、响应格式和使用示例。*
