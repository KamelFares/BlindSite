<template>
  <section class="stick-page">
    <header class="stick-page__header">
      <h1 class="stick-page__title">Cane Navigation Simulation</h1>
      <p class="stick-page__lead">
        Imagine you are walking in a room with a white cane. You cannot see the
        room – you can only move step by step and "tap" with your cane to
        discover walls and obstacles.
      </p>
      <p class="stick-page__instructions">
        Use the <strong>arrow keys</strong> to move and press
        <strong>Space</strong> to tap the cane in front of you.
      </p>
    </header>

    <main class="stick-page__main">
      <section
        class="stick-page__arena"
        tabindex="0"
        role="application"
        aria-label="Cane navigation simulation. Use arrow keys to move and space to tap."
        @keydown.prevent="onKeydown"
      >
        <div class="grid" aria-hidden="true">
          <div
            v-for="cell in cells"
            :key="cell.id"
            class="grid__cell"
            :class="{
              'grid__cell--player': cell.isPlayer,
              'grid__cell--goal': cell.isGoal,
              'grid__cell--obstacle': cell.isObstacle,
            }"
          >
            <span v-if="cell.isPlayer" aria-hidden="true">🧍‍♂️</span>
            <span v-else-if="cell.isGoal" aria-hidden="true">🚪</span>
            <span v-else-if="cell.isObstacle" aria-hidden="true">⬛</span>
          </div>
        </div>

        <div class="stick-page__status" aria-live="polite">
          <p class="stick-page__status-line">
            {{ positionDescription }}
          </p>
          <p class="stick-page__status-line">
            {{ caneFeedback }}
          </p>
        </div>
      </section>

      <section class="stick-page__notes">
        <h2>What this tries to show</h2>
        <p>
          Moving around without vision can feel slow and uncertain. Each step
          needs checking. The cane translates shapes and distances into taps and
          vibrations, instead of clear images.
        </p>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const gridSize = 5

const playerX = ref(2)
const playerY = ref(4)

const goalX = 2
const goalY = 0

// Simple set of obstacles in the room
const obstacles = [
  { x: 1, y: 2 },
  { x: 2, y: 2 },
  { x: 3, y: 2 },
  { x: 0, y: 3 },
  { x: 4, y: 3 },
]

const caneFeedback = ref('Press Space to tap the cane in front of you.')

const cells = computed(() => {
  const list: Array<{
    id: string
    x: number
    y: number
    isPlayer: boolean
    isGoal: boolean
    isObstacle: boolean
  }> = []

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const id = `${x}-${y}`
      const isPlayer = x === playerX.value && y === playerY.value
      const isGoal = x === goalX && y === goalY
      const isObstacle = obstacles.some((o) => o.x === x && o.y === y)
      list.push({ id, x, y, isPlayer, isGoal, isObstacle })
    }
  }

  return list
})

const positionDescription = computed(() => {
  if (playerX.value === goalX && playerY.value === goalY) {
    return 'You have found the door. Imagine the feeling of reaching a safe exit.'
  }
  return `You are somewhere in the room. You know the door is at the far side, but you cannot see it. Move slowly and tap with the cane.`
})

const isBlocked = (x: number, y: number) => {
  if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return true
  return obstacles.some((o) => o.x === x && o.y === y)
}

const move = (dx: number, dy: number) => {
  const nextX = playerX.value + dx
  const nextY = playerY.value + dy

  if (nextX < 0 || nextY < 0 || nextX >= gridSize || nextY >= gridSize) {
    caneFeedback.value = 'Your cane hits a solid wall. You cannot go further this way.'
    return
  }

  if (isBlocked(nextX, nextY)) {
    caneFeedback.value = 'The cane touches an obstacle in front of you. You feel a hard object blocking the way.'
    return
  }

  playerX.value = nextX
  playerY.value = nextY
  caneFeedback.value = 'The floor feels clear. You carefully take a step forward.'
}

const tapCane = () => {
  const aheadX = playerX.value
  const aheadY = playerY.value - 1

  if (aheadY < 0) {
    caneFeedback.value = 'When you tap ahead, the cane meets a wall. You have reached the top of the room.'
    return
  }

  if (obstacles.some((o) => o.x === aheadX && o.y === aheadY)) {
    caneFeedback.value = 'The cane quickly taps something in front of you. There is an obstacle ahead.'
    return
  }

  if (aheadX === goalX && aheadY === goalY) {
    caneFeedback.value = 'The cane finds the outline of a doorway. You have discovered the exit.'
    return
  }

  caneFeedback.value = 'The cane finds only empty floor ahead. It feels safe to move forward.'
}

const onKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowUp':
      move(0, -1)
      break
    case 'ArrowDown':
      move(0, 1)
      break
    case 'ArrowLeft':
      move(-1, 0)
      break
    case 'ArrowRight':
      move(1, 0)
      break
    case ' ':
    case 'Spacebar':
      tapCane()
      break
  }
}
</script>

<style scoped>
.stick-page {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.stick-page__header {
  display: grid;
  gap: 1rem;
}

.stick-page__title {
  font-size: clamp(2rem, 3vw, 2.6rem);
}

.stick-page__lead,
.stick-page__instructions {
  max-width: 42rem;
  color: #e5e7eb;
}

.stick-page__main {
  display: grid;
  gap: 2.5rem;
}

.stick-page__arena {
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 1.25rem;
  background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%);
  outline: none;
}

.stick-page__arena:focus-visible {
  box-shadow: 0 0 0 2px #f97316;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 2.3rem);
  grid-template-rows: repeat(5, 2.3rem);
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.grid__cell {
  border-radius: 0.35rem;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.grid__cell--player {
  background: #fbbf24;
}

.grid__cell--goal {
  background: #22c55e;
}

.grid__cell--obstacle {
  background: #4b5563;
}

.stick-page__status {
  font-size: 0.95rem;
  color: #e5e7eb;
}

.stick-page__status-line + .stick-page__status-line {
  margin-top: 0.5rem;
}

.stick-page__notes {
  max-width: 42rem;
  color: #e5e7eb;
}

.stick-page__notes h2 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}
</style>
