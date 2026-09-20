/**
 * gallery-worker — the small Cloudflare Worker behind jordiop.{com,es,cat}.
 *
 * GET /list         lists the R2 photo bucket for /gallery
 * GET /now-playing  proxies Spotify "currently playing" for /music
 *
 * The Spotify credentials live here as Worker secrets rather than in the Vite
 * bundle, where anything VITE_* is public to whoever opens devtools.
 */

/** Production origins. Anything not matched here gets no CORS header at all. */
const ALLOWED_ORIGINS = new Set([
  'https://jordiop.com',
  'https://www.jordiop.com',
  'https://jordiop.es',
  'https://www.jordiop.es',
  'https://jordiop.cat',
  'https://www.jordiop.cat',
])

/** `vite dev` and `vite preview` pick their own ports, so match any of them. */
const LOCALHOST = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

/** Vercel preview deployments — drop this line if you don't want them allowed. */
const VERCEL_PREVIEW = /^https:\/\/[a-z0-9-]+\.vercel\.app$/

function isAllowed(origin) {
  return ALLOWED_ORIGINS.has(origin) || LOCALHOST.test(origin) || VERCEL_PREVIEW.test(origin)
}

/**
 * On a miss we omit Access-Control-Allow-Origin entirely instead of echoing a
 * default. Echoing some other domain is what made this fail silently before:
 * the worker answered 200 and the browser threw the body away.
 */
function corsHeaders(request) {
  const origin = request.headers.get('Origin') ?? ''

  // Vary: Origin on every response, or the CDN will serve one visitor's
  // allow-header to a visitor on a different domain.
  if (!isAllowed(origin)) return { Vary: 'Origin' }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

function json(body, request, { status = 200, cacheControl = 'no-store' } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cacheControl,
      ...corsHeaders(request),
    },
  })
}

/* -------------------------------------------------------------------------- */
/* /list                                                                       */
/* -------------------------------------------------------------------------- */

async function handleList(request, env) {
  if (!env.PHOTOS_BUCKET) {
    // Names the bindings that *are* present, so a misnamed binding is obvious
    // from the response instead of being a generic 500.
    const bindings = Object.keys(env).join(', ') || 'none'
    return json(
      { error: 'R2 bucket binding "PHOTOS_BUCKET" is missing', bindings },
      request,
      { status: 500 },
    )
  }

  const listed = await env.PHOTOS_BUCKET.list()

  return json(
    {
      objects: listed.objects.map((object) => ({
        key: object.key,
        size: object.size,
        uploaded: object.uploaded,
      })),
    },
    request,
    { cacheControl: 'public, max-age=60' },
  )
}

/* -------------------------------------------------------------------------- */
/* /now-playing                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Access tokens last an hour; the isolate usually outlives a few polls, so
 * caching one here saves a token round-trip per request. Best-effort only —
 * a cold isolate just fetches a fresh one.
 */
let cachedToken = { value: '', expiresAt: 0 }

async function getAccessToken(env) {
  if (cachedToken.value && Date.now() < cachedToken.expiresAt) return cachedToken.value

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
  })

  if (!response.ok) return null

  const data = await response.json()
  if (!data.access_token) return null

  // Expire a minute early so we never send a token that dies mid-flight.
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }

  return cachedToken.value
}

async function handleNowPlaying(request, env) {
  const missing = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN'].filter(
    (name) => !env[name],
  )

  if (missing.length) {
    return json({ error: `Missing secrets: ${missing.join(', ')}` }, request, { status: 500 })
  }

  const token = await getAccessToken(env)
  if (!token) return json({ error: 'Spotify token refresh failed' }, request, { status: 502 })

  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  })

  // 204 means "nothing playing right now" — not an error.
  if (response.status === 204) return json({ track: null }, request)
  if (!response.ok) return json({ error: `Spotify ${response.status}` }, request, { status: 502 })

  const data = await response.json()
  if (!data?.item) return json({ track: null }, request)

  // Shaped here rather than in the client, so the browser gets only what the
  // widget draws — no raw Spotify payload, no other playback state.
  return json(
    {
      track: {
        title: data.item.name,
        artist: data.item.artists.map((artist) => artist.name).join(', '),
        album: data.item.album.name,
        albumArt: data.item.album.images[0]?.url ?? '',
        spotifyUrl: data.item.external_urls.spotify,
        isPlaying: data.is_playing,
        progressMs: data.progress_ms ?? 0,
        durationMs: data.item.duration_ms,
      },
    },
    request,
  )
}

/* -------------------------------------------------------------------------- */

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) })
    }

    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed' }, request, { status: 405 })
    }

    try {
      if (pathname === '/list') return await handleList(request, env)
      if (pathname === '/now-playing') return await handleNowPlaying(request, env)
    } catch (error) {
      return json({ error: error.message }, request, { status: 500 })
    }

    return json({ error: 'Not found' }, request, { status: 404 })
  },
}
