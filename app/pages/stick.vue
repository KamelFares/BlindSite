<template>
  <section class="stick-page">
    <header class="stick-page__header">
      <h1 class="stick-page__title">Cane Simulation (Audio Hunt)</h1>
      <p class="stick-page__lead">
        Find hidden targets using sound only. Your cane sends a “ping” and you
        must follow the audio cue (volume + stereo pan) to locate the target.
      </p>
      <p class="stick-page__instructions">
        Use <strong>arrow keys</strong> to move. Press <strong>Space</strong>
        to ping. When you think you’re on the target tile, press
        <strong>Enter</strong> to “pick up” the target.
      </p>
    </header>

    <main class="stick-page__main">
      <section
        class="stick-page__arena"
        tabindex="0"
        role="application"
        aria-label="Audio hunt cane game. Arrow keys to move. Space to ping. Enter to pick up the target."
        @keydown.prevent="onKeydown"
      >
        <div class="hud" aria-live="polite">
          <div class="hud__row">
            <span>Targets found: <strong>{{ found }}</strong> / {{ goalCount }}</span>
            <span>Moves: <strong>{{ moves }}</strong></span>
          </div>
          <div class="hud__row">
            <span>Last ping distance: <strong>{{ lastDistanceLabel }}</strong></span>
            <span v-if="isOnTarget" class="hud__hot">Target is here</span>
          </div>
        </div>

        <p class="stick-page__status" aria-live="polite">{{ message }}</p>

        <!-- Minimal visual: show only your position as a tiny dot (still mostly dark) -->
        <div class="mini" aria-hidden="true">
          <div
            class="mini__dot"
            :style="{ left: `${(playerX / (gridSize - 1)) * 100}%`, top: `${(playerY / (gridSize - 1)) * 100}%` }"
          />
        </div>
      </section>

      <section class="stick-page__notes">
        <h2>What this tries to show</h2>
        <p>
          In real life, people learn to map space through sound, touch and
          repetition. This mini-game exaggerates that: you must build a mental
          map and use audio cues to navigate.
        </p>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// Audio-only “target hunt”
const gridSize = 11
const goalCount = 3

const playerX = ref(5)
const playerY = ref(9)

type Target = { x: number; y: number; found: boolean }
const targets = ref<Target[]>([])

const found = computed(() => targets.value.filter((t) => t.found).length)
const moves = ref(0)
const message = ref('Press Space to ping. Use the sound to find targets.')
const lastDistance = ref<number | null>(null)

// --- Audio engine (beeps with stereo pan + volume based on distance) ---
const audioCtx = ref<AudioContext | null>(null)
const master = ref<GainNode | null>(null)
const panner = ref<StereoPannerNode | null>(null)
const beep = (distance: number, panValue: number) => {
  try {
    const ctx = audioCtx.value
    const m = master.value
    const p = panner.value
    if (!ctx || !m || !p) return

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    // closer = higher pitch
    osc.frequency.value = 250 + Math.max(0, 220 - distance * 12)

    const gain = ctx.createGain()
    const volume = Math.max(0.02, Math.min(0.35, 0.35 - distance * 0.03))
    gain.gain.value = 0

    // Set pan instantly for the ping
    p.pan.setValueAtTime(panValue, ctx.currentTime)

    osc.connect(gain).connect(p)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.26)

    osc.start()
    osc.stop(ctx.currentTime + 0.28)
  } catch {
    // ignore
  }
}

const ensureAudio = async () => {
  if (audioCtx.value) return
  audioCtx.value = new AudioContext()
  const ctx = audioCtx.value
  const m = ctx.createGain()
  m.gain.value = 0.35
  const p = new StereoPannerNode(ctx, { pan: 0 })
  p.connect(m).connect(ctx.destination)
  master.value = m
  panner.value = p
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const spawnTargets = () => {
  const next: Target[] = []
  while (next.length < goalCount) {
    const x = randomInt(0, gridSize - 1)
    const y = randomInt(0, gridSize - 1)
    // avoid starting near player
    const d = Math.abs(x - playerX.value) + Math.abs(y - playerY.value)
    if (d < 4) continue
    if (next.some((t) => t.x === x && t.y === y)) continue
    next.push({ x, y, found: false })
  }
  targets.value = next
}

const nearestTarget = computed(() => {
  const remaining = targets.value.filter((t) => !t.found)
  if (remaining.length === 0) return null
  let best = remaining[0]
  let bestDist = Infinity
  for (const t of remaining) {
    const d = Math.abs(t.x - playerX.value) + Math.abs(t.y - playerY.value)
    if (d < bestDist) {
      bestDist = d
      best = t
    }
  }
  return { target: best, dist: bestDist }
})

const isOnTarget = computed(() => {
  return targets.value.some((t) => !t.found && t.x === playerX.value && t.y === playerY.value)
})

const lastDistanceLabel = computed(() => {
  if (lastDistance.value === null) return '—'
  if (lastDistance.value === 0) return 'here'
  if (lastDistance.value <= 2) return 'very close'
  if (lastDistance.value <= 5) return 'close'
  if (lastDistance.value <= 9) return 'far'
  return 'very far'
})

const move = (dx: number, dy: number) => {
  const nx = playerX.value + dx
  const ny = playerY.value + dy
  if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) {
    message.value = 'Wall. You cannot go further.'
    return
  }
  playerX.value = nx
  playerY.value = ny
  moves.value++
  message.value = 'Step.'
}

const ping = async () => {
  await ensureAudio()
  const best = nearestTarget.value
  if (!best) {
    message.value = 'No targets left.'
    return
  }

  lastDistance.value = best.dist
  // pan based on relative x (-1..1)
  const dx = best.target.x - playerX.value
  const panValue = Math.max(-1, Math.min(1, dx / 4))
  message.value = 'Ping… follow the sound.'
  beep(best.dist, panValue)
}

const pickup = () => {
  const t = targets.value.find((tt) => !tt.found && tt.x === playerX.value && tt.y === playerY.value)
  if (!t) {
    message.value = 'Nothing here.'
    return
  }

  t.found = true
  message.value = 'Found it.'
  lastDistance.value = 0
  // Achievement
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('blindsite:achievement', {
        detail: { key: 'finder', text: 'Seeker: you found a target by sound.' },
      })
    )
  }

  if (found.value >= goalCount) {
    message.value = `All targets found in ${moves.value} moves. Great job.`
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('blindsite:achievement', {
          detail: { key: 'caneMaster', text: 'Cane master: you completed the audio hunt.' },
        })
      )
    }
  }
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
      ping()
      break
    case 'Enter':
      pickup()
      break
  }
}

onMounted(() => {
  spawnTargets()
  // Achievement: entered the cane page
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('blindsite:achievement', {
        detail: { key: 'cane', text: 'Navigator: you started the cane audio hunt.' },
      })
    )
  }
})
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

.hud {
  display: grid;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
  color: rgba(229, 231, 235, 0.95);
  font-size: 0.95rem;
}

.hud__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.hud__hot {
  color: #fbbf24;
  font-weight: 700;
}

.stick-page__status {
  color: rgba(229, 231, 235, 0.92);
  margin: 0 0 1.1rem;
}

.mini {
  position: relative;
  height: 260px;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.mini__dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  background: rgba(251, 191, 36, 0.9);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.35);
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
