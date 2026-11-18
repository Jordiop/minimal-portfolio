<script setup>
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/i18n'
import IconGlyph from './IconGlyph.vue'

const { isDark, toggleTheme } = useTheme()
const { t } = useI18n()
</script>

<template>
  <!-- Shows the current theme: a moon in dark mode, a sun in light mode. -->
  <button
    type="button"
    class="theme-toggle relative flex h-7 w-7 items-center justify-center overflow-hidden border border-rule text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
    :aria-label="isDark ? t('theme.toLight') : t('theme.toDark')"
    :title="isDark ? t('theme.toLight') : t('theme.toDark')"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <Transition name="theme-icon" mode="out-in">
      <IconGlyph v-if="isDark" key="moon" name="moon" :size="14" />
      <IconGlyph v-else key="sun" name="sun" :size="14" />
    </Transition>
  </button>
</template>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: opacity 180ms ease, transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}
.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}
</style>
