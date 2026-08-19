<script>
export const route = { titleKey: 'titles.music', descriptionKey: 'seo.music', labelKey: 'nav.music', nav: true, order: 4 }
</script>

<script setup>
import { computed, ref } from 'vue'
import { albums } from '@/data/albums'
import { useI18n } from '@/i18n'
import NowPlaying from '@/components/NowPlaying.vue'
import PageHead from '@/components/PageHead.vue'

const { t } = useI18n()

const active = ref(null)

const genres = computed(() => [...new Set(albums.map((album) => album.genre))])

const shown = computed(() =>
  active.value === null ? albums : albums.filter((album) => album.genre === active.value),
)

const pad = (n) => String(n + 1).padStart(2, '0')
</script>

<template>
  <div class="rise">
    <PageHead
      :index="`04 — ${t('titles.music')}`"
      :title="t('music.heading')"
      :lede="t('music.lede')"
    />

    <NowPlaying />

    <section class="flex flex-wrap gap-x-4 gap-y-2 border-b border-rule py-4">
      <button
        type="button"
        class="text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
        :class="active === null ? 'text-accent' : 'text-muted hover:text-ink'"
        @click="active = null"
      >
        {{ active === null ? '● ' : '○ ' }}{{ t('music.all') }}
      </button>

      <button
        v-for="genre in genres"
        :key="genre"
        type="button"
        class="text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
        :class="active === genre ? 'text-accent' : 'text-muted hover:text-ink'"
        @click="active = genre"
      >
        {{ active === genre ? '● ' : '○ ' }}{{ genre }}
      </button>
    </section>

    <!-- Track-listing layout: the covers are the only images on the page, so they earn the space. -->
    <section class="pt-4">
      <a
        v-for="(album, index) in shown"
        :key="album.title"
        :href="album.spotifyUrl || undefined"
        :target="album.spotifyUrl ? '_blank' : undefined"
        rel="noreferrer"
        class="group grid w-full grid-cols-[2.5rem_3.5rem_1fr_auto] items-center gap-x-4 border-b border-rule py-4 text-left transition-colors duration-300 hover:border-accent sm:grid-cols-[3rem_4.5rem_1fr_auto] sm:gap-x-6"
      >
        <span class="text-[11px] text-faint transition-colors duration-300 group-hover:text-accent">
          {{ pad(index) }}
        </span>

        <img
          :src="album.coverUrl"
          :alt="`${album.title} — ${album.artist}`"
          loading="lazy"
          class="aspect-square w-full border border-rule object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />

        <span class="min-w-0">
          <span
            class="block truncate font-bold tracking-tight transition-colors duration-300 group-hover:text-accent"
          >
            {{ album.title }}
          </span>
          <span class="block truncate text-[13px] text-muted">{{ album.artist }}</span>
        </span>

        <span class="flex items-baseline gap-3 text-[11px] uppercase tracking-[0.18em] text-faint">
          <span class="hidden sm:inline">{{ album.genre }}</span>
          <span>{{ album.year }}</span>
        </span>
      </a>
    </section>

    <p class="pt-6 text-[13px] text-muted">
      {{ t('music.albumCount', { shown: shown.length, total: albums.length }) }}
    </p>
  </div>
</template>
