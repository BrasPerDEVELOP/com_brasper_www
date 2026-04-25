<template>
  <section class="bg-gradient-to-b from-gray-50 to-white px-4 py-16 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-6xl">
      <div class="mb-12 text-center">
        <span class="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {{ t('landing_partners_title') }}
        </span>
        <h2 class="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
          {{ t('landing_partners_subtitle') }}
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-gray-600">
          {{ t('landing_partners_description') }}
        </p>
      </div>

      <div class="relative">
        <div class="overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-500 ease-in-out">
          <div class="flex flex-col items-center lg:flex-row lg:items-start">
            <div
              class="flex min-h-[300px] w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-8 lg:w-2/5 lg:p-12"
            >
              <div class="text-center">
                <img
                  v-if="!logoErrors[currentPartner.id]"
                  :src="currentPartner.logo"
                  :alt="currentPartner.name"
                  class="mx-auto mb-4 max-h-[200px] max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  width="332"
                  height="235"
                  @error="markLogoError(currentPartner.id)"
                />
                <div v-else class="text-sm text-gray-400">Logo no disponible</div>
                <h3 class="mt-4 text-xl font-bold text-gray-800">
                  {{ currentPartner.title }}
                </h3>
              </div>
            </div>

            <div class="w-full p-8 lg:w-3/5 lg:p-12">
              <h4 class="mb-4 text-2xl font-bold text-gray-900">
                {{ currentPartner.name }}
              </h4>
              <p class="mb-6 leading-relaxed text-gray-600">
                {{ currentPartner.description }}
              </p>

              <ul class="mb-6 space-y-3">
                <li
                  v-for="(benefit, index) in currentPartner.benefits"
                  :key="`${currentPartner.id}-${index}`"
                  class="flex items-start gap-3 text-gray-700"
                >
                  <span class="mt-1 text-blue-600">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Partner anterior"
          class="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-x-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-blue-200 bg-white text-2xl text-blue-600 shadow-lg transition-all duration-300 hover:scale-110 hover:border-blue-400 hover:bg-blue-50 md:flex"
          @click="prevPartner"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Siguiente partner"
          class="absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 translate-x-12 items-center justify-center rounded-full border-2 border-blue-200 bg-white text-2xl text-blue-600 shadow-lg transition-all duration-300 hover:scale-110 hover:border-blue-400 hover:bg-blue-50 md:flex"
          @click="nextPartner"
        >
          ›
        </button>

        <div class="mt-8 flex justify-center gap-2">
          <button
            v-for="(_, index) in partners"
            :key="`partner-dot-${index}`"
            type="button"
            :aria-label="`Ir al partner ${index + 1}`"
            class="h-3 rounded-full transition-all duration-300"
            :class="index === currentIndex ? 'w-8 bg-blue-600' : 'w-3 bg-gray-300 hover:bg-gray-400'"
            @click="goToPartner(index)"
          />
        </div>
      </div>

      <div class="mt-4 text-center text-sm text-gray-500">
        {{ currentIndex + 1 }} / {{ partners.length }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLandingPartners } from '../composables/useLandingPartners'

const { t } = useI18n()
const {
  partners,
  currentIndex,
  currentPartner,
  logoErrors,
  goToPartner,
  nextPartner,
  prevPartner,
  markLogoError
} = useLandingPartners()
</script>
