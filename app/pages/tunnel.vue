<template>
  <section class="tunnel">
    <header class="tunnel__header">
      <h1 class="tunnel__title">Tunnel Vision (glaucoma / retinitis pigmentosa)</h1>
      <p class="tunnel__lead">
        Peripheral vision can fade, leaving a narrow “tunnel”. Try to find and
        click the highlighted target while your view is restricted.
      </p>

      <div class="controls" aria-label="Tunnel vision controls">
        <label class="controls__label" for="radius">
          Tunnel size: <strong>{{ radius }}</strong>
        </label>
        <input
          id="radius"
          class="controls__range"
          type="range"
          min="70"
          max="260"
          step="10"
          v-model.number="radius"
        />
      </div>

      <p class="tunnel__note">
        Tip: Use your mouse to “scan”. In real life people scan with head/eye
        movements to compensate.
      </p>
    </header>

    <main class="tunnel__main">
      <section class="game" aria-label="Find the glowing dot">
        <div class="game__top" aria-live="polite">
          <p>Score: <strong>{{ score }}</strong> | Misses: <strong>{{ misses }}</strong></p>
          <p class="game__status">{{ status }}</p>
        </div>

        <div class="arena" @click.self="miss()" @mousemove="onMove" :style="maskStyle">
          <div class="mask" aria-hidden="true" />

          <button
            type="button"
            class="target"
            :style="{ left: `${targetX}%`, top: `${targetY}%` }"
            @click.stop="hit"
            aria-label="Target"
          />

          <div class="noise" aria-hidden="true" />
        </div>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLightCursor } from '~/composables/useLightCursor'

const { cssVars } = useLightCursor()

const radius = ref(170)
const score = ref(0)
const misses = ref(0)
const status = ref('Find the glowing dot. Click it.')

const targetX = ref(50)
const targetY = ref(50)

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const reposition = () => {
  targetX.value = randomBetween(8, 92)
  targetY.value = randomBetween(10, 90)
}

const hit = () => {
  score.value++
  status.value = 'Hit. New target.'
  reposition()
}

const miss = () => {
  misses.value++
  status.value = 'Miss. Scan again.'
}

const onMove = () => {
  // no-op: we use global cursor vars via useLightCursor (app shell updates them)
}

const maskStyle = computed(() => ({
  ...cssVars.value,
  '--radius': `${radius.value}px`,
}))

onMounted(() => {
  reposition()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('blindsite:achievement', {
        detail: { key: 'tunnel', text: 'Tunnel vision: you opened the tunnel simulation.' },
      })
    )
  }
})
</script>

<style scoped>
.tunnel {
  display: grid;
  gap: 2.5rem;
}

.tunnel__header {
  max-width: 52rem;
  display: grid;
  gap: 1rem;
}

.tunnel__title {
  font-size: clamp(2.2rem, 3.5vw, 2.8rem);
}

.tunnel__lead,
.tunnel__note {
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

/* darkness mask: only a circular area is visible around cursor */
.mask {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at var(--cursor-x) var(--cursor-y),
      rgba(255, 255, 255, 0.02) 0,
      rgba(255, 255, 255, 0.0) 20px,
      rgba(0, 0, 0, 0.98) var(--radius)
    );
  pointer-events: none;
  z-index: 2;
}

.target {
  position: absolute;
  z-index: 1;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(251, 191, 36, 0.85);
  background: rgba(251, 191, 36, 0.18);
  box-shadow:
    0 0 0 2px rgba(251, 191, 36, 0.12),
    0 0 30px rgba(251, 191, 36, 0.25);
  cursor: pointer;
}

.target:hover,
.target:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(251, 191, 36, 0.35),
    0 0 44px rgba(251, 191, 36, 0.35);
}

.noise {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.16), transparent 35%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.12), transparent 38%);
  pointer-events: none;
}
</style>
