<template>
  <section id="services" class="bg-[#1b1f2e] px-4 py-16 text-white sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-12 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl">
          {{ t('landing_best_rates_title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-8 text-left md:grid-cols-2 lg:grid-cols-3">
        <article v-for="(service, index) in services" :key="`service-${index}`" class="flex items-start gap-4">
          <span
            class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.icon" />
            </svg>
          </span>
          <div>
            <h4 class="mb-1 text-sm font-bold">
              {{ service.title }}
            </h4>
            <p class="text-sm text-gray-300">
              {{ service.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const services = computed(() => [
  {
    title: t('landing_best_rates_transfers_title'),
    description: t('landing_best_rates_transfers_description'),
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
  },
  {
    title: t('landing_best_rates_quotations_title'),
    description: t('landing_best_rates_quotations_description'),
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    title: t('landing_best_rates_shipments_title'),
    description: t('landing_best_rates_shipments_description'),
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    title: t('landing_best_rates_services_title'),
    description: t('landing_best_rates_services_description'),
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  {
    title: t('landing_best_rates_improvement_title'),
    description: t('landing_best_rates_improvement_description'),
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  }
])
</script>
