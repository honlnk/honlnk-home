// ============================================================
// projects.ts —— 项目数据加载 + GitHub API 动态拉取
// 数据源：projects.zh.json / projects.en.json（按语言拆分）
// 加/改项目时，编辑对应 JSON 文件即可。
// stars/forks 在构建时从 GitHub API 拉取真实值（失败回退 JSON 手填值）。
// ============================================================

import zhData from '../../content/projects/zh.json'
import enData from '../../content/projects/en.json'
import type { Lang } from '../i18n/ui'

export interface Project {
  name: string
  desc: string
  tech: string[]
  stars: number
  forks: number
  url: string
  repo: string
  featured?: boolean
}

// 各语言的项目数据
const dataByLang: Record<Lang, Project[]> = {
  zh: zhData as Project[],
  en: enData as Project[],
}

// 从 repo URL 提取 owner/name，用于调 GitHub API
function parseRepoPath(repoUrl: string): string | null {
  const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+?)\/?$/)
  return match ? match[1] : null
}

// 构建时拉取单个仓库的真实 Star/Fork 数
async function fetchGitHubStats(
  repoUrl: string
): Promise<{ stars: number; forks: number } | null> {
  const repoPath = parseRepoPath(repoUrl)
  if (!repoPath) return null

  try {
    const res = await fetch(`https://api.github.com/repos/${repoPath}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    })

    if (res.status === 403) {
      console.warn(
        `[projects] GitHub API 限流（403），${repoPath} 回退到手填数据`
      )
      return null
    }
    if (!res.ok) return null

    const data = await res.json()
    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
    }
  } catch (e) {
    console.warn(`[projects] 拉取 ${repoPath} 失败，回退到手填数据`)
    return null
  }
}

// 构建时调用：按语言取数据，并并行拉取真实 stats（失败则保留手填值）
export async function getProjects(lang: Lang): Promise<Project[]> {
  const projects = dataByLang[lang]
  const enriched = await Promise.all(
    projects.map(async (p) => {
      const stats = await fetchGitHubStats(p.repo)
      if (!stats) return p
      return { ...p, stars: stats.stars, forks: stats.forks }
    })
  )
  return enriched
}
