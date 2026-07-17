// ============================================================
// utils.ts —— i18n 工具函数
// 提供：从 URL 解析语言、t() 翻译函数、跨语言路径生成
// ============================================================

import { ui, defaultLang, showDefaultLang, type Lang } from './ui'

// ---------- 从 URL 解析当前语言 ----------
// /en/xxx → 'en'，/xxx → 'zh'（默认语言无前缀）
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as Lang
  return defaultLang
}

// ---------- 翻译函数 ----------
// 返回 t(key, params?)：缺 key 时回退默认语言
// params 用于插值，如 t('stats.since', { since: 2025, years: 1 })
export function useTranslations(lang: Lang) {
  return function t(
    key: string,
    params?: Record<string, string | number>
  ): string {
    const dict = ui[lang] as Record<string, string>
    const fallback = ui[defaultLang] as Record<string, string>
    let str = key in dict ? dict[key] : fallback[key] ?? key
    // 简单插值：{xxx} → params.xxx
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, String(v))
      }
    }
    return str
  }
}

// ---------- 跨语言路径生成 ----------
// 中文（默认）→ '/path'（无前缀）；英文 → '/en/path'
export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: Lang = lang): string {
    // 确保 path 以 / 开头
    const p = path.startsWith('/') ? path : `/${path}`
    return !showDefaultLang && l === defaultLang ? p : `/${l}${p}`
  }
}

// ---------- 获取当前页面对应的其他语言版本路径 ----------
// 用于语言切换器和 hreflang：当前在 /en/ 时，中文版路径是 '/'
export function getSwitchLangPath(currentLang: Lang, targetLang: Lang): string {
  // 首页切换：中文 '/'，英文 '/en/'
  // 默认语言（中文）→ '/'
  if (targetLang === defaultLang) return '/'
  return `/${targetLang}/`
}
