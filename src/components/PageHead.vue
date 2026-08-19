<script setup>
defineProps({
  index: { type: String, default: '' },
  title: { type: String, required: true },
  lede: { type: String, default: '' },
})
</script>

<template>
  <header class="border-b border-rule pb-8">
    <p v-if="index" class="label mb-6">{{ index }}</p>
    <h1 class="text-3xl/none font-bold tracking-tight sm:text-5xl/none">
      {{ title }}
    </h1>
    <p v-if="lede" class="mt-6 max-w-[52ch] text-muted">{{ lede }}</p>
    <slot />
  </header>
</template>
