<script setup>
import { useI18n } from '@/i18n'

const { locale, locales, setLocale, t } = useI18n()
</script>

<template>
  <div
    class="flex h-7 items-center border border-rule"
    role="group"
    :aria-label="t('language.label')"
  >
    <button
      v-for="(entry, index) in locales"
      :key="entry.code"
      type="button"
      class="h-full px-2 text-[11px] uppercase tracking-[0.12em] transition-colors duration-300"
      :class="[
        index > 0 ? 'border-l border-rule' : '',
        locale === entry.code ? 'text-accent' : 'text-muted hover:text-ink',
      ]"
      :aria-pressed="locale === entry.code"
      :title="entry.name"
      @click="setLocale(entry.code)"
    >
      {{ entry.label }}
    </button>
  </div>
</template>
