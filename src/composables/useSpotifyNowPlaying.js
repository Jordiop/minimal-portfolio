import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Spotify "currently playing", refreshed on an interval.
 *
 * The credentials live as secrets on the Cloudflare worker, not here: Vite
 * inlines every VITE_* value into the client bundle, so a client secret or a
 * refresh token in this file would be public. The worker returns only the
 * fields the widget draws.
 */
const NOW_PLAYING_URL = import.meta.env.VITE_NOW_PLAYING_ENDPOINT || ''

const POLL_MS = 30_000

async function fetchNowPlaying() {
  const response = await fetch(NOW_PLAYING_URL)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data = await response.json()
  return data.track ?? null
}

export function useSpotifyNowPlaying() {
  const configured = Boolean(NOW_PLAYING_URL)
  const track = ref(null)
  const loading = ref(configured)
  const error = ref(false)

  let poll = null
  let tick = null

  async function refresh() {
    try {
      track.value = await fetchNowPlaying()
      error.value = false
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (!configured) return

    refresh()
    poll = setInterval(refresh, POLL_MS)

    // Advance the progress bar between polls so it doesn't sit still.
    tick = setInterval(() => {
      if (!track.value?.isPlaying) return
      track.value = {
        ...track.value,
        progressMs: Math.min(track.value.progressMs + 1000, track.value.durationMs),
      }
    }, 1000)
  })

  onUnmounted(() => {
    if (poll) clearInterval(poll)
    if (tick) clearInterval(tick)
  })

  return { track, loading, error, configured }
}
