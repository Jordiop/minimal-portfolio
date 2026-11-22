<script>
export const route = { titleKey: 'titles.gallery', descriptionKey: 'seo.gallery', labelKey: 'nav.gallery', icon: 'camera', nav: true, order: 6 }
</script>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useGallery } from '@/composables/useGallery'
import { useI18n } from '@/i18n'
import PageHead from '@/components/PageHead.vue'
import ImageLightbox from '@/components/ImageLightbox.vue'

const { t } = useI18n()
const { photos, isLoading, errorKey, fetchPhotos } = useGallery()

const lightbox = ref(null)

// The composable reports a key so the message follows the selected language.
const errorMessage = computed(() => (errorKey.value ? t(errorKey.value) : ''))

function open(index) {
  lightbox.value = index
}

onMounted(fetchPhotos)
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

    <ImageLightbox v-model="lightbox" :items="photos" />
  </div>
</template>
