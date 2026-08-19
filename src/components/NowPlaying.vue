<script setup>
import { computed } from 'vue'
import { useSpotifyNowPlaying } from '@/composables/useSpotifyNowPlaying'
import { useI18n } from '@/i18n'

const { track, loading, error, configured } = useSpotifyNowPlaying()
const { t } = useI18n()

const percent = computed(() => {
  if (!track.value?.durationMs) return 0
  return Math.round((track.value.progressMs / track.value.durationMs) * 100)
})

const clock = (ms) => {
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
</script>

<template>
  <section v-if="configured" class="border-b border-rule py-6">
    <div class="flex items-baseline justify-between">
      <p class="label flex items-center gap-2">
        <span
          v-if="track?.isPlaying"
          class="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent"
          aria-hidden="true"
        />
        {{ t('music.nowPlaying') }}
      </p>
      <span v-if="track" class="label">Spotify</span>
    </div>

    <p v-if="loading" class="mt-3 text-[13px] text-faint">{{ t('music.checking') }}</p>
    <p v-else-if="error" class="mt-3 text-[13px] text-muted">{{ t('music.unavailable') }}</p>
    <p v-else-if="!track" class="mt-3 text-[13px] text-muted">{{ t('music.nothingPlaying') }}</p>

    <a
      v-else
      :href="track.spotifyUrl"
      target="_blank"
      rel="noreferrer"
      class="group mt-4 grid grid-cols-[3.5rem_1fr] items-center gap-x-4 sm:grid-cols-[4.5rem_1fr] sm:gap-x-6"
    >
      <img
        :src="track.albumArt"
        :alt="track.album"
        class="aspect-square w-full border border-rule object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <span class="min-w-0">
        <span
          class="block truncate text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-accent"
        >
          {{ track.title }}
        </span>
        <span class="block truncate text-[13px] text-muted">
          {{ track.artist }} — {{ track.album }}
        </span>

        <!-- Progress, drawn as a rule so it reads like the rest of the page. -->
        <span class="mt-3 flex items-center gap-3">
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
      </span>
    </a>
  </section>
</template>
