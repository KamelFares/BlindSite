<template>
  <section class="colors-page">
    <header class="colors-page__header">
      <h1 class="colors-page__title">Color Vision Challenge</h1>
      <p class="colors-page__lead">
        This is a simple game inspired by color-blindness tests. In each round,
        one circle has a slightly different color. Try to find it.
      </p>
      <p class="colors-page__note">
        This is <strong>not</strong> a medical test. Real color-vision
        diagnosis must be done by an eye-care professional.
      </p>
    </header>

    <main class="colors-page__main">
      <section class="colors-page__arena" aria-label="Color vision game">
        <p class="colors-page__instructions">
          Round {{ round }} / {{ totalRounds }} — Click the circle that looks
          different.
        </p>

        <div class="colors-grid">
          <button
            v-for="tile in tiles"
            :key="tile.id"
            type="button"
            class="colors-grid__tile"
            :style="{ background: tile.color }"
            @click="handleTileClick(tile)"
            aria-label="Color choice"
          ></button>
        </div>

        <div class="colors-page__hud" aria-live="polite">
          <p><strong>Correct:</strong> {{ correct }}</p>
          <p><strong>Wrong:</strong> {{ wrong }}</p>
          <p class="colors-page__status">{{ statusMessage }}</p>
        </div>
      </section>

      <section class="colors-page__info">
        <h2>What does this show?</h2>
        <p>
          Many color-blind people can see colors, but some shades are hard to
          tell apart. Red and green, or blue and purple, might look almost the
          same. When websites use only color to show important information, it
          can be confusing.
        </p>
        <p>
          Good design adds patterns, icons or text labels so that you do not
          have to rely on color alone.
        </p>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Tile {
  id: number
  color: string
  isTarget: boolean
}

const gridSize = 4
const totalRounds = 10

const round = ref(1)
const correct = ref(0)
const wrong = ref(0)
const statusMessage = ref('Click the circle that looks different from the others.')

const tiles = ref<Tile[]>([])

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const makeRound = () => {
  const baseHue = Math.floor(randomBetween(0, 360))

  const type = Math.random() < 0.5 ? 'red-green' : 'blue-purple'

  let baseColor: string
  let targetColor: string

  if (type === 'red-green') {
    baseColor = `hsl(${baseHue}, 70%, 45%)`
    targetColor = `hsl(${(baseHue + 20) % 360}, 70%, 45%)`
  } else {
    baseColor = `hsl(${baseHue}, 55%, 45%)`
    targetColor = `hsl(${(baseHue + 18) % 360}, 55%, 50%)`
  }

  const totalTiles = gridSize * gridSize
  const targetIndex = Math.floor(Math.random() * totalTiles)

  const nextTiles: Tile[] = []
  for (let i = 0; i < totalTiles; i++) {
    nextTiles.push({
      id: i,
      color: i === targetIndex ? targetColor : baseColor,
      isTarget: i === targetIndex,
    })
  }

  tiles.value = nextTiles
  statusMessage.value = 'Click the circle that looks different from the others.'
}

const handleTileClick = (tile: Tile) => {
  if (round.value > totalRounds) {
    statusMessage.value = 'Game over. Refresh the page to play again.'
    return
  }

  if (tile.isTarget) {
    correct.value++
    statusMessage.value = 'Correct! A new set of colors is coming up.'
  } else {
    wrong.value++
    statusMessage.value = 'This one matches the others. Look again carefully at the next round.'
  }

  round.value++
  if (round.value <= totalRounds) {
    makeRound()
  } else {
    statusMessage.value += ' You finished all rounds.'
  }
}

makeRound()
</script>

<style scoped>
.colors-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.colors-page__header {
  display: grid;
  gap: 1rem;
  max-width: 44rem;
}

.colors-page__title {
  font-size: clamp(2.2rem, 3.5vw, 2.8rem);
}

.colors-page__lead,
.colors-page__note {
  color: #e5e7eb;
  line-height: 1.6;
}

.colors-page__main {
  display: grid;
  gap: 2.5rem;
}

.colors-page__arena {
  max-width: 44rem;
}

.colors-page__instructions {
  margin-bottom: 1rem;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(4, 4.25rem);
  grid-template-rows: repeat(4, 4.25rem);
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.colors-grid__tile {
  border-radius: 999px;
  border: 2px solid rgba(15, 23, 42, 0.9);
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.4), 0 4px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.colors-grid__tile:hover,
.colors-grid__tile:focus-visible {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 0 0 2px #fbbf24, 0 8px 24px rgba(0, 0, 0, 0.7);
}

.colors-page__hud {
  font-size: 0.95rem;
  color: #e5e7eb;
}

.colors-page__status {
  margin-top: 0.5rem;
}

.colors-page__info {
  max-width: 44rem;
  color: #e5e7eb;
  line-height: 1.6;
}

.colors-page__info h2 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}
</style>
