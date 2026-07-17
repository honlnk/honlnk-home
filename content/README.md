# content/ —— 站点数据目录

改文案、改项目、改技能、改联系方式，只动这里的文件，无需碰 `src/` 代码。

## 目录结构

```
content/
├── profile.json        语言中性的个人数据（头像/用户名/CTA/联系方式/snake SVG）
├── ui/
│   ├── zh.json         中文 UI 文案（标题/按钮/描述/统计标签 等）
│   └── en.json         英文 UI 文案
├── projects/
│   ├── zh.json         中文项目数据（数组：name/desc/tech/stars/forks/url/repo）
│   └── en.json         英文项目数据
└── skills/
    ├── zh.json         中文技能分组（数组：label/items[]）
    └── en.json         英文技能分组
```

## labelKey 机制

`profile.json` 里凡是涉及文案的字段（CTA 按钮、联系方式），都支持两种写法：

- **`labelKey`**：指向 `ui/{zh,en}.json` 的翻译 key，随语言切换。
  例：`"labelKey": "contact.label.email"` → 中文显示「邮箱」、英文显示「Email」
- **`label`**：语言无关的字面量，中英文都显示同一段文字。
  例：`"label": "GitHub"`

## 数据源映射（哪个文件喂哪个组件）

| 文件 | 消费组件 |
|------|---------|
| `profile.json` | Hero / About(tags) / Contact / Snake / GitHubStats(用户名) / Layout(头像) |
| `ui/*.json` | 所有组件的标题/标签/按钮文案 |
| `projects/*.json` | Projects + ProjectCard |
| `skills/*.json` | Skills |

加载层在 `src/data/`（`profile.ts` / `skills.ts` / `projects.ts`），
组件只调 getter，不直接 import JSON。
