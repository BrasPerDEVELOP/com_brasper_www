<template>
  <section id="banner" class="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 text-white">
    <div class="absolute inset-0 -z-10">
      <div
        class="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-300/40 blur-3xl"
      />
      <div class="absolute right-0 top-28 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div class="absolute left-0 top-64 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
    </div>

    <div
      class="relative z-10 mx-auto flex max-w-7xl flex-col items-stretch justify-center gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:gap-6 lg:gap-12 lg:px-12 lg:py-20"
    >
      <div class="min-w-0 w-full flex-1 text-center md:text-left">
        <div class="flex items-center gap-2 font-bold">
          <Icon icon="ic:round-whatsapp" width="32" height="32" class="shrink-0" />
          <span class="inline-flex rounded-full px-3 py-1.5 text-xs uppercase tracking-widest text-white">
            <p class="text-yellow-400">{{ t('landing_badge_title') }}</p>
            {{ t('landing_badge') }}
          </span>
        </div>

        <h1 class="text-xl font-bold leading-snug sm:text-lg md:text-xl lg:text-3xl xl:text-4xl">
          {{ t('landing_title') }}
        </h1>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-center">
          <img
            :src="bannerImageSrc"
            :alt="t('landing_badge')"
            loading="eager"
            decoding="async"
            class=""
          />
        </div>
      </div>

      <div class="mx-auto w-full sm:w-lg">
        <div class="relative w-full min-w-[min(100%,280px)]">
          <div
            class="absolute -inset-3 -z-10 rounded-[30px] bg-gradient-to-r from-cyan-300/60 via-blue-300/40 to-cyan-300/60 blur-2xl"
          />
          <CalculatorView
            variant="banner"
            :initial-amount="1000"
            :show-button="true"
            :show-terms="true"
            :show-reductions="true"
            :button-text="t('send_money')"
            :title="t('calculatorTitle')"
            :subtitle="t('calculator_description')"
            custom-classes="!max-w-full !rounded-[30px] !p-6 sm:!p-8"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import CalculatorView from '@/modules/calculator/presentation/bodies/CalculatorView.vue'

const { t, locale } = useI18n()

const bannerImageSrc = computed(() => {
  const file = locale.value === 'es' ? 'es' : locale.value === 'en' ? 'en' : 'pr'
  return `/assets/images/banner/${file}.webp`
})
</script>
