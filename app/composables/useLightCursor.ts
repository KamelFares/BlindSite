import { ref, computed, onMounted, onUnmounted } from 'vue'

type InputMode = 'pointer' | 'keyboard'

interface ViewportSize {
  width: number
  height: number
}

export function useLightCursor() {
  const x = ref(0)
  const y = ref(0)
  const lightEnabled = ref(true)
  const inputMode = ref<InputMode>('pointer')
  const viewport = ref<ViewportSize>({ width: 1, height: 1 })

  const updateViewport = () => {
    if (typeof window === 'undefined') return
    viewport.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    updateViewport()

    // start in the middle of the viewport
    x.value = window.innerWidth / 2
    y.value = window.innerHeight / 2

    window.addEventListener('resize', updateViewport)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', updateViewport)
  })

  const updateFromPointer = (event: MouseEvent | PointerEvent) => {
    x.value = event.clientX
    y.value = event.clientY
    inputMode.value = 'pointer'
  }

  const updateFromElement = (el: HTMLElement | null) => {
    if (!el || typeof window === 'undefined') return
    const rect = el.getBoundingClientRect()
    x.value = rect.left + rect.width / 2
    y.value = rect.top + rect.height / 2
    inputMode.value = 'keyboard'
  }

  const toggleLight = () => {
    lightEnabled.value = !lightEnabled.value
  }

  const cssVars = computed(() => ({
    '--cursor-x': `${x.value}px`,
    '--cursor-y': `${y.value}px`,
  }))

  const pan = computed(() => {
    const width = viewport.value.width || 1
    const normalizedX = x.value / width // 0..1
    const rawPan = (normalizedX - 0.5) * 2 // -1..1
    return Math.max(-1, Math.min(1, rawPan))
  })

  return {
    x,
    y,
    viewport,
    lightEnabled,
    inputMode,
    cssVars,
    pan,
    updateFromPointer,
    updateFromElement,
    toggleLight,
  }
}
