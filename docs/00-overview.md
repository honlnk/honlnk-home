# 项目总览 · honlnk-home

> 鸿影（honlnk）个人主页 —— 数字名片 + 作品集

## 一句话定位

为 `honlnk.com` 根域名打造一个**静态优先、性能极致、SEO 友好**的个人主页，承担三大职能：

1. **数字名片** —— 让访客 10 秒内认识"鸿影是谁"
2. **作品集** —— 把散落在各子域名的 AI 项目集中展示
3. **导航台** —— 统一入口，通往博客、简历、各产品

## 背景与动机

- 账号 `honlnk` 在 GitHub 9 个月内积累了 44 个仓库，其中 **gpt-image-studio (22⭐)、NovAI (5⭐)、text-diff-viewer (3⭐)** 等已有一定影响力。
- 多个 AI 项目已绑定独立子域名（`image/novai/grade.honlnk.com`），但**缺少统一入口**把它们串起来。
- `honlnk.com` 根域名当前为空白，亟需一个"门面"。

## 核心原则

| 原则 | 说明 |
|---|---|
| 内容驱动 | 以展示作品和文字为主，交互为辅 |
| 静态优先 | 默认零 JS，只在必要处加交互岛屿 |
| 单页为主 | 首版一页式滚动，不做多页路由 |
| 可扩展 | 地基打好，未来能低成本接入博客/笔记 |
| 文档先行 | 所有决策沉淀在 `docs/`，便于回顾迭代 |

## 技术栈（一句话）

**Astro**（内容驱动框架，零 JS 优先）+ **Vue3 组件**（写交互岛屿）+ **Tailwind CSS**（样式）。

详见 [02-tech-stack.md](./02-tech-stack.md)。

## 部署目标

- **方式**：GitHub Pages（与现有项目体系一致）
- **域名**：`honlnk.com`（根域名 A 记录指向 GitHub Pages IP）
- **仓库**：新建 `honlnk-home`（或复用 `honlnk` profile 仓库，待定）

## 文档索引

| 文档 | 内容 |
|---|---|
| [00-overview.md](./00-overview.md) | 项目总览（本文档）|
| [01-content-plan.md](./01-content-plan.md) | 首页内容规划：各板块详细方案 |
| [02-tech-stack.md](./02-tech-stack.md) | 技术选型记录：为什么选 Astro |
| [03-design-system.md](./03-design-system.md) | 设计规范：配色/字体/视觉调性 |
| [04-roadmap.md](./04-roadmap.md) | 实施路线：分阶段落地计划 |

---

*文档创建：2026-07-16*
*维护者：鸿影（honlnk）*
