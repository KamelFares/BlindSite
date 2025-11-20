<template>
  <div class="audio-layer" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useLightCursor } from '../composables/useLightCursor'

const { pan, lightEnabled } = useLightCursor()

const audioCtx = ref<AudioContext | null>(null)
const panner = ref<StereoPannerNode | null>(null)
const source = ref<AudioBufferSourceNode | null>(null)
const isAudioOn = ref(false)

const initAudio = async () => {
  if (audioCtx.value) return
  audioCtx.value = new AudioContext()
  const res = await fetch('/audio/ambient-room.mp3')
  const arrayBuffer = await res.arrayBuffer()
  const buffer = await audioCtx.value.decodeAudioData(arrayBuffer)

  const src = audioCtx.value.createBufferSource()
  src.buffer = buffer
  src.loop = true

  const panNode = new StereoPannerNode(audioCtx.value, { pan: 0 })
  src.connect(panNode).connect(audioCtx.value.destination)
  src.start()

  panner.value = panNode
  source.value = src
  isAudioOn.value = true
}

onMounted(() => {
  // Wait for user interaction to start audio
  window.addEventListener('click', initAudio, { once: true })
})

watch(pan, (value) => {
  if (panner.value && lightEnabled.value) {
    panner.value.pan.value = value
  }
})
</script>

<style scoped>
.audio-layer {
  display: none;
}
</style>
