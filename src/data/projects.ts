// ============================================================
// projects.ts —— 精选作品数据（集中维护）
// 新增项目时，往数组里加一项即可，卡片自动渲染。
// Star/Fork 数为手填，定期更新。
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
