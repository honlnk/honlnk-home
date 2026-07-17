// ============================================================
// github.ts —— GitHub 统计数据：客户端拉取 + localStorage 缓存
// 缓存策略：每天 0 点 / 12 点后第一次访问才拉新数据，其余读缓存。
// 请求失败时静默回退到缓存（无缓存则返回 null，面板不渲染）。
// ============================================================

export interface LangStat {
  name: string
  count: number
  pct: number
}

export interface UserStats {
  public_repos: number
  followers: number
  following: number
  created_at: string
  total_stars: number
  total_forks: number
  languages: LangStat[]
}

interface CachedStats {
  data: UserStats
  fetchedAt: number
}

const CACHE_KEY = 'honlnk:github-stats'

// 两个刷新锚点的小时数：0 点、12 点
const REFRESH_HOURS = [0, 12]

/**
 * 从 GitHub API 拉取并聚合统计（未认证，浏览器端直连，CORS 支持）。
 * 任一请求失败或限流 → 返回 null。
 */
export async function fetchGitHubStats(
  username: string
): Promise<UserStats | null> {
  const headers = { Accept: 'application/vnd.github+json' }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
        { headers }
      ),
    ])

    if (userRes.status === 403 || reposRes.status === 403) {
      console.warn('[GitHubStats] GitHub API 限流（403）')
      return null
    }
    if (!userRes.ok || !reposRes.ok) return null

    const user = await userRes.json()
    const repos = await reposRes.json()

    const total_stars = repos.reduce(
      (s: number, r: any) => s + (r.stargazers_count || 0),
      0
    )
    const total_forks = repos.reduce(
      (s: number, r: any) => s + (r.forks_count || 0),
      0
    )

    // 按仓库数量统计语言分布
    const langCount: Record<string, number> = {}
    for (const r of repos) {
      const lang = r.language
      if (lang) langCount[lang] = (langCount[lang] || 0) + 1
    }
    const totalLangRepos = Object.values(langCount).reduce(
      (a: number, b: number) => a + b,
      0
    )
    const languages: LangStat[] = Object.entries(langCount)
      .map(([name, count]) => ({
        name,
        count,
        pct: totalLangRepos ? Math.round((count / totalLangRepos) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    return {
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
      total_stars,
      total_forks,
      languages,
    }
  } catch (e) {
    console.warn('[GitHubStats] 拉取失败')
    return null
  }
}

/**
 * 缓存策略：上一次拉取是否已早于「今天最近一个已过的刷新锚点」。
 *
 * 锚点 = 每天 0 点、12 点（本地时间）。
 * - 无缓存（ts 为 0）→ 首次访问，立即拉
 * - 上次在昨天/更早 → 今天 0 点锚点已过 → 拉新
 * - 上次在今天 0~12 点之间，现在 12 点之后 → 今天 12 点锚点已过 → 拉新
 * - 上次在今天某锚点之后，当前还没到下一个锚点 → 不拉
 *
 * 即每天最多触发 2 次真实请求。
 */
export function shouldRefresh(lastFetchTs: number, now: Date = new Date()): boolean {
  // 首次访问，没缓存
  if (!lastFetchTs) return true

  // 找出「当前时间之前、最近的那个锚点」的时间戳
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = now.getDate()
  const anchorToday = REFRESH_HOURS.map(
    (h) => new Date(y, m, d, h, 0, 0, 0).getTime()
  )

  // 当前小时 < 12 → 今天的锚点里只有 0 点已过；否则 0 点和 12 点都过
  const latestPassedAnchor =
    now.getHours() >= 12 ? anchorToday[1] : anchorToday[0]

  // 上次拉取早于「最近已过锚点」→ 说明锚点之后还没拉过 → 需要 refresh
  return lastFetchTs < latestPassedAnchor
}

/** 读 localStorage 缓存 */
function readCache(): CachedStats | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedStats
    if (!parsed?.data || typeof parsed.fetchedAt !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

/** 写 localStorage 缓存 */
function writeCache(data: UserStats): void {
  try {
    const payload: CachedStats = { data, fetchedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* localStorage 不可用时静默忽略 */
  }
}

/**
 * 组合入口：按缓存策略决定是否拉新数据。
 * - 不需要刷新 → 直接返回缓存
 * - 需要刷新 → 拉取成功写缓存并返回；失败静默回退缓存（无缓存返回 null）
 */
export async function loadStats(username: string): Promise<UserStats | null> {
  const cached = readCache()

  if (!shouldRefresh(cached?.fetchedAt ?? 0)) {
    return cached?.data ?? null
  }

  const fresh = await fetchGitHubStats(username)
  if (fresh) {
    writeCache(fresh)
    return fresh
  }
  // 拉取失败，静默回退缓存
  return cached?.data ?? null
}
