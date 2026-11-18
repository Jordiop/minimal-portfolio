/**
 * The CD shelf on /music, read from src/content/music — one JSON file per
 * album, edited in Sveltia CMS at /admin/ (covers upload to public/media/music).
 *
 *   { "title", "artist", "year", "genre", "cover", "spotifyUrl"? }
 *
 * Shelved like a real one: alphabetically by artist, then by year.
 */
const files = import.meta.glob('/src/content/music/*.json', { eager: true, import: 'default' })

const sortName = (artist) => artist.replace(/^the\s+/i, '').toLowerCase()

export const albums = Object.entries(files)
  .map(([path, album]) => ({ ...album, id: path.split('/').pop().replace(/\.json$/, '') }))
  .sort(
    (a, b) => sortName(a.artist).localeCompare(sortName(b.artist)) || (a.year ?? 0) - (b.year ?? 0),
  )

const normalise = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

/** The shelf album that matches what Spotify is playing, if it's one of them. */
export function findShelved(track) {
  if (!track) return null
  const album = normalise(track.album)
  return albums.find((entry) => normalise(entry.title) === album) ?? null
}
