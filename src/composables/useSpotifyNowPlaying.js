import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Spotify "currently playing", refreshed on an interval.
 *
 * Note: these credentials are inlined into the client bundle by Vite, so the
 * client secret and refresh token are visible to anyone who views the page.
 * The refresh token is read-only for playback state, but if you ever want it
 * private, move getAccessToken() behind a serverless function.
 */
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN

const POLL_MS = 30_000

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  })

  if (!response.ok) return null
  const data = await response.json()
  return data.access_token ?? null
}

async function fetchCurrentlyPlaying(token) {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  })

  // 204 means "nothing playing right now".
  if (response.status === 204 || !response.ok) return null

  const data = await response.json()
  if (!data?.item) return null

  const durationMs = data.item.duration_ms
  const progressMs = data.progress_ms ?? 0

  return {
    title: data.item.name,
    artist: data.item.artists.map((artist) => artist.name).join(', '),
    album: data.item.album.name,
    albumArt: data.item.album.images[0]?.url ?? '',
    spotifyUrl: data.item.external_urls.spotify,
    isPlaying: data.is_playing,
    progressMs,
    durationMs,
  }
}

export function useSpotifyNowPlaying() {
  const configured = Boolean(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN)
  const track = ref(null)
  const loading = ref(configured)
  const error = ref(false)

  let poll = null
  let tick = null

  async function refresh() {
    try {
      const token = await getAccessToken()
      if (!token) {
        error.value = true
        return
      }
      track.value = await fetchCurrentlyPlaying(token)
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
