# 设计规范 · honlnk-home

> 视觉调性、配色、字体、交互细节。**克制、有记忆点、让作品说话**。

## 设计调性

两个词概括：**克制 · 技术感**。

| 要 | 不要 |
|---|---|
| 大量留白 | 信息堆砌 |
| 单色为主 + 一个强调色 | 彩虹色、花哨渐变 |
| 等宽字体点缀技术感 | 全程衬线/艺术字 |
| 微动效（hover、淡入）| 夸张动画、自动播放视频 |
| 深色优先 | 默认亮瞎眼的纯白 |

参考气质：开发者个人站、终端美学、Linear/Vercel 官网那种克制感。

---

## 配色方案

### 主色调（深色优先）

```
背景层级（从深到浅）：
  --bg-base:      #0a0a0a   ← 主背景（近黑）
  --bg-surface:   #141414   ← 卡片背景
  --bg-elevated:  #1e1e1e   ← 悬浮元素、hover

文字层级：
  --text-primary:   #fafafa  ← 主文字（高对比）
  --text-secondary: #a3a3a3  ← 次要文字
  --text-muted:     #525252  ← 辅助/占位

边框/分割：
  --border:         #262626  ← 卡片边框、分割线
```

### 强调色（Accent）✅ 已定：青绿

品牌色锁定为**青绿**，贯穿全局（链接、按钮、标题装饰、卡片 hover 边框）。

| 用途 | 深色模式 | 亮色模式 |
|---|---|---|
| Accent 主色 | `#00d4aa` | `#10b981` |
| Accent 悬停 | `#00f0c0` | `#059669` |
| Accent 弱化（背景/标签底）| `rgba(0,212,170,0.1)` | `rgba(16,185,129,0.1)` |

气质：技术、生机、AI 感，和"AI 应用"定位契合。不花哨，有辨识度。

### 主题模式 ✅ 已定：亮/暗双主题切换

- **默认深色**（`prefers-color-scheme: dark` 探测，无偏好时走深色）
- 右上角放主题切换开关（Vue 岛屿，`client:load`）
- 用户选择记入 `localStorage`，下次访问保持
- 通过 `<html data-theme="dark|light">` 切换，SCSS 用属性选择器驱动变量

```scss
// 主题变量管理（SCSS）
:root[data-theme="dark"] {
  --bg-base: #0a0a0a;
  --text-primary: #fafafa;
  // ...
}
:root[data-theme="light"] {
  --bg-base: #ffffff;
  --text-primary: #0a0a0a;
  // ...
}
```

亮色模式色值：

```
--bg-base:      #ffffff
--bg-surface:   #f5f5f5
--bg-elevated:  #ebebeb
--text-primary: #0a0a0a
--text-secondary:#525252
--text-muted:   #a3a3a3
--border:       #e5e5e5
--accent:       #10b981
```

---

## 字体

### 字体栈

```css
/* 西文 / 代码风 */
--font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

/* 中文正文 */
--font-sans: -apple-system, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
```

### 使用策略

| 场景 | 字体 | 说明 |
|---|---|---|
| Logo / ID (`honlnk`) | **Mono** | 等宽，技术感，像终端 |
| 主名（鸿影）| Sans（粗） | 中文清晰为主 |
| 标题 | Sans | 正文用 |
| 正文 | Sans |  |
| 代码片段、标签 | Mono | 技术点缀 |

> **关键记忆点**：`honlnk` 这个 ID 用等宽字体，强化"程序员"身份认同。

### 字号阶梯（rem）

```
Display:  3.5rem   ← Hero 主名（移动端缩小）
H1:       2.5rem   ← 板块大标题
H2:       1.75rem  ← 卡片标题
Body:     1rem     ← 正文
Small:    0.875rem ← 标签、辅助文字
```

---

## 间距与布局

### 设计 token 的实现方式

本项目体量不大，**所有设计 token（间距、字号、圆角、配色）统一用原生 CSS 自定义属性（CSS 变量）实现，全部集中在 `styles/global.scss` 里**，不再单独建 `_tokens.scss`。

