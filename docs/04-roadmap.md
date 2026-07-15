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

- [ ] 初始化 Astro 项目（`npm create astro@latest`）
- [ ] 安装核心集成：
  - `@astrojs/vue`（Vue 组件支持）
  - `@astrojs/tailwind` 或 Tailwind v4 Vite 插件
- [ ] 建立目录结构：
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
  │   └── Contact.astro
  ├── data/
  │   └── projects.ts         ← 项目数据（集中管理）
  ├── pages/
  │   └── index.astro         ← 首页（组装各板块）
  └── styles/
      └── global.css          ← 全局样式 + CSS 变量
  ```
- [ ] 配置基础 `Layout.astro`（meta、SEO 标签、字体引入）
- [ ] 确认 `npm run dev` 正常启动

### 产出
一个空白但能跑的 Astro 项目。

---

## 阶段 1：内容 MVP

### 目标
把 5 个板块的内容用纯静态 HTML 填进去，**先求"内容完整"，不求好看**。

### 任务清单

- [ ] **Hero**：名字、定位、bio、3 个 CTA 按钮
- [ ] **About**：一段话 + 5 个标签
- [ ] **Projects**：6 张项目卡片（数据从 `data/projects.ts` 读取）
  - 数据字段：name, desc, tech[], stars, forks, url, demo?
- [ ] **Skills**：四行分类标签
- [ ] **Contact**：GitHub / 博客 / 邮箱 + Footer
- [ ] 移动端基础适配（单列布局）

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

- [ ] 全局 CSS 变量注入（配色、间距、字体）
- [ ] 深色主题应用（背景层级、文字层级）
- [ ] 字体引入：JetBrains Mono（等宽）+ 系统中文字体
- [ ] Hero 视觉强化（字号阶梯、留白、CTA 按钮样式）
- [ ] 项目卡片样式（边框、圆角、hover 上浮）
- [ ] 板块入场动效（`client:visible` 淡入）
- [ ] 响应式断点测试（手机/平板/桌面）
- [ ] Lighthouse 跑分（目标：性能/SEO 双 95+）

### 产出
一个视觉完成度高、可以直接上线的页面。

---

## 阶段 3：部署上线

### 目标
`honlnk.com` 根域名能访问到这个页面。

### 任务清单

- [ ] 新建 GitHub 仓库 `honlnk-home`（或决定复用 `honlnk` profile 仓库）
- [ ] 配置 GitHub Pages（source: main 分支）
- [ ] 添加 `CNAME` 文件：`honlnk.com`
- [ ] DNS 配置（在你的域名服务商处）：
  ```
  @    A     185.199.108.153
  @    A     185.199.109.153
  @    A     185.199.110.153
  @    A     185.199.111.153
  www  CNAME honlnk.github.io.
  ```
- [ ] 等待 DNS 生效，验证 HTTPS 证书
- [ ] 验证各子域名链接可达

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

## 关键决策点（动手前需确认）

> 这些在进入阶段 0 之前敲定，避免返工。

1. **强调色**：青绿 `#00d4aa` 还是其他？（见 [设计规范](./03-design-system.md#强调色accent)）
2. **是否做亮色模式**：首版只做深色，还是双模式？
3. **Hero 动态背景**：要还是不要？
4. **头像/Logo**：用 GitHub avatar、自绘、还是纯文字 Logo？
5. **仓库策略**：新建 `honlnk-home`，还是复用 `honlnk` profile 仓库？

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
