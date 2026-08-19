import { ref } from 'vue'

/**
 * Photos come from a Cloudflare R2 bucket, listed by a small worker.
 * Set these in .env — see .env.example.
 */
const R2_BASE_URL = import.meta.env.VITE_R2_PUBLIC_URL || ''
const R2_LIST_URL = import.meta.env.VITE_R2_LIST_ENDPOINT || ''

// Module-level singletons — shared across every useGallery() call.
const photos = ref([])
const isLoading = ref(false)

/**
 * An i18n key rather than a message, so the page renders the error in the
 * visitor's language and it re-translates when they switch.
 */
const errorKey = ref('')

function keyToCaption(key) {
  return (key.split('/').pop() ?? key).replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
}

export function useGallery() {
  async function fetchPhotos() {
    if (photos.value.length) return

    if (!R2_LIST_URL) {
      errorKey.value = 'gallery.notConfigured'
      return
    }

    isLoading.value = true
    errorKey.value = ''

    try {
      const response = await fetch(R2_LIST_URL)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      photos.value = data.objects
        .filter((object) => /\.(jpe?g|png|webp|avif|gif)$/i.test(object.key))
        .map((object) => ({
          key: object.key,
          url: `${R2_BASE_URL}/${object.key}`,
          caption: keyToCaption(object.key),
        }))
    } catch {
      errorKey.value = 'gallery.failed'
    } finally {
      isLoading.value = false
    }
  }

  return { photos, isLoading, errorKey, fetchPhotos }
}
