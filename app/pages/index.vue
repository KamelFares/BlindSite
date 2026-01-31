<template>
  <section class="page">
    <header class="hero" aria-label="Blindness education introduction">
      <h1 class="hero__title reveal">{{ t('home.title') }}</h1>
      <p class="hero__subtitle reveal">{{ t('home.subtitle1') }}</p>
      <p class="hero__subtitle reveal">{{ t('home.subtitle2') }}</p>
    </header>

    <main class="flow" aria-label="Educational sections">
      <section
        v-for="(s, index) in sections"
        :key="s.id"
        :style="styleFor(index)"
        :id="s.id"
        class="block"
        :class="{ 'block--link': !!s.route }"
        tabindex="0"
        :role="s.route ? 'link' : 'region'"
        :aria-label="s.route ? `${s.title}. Open simulation.` : s.title"
        @click="s.route ? openRoute(s.route) : undefined"
        @keydown.enter.prevent="s.route ? openRoute(s.route) : undefined"
        @keydown.space.prevent="s.route ? openRoute(s.route) : undefined"
      >
        <!-- Cue: always visible hint that something is here -->
        <div class="cue" aria-hidden="true">
          <span class="cue__dot" />
          <span class="cue__beam" />
        </div>

        <div class="content">
          <h2 class="content__title reveal">{{ s.title }}</h2>
          <p class="content__text reveal">{{ s.text }}</p>

          <div v-if="s.route" class="content__cta">
            <NuxtLink class="cta" :to="localePath(s.route)">{{ s.cta ?? 'Open' }}</NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Donation links at the end of the page (awareness / support) -->
    <footer class="donate" aria-label="Donation links">
      <h2 class="donate__title reveal">{{ t('home.donateTitle') }}</h2>
      <p class="donate__note reveal">{{ t('home.donateNote') }}</p>

      <ul class="donate__list" aria-label="Donation links">
        <li class="donate__item">
          <a
            class="donate__link"
            :href="t('home.donations.dbsv.url')"
            target="_blank"
            rel="noopener noreferrer"
            @click="dispatchAchievement('supporter', 'Supporter: you opened a donation link.')"
          >
            <span class="donate__name">{{ t('home.donations.dbsv.name') }}</span>
            <span class="donate__desc">{{ t('home.donations.dbsv.desc') }}</span>
          </a>
        </li>
        <li class="donate__item">
          <a
            class="donate__link"
            :href="t('home.donations.proretina.url')"
            target="_blank"
            rel="noopener noreferrer"
            @click="dispatchAchievement('supporter', 'Supporter: you opened a donation link.')"
          >
            <span class="donate__name">{{ t('home.donations.proretina.name') }}</span>
            <span class="donate__desc">{{ t('home.donations.proretina.desc') }}</span>
          </a>
        </li>
        <li class="donate__item">
          <a
            class="donate__link"
            :href="t('home.donations.aktionMensch.url')"
            target="_blank"
            rel="noopener noreferrer"
            @click="dispatchAchievement('supporter', 'Supporter: you opened a donation link.')"
          >
            <span class="donate__name">{{ t('home.donations.aktionMensch.name') }}</span>
            <span class="donate__desc">{{ t('home.donations.aktionMensch.desc') }}</span>
          </a>
        </li>
        <li class="donate__item">
          <a
            class="donate__link"
            :href="t('home.donations.cbm.url')"
            target="_blank"
            rel="noopener noreferrer"
            @click="dispatchAchievement('supporter', 'Supporter: you opened a donation link.')"
          >
            <span class="donate__name">{{ t('home.donations.cbm.name') }}</span>
            <span class="donate__desc">{{ t('home.donations.cbm.desc') }}</span>
          </a>
        </li>
      </ul>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n, useLocalePath } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const dispatchAchievement = (key: string, text: string) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('blindsite:achievement', { detail: { key, text } }))
}

type Section = {
  id: string
  title: string
  text: string
  route?: string
  cta?: string
}

const router = useRouter()

const openRoute = (to: string) => {
  router.push(localePath(to))
}

