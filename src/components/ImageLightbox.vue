<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from '@/i18n'

/**
 * Full-screen image viewer shared by /gallery and the project pages.
 * v-model is the index of the open image, or null when closed.
 */
const props = defineProps({
  items: { type: Array, required: true }, // [{ url, caption }]
})

const index = defineModel({ type: Number, default: null })

const { t } = useI18n()

function step(delta) {
  if (index.value === null) return
  const count = props.items.length
  index.value = (index.value + delta + count) % count
}

function onKey(event) {
  if (index.value === null) return
  if (event.key === 'Escape') index.value = null
  if (event.key === 'ArrowRight') step(1)
  if (event.key === 'ArrowLeft') step(-1)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="index !== null && items[index]"
      class="fixed inset-0 z-50 flex flex-col bg-paper/97 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      @click.self="index = null"
    >
      <div class="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
        <p class="label">{{ items[index].caption }}</p>
        <button type="button" class="label shrink-0 hover:text-accent" @click="index = null">
          {{ t('gallery.close') }}
        </button>
      </div>

      <div class="flex min-h-0 flex-1 items-center justify-center py-6" @click.self="index = null">
        <img
          :src="items[index].url"
          :alt="items[index].caption"
          class="max-h-full max-w-full object-contain"
        />
      </div>

      <div v-if="items.length > 1" class="flex items-center justify-between border-t border-rule pt-3">
        <button type="button" class="label hover:text-accent" @click="step(-1)">
          {{ t('gallery.previous') }}
        </button>
        <span class="label">{{ index + 1 }} / {{ items.length }}</span>
        <button type="button" class="label hover:text-accent" @click="step(1)">
          {{ t('gallery.next') }}
        </button>
      </div>
    </div>
  </Teleport>
</template>
