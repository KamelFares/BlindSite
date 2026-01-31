<template>
  <section class="retino">
    <header class="retino__header">
      <h1 class="retino__title">Diabetic Retinopathy (floaters + patches)</h1>
      <p class="retino__lead">
        Diabetic retinopathy can cause blurry areas, dark patches, and floaters.
        This simulation overlays moving “floaters” and patchy blur while you try
        to read and click the correct label.
      </p>

      <div class="controls" aria-label="Retinopathy controls">
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
    </header>

    <main class="retino__main">
      <section class="game" aria-label="Read the label mini-game">
        <div class="game__top" aria-live="polite">
          <p class="game__prompt">
            Task: Click the label <strong>“{{ target }}”</strong>
          </p>
          <p class="game__score">
            Score: <strong>{{ score }}</strong> | Mistakes: <strong>{{ mistakes }}</strong>
          </p>
        </div>

        <div class="stage" :style="stageStyle" @mousemove="onMove">
          <div class="overlay" aria-hidden="true">
            <div
              v-for="f in floaters"
              :key="f.id"
              class="floater"
              :style="{
                left: `${f.x}%`,
                top: `${f.y}%`,
                transform: `translate(-50%,-50%) scale(${f.s})`
              }"
            />
            <div
              v-for="p in patches"
              :key="p.id"
              class="patch"
              :style="{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.r}px`,
                height: `${p.r}px`,
                transform: 'translate(-50%,-50%)'
              }"
            />
          </div>

          <div class="labels">
            <button
              v-for="l in labels"
              :key="l"
              type="button"
              class="label"
              @click="pick(l)"
            >
              {{ l }}
            </button>
          </div>
        </div>

        <p class="game__hint">
          Tip: Increase severity and notice how “easy reading” becomes slow and
          frustrating.
        </p>
      </section>

      <section class="info">
        <h2>What this can represent</h2>
        <ul>
          <li>Blurred or missing patches</li>
          <li>Floaters that drift across the field of view</li>
          <li>Harder reading / recognizing small text</li>
        </ul>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type Floater = { id: number; x: number; y: number; vx: number; vy: number; s: number }
type Patch = { id: number; x: number; y: number; r: number }

const severity = ref(5)
const score = ref(0)
const mistakes = ref(0)

const allLabels = ['INSULIN', 'WATER', 'EXIT', 'HELP', 'CLINIC', 'PHARMACY']
const labels = ref<string[]>([])
const target = ref('EXIT')

const floaters = ref<Floater[]>([])
const patches = ref<Patch[]>([])
let raf: number | null = null
let nextId = 1

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const remakeRound = () => {
  // Pick 4 labels
  const shuffled = [...allLabels].sort(() => Math.random() - 0.5)
  labels.value = shuffled.slice(0, 4)
  target.value = labels.value[Math.floor(Math.random() * labels.value.length)]
}

const rebuildOverlay = () => {
  const s = severity.value
  const floaterCount = Math.round((s / 10) * 10) // 0..10
  const patchCount = Math.round((s / 10) * 6) // 0..6

  floaters.value = Array.from({ length: floaterCount }, () => {
    const id = nextId++
    return {
      id,
      x: randomBetween(5, 95),
      y: randomBetween(10, 90),
      vx: randomBetween(-0.02, 0.02),
      vy: randomBetween(-0.015, 0.015),
      s: randomBetween(0.8, 1.8),
    }
  })

  patches.value = Array.from({ length: patchCount }, () => {
    const id = nextId++
    return {
      id,
      x: randomBetween(10, 90),
      y: randomBetween(15, 85),
      r: randomBetween(90, 180) + s * 6,
    }
  })
}

const step = () => {
  const s = severity.value
  const speed = 1 + (s / 10) * 2
  for (const f of floaters.value) {
    f.x += f.vx * 60 * speed
    f.y += f.vy * 60 * speed
    if (f.x < -10) f.x = 110
    if (f.x > 110) f.x = -10
    if (f.y < -10) f.y = 110
    if (f.y > 110) f.y = -10
  }
  raf = window.requestAnimationFrame(step)
}

const pick = (label: string) => {
  if (label === target.value) {
    score.value++
    remakeRound()
  } else {
    mistakes.value++
  }
}

const stageStyle = computed(() => {
  const s = severity.value
  const blur = (s / 10) * 7
  const contrast = 1 - (s / 10) * 0.25
  return {
    '--stage-blur': `${blur.toFixed(2)}px`,
    '--stage-contrast': contrast.toFixed(2),
    '--overlay-opacity': (0.05 + (s / 10) * 0.22).toFixed(3),
  } as Record<string, string>
})

const onMove = () => {
  // placeholder: if later you want cursor-driven glare/blur, we can do it here
}

watch(severity, () => {
  rebuildOverlay()
})

onMounted(() => {
  remakeRound()
  rebuildOverlay()

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('blindsite:achievement', {
        detail: { key: 'retino', text: 'Patchy vision: you opened diabetic retinopathy.' },
      })
    )
  }

  raf = window.requestAnimationFrame(step)
})

onUnmounted(() => {
  if (raf) window.cancelAnimationFrame(raf)
})
</script>

<style scoped>
.retino {
  display: grid;
  gap: 2.5rem;
}

.retino__header {
  max-width: 52rem;
  display: grid;
  gap: 1rem;
}

.retino__title {
  font-size: clamp(2.2rem, 3.5vw, 2.8rem);
}

.retino__lead {
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

.retino__main {
  display: grid;
  gap: 2.5rem;
}

.game {
  max-width: 52rem;
}

.game__top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  color: #e5e7eb;
  margin-bottom: 0.75rem;
}

.stage {
  position: relative;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.75), rgba(2, 6, 23, 0.92));
  padding: 1.25rem;
  overflow: hidden;
  filter: blur(var(--stage-blur)) contrast(var(--stage-contrast));
}

.labels {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.label {
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.55);
  background: rgba(15, 23, 42, 0.7);
  color: rgba(248, 250, 252, 0.92);
  padding: 1.15rem;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.label:hover,
.label:focus-visible {
  outline: none;
  border-color: rgba(251, 191, 36, 0.85);
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: var(--overlay-opacity);
}

.floater {
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.0) 68%),
    radial-gradient(circle, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0) 62%);
  filter: blur(1px);
  mix-blend-mode: multiply;
}

.patch {
  position: absolute;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.15) 55%, rgba(0, 0, 0, 0.0) 74%);
  filter: blur(8px);
  mix-blend-mode: multiply;
}

.game__hint {
  margin-top: 0.75rem;
  color: #e5e7eb;
  opacity: 0.9;
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
</style>