const sectionDefs = [
  { id: 'what', key: 'what' },
  { id: 'different', key: 'different' },
  { id: 'navigate', key: 'navigate' },
  { id: 'tech', key: 'tech' },
  { id: 'design', key: 'design' },
  { id: 'cataract', key: 'cataract', route: '/cataract' },
  { id: 'macular', key: 'macular', route: '/macular' },
  { id: 'color', key: 'color', route: '/colors' },
  // New simulations (not yet in the i18n home sections list)
  { id: 'retinopathy', key: 'retinopathy' },
  { id: 'tunnel', key: 'tunnel' },
  { id: 'migraine', key: 'migraine' },
] as const

const sections = computed<Section[]>(() =>
  sectionDefs.map((d) => {
    // Existing i18n-driven sections
    if ('route' in d && d.route) {
      return {
        id: d.id,
        title: t(`home.sections.${d.key}.title`),
        text: t(`home.sections.${d.key}.text`),
        route: d.route,
        cta: t(`home.sections.${d.key}.cta`),
      }
    }

    // New pages: use nav labels + short hardcoded descriptions for now
    if (d.key === 'retinopathy') {
      return {
        id: d.id,
        title: t('nav.retinopathy'),
        text: 'Patchy blur + drifting floaters. Try to click the correct label.',
        route: '/retinopathy',
        cta: 'Open simulation',
      }
    }
    if (d.key === 'tunnel') {
      return {
        id: d.id,
        title: t('nav.tunnel'),
        text: 'Restricted peripheral vision. Scan to find the target dot.',
        route: '/tunnel',
        cta: 'Open simulation',
      }
    }
    if (d.key === 'migraine') {
      return {
        id: d.id,
        title: t('nav.migraine'),
        text: 'Shimmering aura + central scotoma overlay. Try to click the moving target.',
        route: '/migraine',
        cta: 'Open simulation',
      }
    }

    // Fallback
    return {
      id: d.id,
      title: d.id,
      text: '',
    }
  })
)

// Randomize left/right position for each paragraph block while still scrolling normally.
// (Deterministic per reload, but feels "scattered" across the page.)
const offsets = ref<number[]>([])

const generateOffsets = (count: number) => {
  offsets.value = Array.from({ length: count }, () => {
    const sign = Math.random() < 0.5 ? -1 : 1
    const px = Math.round((120 + Math.random() * 220) * sign) // -340..-120 or 120..340
    return px
  })
}

onMounted(() => {
  generateOffsets(sections.value.length)
})

// When switching languages, keep the same left/right layout, but if the number
// of sections ever changes, regenerate.
watch(
  () => [locale.value, sections.value.length] as const,
  ([, len]) => {
    if (offsets.value.length !== len) generateOffsets(len)
  }
)

const styleFor = (index: number) => ({
  '--offset-x': `${offsets.value[index] ?? 0}px`,
})
</script>

<style scoped>
.page {
  /* user request: completely black */
  min-height: 100vh;
}

.donate {
  margin: 4rem 0 7rem;
  max-width: 72rem;
  display: grid;
  gap: 0.65rem;
}

