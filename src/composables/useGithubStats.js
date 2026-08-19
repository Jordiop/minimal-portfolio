import { ref } from 'vue'

/** Public, unauthenticated GitHub API. Cached in localStorage for 15 minutes. */
const CACHE_KEY = 'github-stats'
const CACHE_TTL = 15 * 60 * 1000

const stats = ref(null)
const isLoading = ref(false)
const error = ref('')

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { at, value } = JSON.parse(raw)
    return Date.now() - at < CACHE_TTL ? value : null
  } catch {
    return null
  }
}

export function useGithubStats() {
  async function fetchStats(username) {
    if (stats.value) return

    const cached = readCache()
    if (cached) {
      stats.value = cached
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const [user, repos] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`).then((r) => r.json()),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`).then((r) => r.json()),
      ])

      if (user.message) throw new Error(user.message)

      stats.value = {
        repos: user.public_repos ?? 0,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        stars: Array.isArray(repos)
          ? repos.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0)
          : 0,
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), value: stats.value }))
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : 'GitHub is unavailable'
    } finally {
      isLoading.value = false
    }
  }

  return { stats, isLoading, error, fetchStats }
}
