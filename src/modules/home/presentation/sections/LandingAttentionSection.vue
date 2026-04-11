<template>
  <section
    id="atencion"
    class="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    aria-labelledby="landing-attention-heading"
  >
    <div class="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
    <div class="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

    <div class="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div class="space-y-8 lg:col-span-7">
        <div class="space-y-4">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 backdrop-blur-sm"
          >
            <Icon icon="mdi:lightning-bolt" class="h-4 w-4 text-cyan-700" aria-hidden="true" />
            <span class="text-xs font-bold uppercase tracking-widest text-cyan-800">
              {{ t('landing_attention_kicker') }}
            </span>
          </div>
          <h2
            id="landing-attention-heading"
            class="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl lg:leading-[1.1]"
          >
            {{ t('landing_attention_title_prefix') }}
            <span class="text-secondary">{{ t('landing_attention_title_highlight') }}</span>
          </h2>
         
        </div>

        <div class="max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
          <h3 class="text-xl font-bold tracking-tight text-secondary sm:text-2xl">
            {{ t('landing_attention_hours_title') }}
          </h3>

          <p class="mt-5 text-sm font-semibold text-slate-700">
            {{ t('landing_attention_hours_section_regular') }}
          </p>
          <ul class="mt-3 space-y-4" role="list">
            <li v-for="row in attentionRegularRows" :key="row.hoursKey" class="flex gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-white shadow-sm"
                aria-hidden="true"
              >
                <Icon icon="mdi:clock-outline" class="h-4 w-4" />
              </span>
              <p class="pt-0.5 text-base font-semibold leading-snug text-secondary">
                {{ t(row.labelKey) }}:
                <span class="font-bold"> {{ t(row.hoursKey) }}</span>
              </p>
            </li>
          </ul>

          <p class="mt-6 text-sm font-semibold text-slate-700">
            {{ t('landing_attention_hours_section_extended') }}
          </p>
          <ul class="mt-3 space-y-4" role="list">
            <li v-for="row in attentionExtendedRows" :key="row.hoursKey" class="flex gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-white shadow-sm"
                aria-hidden="true"
              >
                <Icon icon="mdi:clock-outline" class="h-4 w-4" />
              </span>
              <p class="pt-0.5 text-base font-semibold leading-snug text-secondary">
                {{ t(row.labelKey) }}:
                <span class="font-bold"> {{ t(row.hoursKey) }}</span>
              </p>
            </li>
          </ul>

          <p class="mt-6 text-sm font-semibold text-slate-700">
            {{ t('landing_attention_hours_section_holidays') }}
          </p>
          <ul class="mt-3 space-y-4" role="list">
            <li v-for="row in attentionHolidayRows" :key="row.hoursKey" class="flex gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-white shadow-sm"
                aria-hidden="true"
              >
                <Icon icon="mdi:clock-outline" class="h-4 w-4" />
              </span>
              <p class="pt-0.5 text-base font-semibold leading-snug text-secondary">
                {{ t(row.labelKey) }}:
                <span class="font-bold"> {{ t(row.hoursKey) }}</span>
              </p>
            </li>
          </ul>

          <p class="mt-5 text-xs leading-relaxed text-slate-500">
            {{ t('landing_attention_hours_footnote') }}
          </p>
        </div>

    

        <div class="pt-2">
          <a
            href="#banner"
            class="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg ring-1 ring-white/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-600/25 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] active:shadow-lg"
          >
            {{ t('landing_attention_cta') }}
            <svg
              class="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      <div class="relative lg:col-span-5">
        <div class="relative z-10 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-slate-200/60">
          <div class="relative aspect-square w-full min-h-[280px] sm:min-h-0">
            <img
              src="/assets/images/home/horario.png"
              :alt="t('landing_attention_image_alt')"
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

const attentionRegularRows = [
  { labelKey: 'landing_attention_hours_weekdays_label', hoursKey: 'landing_attention_hours_weekdays_hours' },
] as const

const attentionExtendedRows = [
  { labelKey: 'landing_attention_hours_saturday_label', hoursKey: 'landing_attention_hours_saturday_hours' },
  { labelKey: 'landing_attention_hours_sunday_label', hoursKey: 'landing_attention_hours_sunday_hours' },
] as const

const attentionHolidayRows = [
  { labelKey: 'landing_attention_hours_holiday_label', hoursKey: 'landing_attention_hours_holiday_hours' },
] as const
</script>
