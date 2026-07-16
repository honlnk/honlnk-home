// ============================================================
// projects.ts —— 精选作品数据（集中维护）
// stars/forks 在构建时从 GitHub API 动态拉取（getProjects），
// 下面手填的静态数组作为兜底基础数据 + 离线/限流时的降级值。
// 新增项目时，往数组里加一项即可，卡片自动渲染。
// ============================================================

export interface Project {
  name: string
  desc: string
  tech: string[]
  stars: number
  forks: number
  url: string         // 在线访问地址（已绑子域名）
  repo: string        // GitHub 仓库地址
  featured?: boolean  // 是否置顶
}

// 静态基础数据（stars/forks 为手填兜底值，构建时会被真实值覆盖）
export const projects: Project[] = [
  {
    name: 'GPT Image Studio',
    desc: '本地优先的 AI 图片创作工作台',
    tech: ['TypeScript'],
    stars: 22,
    forks: 3,
    url: 'https://image.honlnk.com',
    repo: 'https://github.com/honlnk/gpt-image-studio',
    featured: true,
  },
  {
    name: 'NovAI',
    desc: '长篇小说 AI 写作工作空间（RAG 驱动）',
    tech: ['TypeScript'],
    stars: 5,
    forks: 1,
    url: 'https://novai.honlnk.com',
    repo: 'https://github.com/honlnk/NovAI',
    featured: true,
  },
  {
    name: 'linkseek',
    desc: '自托管 MCP 服务（联网搜索 + 网页抓取）',
    tech: ['TypeScript'],
    stars: 1,
    forks: 0,
    url: 'https://mcp.honlnk.com',
    repo: 'https://github.com/honlnk/linkseek',
  },
  {
    name: 'text-diff-viewer',
    desc: '纯文本差异对比工具',
    tech: ['TypeScript'],
    stars: 3,
    forks: 0,
    url: 'https://diff.honlnk.top',
    repo: 'https://github.com/honlnk/text-diff-viewer',
  },
  {
    name: 'GradeSieve',
    desc: '成绩筛选工具',
    tech: ['Vue'],
    stars: 0,
    forks: 0,
    url: 'https://grade.honlnk.com',
    repo: 'https://github.com/honlnk/GradeSieve',
  },
  {
    name: '顿顿（dundun）',
    desc: 'AI 烹饪私教',
    tech: ['Vue'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/honlnk/dundun',
    repo: 'https://github.com/honlnk/dundun',
  },
]

// 从 repo URL 提取 owner/name，用于调 GitHub API
function parseRepoPath(repoUrl: string): string | null {
  // https://github.com/{owner}/{repo} → {owner}/{repo}
  const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+?)\/?$/)
  return match ? match[1] : null
}

// 构建时拉取单个仓库的真实 Star/Fork 数
// 失败（网络错、限流、404）一律返回 null，外层降级到手填值
async function fetchGitHubStats(
  repoUrl: string
): Promise<{ stars: number; forks: number } | null> {
  const repoPath = parseRepoPath(repoUrl)
  if (!repoPath) return null

  try {
    const res = await fetch(`https://api.github.com/repos/${repoPath}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        // 可选 token：配了就走 5000/h 限流，不配走 60/h（本项目够用）
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

// 构建时调用：并行拉取所有项目的真实 stats，失败的手填值保留
export async function getProjects(): Promise<Project[]> {
  const enriched = await Promise.all(
    projects.map(async (p) => {
      const stats = await fetchGitHubStats(p.repo)
      if (!stats) return p // 降级：保留原手填值
      return { ...p, stars: stats.stars, forks: stats.forks }
    })
  )
  return enriched
}
