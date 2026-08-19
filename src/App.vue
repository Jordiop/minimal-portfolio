<script setup>
import { useSeoHead } from '@/composables/useSeo'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'

// Single writer for <title>, meta, canonical and hreflang.
useSeoHead()
</script>

<template>
  <div class="relative z-10 flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-accent focus:bg-paper focus:px-3 focus:py-2 focus:text-[13px]"
    >
      Skip to content
    </a>

    <SiteHeader />

    <main id="main" class="shell flex-1 pt-16 sm:pt-24">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <SiteFooter />
  </div>
</template>
