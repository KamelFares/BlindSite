<template>
  <section class="page">
    <header class="page__header" v-scroll-reveal>
      <h1 class="page__title">Welcome to BlindSite</h1>
      <p class="page__lead reveal-on-hover">
        This is an empathy/awareness experience. Move your mouse to reveal this text and explore the page as if you only have a small cone of vision.
      </p>
    </header>

    <section class="page__section" aria-labelledby="section-main" v-scroll-reveal>
      <h2 id="section-main">Main Content</h2>
      <p class="reveal-on-hover">
        The web is mostly dark here. Only the area under your cursor is visible. Try to find all the text and interact with the page using your mouse or keyboard.
      </p>
    </section>

    <section class="page__section" aria-labelledby="section-what-1" v-scroll-reveal>
      <h2 id="section-what-1">What is blindness?</h2>
      <p class="reveal-on-hover">
        Blindness does not always mean seeing nothing at all. Many blind and low-vision people see light, shapes, or limited detail. Vision can also change over time, or be different between the two eyes.
      </p>
    </section>

    <section class="page__section" aria-labelledby="section-what-2" v-scroll-reveal>
      <h2 id="section-what-2" class="visually-hidden">What is blindness? (continued)</h2>
      <p class="reveal-on-hover">
        Because blindness is so different from person to person, there is no single "blind experience". The examples on this site are just small slices meant to build empathy, not to speak for everyone.
      </p>
    </section>

    <section class="page__section" aria-labelledby="section-navigation-1" v-scroll-reveal>
      <h2 id="section-navigation-1">How do blind people navigate?</h2>
      <p class="reveal-on-hover">
        Many blind people use a white cane or guide dog together with memory, sound, touch and smell. The cane sends information through small vibrations and taps, helping to detect curbs, steps, obstacles and open space.
      </p>
    </section>

    <section class="page__section" aria-labelledby="section-navigation-2" v-scroll-reveal>
      <h2 id="section-navigation-2" class="visually-hidden">How do blind people navigate? (continued)</h2>
      <p class="reveal-on-hover">
        Indoors, counting steps, feeling textures on the floor, listening for echoes and air movement can all help create a mental map of a room or hallway.
      </p>
    </section>

    <section class="page__section" aria-labelledby="section-technology-1" v-scroll-reveal>
      <h2 id="section-technology-1">Assistive technology on computers and phones</h2>
      <p class="reveal-on-hover">
        Screen readers like VoiceOver, JAWS, NVDA or TalkBack read out what is on the screen. People use keyboard shortcuts and gestures instead of a mouse to move between headings, links, buttons and form fields.
      </p>
    </section>

    <section class="page__section" aria-labelledby="section-technology-2" v-scroll-reveal>
      <h2 id="section-technology-2" class="visually-hidden">Assistive technology on computers and phones (continued)</h2>
      <p class="reveal-on-hover">
        Well-built websites use clear headings, descriptive link text, labels on form controls and good keyboard support. This makes it easier and faster for blind users to explore without getting lost.
      </p>
    </section>

    <section class="page__section" aria-labelledby="section-respect-1" v-scroll-reveal>
      <h2 id="section-respect-1">Respect and everyday life</h2>
      <p class="reveal-on-hover">
        Blind people study, work, raise families, play games and use social media like everyone else. Accessibility barriers often come from design choices, not from blindness itself.
      </p>
    </section>

    <section class="page__section" aria-labelledby="section-respect-2" v-scroll-reveal>
      <h2 id="section-respect-2" class="visually-hidden">Respect and everyday life (continued)</h2>
      <p class="reveal-on-hover">
        When you meet a blind person, it is usually best to introduce yourself, ask if they want help instead of grabbing them, and talk to them directly rather than only to the people around them.
      </p>
    </section>

    <transition name="scroll-fade">
      <div v-if="showScrollControls" class="scroll-controls">
        <button class="scroll-arrow scroll-arrow--up" @click="scrollToTop" aria-label="Scroll to top">
          <span class="eye-icon">&#128065;</span>
        </button>
        <button class="scroll-arrow scroll-arrow--down" @click="scrollToBottom" aria-label="Scroll to bottom">
          <span class="eye-icon">&#128065;</span>
        </button>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const showScrollControls = ref(false)

const handleScroll = () => {
  if (typeof window === 'undefined') return
  // Hide by default and only show after scrolling AND moving the mouse
  showScrollControls.value = window.scrollY > 150 && hasMouseMoved.value
}

const hasMouseMoved = ref(false)
const handleMouseMove = () => {
  hasMouseMoved.value = true
  handleScroll()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

onMounted(() => {
  if (typeof window === 'undefined') return
  handleScroll()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('mousemove', handleMouseMove, { once: true })
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', handleMouseMove)
})

// Simple scroll-reveal directive: sections slide up and fade in
const vScrollReveal = {
  mounted(el: HTMLElement) {
    if (typeof window === 'undefined') return

    el.classList.add('scroll-reveal')

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add('scroll-reveal--visible')
          obs.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.2,
    })

    observer.observe(el)
  },
}

</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: auto;
}

.page__header {
  display: grid;
  gap: 1.25rem;
  min-height: 100vh;
  align-content: center;
}

.page__title {
  font-size: clamp(3rem, 5vw, 4.2rem);
  line-height: 1.1;
  letter-spacing: 0.02em;
}

.page__lead {
  max-width: 44rem;
  color: #e5e7eb;
  font-size: 2.3rem;
  line-height: 1.7;
}

.page__section {
  max-width: 44rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
}

.reveal-on-hover {
  color: rgba(229, 231, 235, 0.06);
  font-size: 2.1rem;
  line-height: 1.7;
  letter-spacing: 0.01em;
  transition: color 0.18s ease, background 0.25s ease, text-shadow 0.25s ease;
  pointer-events: auto;
  background: transparent;
  border-radius: 0.75rem;
  padding: 0.85rem 1rem;
  position: relative;
}
.reveal-on-hover:hover,
.reveal-on-hover:focus {
  color: rgba(248, 250, 252, 0.92);
  background: radial-gradient(
    circle at var(--cursor-x) var(--cursor-y),
    rgba(248, 250, 252, 0.16) 0,
    rgba(148, 163, 184, 0.06) 120px,
    transparent 240px
  );
  text-shadow:
    0 0 18px rgba(15, 23, 42, 0.9),
    0 0 48px rgba(0, 0, 0, 0.75);
}

.reveal-on-hover:focus-visible {
  outline: 2px solid rgba(251, 191, 36, 0.9);
  outline-offset: 4px;
}

.scroll-controls {
  position: fixed;
  /* Fixed on the right side */
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 10;
}

.scroll-arrow {
  background: #18181b;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px #0008;
  transition: background 0.2s, border 0.2s;
  font-size: 2rem;
  color: #e5e7eb;
}
.scroll-arrow:hover,
.scroll-arrow:focus {
  background: #27272a;
  border-color: #f87171;
}

.eye-icon {
  font-size: 2rem;
  display: inline-block;
  vertical-align: middle;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Scroll reveal animation for sections */
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-reveal--visible {
  opacity: 1;
  transform: translateY(0);
}

.scroll-fade-enter-active,
.scroll-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.scroll-fade-enter-from,
.scroll-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
