<script>
export const route = { titleKey: 'titles.gallery', descriptionKey: 'seo.gallery', labelKey: 'nav.gallery', nav: true, order: 6 }
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useGallery } from '@/composables/useGallery'
import { useI18n } from '@/i18n'
import PageHead from '@/components/PageHead.vue'

const { t } = useI18n()
const { photos, isLoading, errorKey, fetchPhotos } = useGallery()

const lightbox = ref(null)

// The composable reports a key so the message follows the selected language.
const errorMessage = computed(() => (errorKey.value ? t(errorKey.value) : ''))

function open(index) {
  lightbox.value = index
}

function step(delta) {
  if (lightbox.value === null) return
  const count = photos.value.length
  lightbox.value = (lightbox.value + delta + count) % count
}

function onKey(event) {
  if (lightbox.value === null) return
  if (event.key === 'Escape') lightbox.value = null
  if (event.key === 'ArrowRight') step(1)
  if (event.key === 'ArrowLeft') step(-1)
}

onMounted(() => {
  fetchPhotos()
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="rise">
    <PageHead
      :index="`05 — ${t('titles.gallery')}`"
      :title="t('gallery.heading')"
      :lede="t('gallery.lede')"
    />

    <section class="py-10">
      <div v-if="isLoading" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div v-for="n in 9" :key="n" class="aspect-[4/3] animate-pulse bg-surface" />
      </div>

      <p v-else-if="errorMessage" class="max-w-[52ch] text-muted">{{ errorMessage }}</p>

      <p v-else-if="!photos.length" class="text-muted">{{ t('gallery.empty') }}</p>

      <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button
          v-for="(photo, index) in photos"
          :key="photo.key"
          type="button"
          class="group relative overflow-hidden border border-rule"
          @click="open(index)"
        >
          <img
            :src="photo.url"
            :alt="photo.caption"
            loading="lazy"
            class="aspect-[4/3] w-full object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
          <span
            class="absolute inset-x-0 bottom-0 translate-y-full bg-paper/90 px-2 py-1 text-left text-[11px] uppercase tracking-[0.18em] text-muted transition-transform duration-300 group-hover:translate-y-0"
          >
            {{ photo.caption }}
          </span>
        </button>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightbox !== null"
        class="fixed inset-0 z-50 flex flex-col bg-paper/97 p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        @click.self="lightbox = null"
      >
        <div class="flex items-baseline justify-between border-b border-rule pb-3">
          <p class="label">{{ photos[lightbox].caption }}</p>
          <button type="button" class="label hover:text-accent" @click="lightbox = null">
            {{ t('gallery.close') }}
          </button>
        </div>

        <div class="flex min-h-0 flex-1 items-center justify-center py-6">
          <img
            :src="photos[lightbox].url"
            :alt="photos[lightbox].caption"
            class="max-h-full max-w-full object-contain"
          />
        </div>

        <div class="flex items-center justify-between border-t border-rule pt-3">
          <button type="button" class="label hover:text-accent" @click="step(-1)">
            {{ t('gallery.previous') }}
          </button>
          <span class="label">{{ lightbox + 1 }} / {{ photos.length }}</span>
          <button type="button" class="label hover:text-accent" @click="step(1)">
            {{ t('gallery.next') }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
