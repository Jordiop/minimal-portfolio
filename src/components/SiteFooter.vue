<script setup>
import { site } from '@/data/site'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 border-t border-rule">
    <div class="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-2">
        <p class="label">{{ t('footer.elsewhere') }}</p>
        <ul class="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
          <li v-for="link in site.links" :key="link.label">
            <a
              :href="link.href"
              target="_blank"
              rel="noreferrer"
              class="link-draw text-muted"
            >{{ link.label }}</a>
          </li>
          <li>
            <a :href="`mailto:${site.email}`" class="link-draw text-muted">
              {{ t('footer.email') }}
            </a>
          </li>
        </ul>
      </div>

      <p class="label">{{ year }} {{ site.name }}</p>
    </div>
  </footer>
</template>
