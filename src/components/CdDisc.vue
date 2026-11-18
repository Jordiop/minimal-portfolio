<script setup>
/**
 * A compact disc printed with the album cover. The face spins; the light
 * catching the plastic and the clear hub stay put, the way they do on a real one.
 */
defineProps({
  src: { type: String, default: '' },
  spinning: { type: Boolean, default: false },
})
</script>

<template>
  <span class="cd-disc" aria-hidden="true">
    <span
      class="cd-disc__face"
      :class="{ 'is-spinning': spinning }"
      :style="src ? { backgroundImage: `url('${src}')` } : null"
    />
  </span>
</template>

<style scoped>
.cd-disc {
  position: relative;
  display: block;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #d9d6cf, #a9a59c);
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 0.25),
    0 6px 18px -6px rgb(0 0 0 / 0.45);
}

.cd-disc__face {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  animation: cd-spin 2.4s linear infinite;
  animation-play-state: paused;
}
.cd-disc__face.is-spinning {
  animation-play-state: running;
}

/* Light on the plastic: static, so it reads as the disc turning beneath it. */
.cd-disc::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: 50%;
  background: conic-gradient(
    from 20deg,
    transparent 0deg,
    rgb(255 255 255 / 0.28) 25deg,
    transparent 60deg,
    transparent 180deg,
    rgb(255 255 255 / 0.2) 205deg,
    transparent 240deg
  );
  mix-blend-mode: screen;
  pointer-events: none;
}

/* Clear plastic hub with the spindle hole, which shows whatever is behind. */
.cd-disc::after {
  content: "";
  position: absolute;
  inset: 34%;
  z-index: 2;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--cd-hole, var(--paper)) 0 30%,
    rgb(0 0 0 / 0.25) 31% 33%,
    rgb(235 235 235 / 0.7) 34% 62%,
    rgb(180 180 180 / 0.45) 63% 100%
  );
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.18);
}

@keyframes cd-spin {
  to { transform: rotate(1turn); }
}

@media (prefers-reduced-motion: reduce) {
  .cd-disc__face { animation: none; }
}
</style>
