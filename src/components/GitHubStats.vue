<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { loadStats, type UserStats } from '../data/github'

const props = defineProps<{
  username: string
  labels: {
    repos: string
    stars: string
    followers: string
    forks: string
    // since 模板，支持 {since} {years} 插值
    sinceTemplate: string
    sinceFallback: string // years=0 时用，如 "GitHub 2023"
    langDist: string
  }
}>()

const stats = ref<UserStats | null>(null)

onMounted(async () => {
  stats.value = await loadStats(props.username)
})

// 贡献年限文案：按模板插值组装
const sinceText = computed(() => {
  if (!stats.value) return ''
  const created = new Date(stats.value.created_at).getFullYear()
  const now = new Date().getFullYear()
  const years = now - created
  if (years <= 0) {
    return props.labels.sinceFallback.replace('{since}', String(created))
  }
  return props.labels.sinceTemplate
    .replace('{since}', String(created))
    .replace('{years}', String(years))
})

/* ---------- 语言分布：SVG 环形图 ---------- */
const R = 52 // 环半径（viewBox 120 内，描边 14 后外沿 59）
const CIRC = 2 * Math.PI * R

// GitHub Linguist 官方语言色，未收录的语言按序取兜底色板
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Python: '#3572A5',
  Vue: '#41b883',
  Astro: '#ff5a03',
  'C++': '#f34b7d',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Go: '#00ADD8',
  Rust: '#dea584',
}
const FALLBACK_COLORS = [
  '#7a8ba3',
  '#c9a227',
  '#7aa874',
  '#b07aa8',
  '#5f9ea0',
  '#a8845c',
]

function langColor(name: string, index: number): string {
  return LANG_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

// 按 count（而非取整后的 pct）精确切分圆弧，保证首尾无缝
const segs = computed(() => {
  const langs = stats.value?.languages ?? []
  const total = langs.reduce((s, l) => s + l.count, 0)
  if (!total) return []
  let acc = 0
  return langs.map((l, i) => {
    const frac = l.count / total
    const seg = {
      name: l.name,
      pct: l.pct,
      color: langColor(l.name, i),
      len: frac * CIRC,
      offset: -acc * CIRC, // 负值 = 顺时针推进
      delay: `${i * 90}ms`,
    }
    acc += frac
    return seg
  })
})

// 数据到位后下一帧切换，让分段从 0 长度生长到位（stroke-dasharray transition）
const ready = ref(false)
watch(stats, (v) => {
  if (v) requestAnimationFrame(() => (ready.value = true))
})
</script>

<template>
  <div v-if="stats" class="grid">
    <!-- 数字统计卡 -->
    <div class="card numbers">
      <div class="number-grid">
        <div class="stat-item">
          <span class="num">{{ stats.public_repos }}</span>
          <span class="label">{{ labels.repos }}</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.total_stars }}</span>
          <span class="label">{{ labels.stars }}</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.followers }}</span>
          <span class="label">{{ labels.followers }}</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.total_forks }}</span>
          <span class="label">{{ labels.forks }}</span>
        </div>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -- 模板插值已转义为纯文本 -->
      <p class="since mono" v-html="sinceText"></p>
    </div>

    <!-- 语言占比卡（环形图 + 图例） -->
    <div class="card langs">
      <h3 class="card-label">{{ labels.langDist }}</h3>
      <div class="langs-body">
        <svg
          class="donut"
          viewBox="0 0 120 120"
          role="img"
          :aria-label="labels.langDist"
        >
          <g transform="rotate(-90 60 60)">
            <circle
              v-for="s in segs"
              :key="s.name"
              class="seg"
              cx="60"
              cy="60"
              :r="R"
              fill="none"
              stroke-width="14"
              :stroke="s.color"
              :stroke-dasharray="ready ? `${s.len} ${CIRC - s.len}` : `0 ${CIRC}`"
              :stroke-dashoffset="s.offset"
              :style="{ transitionDelay: ready ? s.delay : '0ms' }"
            >
              <title>{{ s.name }} · {{ s.pct }}%</title>
            </circle>
          </g>
        </svg>
        <div class="legend">
          <div class="legend-row" v-for="s in segs" :key="s.name">
            <span class="dot" :style="{ background: s.color }"></span>
            <span class="lang-name">{{ s.name }}</span>
            <span class="lang-pct mono">{{ s.pct }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- stats 为 null（首次加载中 / 拉取失败且无缓存）时留空，避免占位抖动 -->
</template>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.card {
  padding: var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

/* ---------- 数字统计卡 ---------- */
.numbers {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.number-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.num {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.label {
  font-size: var(--font-small);
  color: var(--text-secondary);
}

.since {
  margin-top: var(--space-3);
  font-size: var(--font-small);
  color: var(--text-muted);
  text-align: right;
}

/* ---------- 语言占比卡（环形图 + 图例） ---------- */
.langs {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: var(--font-small);
  color: var(--accent);
  margin-bottom: var(--space-2);
}

.langs-body {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.donut {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.seg {
  transition:
    stroke-dasharray 900ms ease,
    stroke-width 200ms ease;

  &:hover {
    stroke-width: 17;
  }
}

.legend {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.legend-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.6rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.lang-name {
  font-size: var(--font-small);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lang-pct {
  font-size: var(--font-small);
  color: var(--text-muted);
  text-align: right;
}

/* ---------- 响应式 ---------- */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .number-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
  }
  .num {
    font-size: 1.6rem;
  }
  .donut {
    width: 118px;
    height: 118px;
  }
}
</style>
