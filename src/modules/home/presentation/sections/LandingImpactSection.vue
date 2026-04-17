<template>
  <section
    id="impacto"
    class="relative overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    aria-labelledby="landing-impact-heading"
  >
    <div class="pointer-events-none absolute inset-0 z-0">
      <div class="absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div
        class="absolute bottom-1/4 right-1/4 h-[600px] w-[600px] translate-x-1/3 rounded-full bg-blue-600/10 blur-[150px]"
      />
    </div>

    <div class="relative z-10 mx-auto max-w-7xl">
      <div class="mb-14 flex flex-col items-start justify-between gap-8 lg:mb-20 lg:flex-row lg:items-end">
        <div class="max-w-2xl">
          <div class="mb-6 flex items-center gap-3">
            <span class="h-0.5 w-12 shrink-0 bg-cyan-400" aria-hidden="true" />
            <span class="text-xs font-extrabold uppercase tracking-widest text-blue-600">
              {{ t('landing_impact_kicker') }}
            </span>
          </div>
          <h2
            id="landing-impact-heading"
            class="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {{ t('landing_impact_title_line1') }}
            <span class="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">{{
              t('landing_impact_title_highlight')
            }}</span>
            {{ t('landing_impact_title_line2') }}
          </h2>
        </div>
        <p class="max-w-md text-left text-base leading-relaxed text-slate-600 lg:text-right lg:text-lg">
          {{ t('landing_impact_lead') }}
        </p>
      </div>

      <div class="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="item in impactStatItems"
          :key="item.valueKey"
          class="group relative overflow-hidden rounded-xl border border-cyan-500/10 bg-white/80 p-8 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
        >
          <div
            class="absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl transition-all duration-500"
            :class="item.glowOrbClass"
            aria-hidden="true"
          />
          <Icon :icon="item.icon" class="mb-6 text-3xl text-blue-600" aria-hidden="true" />
          <div
            class="text-4xl font-extrabold tracking-tighter text-slate-900"
            :class="item.valueNoteKey ? 'mb-1' : 'mb-2'"
          >
            {{ t(item.valueKey) }}
          </div>
          <p v-if="item.valueNoteKey" class="mb-2 text-xs font-medium text-slate-500">
            {{ t(item.valueNoteKey) }}
          </p>
          <div class="mb-4 text-xs font-bold uppercase tracking-widest text-blue-600">
            {{ t(item.labelKey) }}
          </div>
          <p class="text-sm leading-relaxed text-slate-600">
            {{ t(item.descKey) }}
          </p>
          <div class="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div class="h-full rounded-full transition-all duration-500" :class="[item.barWidthClass, item.barClass]" />
          </div>
        </article>
      </div>

   

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

interface ImpactStatItem {
  icon: string
  valueKey: string
  labelKey: string
  descKey: string
  barWidthClass: string
  barClass: string
  glowOrbClass: string
  /** Ej. leyenda “M = millones” bajo la cifra */
  valueNoteKey?: string
}

const impactStatItems = computed<ImpactStatItem[]>(() => [
  {
    icon: 'mdi:swap-horizontal',
    valueKey: 'landing_impact_stat_1_value',
    labelKey: 'landing_impact_stat_1_label',
    descKey: 'landing_impact_stat_1_description',
    barWidthClass: 'w-3/4',
    barClass: 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.35)]',
    glowOrbClass: 'bg-cyan-400/10 group-hover:bg-cyan-400/15'
  },
  {
    icon: 'mdi:account-group',
    valueKey: 'landing_impact_stat_2_value',
    labelKey: 'landing_impact_stat_2_label',
    descKey: 'landing_impact_stat_2_description',
    barWidthClass: 'w-1/2',
    barClass: 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.35)]',
    glowOrbClass: 'bg-blue-600/10 group-hover:bg-blue-600/15'
  },
  {
    icon: 'mdi:currency-usd',
    valueKey: 'landing_impact_stat_3_value',
    labelKey: 'landing_impact_stat_3_label',
    descKey: 'landing_impact_stat_3_description',
    barWidthClass: 'w-5/6',
    barClass: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.45)]',
    glowOrbClass: 'bg-cyan-400/10 group-hover:bg-cyan-400/15'
  },
  {
    icon: 'mdi:verified',
    valueKey: 'landing_impact_stat_4_value',
    labelKey: 'landing_impact_stat_4_label',
    descKey: 'landing_impact_stat_4_description',
    barWidthClass: 'w-full',
    barClass: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.45)]',
    glowOrbClass: 'bg-blue-600/10 group-hover:bg-blue-600/15'
  }
])
</script>
