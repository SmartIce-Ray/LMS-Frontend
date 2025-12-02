# SmartIce LMS 前端

## 项目概述

有点东西餐饮集团培训管理系统前端，配合 SmartIce LMS 后端使用。

### 第一阶段：员工学习端（WebApp）
- **目标用户**：门店员工（新员工入职 + 在岗技能提升）
- **技术形态**：WebApp → 后续小程序/原生
- **核心功能**：课程学习、打卡、统计、站内消息

### 设计风格
- **主题**：深色模式（Dark Mode）
- **导航**：侧边栏（移动端可折叠）
- **设计哲学**：苹果 HIG（清晰、依从、深度）

### 色彩系统
| 用途 | 色值 |
|-----|------|
| 背景 | #000000 |
| 卡片 | #1C1C1E |
| 悬浮 | #2C2C2E |
| 主色(CTA) | #FF6B35 |
| 进度条 | #4ECDC4 |
| 成功 | #34C759 |
| 主文字 | #FFFFFF |
| 次文字 | #8E8E93 |

---

## 技术栈

| 组件 | 技术选型 |
|------|----------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| UI 组件库 | shadcn-vue (New York 风格) |
| 样式 | Tailwind CSS v4 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| HTTP | Axios |
| 构建 | Vite |
| 包管理 | pnpm |

---

## 后端 API

- **基础地址**：`http://localhost:8000/api/v1`
- **认证方式**：JWT Bearer Token（access + refresh）
- **API 文档**：`http://localhost:8000/docs`（Swagger）

### 主要端点
| 端点 | 说明 |
|------|------|
| `/auth` | 登录、注册、刷新Token、修改密码 |
| `/brands` | 品牌管理 |
| `/stores` | 门店管理 |
| `/users` | 用户管理 |
| `/courses` | 课程、章节、内容、报名、进度 |

---

## 目录结构

```
src/
├── assets/              # 静态资源
├── components/          # 通用组件
│   └── ui/              # shadcn-vue UI 组件
│       ├── button/
│       ├── card/
│       ├── input/
│       └── label/
├── composables/         # 可组合函数
├── layouts/             # 布局组件
├── lib/                 # 工具函数
│   ├── api.ts           # Axios 实例（含拦截器）
│   └── utils.ts         # cn() 等工具函数
├── pages/               # 页面组件
│   ├── Home.vue
│   ├── Login.vue
│   ├── Dashboard.vue
│   └── courses/
│       ├── CourseList.vue
│       └── CourseDetail.vue
├── router/              # 路由配置
│   └── index.ts
├── stores/              # Pinia 状态管理
│   └── auth.ts          # 认证状态
├── styles/              # 全局样式
└── types/               # TypeScript 类型
    └── user.ts          # 用户相关类型
```

---

## 权限模型

```
super_admin (全局)
├─ brand_admin (品牌级)
│  ├─ store_manager (门店级)
│  ├─ trainer (培训师)
│  └─ supervisor (主管)
└─ employee (普通员工)
```

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 添加 shadcn-vue 组件
pnpm dlx shadcn-vue@latest add [组件名]
```

---

## 已安装的 shadcn-vue 组件

- Button
- Card (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction)
- Input
- Label

---

## 文档索引

| 文档 | 说明 |
|-----|------|
| ~/.claude/plans/hidden-hatching-rabin.md | **设计工作计划**（完整设计规范、页面结构、开发计划） |
| 参考/Gemini调研.md | 连锁餐饮LMS UX研究（Gemini深度调研） |
| 参考/设计参考.md | UX到UI转化方法论 |
| 参考/苹果设计规范.md | Apple HIG 设计原则 |
| 参考/WechatIMG990-993.jpg | UI参考图（深色主题视频编辑App） |

## 关键设计决策

1. **深色主题**：专业感、内容突出、减少视觉疲劳
2. **侧边栏导航**：比底部Tab更灵活，移动端可折叠
3. **游戏化元素**：连胜显示、完成动画（五彩纸屑）
4. **WebApp限制**：无推送、无触觉反馈、无生物识别（后续原生实现）