.donate__title {
  margin: 0.75rem 0 0;
  font-size: clamp(1.15rem, 1.8vw, 1.45rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.donate__note {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
}

.donate__list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  display: grid;
  gap: 0.5rem;
}

.donate__link {
  display: grid;
  gap: 0.2rem;
  text-decoration: none;
  padding: 0.75rem 0.9rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(2, 6, 23, 0.22);
}

.donate__name {
  color: rgba(248, 250, 252, 0.12);
  font-weight: 650;
  transition: color 0.18s ease;
}

.donate__desc {
  color: rgba(248, 250, 252, 0.06);
  transition: color 0.18s ease;
}

.donate:hover .donate__name,
.donate:focus-within .donate__name,
.donate:hover .donate__desc,
.donate:focus-within .donate__desc {
  color: rgba(248, 250, 252, 0.92);
}

.donate__link:hover,
.donate__link:focus-visible {
  border-color: rgba(251, 191, 36, 0.75);
  outline: none;
}

.hero {
  min-height: 62vh;
  display: grid;
  gap: 0.9rem;
  align-content: center;
}

.hero__title {
  font-size: clamp(3rem, 6vw, 4.6rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
}

.hero__subtitle {
  margin: 0;
  max-width: 72rem;
  font-size: clamp(1.25rem, 2.3vw, 2rem);
  line-height: 1.65;
}

/* On the hero we want the instructions to be readable without hover. */
.hero .reveal {
  color: rgba(248, 250, 252, 0.72);
  text-shadow:
    0 0 18px rgba(0, 0, 0, 0.75),
    0 0 42px rgba(0, 0, 0, 0.7);
}

.flow {
  display: grid;
  /* more vertical space so users must "search" */
  gap: 7rem;
  padding: 3rem 0 14rem;

  /* smoother, more “seamless” section-to-section experience */
  scroll-snap-type: y proximity;
}

/* Make scrolling feel more "game-like" and readable */
:global(html) {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
}

:global(body) {
  scrollbar-color: rgba(248, 250, 252, 0.25) rgba(15, 23, 42, 0.45);
}

:global(::-webkit-scrollbar) {
  width: 12px;
}

:global(::-webkit-scrollbar-track) {
  background: rgba(15, 23, 42, 0.45);
}

:global(::-webkit-scrollbar-thumb) {
  background: rgba(248, 250, 252, 0.22);
  border-radius: 999px;
  border: 2px solid rgba(15, 23, 42, 0.45);
}

:global(::-webkit-scrollbar-thumb:hover) {
  background: rgba(248, 250, 252, 0.35);
}

.block {
  position: relative;
  min-height: min(86vh, 740px);
  display: grid;
  align-content: center;
  border-radius: 1.25rem;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  outline: none;

  /* random left/right offset per section */
  transform: translateX(var(--offset-x, 0px));
  scroll-snap-align: center;
  transition: transform 0.35s ease;
}

/* Cue that indicates where the paragraph is */
.cue {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  gap: 0.6rem;
  align-items: center;
}

.cue__dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.22);
  box-shadow:
    0 0 0 1px rgba(248, 250, 252, 0.18),
    0 0 18px rgba(248, 250, 252, 0.12);
  animation: cue-pulse 1.8s ease-in-out infinite;
}

.cue__beam {
  width: 8px;
  height: 68px;
  border-radius: 999px;
  background: linear-gradient(
    to bottom,
    rgba(248, 250, 252, 0.0),
    rgba(248, 250, 252, 0.12),
    rgba(248, 250, 252, 0.0)
  );
}

@keyframes cue-pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.55;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.55;
  }
}

.content {
  max-width: 86rem;
}

.content__title {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
}

.content__text {
  margin: 0;
  font-size: clamp(1.6rem, 2.7vw, 2.3rem);
  line-height: 1.7;
}

/* Reveal mechanic: almost invisible until hovered/focused */
.reveal {
  color: rgba(248, 250, 252, 0.02);
  transition: color 0.18s ease, text-shadow 0.18s ease;
}

.block:hover .reveal,
.block:focus-within .reveal {
  color: rgba(248, 250, 252, 0.92);
  text-shadow:
    0 0 18px rgba(15, 23, 42, 0.9),
    0 0 48px rgba(0, 0, 0, 0.75);
}

/* Extra reveal glow following the cursor */
.block:hover {
  background: radial-gradient(
    circle at var(--cursor-x) var(--cursor-y),
    rgba(248, 250, 252, 0.12) 0,
    rgba(148, 163, 184, 0.04) 180px,
    transparent 420px
  );
}

.block--link {
  cursor: pointer;
}

.block--link:focus-visible {
  outline: 2px solid rgba(251, 191, 36, 0.9);
  outline-offset: 4px;
}

.content__cta {
  margin-top: 1.25rem;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.55);
  color: rgba(248, 250, 252, 0.92);
}

.cta:hover,
.cta:focus-visible {
  background: rgba(15, 23, 42, 0.85);
}

@media (max-width: 720px) {
  .block {
    padding-left: 3.15rem;
    transform: translateX(0);
    min-height: 62vh;
  }
  .cue {
    left: 0.75rem;
  }

  .flow {
    gap: 2.5rem;
  }
}

@media (max-width: 420px) {
  .block {
    padding: 1rem 1rem 1rem 3.15rem;
    min-height: 58vh;
  }
}
</style>
