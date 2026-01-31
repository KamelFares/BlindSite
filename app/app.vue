<template>
  <div
    class="app-root"
    :style="cssVars"
    @mousemove="onPointerMove"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu.prevent
  >
    <NuxtRouteAnnouncer />

    <a href="#main" class="skip-link">{{ t('nav.skip') }}</a>

    <div
      v-if="lightEnabled"
      class="light-overlay"
      :style="overlayStyle"
      aria-hidden="true"
    />

    <!-- Cursor effects: left click = echo, right click = screen flash -->
    <div class="cursor-effects" aria-hidden="true">
      <div
        v-for="echo in echoes"
        :key="echo.id"
        class="cursor-echo"
        :style="{ left: `${echo.x}px`, top: `${echo.y}px` }"
      />
      <div
        v-for="flash in flashes"
        :key="flash.id"
        class="screen-flash"
        :style="{ '--flash-x': `${flash.x}px`, '--flash-y': `${flash.y}px` }"
      />

      <!-- Right-click hold: keep a "torch flash" on while the button is held down -->
      <div
        v-if="flashHeld"
        class="screen-flash screen-flash--held"
        :style="{ '--flash-x': `${flashHeldX}px`, '--flash-y': `${flashHeldY}px` }"
      />
    </div>

    <header class="top-bar">
      <div class="top-bar__title top-bar__title--blink">BlindSite</div>
      <nav class="top-bar__nav" aria-label="Main modes">
        <NuxtLink :to="localePath('/')" class="top-bar__link">{{ t('nav.light') }}</NuxtLink>
        <NuxtLink :to="localePath('/stick')" class="top-bar__link">{{ t('nav.cane') }}</NuxtLink>
        <NuxtLink :to="localePath('/game')" class="top-bar__link">{{ t('nav.blindTouch') }}</NuxtLink>
        <NuxtLink :to="localePath('/colors')" class="top-bar__link">{{ t('nav.colorVision') }}</NuxtLink>
        <NuxtLink :to="localePath('/cataract')" class="top-bar__link">{{ t('nav.cataract') }}</NuxtLink>
        <NuxtLink :to="localePath('/macular')" class="top-bar__link">{{ t('nav.macular') }}</NuxtLink>
        <NuxtLink :to="localePath('/visual-snow')" class="top-bar__link">{{ t('nav.visualSnow') }}</NuxtLink>
        <NuxtLink :to="localePath('/retinopathy')" class="top-bar__link">{{ t('nav.retinopathy') }}</NuxtLink>
        <NuxtLink :to="localePath('/tunnel')" class="top-bar__link">{{ t('nav.tunnel') }}</NuxtLink>
        <NuxtLink :to="localePath('/migraine')" class="top-bar__link">{{ t('nav.migraine') }}</NuxtLink>
      </nav>

      <div class="top-bar__right">
        <label class="lang" :aria-label="t('nav.language')">
          <select
            class="lang__select"
            :value="locale"
            @change="onLocaleChange(($event.target as HTMLSelectElement).value)"
          >
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>
        </label>

        <button
          type="button"
          class="top-bar__toggle"
          @click="toggleLight"
          :aria-pressed="lightEnabled ? 'true' : 'false'"
        >
          {{ lightEnabled ? t('nav.toggleLightOff') : t('nav.toggleLightOn') }}
        </button>
      </div>
    </header>

    <AudioLayer />
    <AchievementsLayer />

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
import AchievementsLayer from '~/components/AchievementsLayer.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n, useLocalePath, useSwitchLocalePath } from '#imports'

const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const onLocaleChange = async (next: string) => {
  // Keep URL in sync with selected locale (prefix strategy)
  const target = switchLocalePath(next as any)
  if (target) {
    await router.push(target)
  }
  await setLocale(next as any)
}

// Achievement: switch language at least once
let firstLocale = locale.value
watch(
  () => locale.value,
  (next) => {
    if (next !== firstLocale) {
      dispatchAchievement('polyglot', 'Polyglot: you switched the language.')
      firstLocale = next
    }
  }
)

const {
  lightEnabled,
  cssVars,
  updateFromPointer,
  toggleLight,
} = useLightCursor()

// --- Achievements (hidden features) ---
let lastX = 0
let lastY = 0
let traveled = 0
let torchTimer: number | null = null

const dispatchAchievement = (key: string, text: string) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('blindsite:achievement', { detail: { key, text } }))
}

const trackDistance = (event: MouseEvent) => {
  if (!lastX && !lastY) {
    lastX = event.clientX
    lastY = event.clientY
    return
  }
  const dx = event.clientX - lastX
  const dy = event.clientY - lastY
  traveled += Math.sqrt(dx * dx + dy * dy)
  lastX = event.clientX
  lastY = event.clientY

  if (traveled > 8000) {
    dispatchAchievement('explorer', 'Explorer: you searched the darkness for a while.')
    traveled = -999999 // prevent repeated dispatch
  }
}

const onPointerMove = (event: MouseEvent) => {
  updateFromPointer(event)

  // If right mouse is held, keep the flash centered under the cursor
  // event.buttons bitmask: 2 = right mouse button
  if (flashHeld.value && (event.buttons & 2) === 2) {
    flashHeldX.value = event.clientX
    flashHeldY.value = event.clientY
  }

  trackDistance(event)
}

type Echo = { id: number; x: number; y: number }
type Flash = { id: number; x: number; y: number }

const echoes = ref<Echo[]>([])
const flashes = ref<Flash[]>([])
const flashHeld = ref(false)
const flashHeldX = ref(0)
const flashHeldY = ref(0)
let nextEffectId = 1
let echoCount = 0

