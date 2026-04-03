<template>
  <section id="how-it-works" class="relative z-10 bg-white px-4 py-20 sm:px-6 lg:px-8">
    <div class="mb-16 text-center">
      <p class="text-3xl font-semibold text-indigo-600">
        {{ t('landing_section_process') }}
      </p>
      <h2 class="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
        {{ t('landing_section_process_title') }}
      </h2>
    </div>

    <div class="relative mb-20 flex w-full justify-center">
      <div class="pointer-events-none absolute left-0 right-0 top-6 mx-auto hidden w-full max-w-5xl md:block">
        <svg viewBox="0 0 1200 160" class="h-24 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40 120C220 20 380 20 560 120C740 20 900 20 1160 120"
            stroke="#cbd5e1"
            stroke-width="6"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <div class="flex w-full max-w-5xl justify-between px-4">
        <div
          v-for="(step, index) in processSteps"
          :key="`process-badge-${step.number}`"
          class="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-lg font-bold text-white shadow-xl ring-4 ring-white"
          :style="{
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
            marginTop: index % 2 === 0 ? '2rem' : '0'
          }"
        >
          {{ step.number }}
        </div>
      </div>
    </div>

    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 text-center sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="step in processSteps"
        :key="`process-step-${step.number}`"
        class="rounded-lg p-6 text-gray-800 shadow-md duration-300 hover:bg-blue-600 hover:text-white"
      >
        <h4 class="mb-2 text-lg font-bold">
          {{ step.title }}
        </h4>
        <p class="text-sm">
          {{ step.description }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const processSteps = computed(() => [
  {
    number: '01',
    title: t('landing_simple_guide_step_1_title'),
    description: t('landing_simple_guide_step_1_description')
  },
  {
    number: '02',
    title: t('landing_simple_guide_step_2_title'),
    description: t('landing_simple_guide_step_2_description')
  },
  {
    number: '03',
    title: t('landing_simple_guide_step_3_title'),
    description: t('landing_simple_guide_step_3_description')
  },
  {
    number: '04',
    title: t('landing_simple_guide_step_4_title'),
    description: t('landing_simple_guide_step_4_description')
  }
])
</script>
