<template>
  <section
    id="faq"
    class="relative overflow-hidden bg-gradient-to-b from-slate-50 via-cyan-50/40 to-white px-4 py-20 sm:px-6 lg:px-8"
  >
    <div class="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-r from-blue-600/10 via-cyan-400/10 to-blue-500/10 blur-3xl"></div>
    <div class="mx-auto max-w-6xl">
      <div class="mb-10 text-center">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">{{ t('faq') }}</p>
        <h2 class="text-3xl font-bold text-[#0c1b3a] sm:text-4xl">{{ t('landing_section_faq_title') }}</h2>
        <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Resuelve tus dudas sobre transferencias, tiempos, monedas y condiciones con una guia clara y directa.
        </p>
      </div>

      <div class="flex flex-col gap-6 md:flex-row">
        <aside class="w-full md:w-72">
          <div class="rounded-[28px] bg-[#0F123E] p-4 shadow-[0_20px_60px_rgba(15,18,62,0.18)]">
            <div class="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Brasper Help</p>
              <p class="mt-2 text-sm leading-relaxed text-white/80">
                Encuentra respuestas rapidas y revisa nuestras condiciones antes de operar.
              </p>
            </div>
            <div class="space-y-3">
              <button
                type="button"
                class="w-full rounded-2xl px-4 py-3 text-left font-semibold transition-all"
                :class="
                  activeFaqTab === 'faq'
                    ? 'bg-cyan-400 text-[#0F123E] shadow-lg'
                    : 'bg-white/8 text-white hover:bg-white/14'
                "
                @click="activeFaqTab = 'faq'"
              >
                {{ t('faq') }}
              </button>
              <button
                type="button"
                class="w-full rounded-2xl px-4 py-3 text-left font-semibold transition-all"
                :class="
                  activeFaqTab === 'terms'
                    ? 'bg-[#d3ff00] text-[#0F123E] shadow-lg'
                    : 'bg-white/8 text-white hover:bg-white/14'
                "
                @click="activeFaqTab = 'terms'"
              >
                {{ termsTabLabel }}
              </button>
            </div>
          </div>
        </aside>

        <main class="flex-1 rounded-[30px] border border-cyan-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
          <div v-if="activeFaqTab === 'faq'" class="space-y-4">
            <div class="mb-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 class="text-2xl font-bold text-[#0c1b3a]">
                  {{ t('faq') }}
                </h3>
                <p class="mt-2 text-sm text-slate-500">
                  Informacion clave sobre el servicio Brasper.
                </p>
              </div>
              <div class="hidden rounded-2xl bg-cyan-50 px-4 py-3 text-right sm:block">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">FAQ</p>
                <p class="mt-1 text-2xl font-bold text-[#0F123E]">{{ faqs.length }}</p>
              </div>
            </div>

            <details
              v-for="(item, index) in faqs"
              :key="item.question"
              class="faq-item group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-cyan-300 hover:shadow-md"
            >
              <summary class="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-bold text-white">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>
                <div class="flex-1">
                  <span class="block text-base font-semibold text-[#0c1b3a]">
                    {{ item.question }}
                  </span>
                </div>
                <span class="faq-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#0F123E] transition-transform">
                  +
                </span>
              </summary>
              <div class="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-sm leading-relaxed text-slate-700">
                {{ item.answer }}
              </div>
            </details>
          </div>

          <div v-else class="space-y-5">
            <div class="rounded-[26px] bg-gradient-to-r from-[#0F123E] via-blue-700 to-cyan-500 p-6 text-white shadow-lg">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Legal</p>
              <h3 class="mt-2 text-2xl font-bold">
                {{ termsTabLabel }}
              </h3>
              <p class="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
                {{ termsDescription }}
              </p>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p class="text-sm leading-relaxed text-slate-600">
                Consulta el documento oficial con politicas, condiciones operativas y detalles importantes del servicio.
              </p>
              <a
                href="https://drive.google.com/file/d/1ACrx6qdwvws_pSuUrlL2w4AgNydPMlW6/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-5 inline-flex rounded-xl bg-[#0F123E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {{ termsButtonLabel }}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const activeFaqTab = ref<'faq' | 'terms'>('faq')

const termsTabLabel = computed(() => {
  if (locale.value === 'en') return 'Terms and Conditions'
  if (locale.value === 'pt') return 'Termos e Condicoes'
  return 'Terminos y Condiciones'
})

const termsDescription = computed(() => {
  if (locale.value === 'en') {
    return 'Review the conditions, policies, and operating details before making your transfer.'
  }
  if (locale.value === 'pt') {
    return 'Revise as condicoes, politicas e detalhes operacionais antes de realizar sua transferencia.'
  }
  return 'Revisa las condiciones, politicas y detalles operativos antes de realizar tu transferencia.'
})

const termsButtonLabel = computed(() => {
  if (locale.value === 'en') return 'Open terms document'
  if (locale.value === 'pt') return 'Abrir documento de termos'
  return 'Abrir documento de terminos'
})

const faqs = computed(() => [
  { question: t('landing_faq_1_question'), answer: t('landing_faq_1_answer') },
  { question: t('landing_faq_2_question'), answer: t('landing_faq_2_answer') },
  { question: t('landing_faq_3_question'), answer: t('landing_faq_3_answer') },
  { question: t('landing_faq_4_question'), answer: t('landing_faq_4_answer') }
])
</script>

<style scoped>
.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item[open] {
  border-color: rgb(34 211 238 / 0.8);
  box-shadow: 0 12px 30px rgba(14, 165, 233, 0.12);
}

.faq-item[open] .faq-icon {
  transform: rotate(45deg);
  background: rgb(34 211 238 / 0.14);
}
</style>
