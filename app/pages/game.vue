<template>
  <section class="blind-touch">
    <header class="blind-touch__header">
      <h1 class="blind-touch__title">Blind Touch – Visual Mode</h1>
      <p class="blind-touch__lead">
        This is a sound-guided grid. One hidden tile is the target. Use your
        ears and simple hints to find it.
      </p>
      <p class="blind-touch__instructions">
        Click tiles to guess. <strong>Higher pitch</strong> means you are
        closer. Sound pans <strong>left/right</strong> depending on the tile's
        position.
      </p>
      <button type="button" class="blind-touch__sound-btn" @click="enableSound">
        {{ audioReady ? 'Sound enabled' : 'Enable sound' }}
      </button>
    </header>

    <main class="blind-touch__main">
      <section
        class="blind-touch__arena"
        aria-label="Blind Touch style grid. Click tiles and listen to the sound to find the hidden target."
      >
        <div class="grid" @click="enableSound">
          <button
            v-for="cell in cells"
            :key="cell.id"
            type="button"
            class="grid__tile"
            @mouseenter="onTileHover(cell)"
            @focus="onTileHover(cell)"
            @click.stop="onTileClick(cell)"
          >
            <!-- Optional visual index to make it more game-like -->
            <span class="grid__tile-label">{{ cell.index + 1 }}</span>
          </button>
        </div>

        <div class="blind-touch__hud" aria-live="polite">
          <p><strong>Score:</strong> {{ score }}</p>
          <p><strong>Attempts:</strong> {{ attempts }}</p>
          <p class="blind-touch__status">{{ statusMessage }}</p>
        </div>
      </section>

      <section class="blind-touch__notes">
        <h2>Idea behind this mode</h2>
        <p>
          With vision, the grid is easy to scan. In a non-visual version, you
          would only hear the sounds and hints, building a mental picture from
          audio instead of sight.
        </p>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const gridSize = 4

interface Cell {
  id: string
  index: number
  x: number
  y: number
}

const attempts = ref(0)
const score = ref(0)
const statusMessage = ref('Click any tile to start guessing. Listen to pitch and left/right pan.')

const targetIndex = ref(0)

const targetX = computed(() => targetIndex.value % gridSize)
const targetY = computed(() => Math.floor(targetIndex.value / gridSize))

const cells = computed<Cell[]>(() => {
  const list: Cell[] = []
  let index = 0
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      list.push({ id: `${x}-${y}`, index, x, y })
      index++
    }
  }
  return list
})

// --- Audio setup (Web Audio) ---
const audioCtx = ref<AudioContext | null>(null)
const audioReady = ref(false)

const enableSound = () => {
  if (audioCtx.value || typeof window === 'undefined') return
  audioCtx.value = new AudioContext()
  audioReady.value = true
}

const playTone = (panValue: number, frequency: number, duration = 0.15) => {
  if (!audioCtx.value) return
  const ctx = audioCtx.value

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const panner = new StereoPannerNode(ctx, { pan: panValue })

  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.25, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

  osc.connect(gain).connect(panner).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

// Map a cell's x-position to stereo pan (-1 left, +1 right)
const panForCell = (cell: Cell) => {
  const normalizedX = cell.x / (gridSize - 1)
  return (normalizedX - 0.5) * 2 // -1..1
}

// Distance: lower is closer to the target
const distanceToTarget = (cell: Cell) => {
  const dx = Math.abs(cell.x - targetX.value)
  const dy = Math.abs(cell.y - targetY.value)
  return dx + dy
}

const resetRound = () => {
  const total = gridSize * gridSize
  targetIndex.value = Math.floor(Math.random() * total)
  statusMessage.value = 'New target hidden. Listen carefully and try again.'
}

// Hover/focus gives a subtle hint: closer = higher pitch, pan = cell position
const onTileHover = (cell: Cell) => {
  if (!audioCtx.value) return
  const dist = distanceToTarget(cell)
  const maxDist = (gridSize - 1) * 2
  const closeness = 1 - dist / maxDist // 0..1
  const baseFreq = 300
  const freqRange = 500
  const frequency = baseFreq + closeness * freqRange
  const pan = panForCell(cell)
  playTone(pan, frequency, 0.12)
}

const onTileClick = (cell: Cell) => {
  attempts.value++
  const pan = panForCell(cell)

  if (cell.index === targetIndex.value) {
    score.value++
    statusMessage.value = 'Correct tile! A new hidden tile has been chosen.'
    playTone(pan, 900, 0.2)
    resetRound()
    return
  }

  const dx = cell.x - targetX.value
  const dy = cell.y - targetY.value

  let hint = 'Not this one. '
  if (dx < 0) hint += 'The target is more to the right. '
  if (dx > 0) hint += 'The target is more to the left. '
  if (dy < 0) hint += 'The target is higher up. '
  if (dy > 0) hint += 'The target is lower down. '

  statusMessage.value = hint.trim()
  playTone(pan, 220, 0.18)
}

// Initialize first target index
resetRound()
</script>

<style scoped>
.blind-touch {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.blind-touch__header {
  display: grid;
  gap: 1rem;
}

.blind-touch__title {
  font-size: clamp(2rem, 3vw, 2.6rem);
}

.blind-touch__lead,
.blind-touch__instructions {
  max-width: 42rem;
  color: #e5e7eb;
}

.blind-touch__sound-btn {
  align-self: flex-start;
  margin-top: 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(17, 24, 39, 0.8);
  color: #e5e7eb;
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.blind-touch__sound-btn:hover,
.blind-touch__sound-btn:focus-visible {
  background: rgba(15, 23, 42, 0.95);
}

.blind-touch__main {
  display: grid;
  gap: 2.5rem;
}

.blind-touch__arena {
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 1.25rem;
  background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 3rem);
  grid-template-rows: repeat(4, 3rem);
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.grid__tile {
  border-radius: 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
}

.grid__tile:hover,
.grid__tile:focus-visible {
  border-color: #fbbf24;
  background: rgba(30, 64, 175, 0.8);
}

.grid__tile-label {
  opacity: 0.8;
}

.blind-touch__hud {
  font-size: 0.95rem;
  color: #e5e7eb;
}

.blind-touch__status {
  margin-top: 0.5rem;
}

.blind-touch__notes {
  max-width: 42rem;
  color: #e5e7eb;
}

.blind-touch__notes h2 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}
</style>
