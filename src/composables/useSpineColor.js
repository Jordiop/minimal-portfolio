import { reactive } from 'vue'

/**
 * Spine colours for the CD shelf, sampled from each cover in the browser so a
 * new album needs nothing but its cover. A `spine` colour on the album (set in
 * the CMS) wins over the sample.
 *
 * Covers on another origin without CORS headers can't be read back from a
 * canvas; those fall back to a muted colour derived from the album id.
 */
const cache = reactive({})

const FALLBACKS = ['#4a4238', '#5b3a2e', '#2f4a4a', '#3d3a52', '#57502f', '#4b2f3a', '#2e3f2e']

function hashColour(id) {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return FALLBACKS[hash % FALLBACKS.length]
}

/** Average of the cover, weighted towards saturated pixels so it isn't all mud. */
function sample(image) {
  const size = 24
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.drawImage(image, 0, 0, size, size)
  const { data } = context.getImageData(0, 0, size, size)

  let r = 0
  let g = 0
  let b = 0
  let total = 0
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2])
    const min = Math.min(data[i], data[i + 1], data[i + 2])
    const weight = 0.15 + (max - min) / 255
    r += data[i] * weight
    g += data[i + 1] * weight
    b += data[i + 2] * weight
    total += weight
  }

  const hex = (value) => Math.round(value / total).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

/** Dark text on light spines, light text on dark ones. */
export function inkFor(colour) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(colour.slice(i, i + 2), 16) / 255)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.55 ? '#16150f' : '#f2efe9'
}

export function useSpineColor() {
  function spineFor(album) {
    if (album.spine) return album.spine
    if (cache[album.id]) return cache[album.id]

    cache[album.id] = hashColour(album.id)

    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      try {
        cache[album.id] = sample(image)
      } catch {
        // Tainted canvas: keep the fallback.
      }
    }
    image.src = album.cover
    return cache[album.id]
  }

  return { spineFor, inkFor }
}
