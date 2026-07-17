// ============================================================
// skills.ts —— 技能栈数据加载层
// 数据源：content/skills/{zh,en}.json（按语言拆分）
// 加/改技能分组时，编辑对应 JSON 文件即可。
// ============================================================

import zhData from '../../content/skills/zh.json'
import enData from '../../content/skills/en.json'
import type { Lang } from '../i18n/ui'

export interface SkillGroup {
  label: string
  items: string[]
}

const dataByLang: Record<Lang, SkillGroup[]> = {
  zh: zhData as SkillGroup[],
  en: enData as SkillGroup[],
}

export function getSkills(lang: Lang): SkillGroup[] {
  return dataByLang[lang]
}
