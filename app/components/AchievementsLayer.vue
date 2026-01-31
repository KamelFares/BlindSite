<template>
  <div class="achievements" aria-live="polite" aria-atomic="true">
    <div v-for="toast in toasts" :key="toast.id" class="toast">
      <div class="toast__title">Achievement</div>
      <div class="toast__body">{{ toast.text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type Toast = { id: number; text: string }

const STORAGE_KEY = 'blindsite:achievements:v1'
const achieved = ref<Record<string, true>>({})

const toasts = ref<Toast[]>([])
let nextToastId = 1

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    achieved.value = raw ? (JSON.parse(raw) as Record<string, true>) : {}
  } catch {
    achieved.value = {}
  }
}

const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achieved.value))
  } catch {
    // ignore
  }
}

const award = (key: string, text: string) => {
  if (achieved.value[key]) return
  achieved.value = { ...achieved.value, [key]: true }
  save()

  const id = nextToastId++
  toasts.value = [...toasts.value, { id, text }]
  window.setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 4200)
}

const onAchievementEvent = (event: Event) => {
  const e = event as CustomEvent<{ key: string; text: string }>
  if (!e.detail?.key || !e.detail?.text) return
  award(e.detail.key, e.detail.text)
}

// Expose a tiny global helper for local debugging (optional)
const installDebug = () => {
  ;(window as any).awardAchievement = (key: string, text: string) => award(key, text)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  load()
  window.addEventListener('blindsite:achievement', onAchievementEvent)
  installDebug()
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('blindsite:achievement', onAchievementEvent)
})
</script>

<style scoped>
.achievements {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 50;
  display: grid;
  gap: 0.65rem;
  pointer-events: none;
}

.toast {
  width: min(360px, calc(100vw - 2rem));
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(10px);
  padding: 0.75rem 0.9rem;
  color: rgba(248, 250, 252, 0.92);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.65);
  animation: toast-in 220ms ease-out;
}

.toast__title {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.85;
}

.toast__body {
  margin-top: 0.25rem;
  font-size: 0.95rem;
  line-height: 1.35;
}

@keyframes toast-in {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