const spawnEcho = (x: number, y: number) => {
  // Multi-pulse "sonar" echo
  const delays = [0, 140, 280]
  for (const delay of delays) {
    const id = nextEffectId++
    setTimeout(() => {
      echoes.value.push({ id, x, y })
      echoCount++
      if (echoCount === 10) {
        dispatchAchievement('echo10', 'Echolocator: you used 10 echoes.')
      }
      setTimeout(() => {
        echoes.value = echoes.value.filter((e) => e.id !== id)
      }, 900)
    }, delay)
  }
}

const spawnFlash = (x: number, y: number) => {
  // Quick double flash
  const delays = [0, 120]
  for (const delay of delays) {
    const id = nextEffectId++
    setTimeout(() => {
      flashes.value.push({ id, x, y })
      setTimeout(() => {
        flashes.value = flashes.value.filter((f) => f.id !== id)
      }, 320)
    }, delay)
  }
}

const onPointerDown = (event: PointerEvent) => {
  // 0 = left click, 2 = right click
  if (event.button === 0) {
    spawnEcho(event.clientX, event.clientY)
  } else if (event.button === 2) {
    // quick flash + then keep a held flash until user releases right click
    spawnFlash(event.clientX, event.clientY)
    flashHeld.value = true
    flashHeldX.value = event.clientX
    flashHeldY.value = event.clientY

    // Hidden achievement: hold the torch for 2 seconds
    if (torchTimer) window.clearTimeout(torchTimer)
    torchTimer = window.setTimeout(() => {
      dispatchAchievement('torch', 'Torch keeper: you held the flash for 2 seconds.')
    }, 2000)
  }
}

const onPointerUp = (event: PointerEvent) => {
  if (event.button === 2) {
    flashHeld.value = false
    if (torchTimer) {
      window.clearTimeout(torchTimer)
      torchTimer = null
    }
  }
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
  max-width: 1280px;
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
    rgba(0, 0, 0, 0.92),
    rgba(0, 0, 0, 0.62),
    transparent
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.top-bar__title {
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(248, 250, 252, 0.9);
}

/* Subtle blink: respectful (disabled for prefers-reduced-motion) */
.top-bar__title--blink {
  animation: title-blink 4.6s ease-in-out infinite;
}

@keyframes title-blink {
  0%,
  86% {
    opacity: 0.92;
  }
  90% {
    opacity: 0.32;
  }
  93% {
    opacity: 0.92;
  }
  96% {
    opacity: 0.45;
  }
  100% {
    opacity: 0.92;
  }
}

@media (prefers-reduced-motion: reduce) {
  .top-bar__title--blink {
    animation: none;
  }
}

.top-bar__nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  /* responsive: allow horizontal scroll instead of squishing */
  overflow-x: auto;
  scrollbar-width: none;
}

.top-bar__nav::-webkit-scrollbar {
  display: none;
}

.top-bar__right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 0 0 auto;
}

.lang {
  display: inline-flex;
  align-items: center;
}

.lang__select {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(248, 250, 252, 0.9);
  padding: 0.35rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.lang__select:focus-visible {
  outline: 2px solid rgba(251, 191, 36, 0.9);
  outline-offset: 2px;
}

.top-bar__link {
  font-size: 0.85rem;
  color: rgba(248, 250, 252, 0.88);
  text-decoration: none;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid transparent;
}

.top-bar__link:hover,
.top-bar__link:focus-visible {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.22);
}

.top-bar__toggle {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(248, 250, 252, 0.9);
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.top-bar__toggle:hover {
  background: rgba(255, 255, 255, 0.12);
}

@media (max-width: 880px) {
  .top-bar {
    padding: 0.65rem 0.9rem;
  }

  .top-bar__nav {
    gap: 0.5rem;
    max-width: 52vw;
  }
}

@media (max-width: 520px) {
  .top-bar__title {
    display: none;
  }

  .top-bar__nav {
    max-width: 60vw;
  }
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

.cursor-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

.cursor-echo {
  position: fixed;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(248, 250, 252, 0.85);
  box-shadow:
    0 0 0 2px rgba(248, 250, 252, 0.12),
    0 0 18px rgba(248, 250, 252, 0.18);
  transform: translate(-50%, -50%) scale(0.2);
  opacity: 0.9;
  animation: cursor-echo 900ms ease-out forwards;
}

@keyframes cursor-echo {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0.9;
  }
  70% {
    opacity: 0.35;
  }
  100% {
    transform: translate(-50%, -50%) scale(3.2);
    opacity: 0;
  }
}

.screen-flash {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(
      circle at var(--flash-x) var(--flash-y),
      rgba(248, 250, 252, 0.55) 0,
      rgba(248, 250, 252, 0.12) 140px,
      transparent 340px
    );
  opacity: 0;
  animation: screen-flash 320ms ease-out forwards;
}

.screen-flash--held {
  animation: none;
  opacity: 0.7;
  background:
    radial-gradient(
      circle at var(--flash-x) var(--flash-y),
      rgba(248, 250, 252, 0.28) 0,
      rgba(248, 250, 252, 0.12) 180px,
      transparent 520px
    );
  mix-blend-mode: screen;
  filter: saturate(0.9);
  animation: held-flash-pulse 700ms ease-in-out infinite;
}

@keyframes held-flash-pulse {
  0% {
    opacity: 0.55;
  }
  50% {
    opacity: 0.82;
  }
  100% {
    opacity: 0.55;
  }
}

@keyframes screen-flash {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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
