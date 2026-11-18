<script setup>
/**
 * Whatever Spotify is playing, as a disc in the player above the CD shelf.
 * The disc turns while the track plays and stops when it's paused.
 */
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import CdDisc from './CdDisc.vue'

const props = defineProps({
  track: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  /** True when the playing album is also on the shelf. */
  fromShelf: { type: Boolean, default: false },
})

const { t } = useI18n()

const percent = computed(() => {
  if (!props.track?.durationMs) return 0
  return Math.round((props.track.progressMs / props.track.durationMs) * 100)
})

const clock = (ms) => {
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
</script>

<template>
  <section class="grid grid-cols-[6.5rem_1fr] items-center gap-x-5 border-b border-rule py-8 sm:grid-cols-[9rem_1fr] sm:gap-x-8">
    <!-- The tray: a disc when something plays, an empty well when not. -->
    <div class="tray">
      <CdDisc
        v-if="track"
        :src="track.albumArt"
        :spinning="track.isPlaying"
        class="w-full"
        style="--cd-hole: var(--surface)"
      />
      <span v-else class="tray__empty" aria-hidden="true" />
    </div>

    <div class="min-w-0">
      <p class="label flex items-center gap-2">
        <span
          v-if="track?.isPlaying"
          class="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent"
          aria-hidden="true"
        />
        {{ t('music.nowPlaying') }}
        <span v-if="fromShelf" class="text-accent">· {{ t('music.fromShelf') }}</span>
      </p>

      <p v-if="loading" class="mt-3 text-[13px] text-faint">{{ t('music.checking') }}</p>
      <p v-else-if="error" class="mt-3 text-[13px] text-muted">{{ t('music.unavailable') }}</p>
      <p v-else-if="!track" class="mt-3 text-[13px] text-muted">{{ t('music.nothingPlaying') }}</p>

      <a v-else :href="track.spotifyUrl" target="_blank" rel="noreferrer" class="group mt-2 block">
        <span
          class="block truncate text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-accent sm:text-xl"
        >
          {{ track.title }}
        </span>
        <span class="block truncate text-[13px] text-muted">{{ track.artist }} — {{ track.album }}</span>

        <span class="mt-4 flex items-center gap-3">
          <span class="relative block h-px flex-1 bg-rule">
            <span
              class="absolute inset-y-0 left-0 bg-accent transition-[width] duration-1000 ease-linear"
              :style="{ width: `${percent}%` }"
            />
          </span>
          <span class="shrink-0 text-[11px] tabular-nums text-faint">
            {{ clock(track.progressMs) }} / {{ clock(track.durationMs) }}
          </span>
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.tray {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  padding: 7%;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--rule);
}

.tray__empty {
  width: 100%;
  aspect-ratio: 1;
  border: 1px dashed var(--faint);
  border-radius: 50%;
  background: radial-gradient(circle, var(--faint) 0 3px, transparent 4px);
}
</style>
