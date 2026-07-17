<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 文案由 Astro 通过 props 传入（i18n）
const props = defineProps<{
  toLight: string
  toDark: string
}>()

const theme = ref<'dark' | 'light'>('dark')
const mounted = ref(false)

const apply = (t: 'dark' | 'light') => {
  theme.value = t
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('theme', t)
}

const toggle = () => {
  apply(theme.value === 'dark' ? 'light' : 'dark')
}

onMounted(() => {
  // 优先读 localStorage，其次系统偏好，默认深色
  const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  apply(saved ?? (prefersLight ? 'light' : 'dark'))
  mounted.value = true
})
</script>

<template>
  <button
    class="theme-toggle"
    :class="{ 'is-light': theme === 'light' }"
    @click="toggle"
    :title="theme === 'dark' ? props.toLight : props.toDark"
    :aria-label="theme === 'dark' ? props.toLight : props.toDark"
  >
    <!-- 仅在挂载后渲染，避免 SSR/CSR 不一致导致图标闪烁 -->
    <span v-if="mounted" class="icon">{{ theme === 'dark' ? '☀' : '☾' }}</span>
    <span v-else class="icon placeholder"></span>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  position: fixed;
  top: var(--space-3);
  right: var(--space-3);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--text-secondary);
  z-index: 100;
  transition: all var(--transition);

  &:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  .icon {
    line-height: 1;
    &.placeholder {
      width: 14px;
      height: 14px;
    }
  }
}

/* 固定在右上角，移动端也保持 */
@media (max-width: 640px) {
  .theme-toggle {
    top: var(--space-2);
    right: var(--space-2);
  }
}
</style>
