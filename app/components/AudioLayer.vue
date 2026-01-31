<template>
  <div class="audio-layer" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLightCursor } from '../composables/useLightCursor'

const { pan } = useLightCursor()

const audioCtx = ref<AudioContext | null>(null)
const panner = ref<StereoPannerNode | null>(null)
const masterGain = ref<GainNode | null>(null)
const source = ref<AudioBufferSourceNode | OscillatorNode | null>(null)
const isAudioOn = ref(false)
const route = useRoute()

const HOME_ROUTE_NAMES = new Set<string>(['index'])

const getRouteVolume = () => {
  // Home is the core experience, keep it louder.
  // Other pages should have lower ambient to avoid annoyance.
  return HOME_ROUTE_NAMES.has(String(route.name)) ? 1 : 0.45
}

const initAudio = async () => {
  if (audioCtx.value) return

  try {
    audioCtx.value = new AudioContext()

    // Instead of requiring an external audio file (which may be missing), we
    // synthesize a subtle ambient tone. This avoids 404s and decoding errors.
    const ctx = audioCtx.value

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 85

    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 120

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 500

    // Add a subtle noise bed so panning is more noticeable.
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true

    const gain = ctx.createGain()
    gain.gain.value = 0.03

    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.012

    const master = ctx.createGain()
    master.gain.value = getRouteVolume()

    const panNode = new StereoPannerNode(ctx, { pan: 0 })

    osc.connect(filter)
    osc2.connect(filter)
    noise.connect(noiseGain)

    // Mix tone + noise into the panner, then apply master volume
    filter.connect(gain)
    gain.connect(panNode)
    noiseGain.connect(panNode)
    panNode.connect(master).connect(ctx.destination)

    osc.start()
    osc2.start()
    noise.start()

    panner.value = panNode
    masterGain.value = master
    source.value = osc
    isAudioOn.value = true

    // Achievement: user enabled audio
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('blindsite:achievement', {
          detail: { key: 'listener', text: 'Listener: you enabled the ambient sound.' },
        })
      )
    }
  } catch (err) {
    console.warn('[AudioLayer] Failed to start audio', err)
  }
}

onMounted(() => {
  // Wait for user interaction to start audio
  window.addEventListener('click', initAudio, { once: true })
})

watch(pan, (value) => {
  if (panner.value) {
    const ctx = audioCtx.value
    if (ctx) {
      // smooth movement so it feels like the sound follows the cursor
      panner.value.pan.setTargetAtTime(value, ctx.currentTime, 0.02)
    } else {
      panner.value.pan.value = value
    }
  }
})

// Dynamically reduce volume on other pages
watch(
  () => route.name,
  () => {
    const ctx = audioCtx.value
    const master = masterGain.value
    if (!ctx || !master) return

    const volume = getRouteVolume()
    master.gain.setTargetAtTime(volume, ctx.currentTime, 0.12)
  }
)
</script>

<style scoped>
.audio-layer {
  display: none;
}
</style>
