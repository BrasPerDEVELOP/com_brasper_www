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
            <span class="text-cyan-600">{{ t('landing_attention_title_highlight') }}</span>
          </h2>
          <p class="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {{ t('landing_attention_description') }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article
            class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_32px_-4px_rgba(44,47,48,0.06)]"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ t('landing_attention_card_avg_title') }}
              </h3>
              <p class="mt-1 font-medium text-slate-600">
                {{ t('landing_attention_card_avg_description') }}
              </p>
            </div>
          </article>
          <article
            class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_32px_-4px_rgba(44,47,48,0.06)]"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-cyan-700">
              <Icon icon="ic:round-support-agent" class="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ t('landing_attention_card_support_title') }}
              </h3>
              <p class="mt-1 font-medium text-slate-600">
                {{ t('landing_attention_card_support_description') }}
              </p>
            </div>
          </article>
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
              src="/assets/images/home/horario.jpeg"
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
</script>
