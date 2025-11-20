<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Welcome to BlindSite</h1>
      <p class="page__lead reveal-on-hover">
        This is an empathy/awareness experience. Move your mouse to reveal this text and explore the page as if you only have a small cone of vision.
      </p>
    </header>

    <section class="page__section" aria-labelledby="section-main">
      <h2 id="section-main">Main Content</h2>
      <p class="reveal-on-hover">
        The web is mostly dark here. Only the area under your cursor is visible. Try to find all the text and interact with the page using your mouse or keyboard.
      </p>
    </section>

    <div class="scroll-controls">
      <button class="scroll-arrow scroll-arrow--up" @click="scrollToTop" aria-label="Scroll to top">
        <span class="eye-icon">&#128065;</span>
      </button>
      <button class="scroll-arrow scroll-arrow--down" @click="scrollToBottom" aria-label="Scroll to bottom">
        <span class="eye-icon">&#128065;</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  min-height: 120vh;
  padding-bottom: 4rem;
}

.page__header {
  display: grid;
  gap: 1.25rem;
}

.page__title {
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 1.1;
  letter-spacing: 0.02em;
}

.page__lead {
  max-width: 40rem;
  color: #e5e7eb;
  font-size: 1.1rem;
}

.page__section {
  max-width: 40rem;
}

.reveal-on-hover {
  color: transparent;
  transition: color 0.3s;
  pointer-events: auto;
  background: linear-gradient(90deg, #fff2 60%, #fff0 100%);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  position: relative;
}
.reveal-on-hover:hover,
.reveal-on-hover:focus {
  color: #e5e7eb;
  background: linear-gradient(90deg, #fff4 60%, #fff0 100%);
}

.scroll-controls {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
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
</style>
