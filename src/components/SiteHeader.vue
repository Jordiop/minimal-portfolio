<script setup>
import { navRoutes } from '@/router'
import { site } from '@/data/site'
import { useI18n } from '@/i18n'
import LocaleSwitch from './LocaleSwitch.vue'
import ThemeToggle from './ThemeToggle.vue'

const { t, pick } = useI18n()

const pad = (index) => String(index + 1).padStart(2, '0')
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur-sm">
    <!--
      Mobile: brand + controls on the first row, the nav bleeds into a scrollable
      second row. Desktop: all three on one line.
    -->
    <div class="shell grid grid-cols-[1fr_auto] items-center gap-x-4 sm:grid-cols-[1fr_auto_auto] sm:gap-x-8">
      <RouterLink
        to="/"
        class="flex h-14 min-w-0 items-center gap-2 text-[13px] transition-colors duration-300 hover:text-accent"
      >
        <span class="truncate font-bold tracking-tight">{{ site.name }}</span>
        <span class="hidden shrink-0 text-faint 2xl:inline">/ {{ pick(site.role).toLowerCase() }}</span>
      </RouterLink>

      <nav
        class="order-last col-span-2 -mx-6 flex items-center gap-5 overflow-x-auto border-t border-rule px-6 py-2.5 sm:order-none sm:col-span-1 sm:mx-0 sm:border-t-0 sm:px-0 sm:py-0"
      >
        <RouterLink
          v-for="(item, index) in navRoutes"
          :key="item.path"
          :to="item.path"
          class="group flex shrink-0 items-baseline gap-1.5 text-[13px] text-muted transition-colors duration-300 hover:text-ink"
          active-class="!text-ink"
        >
          <span class="hidden text-[10px] text-faint transition-colors group-hover:text-accent xl:inline">
            {{ pad(index) }}
          </span>
          <span class="link-draw">{{ t(item.meta.labelKey) }}</span>
        </RouterLink>
      </nav>

      <div class="flex h-14 items-center justify-end gap-2">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
