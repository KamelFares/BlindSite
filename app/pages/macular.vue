<template>
  <section class="macular">
    <header class="macular__header">
      <h1 class="macular__title">Macular Degeneration Simulation</h1>
      <p class="macular__lead">
        Macular degeneration can affect central vision. People may see a blur or
        dark spot in the center while peripheral vision remains.
      </p>

      <div class="controls">
        <label class="controls__label" for="difficulty">
          Difficulty: <strong>{{ difficultyLabel }}</strong>
        </label>
        <select id="difficulty" class="controls__select" v-model="difficulty">
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>

        <label class="controls__label" for="size">
          Central spot size: <strong>{{ spotSize }}</strong>
        </label>
        <input
          id="size"
          class="controls__range"
          type="range"
          min="80"
          max="260"
          step="10"
          v-model.number="spotSize"
        />
      </div>
    </header>

    <main class="macular__main">
      <section class="game" aria-label="Peripheral vision game">
        <div class="game__top" aria-live="polite">
          <p class="game__prompt">
            Task: Click the target shape <strong>{{ targetShape }}</strong>.
          </p>
          <p class="game__score">
            Score: <strong>{{ score }}</strong>
            | Misses: <strong>{{ misses }}</strong>
            | Time: <strong>{{ timeLeft }}</strong>s
          </p>
        </div>

        <div class="stage" @click="onStageClick" :style="stageStyle">
          <div class="spot" aria-hidden="true" />

          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="item"
            :class="{ 'item--target': item.shape === targetShape }"
            :style="{ left: `${item.x}px`, top: `${item.y}px` }"
            @click.stop="pick(item)"
            :aria-label="`Shape ${item.shape}`"
          >
            <span aria-hidden="true">{{ item.shape }}</span>
          </button>
        </div>

        <p class="game__hint">
          Hint: The center is blocked. Use the edges of the screen to spot the
          shapes and move your eyes around.
        </p>
      </section>

      <section class="info">
        <h2>Why this is hard</h2>
        <p>
          When central vision is affected, details in the middle can disappear.
          Reading, face recognition, and small targets can become difficult.
          People often learn to use a “preferred retinal location” by looking
          slightly away from what they want to see.
        </p>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type Item = {
  id: number
  x: number
  y: number
  shape: string
}

const spotSize = ref(160)
const score = ref(0)
const misses = ref(0)
const targetShape = ref('▲')
const items = ref<Item[]>([])

type Difficulty = 'easy' | 'normal' | 'hard'
const difficulty = ref<Difficulty>('normal')
const timeLeft = ref(25)
let timer: number | null = null

const difficultyLabel = computed(() => {
  if (difficulty.value === 'easy') return 'Easy'
  if (difficulty.value === 'hard') return 'Hard'
  return 'Normal'
})

const shapes = ['▲', '●', '■', '◆', '✚']

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const config = computed(() => {
  switch (difficulty.value) {
    case 'easy':
      return { count: 12, size: 56, padding: 18, start: 30, penalty: 1 }
    case 'hard':
      return { count: 22, size: 38, padding: 16, start: 18, penalty: 2 }
    default:
      return { count: 16, size: 48, padding: 18, start: 25, penalty: 1 }
  }
})

const stageStyle = computed(() => ({
  '--spot-size': `${spotSize.value}px`,
  '--item-size': `${config.value.size}px`,
}))

const layout = () => {
  if (typeof window === 'undefined') return

  const w = Math.min(900, window.innerWidth - 80)
  const h = 420
  const padding = config.value.padding

  const next: Item[] = []
  for (let i = 0; i < config.value.count; i++) {
    next.push({
      id: i,
      x: randomBetween(padding, w - padding),
      y: randomBetween(padding, h - padding),
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    })
  }

  items.value = next
  targetShape.value = shapes[Math.floor(Math.random() * shapes.length)]
}

const resetTimer = () => {
  timeLeft.value = config.value.start
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      // Timeout: new round + penalty
      misses.value += config.value.penalty
      resetTimer()
      layout()
    }
  }, 1000)
}

const pick = (item: Item) => {
  if (item.shape === targetShape.value) {
    score.value++
    // reward: add a little time on harder modes
    timeLeft.value = Math.min(config.value.start, timeLeft.value + 2)
    layout()
  } else {
    misses.value += config.value.penalty
  }
}

const onStageClick = () => {
  // Misclick in the dark
  misses.value += config.value.penalty
}

onMounted(() => {
  layout()
  resetTimer()

  // Hidden achievement: visiting the macular simulation
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('blindsite:achievement', {
        detail: {
          key: 'macular',
          text: 'Central vision: you reached the macular degeneration simulation.',
        },
      })
    )
  }
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

watch(difficulty, () => {
  // Make harder modes also increase scotoma by default
  if (difficulty.value === 'hard') spotSize.value = Math.max(spotSize.value, 190)
  resetTimer()
  layout()
})
</script>

<style scoped>
.macular {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.macular__header {
  display: grid;
  gap: 1rem;
  max-width: 52rem;
}

.macular__title {
  font-size: clamp(2.2rem, 3.5vw, 2.8rem);
}

.macular__lead {
  color: #e5e7eb;
  line-height: 1.6;
}

.controls {
  display: grid;
  gap: 0.35rem;
  max-width: 28rem;
}

.controls__select {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(15, 23, 42, 0.65);
  color: #e5e7eb;
  padding: 0.55rem 0.65rem;
}

.controls__label {
  color: #e5e7eb;
}

.controls__range {
  width: 100%;
}

.macular__main {
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
  /* More relatable: the game area is NOT pitch black so the central scotoma is visible */
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.03) 45%, rgba(0, 0, 0, 0.0) 70%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  height: 420px;
  overflow: hidden;
}

.spot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--spot-size);
  height: var(--spot-size);
  transform: translate(-50%, -50%);
  border-radius: 999px;
  /* Scotoma: looks like a blurry/washed-out spot with a darker core */
  background:
    radial-gradient(circle, rgba(0, 0, 0, 0.75) 0, rgba(0, 0, 0, 0.55) 45%, rgba(0, 0, 0, 0.0) 72%),
    radial-gradient(circle, rgba(255, 255, 255, 0.14) 0, rgba(255, 255, 255, 0.0) 65%);
  filter: blur(2px) contrast(1.05);
  pointer-events: none;
}

.spot::after {
  content: '';
  position: absolute;
  inset: -16px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.0) 70%);
  filter: blur(10px);
  opacity: 0.55;
}

.item {
  position: absolute;
  width: var(--item-size, 54px);
  height: var(--item-size, 54px);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.75);
  color: #e5e7eb;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 1.6rem;
}

.item:hover,
.item:focus-visible {
  border-color: rgba(251, 191, 36, 0.9);
  outline: none;
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
</style>
