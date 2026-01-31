<template>
  <section class="vs">
    <header class="vs__header">
      <h1 class="vs__title">Visual Snow (neurological)</h1>
      <p class="vs__lead">
        Some people experience continuous “static” across their vision, plus
        halos, afterimages, and light sensitivity. This is not a mental illness,
        but a neurological visual disturbance.
      </p>

      <div class="controls">
        <label class="controls__label" for="intensity">
          Intensity: <strong>{{ intensity }}</strong>
        </label>
        <input
          id="intensity"
          class="controls__range"
          type="range"
          min="0"
          max="100"
          step="5"
          v-model.number="intensity"
        />
      </div>
    </header>

    <div class="vs__stage" :style="{ '--noise-opacity': (intensity / 100).toString() }">
      <div class="vs__noise" aria-hidden="true" />
      <div class="vs__content">
        <h2 class="vs__subtitle">Try reading this</h2>
        <p>
          The goal is to communicate how distracting “visual noise” can be. It
          can make contrast and focus harder—especially on large areas or in low
          light.
        </p>
        <p>
          Tip: Use the slider to increase intensity. Compare how it feels on
          different pages.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const intensity = ref(35)

onMounted(() => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('blindsite:achievement', {
      detail: { key: 'visualsnow', text: 'Static vision: you discovered Visual Snow.' },
    })
  )
})

watch(intensity, (v) => {
  if (v >= 80 && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('blindsite:achievement', {
        detail: { key: 'snowstorm', text: 'Snowstorm: you cranked the static to 80%+.' },
      })
    )
  }
})
</script>

<style scoped>
.vs {
  display: grid;
  gap: 2rem;
}

.vs__header {
  max-width: 52rem;
  display: grid;
  gap: 1rem;
}

.vs__title {
  font-size: clamp(2.2rem, 3.5vw, 2.8rem);
}

.vs__lead {
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

.vs__stage {
  position: relative;
  border-radius: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(2, 6, 23, 0.45);
  overflow: hidden;
  min-height: 420px;
}

.vs__content {
  position: relative;
  z-index: 1;
  max-width: 56rem;
  padding: 1.5rem;
  color: rgba(248, 250, 252, 0.92);
  line-height: 1.75;
}

.vs__subtitle {
  margin: 0 0 0.8rem;
}

.vs__noise {
  position: absolute;
  inset: 0;
  opacity: calc(var(--noise-opacity) * 0.9);
  background-image:
    repeating-radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.12) 0 1px, transparent 1px 3px),
    repeating-radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.10) 0 1px, transparent 1px 4px);
  mix-blend-mode: screen;
  filter: contrast(1.1) blur(0.4px);
  animation: noise-drift 700ms steps(2, end) infinite;
}

@keyframes noise-drift {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(-2px, 1px, 0);
  }
  100% {
    transform: translate3d(1px, -2px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vs__noise {
    animation: none;
  }
}
</style>
