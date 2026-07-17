<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

    <!-- 语言占比卡 -->
    <div class="card langs">
      <h3 class="card-label">{{ labels.langDist }}</h3>
      <div class="lang-list">
        <div class="lang-row" v-for="l in stats.languages" :key="l.name">
          <span class="lang-name">{{ l.name }}</span>
          <div class="lang-bar-wrap">
            <div class="lang-bar" :style="{ width: l.pct + '%' }"></div>
          </div>
          <span class="lang-pct mono">{{ l.pct }}%</span>
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

/* ---------- 语言占比卡 ---------- */
.langs {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: var(--font-small);
  color: var(--accent);
  margin-bottom: var(--space-2);
}

.lang-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.lang-row {
  display: grid;
  grid-template-columns: 80px 1fr 40px;
  align-items: center;
  gap: var(--space-1);
}

.lang-name {
  font-size: var(--font-small);
  color: var(--text-secondary);
}

.lang-bar-wrap {
  height: 8px;
  background: var(--bg-elevated);
  border-radius: 4px;
  overflow: hidden;
}

.lang-bar {
  height: 100%;
  background: var(--accent);
  border-radius: 4px;
  transition: width 600ms ease;
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
}
</style>
