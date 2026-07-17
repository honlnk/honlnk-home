// ============================================================
// profile.ts —— 语言中性个人数据的类型化加载层
// 数据源：content/profile.json（改这里即可，无需动代码）
// ============================================================

import profileData from '../../content/profile.json'
import type { Lang } from '../i18n/ui'
import type { TranslationKey } from '../i18n/ui'

/** CTA 按钮：labelKey 走翻译，label 直接字面量 */
export interface HeroCta {
  labelKey?: TranslationKey
  label?: string
  href: string
  primary?: boolean
  external?: boolean
}

/** 联系方式：labelKey 走翻译，value 是字面量（@honlnk、域名、邮箱） */
export interface ContactItem {
  labelKey?: TranslationKey
  label?: string
  value: string
  url: string
}

interface RawProfile {
  username: string
  avatar: string
  bio: string
  heroCta: HeroCta[]
  aboutTags: string[]
  contacts: ContactItem[]
  snake: { light: string; dark: string }
}

const data = profileData as RawProfile

// 重新导出字段，对外只暴露明确的 getter，
// 避免组件直接拿 _comment 之类的杂项 key。
export const username = data.username
export const avatar = data.avatar
export const bio = data.bio
export const heroCta = data.heroCta
export const contacts = data.contacts
export const snake = data.snake

/**
 * 取当前语言的 About 标签列表。
 * aboutTags 存的是 key 后缀（如 "aiApp"），拼成完整翻译 key 再走 t()。
 */
export function getAboutTagKeys(): string[] {
  return data.aboutTags.map((tag) => `about.tag.${tag}`)
}
