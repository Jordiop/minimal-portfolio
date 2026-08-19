<script setup>
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/i18n'

const { isDark, toggleTheme } = useTheme()
const { t } = useI18n()
</script>

<template>
  <button
    type="button"
    class="group relative flex h-7 items-center gap-2 border border-rule px-2 text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
    :aria-label="isDark ? t('theme.toLight') : t('theme.toDark')"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <span
      class="h-2 w-2 shrink-0 border border-current transition-colors duration-300"
      :class="isDark ? 'bg-transparent' : 'bg-current'"
    />
    <span class="hidden md:inline">{{ isDark ? t('theme.dark') : t('theme.light') }}</span>
  </button>
</template>
