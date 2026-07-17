# 实施路线 · honlnk-home

> 分阶段落地计划。小步快跑，先上线骨架，再迭代细节。

## 总体节奏

```
阶段0  项目初始化      ←  代码骨架、依赖、目录结构
阶段1  内容 MVP        ←  5 个板块纯静态版本，能看
阶段2  视觉打磨        ←  配色/字体/动效到位
阶段3  部署上线        ←  GitHub Pages + 绑根域名
阶段4  增强（迭代）    ←  动态数据、深色切换、可选板块
```

**目标**：阶段 3 完成后 `honlnk.com` 就有了一个像样的门面。

---

## 阶段 0：项目初始化

### 目标
搭好 Astro 项目骨架，能 `npm run dev` 跑起来。

### 任务清单

- [x] 初始化 Astro 项目（`pnpm create astro@latest`）
- [x] 安装核心依赖：
  - `@astrojs/vue`（Vue 组件支持）
  - `tailwindcss` + `@tailwindcss/vite`（Tailwind v4 Vite 插件）
  - `sass`（SCSS 编译支持，Astro 原生集成）
  - `@astrojs/check` + `typescript`（类型检查）
- [x] 建立目录结构：
  ```
  src/
  ├── layouts/
  │   └── Layout.astro        ← 页面外壳（<html>/<head>）
  ├── components/
  │   ├── Hero.astro
  │   ├── About.astro
  │   ├── ProjectCard.astro
  │   ├── Projects.astro
  │   ├── Skills.astro
  │   ├── Contact.astro
  │   └── ThemeToggle.vue     ← 主题切换（Vue 岛屿，client:load）
  ├── data/
  │   └── projects.ts         ← 项目数据（集中管理）
  ├── pages/
  │   └── index.astro         ← 首页（组装各板块）
  └── styles/
      └── global.scss         ← 全局样式 + 主题变量（亮/暗），其余样式写在组件内
  ```
- [x] 配置主题切换机制（`<html data-theme>` + `localStorage` + `prefers-color-scheme`）
- [x] 配置基础 `Layout.astro`（meta、SEO 标签、字体引入、防主题闪烁脚本）
- [x] 确认 `pnpm dev` 正常启动

### 产出
一个空白但能跑的 Astro 项目。

---

## 阶段 1：内容 MVP

### 目标
把 5 个板块的内容用纯静态 HTML 填进去，**先求"内容完整"，不求好看**。

### 任务清单

- [x] **Hero**：名字、定位、bio、3 个 CTA 按钮、GitHub 头像
- [x] **About**：一段话 + 5 个标签
- [x] **Projects**：6 张项目卡片（数据从 `data/projects.ts` 读取）
  - 数据字段：name, desc, tech[], stars, forks, url, demo?
- [x] **Skills**：四行分类标签
- [x] **Contact**：GitHub / 博客 / 邮箱 + Footer
- [x] **主题切换开关**：右上角 ThemeToggle.vue，亮/暗切换 + 记忆
- [x] 移动端基础适配（单列布局）

### 数据准备

`src/data/projects.ts` 集中维护项目清单（首版手填）：

```ts
export const projects = [
  {
    name: 'GPT Image Studio',
    desc: '本地优先的 AI 图片创作工作台',
    tech: ['TypeScript'],
    stars: 22, forks: 3,
    url: 'https://image.honlnk.com',
    featured: true,
  },
  // ... 其余 5 个
]
```

### 产出
一个内容完整、但样式朴素的页面。**在本地能完整滚动浏览所有内容**。

---

## 阶段 2：视觉打磨

### 目标
按 [设计规范](./03-design-system.md) 把样式做到位。

### 任务清单

- [x] 全局 CSS 变量注入（配色、间距、字体）
- [x] 深色主题应用（背景层级、文字层级）
- [x] 字体引入：JetBrains Mono（等宽）+ 系统中文字体
- [x] Hero 视觉强化（字号阶梯、留白、CTA 按钮样式）
- [x] 项目卡片样式（边框、圆角、hover 上浮）
- [x] 板块入场动效（IntersectionObserver 淡入，渐进增强）
- [x] 响应式断点测试（手机/平板/桌面）
- [x] Lighthouse 跑分（目标：性能/SEO 双 95+）—— 命令行自检通过，HTML 16KB / SEO 标签齐全 / 零冗余 JS

### 产出
一个视觉完成度高、可以直接上线的页面。

---

## 阶段 3：部署上线

### 目标
`honlnk.com` 根域名能访问到这个页面。

### 任务清单

- [x] 新建 GitHub 仓库 `honlnk-home`（已创建并推送）
- [x] 配置 GitHub Pages（source: GitHub Actions，工作流自动构建部署）
- [x] 添加 `CNAME` 文件：`honlnk.com`
- [x] DNS 配置（在你的域名服务商处）：
  ```
  @    A     185.199.108.153
  @    A     185.199.109.153
  @    A     185.199.110.153
  @    A     185.199.111.153
  www  CNAME honlnk.github.io.
  ```
- [x] 等待 DNS 生效，验证 HTTPS 证书（✅ 已签发，state=approved，有效期至 2026-10-15）
- [x] 验证各子域名链接可达

### 产出
`https://honlnk.com` 正式上线。🎉

---

## 阶段 4：增强（迭代）

上线后按需迭代，不急：

| 增强项 | 价值 | 难度 |
|---|---|---|
| 🌙 深色/亮色切换 | 用户体验 | 低（client:load 岛屿）|
| ⭐ Star 数动态拉取 | 数据真实 | 中（构建时调 GitHub API）|
| 📊 GitHub 统计卡片 | 装饰展示 | 低（嵌 stats 卡片）|
| 📝 最新博客文章 | 内容引流 | 中（接 RSS）|
| ✨ View Transitions | 切页动效 | 低（Astro 内置）|
| 📈 访客统计 | 数据洞察 | 中（接 Umami/Plausible）|
| 🌐 Open Graph 图 | 分享预览 | 低（meta + 静态图）|

---

## 关键决策点（已全部敲定 ✅）

1. **强调色**：✅ 青绿 `#00d4aa`（深色）/ `#10b981`（亮色）
2. **主题模式**：✅ 亮/暗双主题，默认深色，右上角切换，记忆选择
3. **Hero 背景**：✅ 静态纯色，不加动态背景
4. **头像/Logo**：✅ GitHub 头像
5. **仓库**：✅ 新建 `honlnk-home`（已创建并推送）
6. **包管理器**：✅ pnpm
7. **样式方案**：✅ Tailwind（行内）+ SCSS（复杂样式）双轨

---

## 风险与注意

| 风险 | 应对 |
|---|---|
| 根域名 A 记录占用，影响邮箱解析 | 部署前确认 MX 记录不冲突 |
| GitHub Pages HTTPS 证书签发延迟 | 提前部署，留几小时缓冲 |
| `.top` 旧链接 SEO 权重 | 本期不处理，后期单独规划 301 |

---

*文档创建：2026-07-16*
*原则：小步快跑，先上线再迭代*
