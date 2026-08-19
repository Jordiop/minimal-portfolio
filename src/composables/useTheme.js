import { ref, computed } from 'vue'

const STORAGE_KEY = 'portfolio-theme'
const query = window.matchMedia('(prefers-color-scheme: dark)')

function readInitial() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return query.matches ? 'dark' : 'light'
}

// Module-level state: every component shares the same theme.
const theme = ref(readInitial())

function apply(value) {
  document.documentElement.classList.toggle('dark', value === 'dark')
}

apply(theme.value)

// Follow the OS while the visitor has not made an explicit choice.
query.addEventListener('change', (event) => {
  if (localStorage.getItem(STORAGE_KEY)) return
  theme.value = event.matches ? 'dark' : 'light'
  apply(theme.value)
})

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function setTheme(value) {
    theme.value = value
    localStorage.setItem(STORAGE_KEY, value)
    apply(value)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  /** Forget the choice and go back to following the operating system. */
  function useSystemTheme() {
    localStorage.removeItem(STORAGE_KEY)
    theme.value = query.matches ? 'dark' : 'light'
    apply(theme.value)
  }

  return { theme, isDark, setTheme, toggleTheme, useSystemTheme }
}
