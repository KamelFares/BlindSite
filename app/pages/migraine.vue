<template>
  <section class="migraine">
    <header class="migraine__header">
      <h1 class="migraine__title">Migraine Aura (zig-zag / flashing scotoma)</h1>
      <p class="migraine__lead">
        Some migraine auras include shimmering zig-zag patterns and a blind spot.
        This simulation overlays a moving aura while you try to keep focus on a
        target.
      </p>

      <div class="controls" aria-label="Migraine aura controls">
        <label class="controls__label" for="intensity">Intensity: <strong>{{ intensity }}</strong></label>
        <input
          id="intensity"
          class="controls__range"
          type="range"
          min="0"
          max="10"
          step="1"
          v-model.number="intensity"
        />
      </div>
    </header>

    <main class="migraine__main">
      <section class="game" aria-label="Keep focus tracking">
        <div class="game__top" aria-live="polite">
          <p>Time: <strong>{{ seconds }}</strong>s | Hits: <strong>{{ hits }}</strong></p>
          <p class="game__status">{{ status }}</p>
        </div>

        <div class="arena" :style="arenaStyle">
          <div class="aura" aria-hidden="true" />
          <div class="scotoma" aria-hidden="true" />

          <button
            type="button"
            class="dot"
            :style="{ left: `${dotX}%`, top: `${dotY}%` }"
            @click="hit"
            aria-label="Moving target"
          />
        </div>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const intensity = ref(6)
const seconds = ref(0)
const hits = ref(0)
const status = ref('Click the moving dot.')

const dotX = ref(50)
const dotY = ref(50)
const auraAngle = ref(0)

let timer: number | null = null
let raf: number | null = null

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const moveDot = () => {
  dotX.value = randomBetween(10, 90)
  dotY.value = randomBetween(12, 88)
}

const hit = () => {
  hits.value++
  status.value = 'Hit.'
  moveDot()
}

const step = () => {
  auraAngle.value = (auraAngle.value + 0.6 + intensity.value * 0.18) % 360
  raf = window.requestAnimationFrame(step)
}

const arenaStyle = computed(() => {
  const i = intensity.value
  return {
    '--aura-opacity': (0.06 + (i / 10) * 0.26).toFixed(3),
    '--aura-rotate': `${auraAngle.value}deg`,
    '--scotoma-size': `${160 + i * 18}px`,
  } as Record<string, string>
})

onMounted(() => {
  moveDot()
  timer = window.setInterval(() => {
    seconds.value++
  }, 1000)
  raf = window.requestAnimationFrame(step)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('blindsite:achievement', {
        detail: { key: 'migraine', text: 'Aura: you opened migraine simulation.' },
      })
    )
  }
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
  if (raf) window.cancelAnimationFrame(raf)
})
</script>

<style scoped>
.migraine {
  display: grid;
  gap: 2.5rem;
}

.migraine__header {
  max-width: 52rem;
  display: grid;
  gap: 1rem;
}

.migraine__title {
  font-size: clamp(2.2rem, 3.5vw, 2.8rem);
}

.migraine__lead {
  color: #e5e7eb;
  line-height: 1.6;
}

.controls {
  display: grid;
  gap: 0.35rem;
  max-width: 28rem;
}

.controls__label {
  color: #e5e7eb;
}

.controls__range {
  width: 100%;
}

.game {
  max-width: 62rem;
}

.game__top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  color: #e5e7eb;
  margin-bottom: 0.75rem;
}

.arena {
  position: relative;
  height: min(72vh, 640px);
  border-radius: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  overflow: hidden;
  background: radial-gradient(circle at top, rgba(2, 6, 23, 0.55), rgba(0, 0, 0, 0.95));
}

.dot {
  position: absolute;
  z-index: 3;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(56, 189, 248, 0.9);
  background: rgba(56, 189, 248, 0.18);
  box-shadow: 0 0 36px rgba(56, 189, 248, 0.25);
  cursor: pointer;
}

.aura {
  position: absolute;
  inset: -40%;
  z-index: 1;
  opacity: var(--aura-opacity);
  transform: rotate(var(--aura-rotate));
  background:
    conic-gradient(
      from 0deg,
      rgba(255, 255, 255, 0) 0deg,
      rgba(255, 255, 255, 0.95) 18deg,
      rgba(255, 255, 255, 0) 36deg,
      rgba(255, 255, 255, 0.9) 54deg,
      rgba(255, 255, 255, 0) 72deg
    );
  filter: blur(0.5px);
  mix-blend-mode: screen;
  pointer-events: none;
}

.scotoma {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  width: var(--scotoma-size);
  height: var(--scotoma-size);
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0) 68%);
  filter: blur(10px);
  pointer-events: none;
}
</style>
