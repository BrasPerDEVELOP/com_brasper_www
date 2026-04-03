<template>
  <section id="about" class="relative z-10 bg-white px-4 py-20 sm:px-6 lg:px-8">
    <div class="container mx-auto flex flex-col items-center gap-12 lg:flex-row">
      <div class="relative flex w-full flex-col items-center lg:w-1/2">
        <div class="relative z-10 w-full max-w-md">
          <img src="/assets/images/about/about-five1.jpg" alt="Personas trabajando" class="w-full rounded-lg" />
          <button
            type="button"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-cyan-400 px-6 py-2 text-center font-bold text-white shadow-lg"
            @click="scrollToVisionMission"
          >
            {{ t('landing_vision_mission_title') }}
          </button>
        </div>
      </div>

      <div class="w-full lg:w-1/2">
        <div class="mb-10">
          <span class="mb-2 block font-semibold text-indigo-600">
            {{ t('landing_section_advantages') }}
          </span>
          <h2 class="text-3xl font-bold text-gray-900 lg:text-4xl">
            {{ t('landing_section_advantages_title') }}
          </h2>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-xl bg-gray-100 p-6 shadow-sm">
            <div class="mb-4 flex items-center gap-2 text-2xl text-indigo-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h4 class="text-lg font-semibold">{{ t('landing_mission_title') }}</h4>
            </div>
            <p class="text-sm text-gray-700">{{ t('landing_mission_description') }}</p>
          </div>

          <div class="rounded-xl bg-gray-100 p-6 shadow-sm">
            <div class="mb-4 flex items-center gap-2 text-2xl text-indigo-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <h4 class="text-lg font-semibold">{{ t('landing_vision_title') }}</h4>
            </div>
            <p class="text-sm text-gray-700">{{ t('landing_vision_description') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const scrollToVisionMission = () => {
  const section = document.getElementById('vymision')
  section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
