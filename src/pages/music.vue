<script>
export const route = { titleKey: 'titles.music', descriptionKey: 'seo.music', labelKey: 'nav.music', icon: 'disc', nav: true, order: 5 }
</script>

<script setup>
import { computed, ref } from 'vue'
import { albums, findShelved } from '@/data/albums'
import { useI18n } from '@/i18n'
import { useSpotifyNowPlaying } from '@/composables/useSpotifyNowPlaying'
import CdShelf from '@/components/CdShelf.vue'
import NowPlaying from '@/components/NowPlaying.vue'
import PageHead from '@/components/PageHead.vue'

const { t } = useI18n()
const { track, loading, error, configured } = useSpotifyNowPlaying()

const genre = ref(null)
const open = ref(null)

const genres = computed(() => [...new Set(albums.map((album) => album.genre))].sort())

/** Filtering dims the other cases instead of taking them off the shelf. */
const highlighted = computed(() =>
  genre.value === null
    ? null
    : new Set(albums.filter((album) => album.genre === genre.value).map((album) => album.id)),
)

const playing = computed(() => findShelved(track.value))
const openAlbum = computed(() => albums.find((album) => album.id === open.value) ?? null)
</script>

<template>
  <div class="rise">
    <PageHead :index="`04 — ${t('titles.music')}`" :title="t('music.heading')" :lede="t('music.lede')" />

    <NowPlaying
      v-if="configured"
      :track="track"
      :loading="loading"
      :error="error"
      :from-shelf="Boolean(playing)"
    />

    <section class="flex flex-wrap gap-x-4 gap-y-2 border-b border-rule py-4">
      <button
        type="button"
        class="text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
        :class="genre === null ? 'text-accent' : 'text-muted hover:text-ink'"
        @click="genre = null"
      >
        {{ genre === null ? '● ' : '○ ' }}{{ t('music.all') }}
      </button>
      <button
        v-for="item in genres"
        :key="item"
        type="button"
        class="text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
        :class="genre === item ? 'text-accent' : 'text-muted hover:text-ink'"
        @click="genre = item"
      >
        {{ genre === item ? '● ' : '○ ' }}{{ item }}
      </button>
    </section>

    <section class="pt-8">
      <CdShelf
        v-model:open="open"
        :albums="albums"
        :highlighted="highlighted"
        :playing-id="playing?.id ?? null"
        :in-player-label="t('music.inPlayer')"
      />

      <!-- What's in your hand. -->
      <div class="flex min-h-[4.5rem] flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-rule pb-6 pt-2" aria-live="polite">
        <template v-if="openAlbum">
          <p class="text-xl font-bold tracking-tight">{{ openAlbum.title }}</p>
          <p class="text-[13px] text-muted">{{ openAlbum.artist }}</p>
          <p class="label">{{ openAlbum.genre }} · {{ openAlbum.year }}</p>
          <a
            v-if="openAlbum.spotifyUrl"
            :href="openAlbum.spotifyUrl"
            target="_blank"
            rel="noreferrer"
            class="link-draw text-[13px] text-accent"
          >
            {{ t('music.listen') }}
          </a>
        </template>
        <p v-else class="text-[13px] text-muted">{{ t('music.pickOne') }}</p>
      </div>
    </section>

    <p class="pt-6 text-[13px] text-muted">
      {{ t('music.albumCount', { shown: highlighted ? highlighted.size : albums.length, total: albums.length }) }}
    </p>
  </div>
</template>
