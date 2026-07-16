## 目标
让作品卡片展示真实的 GitHub Star/Fork 数，构建时自动从 GitHub API 拉取，无需手动维护。不配 token（60次/小时限流对 6 个仓库够用），带优雅降级保证 CI 永不失败。

## 改动范围（2 个文件）

### 1. `src/data/projects.ts`（重构）
- **保留** 现有 `Project` interface 和 `projects` 静态数组（作为兜底基础数据，name/desc/tech/url/repo 这些不变字段继续手填）
- **新增** `fetchGitHubStats(owner, repo)` 函数：构建时 fetch `https://api.github.com/repos/{owner}/{repo}`，返回 `{ stars, forks }`，失败时返回 `null`
- **新增** `getProjects()` async 函数：遍历 `projects`，并行拉取每个 repo 的真实数据，合并覆盖手填的 stars/forks；任一失败则保留手填值 + 打 warning
- **导出** 调整为：`Project`（类型）、`projects`（静态兜底）、`getProjects`（带真实数据的 async）

### 2. `src/components/Projects.astro`（1 行改动）
- `import { projects }` → `const projects = await getProjects()`
- 排序逻辑和模板完全不动

## 技术细节
- **并发拉取**：6 个 repo 用 `Promise.all` 并行，减少构建耗时
- **降级保证**：`fetchGitHubStats` 内部 try/catch 全包住，网络错/403 限流/404 一律返回 null，外层跳过覆盖 → CI 永不因 API 失败而挂
- **限流日志**：遇到 403 时打一条明确 warning 提示"触发限流，已回退手填数据"，方便排查
- **无 token**：纯未认证请求；将来想加 token 时，只需在 `fetchGitHubStats` 里读 `process.env.GITHUB_TOKEN` 加 Authorization header，改动极小

## 不改动的部分
- `ProjectCard.astro`（仍接收单个 `Project`，零改动）
- `Hero.astro` / 其他组件（不涉及数据层）
- 工作流、样式、类型定义

## 验证
- `pnpm build` 本地跑通，控制台确认 6 个 repo 都拉到了真实数据（或降级 warning）
- 检查 `dist/index.html` 里 Star 数为真实值
- push 后观察 CI 部署成功