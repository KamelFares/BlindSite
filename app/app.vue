<template>
  <div class="app-root" @mousemove="onPointerMove">
    <NuxtRouteAnnouncer />

    <a href="#main" class="skip-link">Skip to main content</a>

    <div
      v-if="lightEnabled"
      class="light-overlay"
      :style="overlayStyle"
      aria-hidden="true"
    />

    <header class="top-bar">
      <div class="top-bar__title">BlindSite</div>
      <nav class="top-bar__nav" aria-label="Main modes">
        <NuxtLink to="/" class="top-bar__link">Light cone mode</NuxtLink>
        <NuxtLink to="/stick" class="top-bar__link">Cane simulation</NuxtLink>
        <NuxtLink to="/game" class="top-bar__link">Blind Touch game</NuxtLink>
        <NuxtLink to="/colors" class="top-bar__link">Color vision game</NuxtLink>
        <NuxtLink to="/cataract" class="top-bar__link">Cataract (blur + glare)</NuxtLink>
      </nav>
      <button
        type="button"
        class="top-bar__toggle"
        @click="toggleLight"
        :aria-pressed="lightEnabled ? 'true' : 'false'"
      >
        {{ lightEnabled ? 'Disable light effect' : 'Enable light effect' }}
      </button>
    </header>

    <AudioLayer />

    <main id="main" class="app-main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
// Light + audio experience composable & layer
// In Nuxt 3, `~/` resolves to the srcDir (here: `app/`).
import { useLightCursor } from '~/composables/useLightCursor'
import AudioLayer from '~/components/AudioLayer.vue'

const {
  lightEnabled,
  cssVars,
  updateFromPointer,
  toggleLight,
} = useLightCursor()

const onPointerMove = (event: MouseEvent) => {
  updateFromPointer(event)
}

const overlayStyle = cssVars
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  background: radial-gradient(circle at top, #111827 0, #020617 50%, #000 100%);
  color: #f9fafb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  position: relative;
  overflow: hidden;
}

.app-main {
  position: relative;
  z-index: 1;
  padding: 5rem 1.5rem 3rem;
  max-width: 960px;
  margin: 0 auto;
}

.top-bar {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  backdrop-filter: blur(16px);
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.95),
    rgba(15, 23, 42, 0.7),
    transparent
  );
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
}

.top-bar__title {
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e5e7eb;
}

.top-bar__nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.top-bar__link {
  font-size: 0.85rem;
  color: #e5e7eb;
  text-decoration: none;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid transparent;
}

.top-bar__link:hover,
.top-bar__link:focus-visible {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(248, 250, 252, 0.4);
}

.top-bar__toggle {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(17, 24, 39, 0.8);
  color: #e5e7eb;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.top-bar__toggle:hover {
  background: rgba(15, 23, 42, 0.95);
}

.light-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(
      circle at var(--cursor-x) var(--cursor-y),
      rgba(249, 250, 251, 0.1) 0,
      rgba(249, 250, 251, 0.02) 80px,
      rgba(0, 0, 0, 0.98) 200px
    );
}

/* Accessibility: skip link */
.skip-link {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -200%);
  top: 0.75rem;
  z-index: 3;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  color: #0f172a;
  border-radius: 999px;
  font-size: 0.85rem;
  text-decoration: none;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.skip-link:focus-visible {
  transform: translate(-50%, 0);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
}
</style>
