# 技术选型 · honlnk-home

> 为什么选 Astro？决策记录 + 关键概念速查。

## 决策结论

**采用 Astro 作为首页框架**，交互组件用 Vue3，样式用 Tailwind + SCSS 混合方案，包管理用 pnpm。

```
Astro（内容/性能底座）
  ├─ Vue3（写交互岛屿，复用现有技能）
  ├─ Tailwind CSS（简单样式，写行内 class）
  ├─ SCSS（复杂样式，写在组件 <style lang="scss"> 里，尽量少建独立 .scss）
  ├─ pnpm（包管理）
  └─ GitHub Pages（部署，与现有体系一致）
```

### 样式策略：Tailwind 行内 + 组件 `<style lang="scss">`

优先级从高到低：

| 场景 | 用什么 | 说明 |
|---|---|---|
| 简单原子样式（间距、对齐、响应式）| **Tailwind 行内 class** | 首选，`<div class="flex gap-4 p-6">` |
| 复杂样式（嵌套、伪类、动画）| **组件内 `<style lang="scss">`** | 写在组件里，跟着组件走，保持内聚 |
| 全局复用（主题变量、重置）| **`styles/global.scss`** | 仅限真正全局的东西 |

原则：
- **能用 Tailwind 搞定的，就写行内 class**，快、直观。
- **复杂样式写在组件的 `<style lang="scss">` 块里**，不单独抽 .scss 文件。
- **尽量少建独立 .scss 文件**，避免碎片化。只有主题变量、全局重置这类全局必需品才进 `styles/`。
- 主题切换（亮/暗）用 CSS 变量 + `[data-theme]` 选择器，定义在 `global.scss`。

---

## 为什么是 Astro

### 场景匹配度

本项目是典型**内容驱动型**网站：文字 + 作品卡片为主，交互极少（主题切换、可能的 Star 动态拉取）。这正是 Astro 的主战场。

### 核心优势对比

| 维度 | Astro | Vue3 + Vite |
|---|---|---|
| 默认 JS 体积 | **~0 KB**（按需岛屿）| ~150KB+（Vue 运行时）|
| 首屏速度 | 极快（直接 HTML）| 慢（等 JS 渲染）|
| SEO | 天然满分（SSG 成品 HTML）| 需额外配 prerender |
| 写交互 | Vue 组件（复用技能）| Vue 组件 |
| 未来加博客 | Content Collections 原生支持 | 要自己搭 |
| Lighthouse | 经常 100 | 70-90 |

### 性能数据（真实网站统计）

Core Web Vitals 通过率（来源：HTTP Archive + Chrome UX Report）：

```
Astro       60%   🏆
WordPress   43%
Gatsby      41%
Next.js     26%
Nuxt        23%
```

对作品集而言，"点开秒开"本身就是专业感的一部分。

---

## 关键概念速查

### 1. 零 JS 优先

Astro 默认把所有组件渲染成纯 HTML + CSS，**自动剥离客户端 JavaScript**。只有明确标记的组件才带 JS。

```astro
---
import ThemeToggle from './ThemeToggle.vue'
---

<ThemeToggle client:load />   <!-- 带 client: 指令 → 有 JS -->
<StaticCard />                <!-- 没加 → 纯静态 -->
```

### 2. 岛屿架构（Islands）

页面 90% 是"海水"（静态 HTML），10% 是"岛屿"（带交互）。

```
[主题开关]  ← 岛屿(要JS)
标题/简介   ← 海水(纯HTML)
项目卡片    ← 海水(纯HTML)
[Star数]    ← 岛屿(要JS)
Footer     ← 海水(纯HTML)
```

### 3. client:* 指令（精细控制 JS 加载）

| 指令 | 何时加载 | 用途 |
|---|---|---|
| `client:load` | 立即 | 主题开关、导航栏 |
| `client:idle` | 空闲时 | 评论框 |
| `client:visible` | 进入视口 | 页底组件、轮播 |
| `client:media` | 特定屏宽 | 移动端菜单 |
| 不加 | **永不** | 绝大多数内容 |

### 4. 框架无关 —— Vue 直接用

Astro 不绑定 UI 框架。安装集成后，**继续写 Vue 组件**即可：

```bash
npm install @astrojs/vue
```

```astro
---
import Counter from './Counter.vue'
---

<Counter client:visible />   <!-- 用 Vue 写交互，Astro 管性能 -->
```

### 5. 内容集合 Content Collections（未来扩展利器）

未来加博客时，每篇文章一个 Markdown，配合 schema 有完整类型校验：

```ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
  })
})
```

查询时有完整 TypeScript 提示。这是 Astro 区别于其他静态站生成器的杀手锏。

### 6. `.astro` 文件结构

```astro
---
// 代码栅栏(fence)：构建时执行的 TypeScript
import Layout from '../layouts/Layout.astro'
const projects = [{ name: 'NovAI', stars: 5 }]
---

<Layout title="鸿影">
  <h1>鸿影</h1>
  {projects.map(p => <p>{p.name}</p>)}
</Layout>

<style>
  /* 局部 CSS，不污染全局 */
  h1 { color: #333; }
</style>
```

学习成本：会 Vue 模板的人 10 分钟上手。

---

## 代价与风险

| 点 | 应对 |
|---|---|
| 需要学 `.astro` 语法 | 半天可掌握，类似 HTML + JSX |
| 社区主题偏博客风 | 我们自己设计，不依赖现成主题 |
| 纯静态，无运行时后端 | 本项目不需要后端，未来可接 Server Islands |

---

## 部署方案

```
本地开发：  npm run dev
构建：      npm run build → 生成 dist/ 纯静态文件
部署：      push 到 GitHub，GitHub Pages 自动发布
域名：      honlnk.com → A 记录指向 GitHub Pages IP
```

**与现有项目体系完全一致**，不引入新平台。

---

## 版本基线

- **包管理器**：pnpm（速度快、磁盘节省，锁定 `pnpm-lock.yaml`）
- Astro：**5.x**（当前稳定，支持 Server Islands、View Transitions）
- Vue：**3.x**
- Tailwind：**4.x**
- SCSS：通过 `sass` 包支持，Astro 原生编译 `.scss`
- Node：**>= 20**

---

## 参考链接

- 官网：https://astro.build
- 文档：https://docs.astro.build
- Vue 集成：https://docs.astro.build/en/guides/integrations-guide/vue/
- 群岛架构：https://docs.astro.build/en/concepts/islands/

---

*文档创建：2026-07-16*
*决策依据：场景匹配 + 性能数据 + 长期可扩展性*
