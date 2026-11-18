<script setup>
import { navRoutes } from '@/router'
import { site } from '@/data/site'
import { useI18n } from '@/i18n'
import IconGlyph from './IconGlyph.vue'
import LocaleSwitch from './LocaleSwitch.vue'
import ThemeToggle from './ThemeToggle.vue'

const { t } = useI18n()
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur-sm">
    <!--
      Mobile: brand + controls on the first row, the icons spread across a
      second row. Desktop: all three on one line.
    -->
    <div class="shell grid grid-cols-[1fr_auto] items-center gap-x-4 sm:grid-cols-[1fr_auto_auto] sm:gap-x-6">
      <RouterLink
        to="/"
        class="flex h-14 min-w-0 items-center gap-2 text-[13px] transition-colors duration-300 hover:text-accent"
      >
        <span class="truncate font-bold tracking-tight">{{ site.name }}</span>
      </RouterLink>

      <nav
        class="order-last col-span-2 -mx-6 flex items-center justify-between border-t border-rule px-4 sm:order-none sm:col-span-1 sm:mx-0 sm:justify-start sm:gap-1 sm:border-t-0 sm:px-0"
      >
        <RouterLink
          v-for="item in navRoutes"
          :key="item.path"
          :to="item.path"
          :aria-label="t(item.meta.labelKey)"
          class="nav-icon group relative flex h-11 w-10 items-center justify-center text-muted transition-colors duration-300 hover:text-ink sm:h-14 sm:w-9"
          active-class="is-active"
        >
          <IconGlyph :name="item.meta.icon" :size="17" />
          <span class="nav-icon__tip" aria-hidden="true">{{ t(item.meta.labelKey) }}</span>
        </RouterLink>
      </nav>

      <div class="flex h-14 items-center justify-end gap-2">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* The current page: ink-coloured icon over a short accent rule. */
.nav-icon.is-active {
  color: var(--ink);
}
.nav-icon::after {
  content: "";
  position: absolute;
  bottom: 9px;
  left: 50%;
  width: 0;
  height: 1px;
  background: var(--accent);
  translate: -50% 0;
  transition: width 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
.nav-icon.is-active::after {
  width: 14px;
}
.nav-icon:hover {
  color: var(--accent);
}

/* Label on hover or keyboard focus — the same small caps as every other label. */
.nav-icon__tip {
  position: absolute;
  top: calc(100% - 4px);
  left: 50%;
  translate: -50% -4px;
  padding: 3px 7px;
  white-space: nowrap;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--paper);
  border: 1px solid var(--rule);
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease, translate 180ms ease;
}
.nav-icon:hover .nav-icon__tip,
.nav-icon:focus-visible .nav-icon__tip {
  opacity: 1;
  translate: -50% 0;
}

/* Touch screens have no hover; the icons have to stand on their own there. */
@media (hover: none) {
  .nav-icon__tip { display: none; }
}
</style>
