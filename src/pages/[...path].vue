<script>
export const route = { titleKey: 'titles.notFound', descriptionKey: 'seo.notFound' }
</script>

<script setup>
import { useI18n } from '@/i18n'
import PageHead from '@/components/PageHead.vue'

const { t } = useI18n()
</script>

<template>
  <div class="rise">
    <PageHead index="Error — 404" title="404" :lede="t('notFound.lede')" />

    <pre class="mt-8 overflow-x-auto border-l border-accent pl-4 text-[13px] leading-relaxed text-muted">throw new Error('Route not found: ' + $route.fullPath)</pre>

    <div class="mt-10 flex flex-wrap gap-x-6 gap-y-2">
      <RouterLink to="/" class="link-draw text-accent">{{ t('notFound.backHome') }}</RouterLink>
      <RouterLink to="/projects" class="link-draw text-muted">
        {{ t('notFound.seeProjects') }}
      </RouterLink>
    </div>
  </div>
</template>
