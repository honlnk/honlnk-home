# honlnk-home

> 鸿影（honlnk）个人主页 —— 数字名片 + 作品集

为 `honlnk.com` 根域名打造的静态优先个人主页，展示精选作品、技能栈与联系方式。

## 技术栈

- **Astro 7** —— 内容驱动框架，零 JS 优先
- **Vue 3** —— 交互岛屿（主题切换）
- **Tailwind CSS 4** —— 简单样式（行内 class）
- **SCSS** —— 复杂样式（组件 `<style lang="scss">`）
- **pnpm** —— 包管理

## 快速开始

```bash
pnpm install      # 安装依赖
pnpm dev          # 本地开发 → http://localhost:4321
pnpm build        # 构建 → dist/
pnpm preview      # 预览构建产物
```

## 项目结构

```
src/
├── layouts/
│   └── Layout.astro         # 页面外壳（SEO、主题防闪烁脚本）
├── components/
│   ├── Hero.astro           # 首屏
│   ├── About.astro          # 关于我
│   ├── ProjectCard.astro    # 作品卡片
│   ├── Projects.astro       # 作品板块
│   ├── Skills.astro         # 技能栈
│   ├── Contact.astro        # 联系方式 + Footer
│   └── ThemeToggle.vue      # 亮/暗主题切换（Vue 岛屿）
├── data/
│   └── projects.ts          # 精选作品数据（集中维护）
├── pages/
│   └── index.astro          # 首页（组装各板块）
└── styles/
    ├── global.css           # Tailwind 入口
    └── global.scss          # 设计 token + 亮暗主题 + 全局重置
```

## 文档

所有规划文档在 [`docs/`](./docs/README.md)，采用文档驱动开发：

- [00 项目总览](./docs/00-overview.md)
- [01 内容规划](./docs/01-content-plan.md)
- [02 技术选型](./docs/02-tech-stack.md)
- [03 设计规范](./docs/03-design-system.md)
- [04 实施路线](./docs/04-roadmap.md)

## 部署

GitHub Pages，绑定根域名 `honlnk.com`。

---

© 2026 鸿影
