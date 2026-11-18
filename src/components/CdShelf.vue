<script setup>
/**
 * The CD shelf: jewel cases standing spine-out. Hover lifts a case out of the
 * row; clicking pulls it out to face you, cover forward, with the disc sliding
 * out of the side. Rows wrap, and every row stands on its own shelf board.
 */
import { onBeforeUnmount, onMounted } from 'vue'
import { useSpineColor } from '@/composables/useSpineColor'
import CdDisc from './CdDisc.vue'

const props = defineProps({
  albums: { type: Array, required: true },
  /** Ids that match the active filter; the rest dim. null means no filter. */
  highlighted: { type: Set, default: null },
  /** Id of the album that is currently in the player, if it is on the shelf. */
  playingId: { type: String, default: null },
  inPlayerLabel: { type: String, default: '' },
})

const open = defineModel('open', { type: String, default: null })

const { spineFor, inkFor } = useSpineColor()

function toggle(id) {
  open.value = open.value === id ? null : id
}

function onKey(event) {
  if (event.key === 'Escape') open.value = null
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const isDim = (id) => props.highlighted !== null && !props.highlighted.has(id)
</script>

<template>
  <div class="shelf">
    <button
      v-for="album in albums"
      :key="album.id"
      type="button"
      class="cd"
      :class="{ 'is-open': open === album.id, 'is-dim': isDim(album.id), 'is-playing': playingId === album.id }"
      :style="{ '--spine': spineFor(album), '--spine-ink': inkFor(spineFor(album)) }"
      :aria-expanded="open === album.id"
      :aria-label="`${album.title} — ${album.artist}, ${album.year}`"
      :title="playingId === album.id ? inPlayerLabel : undefined"
      @click="toggle(album.id)"
    >
      <!-- Spine-out -->
      <span class="cd__spine" aria-hidden="true">
        <span v-if="playingId === album.id" class="cd__playing">▶</span>
        <span class="cd__spine-text">
          <span class="font-bold uppercase">{{ album.artist }}</span>
          <span class="opacity-70"> · </span>
          <span>{{ album.title }}</span>
        </span>
        <span class="cd__year">{{ String(album.year).slice(-2) }}</span>
      </span>

      <!-- Pulled out: disc behind, case in front -->
      <span class="cd__front" aria-hidden="true">
        <CdDisc class="cd__disc" :src="album.cover" />
        <span class="cd__case">
          <img :src="album.cover" alt="" loading="lazy" class="cd__cover" />
        </span>
      </span>
    </button>

    <!-- Keeps the last case upright. -->
    <span class="bookend" aria-hidden="true" />
  </div>
</template>

<style scoped>
.shelf {
  /* Geometry. Every case is the same height, so every row sits on the same pitch. */
  --h: 168px;            /* case height */
  --w: 26px;             /* spine width */
  --case: calc(var(--h) * 0.88);   /* jewel case front, ~125 x 142 mm */
  --peek: calc(var(--case) * 0.42); /* how far the disc slides out */
  --board: 12px;
  --gap: 34px;           /* board + air above the next row */

  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  row-gap: var(--gap);
  column-gap: 2px;
  padding: 18px 12px var(--gap);

  /* One shelf board under every row, repeating at the row pitch. */
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0 calc(18px + var(--h)),
    var(--muted) calc(18px + var(--h)) calc(19px + var(--h)),
    var(--surface) calc(19px + var(--h)) calc(18px + var(--h) + var(--board)),
    transparent calc(18px + var(--h) + var(--board)) calc(var(--h) + var(--gap))
  );
  background-size: 100% calc(var(--h) + var(--gap));
  background-position: 0 0;
}

@media (min-width: 640px) {
  .shelf {
    --h: 208px;
    --w: 30px;
  }
}

.cd {
  position: relative;
  flex: none;
  width: var(--w);
  height: var(--h);
  transition:
    width 520ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease,
    filter 300ms ease;
}
.cd:not(.is-open):hover,
.cd:not(.is-open):focus-visible {
  transform: translateY(-10px);
}
.cd.is-open {
  width: calc(var(--case) + var(--peek));
}
.cd.is-dim {
  opacity: 0.22;
  filter: grayscale(1);
}

/* ---- Spine ---------------------------------------------------------------- */
.cd__spine {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 8px;
  overflow: hidden;
  color: var(--spine-ink);
  background:
    linear-gradient(to right, rgb(255 255 255 / 0.22), transparent 28%, transparent 72%, rgb(0 0 0 / 0.22)),
    var(--spine);
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.22);
  transition: opacity 200ms ease;
}
.cd.is-open .cd__spine {
  opacity: 0;
}

.cd__spine-text {
  min-height: 0;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  writing-mode: vertical-rl;
  font-size: 11px;
  letter-spacing: 0.04em;
  line-height: 1;
}
@media (min-width: 640px) {
  .cd__spine-text { font-size: 12px; }
}

.cd__year {
  margin-top: 6px;
  font-size: 9px;
  opacity: 0.75;
}

.cd__playing {
  margin-bottom: 6px;
  font-size: 9px;
  color: var(--accent);
}
.cd.is-playing:not(.is-open) .cd__spine {
  opacity: 0.55;
}

/* ---- Pulled out ----------------------------------------------------------- */
.cd__front {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
}
.cd.is-open .cd__front {
  opacity: 1;
  transition-delay: 120ms;
}

.cd__disc {
  position: absolute;
  top: 50%;
  left: 0;
  width: calc(var(--case) * 0.94);
  translate: 0 -50%;
  rotate: -40deg;
  transition:
    translate 700ms cubic-bezier(0.22, 1, 0.36, 1),
    rotate 900ms cubic-bezier(0.22, 1, 0.36, 1);
}
.cd.is-open .cd__disc {
  translate: var(--peek) -50%;
  rotate: 0deg;
  transition-delay: 220ms;
}

.cd__case {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: var(--case);
  height: var(--h);
  display: flex;
  align-items: center;
  background: #111;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 0.35),
    0 10px 24px -10px rgb(0 0 0 / 0.55);
}

/* Booklet behind the clear front, beside the hinge. */
.cd__cover {
  margin-left: 7%;
  width: 93%;
  aspect-ratio: 1;
  object-fit: cover;
}

/* The hinge and the glare on the clear lid. */
.cd__case::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 7%;
  background: repeating-linear-gradient(to bottom, #2a2a2a 0 3px, #1a1a1a 3px 5px);
}
.cd__case::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, rgb(255 255 255 / 0.18) 0 18%, transparent 18% 60%, rgb(255 255 255 / 0.07) 60% 64%, transparent 64%);
  pointer-events: none;
}

/* ---- Bookend ------------------------------------------------------------- */
.bookend {
  position: relative;
  flex: none;
  width: 34px;
  height: calc(var(--h) * 0.62);
  margin-left: 4px;
}
.bookend::before {
  /* the upright, leaning back a touch against the last case */
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: var(--muted);
  transform: rotate(-3deg);
  transform-origin: bottom left;
}
.bookend::after {
  /* the foot it stands on */
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .cd:not(.is-open):hover,
  .cd:not(.is-open):focus-visible {
    transform: none;
  }
}
</style>
