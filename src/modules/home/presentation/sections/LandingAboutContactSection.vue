<template>
  <section class="bg-white px-4 py-20 sm:px-6 lg:px-8">
    <div class="container mx-auto flex flex-col items-center gap-10 lg:flex-row">
      <div class="w-full lg:w-1/2">
        <span class="mb-2 block text-2xl font-semibold text-indigo-600 sm:text-3xl">
          {{ t('landing_contact_title') }}
        </span>
        <h2 class="mb-8 text-center text-3xl font-bold leading-snug text-gray-900 md:text-4xl lg:text-left">
          {{ t('landing_about_company_title') }}
        </h2>
        <p class="mb-6 max-w-xl text-sm leading-relaxed text-gray-600">
          {{ t('landing_about_company_description') }}
        </p>

        <div class="mb-10 flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300">
              <svg class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div class="text-sm">
              <p class="text-gray-500">{{ t('landing_contact_title') }}</p>
              <a :href="`tel:${t('landing_contact_phone').replace(/\s/g, '')}`" class="font-bold text-gray-900">
                {{ t('landing_contact_phone') }}
              </a>
            </div>
          </div>
        </div>

        <div class="mr-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="rounded-xl border bg-white p-6 shadow transition hover:shadow-md">
            <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 class="mb-1 text-sm font-semibold">
              {{ t('landing_contact_feature_1_title') }}
            </h4>
            <p class="text-xs text-gray-600">
              {{ t('landing_contact_feature_1_description') }}
            </p>
          </div>
          <div class="rounded-xl border bg-white p-6 shadow transition hover:shadow-md">
            <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 class="mb-1 text-sm font-semibold">
              {{ t('landing_contact_feature_2_title') }}
            </h4>
            <p class="text-xs text-gray-600">
              {{ t('landing_contact_feature_2_description') }}
            </p>
          </div>
        </div>
      </div>

      <div class="relative hidden w-full items-center justify-center md:flex lg:w-1/2">
        <img
          src="/assets/images/acerca/img1.png"
          alt="Acerca de Brasper"
          class="z-10 w-72 rounded-lg object-cover shadow-lg md:w-96"
        />
        <img
          src="/assets/images/acerca/img2.png"
          alt="Acerca secundario"
          class="absolute bottom-0 left-0 w-48 -translate-x-[20%] translate-y-[30%] rounded-lg object-cover shadow-md md:w-60"
        />
        <div class="absolute right-0 top-0 h-20 w-20 translate-x-[50%] -translate-y-[30%] rounded-full bg-cyan-400/30 blur-sm md:h-24 md:w-24" />
        <div class="absolute bottom-0 right-0 h-16 w-16 translate-x-[50%] rounded-full bg-indigo-300/40 md:h-20 md:w-20" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
