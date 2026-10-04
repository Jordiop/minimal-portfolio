<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

const host = ref(null)
const canvas = ref(null)
const ready = ref(false)
// 0 on the hero, 1 once the visitor has scrolled into the content below it.
const veil = ref(0)

let forest = null
let unmounted = false
const cleanup = []

function listen(target, event, handler, options) {
  target.addEventListener(event, handler, options)
  cleanup.push(() => target.removeEventListener(event, handler, options))
}

onMounted(async () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  try {
    // three.js only ships to visitors who land on the home page.
    const { createForest } = await import('@/three/forest')
    if (unmounted) return
    forest = createForest(canvas.value, { dark: isDark.value, reducedMotion })
  } catch (error) {
    // No WebGL: the hero still reads fine on plain paper.
    console.warn('[forest] disabled:', error)
    return
  }

  const resizeObserver = new ResizeObserver(([entry]) => {
    forest.resize(entry.contentRect.width, entry.contentRect.height)
  })
  resizeObserver.observe(host.value)
  cleanup.push(() => resizeObserver.disconnect())

  // Only animate while the hero is on screen and the tab is visible.
  let onScreen = false
  const sync = () => (onScreen && !document.hidden ? forest.start() : forest.stop())
  const intersection = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
    sync()
  })
  intersection.observe(host.value)
  cleanup.push(() => intersection.disconnect())
  listen(document, 'visibilitychange', sync)

  listen(window, 'pointermove', (event) => {
    forest.setPointer((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1))
  }, { passive: true })
  const onScroll = () => {
    forest.setScroll(window.scrollY)
    veil.value = Math.min(window.scrollY / (window.innerHeight * 0.7), 1)
  }
  listen(window, 'scroll', onScroll, { passive: true })
  onScroll()

  ready.value = true
})

watch(isDark, (dark) => forest?.setTheme(dark))

onBeforeUnmount(() => {
  unmounted = true
  cleanup.forEach((fn) => fn())
  forest?.dispose()
})
</script>

<template>
  <!-- Fixed behind the whole page, so the forest stays with you as you scroll. -->
  <Teleport to="body">
    <div
      ref="host"
      class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref="canvas"
        class="block h-full w-full transition-opacity duration-[1500ms] ease-out"
        :class="ready ? 'opacity-100' : 'opacity-0'"
      />
      <!-- Paper washes: keep the copy legible and melt the scene into the page. -->
      <div class="absolute inset-0 bg-linear-to-r from-paper/95 from-15% via-paper/65 via-45% to-paper/0 to-80% max-sm:via-paper/80 max-sm:to-paper/40" />
      <div class="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-paper to-paper/0" />
      <!-- Thickens as you leave the hero: the forest stays, the copy stays readable. -->
      <div class="absolute inset-0 bg-paper" :style="{ opacity: veil * 0.62 }" />
    </div>
  </Teleport>
</template>