```scss
// styles/global.scss —— 唯一的样式源头
:root {
  // 间距
  --space-1: 0.5rem;
  // 字号
  --font-display: 3.5rem;
  // 配色
  --accent: #00d4aa;
  // ...
}

// 亮/暗主题直接覆盖同一套变量
:root[data-theme="dark"]  { --bg-base: #0a0a0a; ... }
:root[data-theme="light"] { --bg-base: #ffffff; ... }
```

好处：
- **单一来源**：改一处全局生效，不会有野值。
- **主题复用**：亮/暗切换本质就是改 CSS 变量值，无缝衔接。
- **符合原则**：`styles/` 只有两个文件（`global.css` 引 Tailwind + `global.scss` 装 token/主题），其余样式内聚在组件 `<style>` 里。

组件里直接用：`padding: var(--space-3); color: var(--accent);`

### 间距系统（8px 基准）

```
--space-1:  0.5rem  (8px)
--space-2:  1rem    (16px)
--space-3:  1.5rem  (24px)
--space-4:  2rem    (32px)
--space-6:  3rem    (48px)
--space-8:  4rem    (64px)
```

### 容器宽度

```
--max-width:  1200px   ← 主内容区
--narrow:     720px    ← 长文本（关于我）
```

### 板块间距

每个板块上下留 `--space-8`（64px）以上，Hero 和 Projects 之间留更多（呼吸感）。

---

## 组件视觉规范

### 项目卡片

```
┌──────────────────────────────┐
│                              │
│  GPT Image Studio      TypeScript
│                              │
│  本地优先的 AI 图片创作工作台  │
│                              │
│  ★ 22   ⑂ 3                  │
│                              │
│  → image.honlnk.com          │
└──────────────────────────────┘
```

- 背景：`--bg-surface`
- 边框：1px solid `--border`，圆角 12px
- 内边距：`--space-3`
- Hover：边框变 `--accent`、轻微上浮（translateY -4px）、阴影增强
- 转场：200ms ease

### 按钮

```
主要按钮：  实心 --accent 背景，黑字
次要按钮：  透明背景，--border 边框，白字
Hover：     透明度变化或边框变色
```

### 标签（技术栈 tag）

```
样式：Mono 字体，小号，--bg-elevated 背景，圆角 4px
示例：[TypeScript] [Vue] [MCP]
```

---

## 动效规范

| 元素 | 动效 | 触发 |
|---|---|---|
| 卡片 hover | 上浮 4px + 边框变色 | 鼠标悬停 |
| 板块入场 | 淡入 + 上移 16px | 滚动进入视口（client:visible）|
| 链接 hover | 下划线滑入 / 颜色变 accent | 悬停 |
| 页面切换 | （二期）View Transitions API | 路由切换 |

**原则**：动效服务于内容，**不超过 300ms**，不自动播放，不闪屏。

### ❌ 不做的动效（明确排除）

- **Hero 动态背景**：不加粒子、流光、canvas 动画。背景保持纯色/静态。
- **自动播放的任何东西**：不自动轮播、不自动滚动、不闪。
- 调性：不花里胡哨，克制的工程师审美。

---

## 响应式断点

```
mobile:   < 640px    单列，字号缩小
tablet:   640-1024px  两列
desktop:  > 1024px   2-3 列，完整布局
```

移动端要点：
- Hero 字号缩到 2.5rem
- 卡片网格变单列
- 导航/按钮全宽

---

## 视觉记忆点清单

首页要让人记住的 3 个点：

1. **`honlnk` 等宽字体 ID + GitHub 头像** —— 程序员身份
2. **那句自嘲 bio** —— 性格辨识度
3. **深色为主 + 青绿强调（可切亮色）** —— 技术/ AI 感调性

---

## 已定项（决策锁定）

- [x] **强调色**：青绿 `#00d4aa`（深色）/ `#10b981`（亮色）
- [x] **主题模式**：亮/暗双主题，默认深色，右上角切换开关，记忆用户选择
- [x] **Hero 背景**：静态纯色，**不加任何动态背景**
- [x] **头像/Logo**：使用 GitHub 头像（`avatars.githubusercontent.com/u/235359418`）
- [x] **调性**：克制、不花里胡哨，工程师审美

---

*文档创建：2026-07-16*
*更新：2026-07-16（锁定配色/主题/Logo 等设计决策）*
