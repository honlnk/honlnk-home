// ============================================================
// ui.ts —— 语言配置 + 类型定义
// 翻译数据在 locales/*.json（zh.json / en.json）
// 改文案只改对应 JSON 文件。
// ============================================================

import zh from '../../content/ui/zh.json'
import en from '../../content/ui/en.json'

// 支持的语言（key = URL 路径段，value = 显示名）
export const languages = {
  zh: '中文',
  en: 'English',
} as const

export type Lang = keyof typeof languages

// 默认语言（无 URL 前缀）
export const defaultLang: Lang = 'zh'

// 默认语言是否在 URL 中显示前缀（false = 中文走 / ，英文走 /en/）
export const showDefaultLang = false

// 翻译数据：JSON 动态导入，以中文 key 集合作为类型基准
export const ui = {
  zh,
  en,
} as const

// 翻译 key 的类型（从中文 JSON 推导，编译期校验 key 拼写）
export type TranslationKey = keyof typeof zh
