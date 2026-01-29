<template>
  <section class="cataract-page">
    <header class="cataract-page__header">
      <h1 class="cataract-page__title">Cataract Simulation (Blur + Glare)</h1>
      <p class="cataract-page__lead">
        Cataracts can cause blurred vision, reduced contrast, and strong glare
        around lights. This page simulates that effect.
      </p>

      <div class="controls" aria-label="Cataract controls">
        <label class="controls__label" for="severity">
          Severity: <strong>{{ severity }}</strong>
        </label>
        <input
          id="severity"
          class="controls__range"
          type="range"
          min="0"
          max="10"
          step="1"
          v-model.number="severity"
        />
      </div>

      <p class="cataract-page__note">
        This is an empathy demo, not a medical tool.
      </p>
    </header>

    <main class="cataract-page__main">
      <section class="game" aria-label="Find the sign game">
        <div class="game__top" aria-live="polite">
          <p class="game__prompt">
            Task: <strong>Click the “{{ targetLabel }}”</strong> sign.
          </p>
          <p class="game__score">
            Score: <strong>{{ score }}</strong> | Mistakes:
            <strong>{{ mistakes }}</strong>
          </p>
        </div>

        <div class="scene" :style="sceneFilterStyle">
          <div class="scene__glare" :style="glareStyle" aria-hidden="true" />

          <div class="signs" aria-label="Signs">
            <button
              v-for="s in signs"
              :key="s.id"
              type="button"
              class="sign"
              :class="`sign--${s.tone}`"
              @click="onPick(s.label)"
            >
              <span class="sign__label">{{ s.label }}</span>
              <span class="sign__sub">{{ s.sub }}</span>
            </button>
          </div>

          <div class="lights" aria-hidden="true">
            <div class="light light--a" />
            <div class="light light--b" />
          </div>
        </div>

        <p class="game__hint">
          Tip: Increase severity to feel how glare + blur makes even simple
          reading harder.
        </p>
      </section>

      <section class="info">
        <h2>What cataracts can feel like</h2>
        <ul>
          <li>Blurred or cloudy vision</li>
          <li>Halos and glare from bright lights</li>
          <li>Reduced contrast (everything looks “washed out”)</li>
          <li>Harder reading, especially at night</li>
        </ul>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const severity = ref(4)

type Tone = 'blue' | 'green' | 'amber' | 'gray'

type Sign = {
  id: string
  label: string
  sub: string
  tone: Tone
}

const signs = ref<Sign[]>([
  { id: 'a', label: 'EXIT', sub: 'Doorway', tone: 'green' },
  { id: 'b', label: 'INFO', sub: 'Help desk', tone: 'blue' },
  { id: 'c', label: 'STOP', sub: 'Do not enter', tone: 'amber' },
  { id: 'd', label: 'WC', sub: 'Restroom', tone: 'gray' },
  { id: 'e', label: 'SHOP', sub: 'Market', tone: 'blue' },
  { id: 'f', label: 'LIFT', sub: 'Elevator', tone: 'gray' },
])

const score = ref(0)
const mistakes = ref(0)
const targetLabel = ref('EXIT')

const pickNewTarget = () => {
  const labels = signs.value.map((s) => s.label)
  targetLabel.value = labels[Math.floor(Math.random() * labels.length)]
}

const onPick = (label: string) => {
  if (label === targetLabel.value) {
    score.value++
    pickNewTarget()
  } else {
    mistakes.value++
  }
}

const sceneFilterStyle = computed(() => {
  // Severity 0..10
  const s = severity.value
  const blurPx = (s / 10) * 7 // up to ~7px blur
  const contrast = 1 - (s / 10) * 0.35 // down to 0.65
  const saturate = 1 - (s / 10) * 0.25 // down to 0.75
  const brightness = 1 + (s / 10) * 0.08
  return {
    filter: `blur(${blurPx.toFixed(2)}px) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)}) brightness(${brightness.toFixed(2)})`,
  }
})

const glareStyle = computed(() => {
  const s = severity.value
  // More severity = stronger glare opacity
  const opacity = 0.05 + (s / 10) * 0.22
  return {
    opacity: opacity.toFixed(3),
  }
})

pickNewTarget()
</script>

<style scoped>
.cataract-page {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.cataract-page__header {
  display: grid;
  gap: 1rem;
  max-width: 52rem;
}

.cataract-page__title {
  font-size: clamp(2.2rem, 3.5vw, 2.8rem);
}

.cataract-page__lead,
.cataract-page__note {
  color: #e5e7eb;
  line-height: 1.6;
  max-width: 52rem;
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

.cataract-page__main {
  display: grid;
  gap: 2.5rem;
}

.game {
  max-width: 52rem;
}

.game__top {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #e5e7eb;
}

.scene {
  position: relative;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.95));
  padding: 1.25rem;
  overflow: hidden;
}

.scene__glare {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.9), transparent 38%),
    radial-gradient(circle at 72% 30%, rgba(255, 255, 255, 0.7), transparent 42%),
    radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.5), transparent 46%);
  mix-blend-mode: screen;
  pointer-events: none;
}

.signs {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
}

.sign {
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.65);
  color: #e5e7eb;
  transition: transform 0.12s ease, border-color 0.12s ease;
}

.sign:hover,
.sign:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(251, 191, 36, 0.85);
  outline: none;
}

.sign__label {
  display: block;
  font-weight: 800;
  letter-spacing: 0.1em;
  font-size: 1.15rem;
}

.sign__sub {
  display: block;
  opacity: 0.85;
  margin-top: 0.25rem;
}

.sign--green {
  background: rgba(34, 197, 94, 0.18);
}

.sign--blue {
  background: rgba(56, 189, 248, 0.18);
}

.sign--amber {
  background: rgba(251, 191, 36, 0.18);
}

.sign--gray {
  background: rgba(148, 163, 184, 0.16);
}

.lights {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.light {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.75), transparent 60%);
  filter: blur(1px);
  opacity: 0.35;
}

.light--a {
  top: 0.75rem;
  left: 0.75rem;
}

.light--b {
  top: 1.4rem;
  right: 1.2rem;
}

.game__hint {
  color: #e5e7eb;
  opacity: 0.9;
  margin-top: 0.75rem;
}

.info {
  max-width: 52rem;
  color: #e5e7eb;
  line-height: 1.6;
}

.info h2 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.info ul {
  padding-left: 1.25rem;
  margin: 0;
}

.info li + li {
  margin-top: 0.4rem;
}

@media (max-width: 720px) {
  .signs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
