<template>
  <section
    id="faq"
    class="relative overflow-hidden bg-gradient-to-b from-slate-50 via-cyan-50/30 to-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-r from-azure-600/10 via-cyan-400/10 to-azure-500/10 blur-3xl"
      aria-hidden="true"
    ></div>

    <div class="mx-auto max-w-6xl">
      <header class="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h1 class="text-3xl font-bold tracking-tight text-[#0c1b3a] sm:text-4xl">
          {{ t('landing_section_faq_title') }}
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          {{ t('faq_intro') }}
        </p>
      </header>

      <div class="grid items-start gap-5 md:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
        <aside class="md:sticky md:top-24">
          <div
            class="rounded-3xl bg-gradient-to-br from-[#1b1f2e] via-[#161c2f] to-[#101426] p-4 shadow-[0_18px_45px_-18px_rgba(15,18,62,0.55)] sm:p-5"
          >
            <div class="flex items-start gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300 ring-1 ring-inset ring-cyan-400/25"
                aria-hidden="true"
              >
                <Icon icon="mdi:lifebuoy" width="20" height="20" />
              </span>
              <div class="min-w-0">
                <p class="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  {{ t('faq_help_label') }}
                </p>
                <p class="mt-1.5 text-sm leading-relaxed text-white/70">
                  {{ t('faq_help_text') }}
                </p>
              </div>
            </div>

            <div
              class="mt-4 grid grid-cols-2 gap-2 md:mt-5 md:grid-cols-1"
              role="tablist"
              :aria-label="t('faq_help_label')"
            >
              <button
                v-for="tab in tabs"
                :id="`faq-tab-${tab.id}`"
                :key="tab.id"
                type="button"
                role="tab"
                :aria-selected="activeFaqTab === tab.id"
                :aria-controls="`faq-panel-${tab.id}`"
                class="group flex items-center gap-2.5 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                :class="
                  activeFaqTab === tab.id
                    ? 'bg-cyan-400 text-[#1b1f2e] shadow-lg shadow-cyan-500/20'
                    : 'bg-white/[0.06] text-white/80 hover:bg-white/[0.12] hover:text-white'
                "
                @click="activeFaqTab = tab.id"
              >
                <Icon :icon="tab.icon" width="18" height="18" class="shrink-0" aria-hidden="true" />
                <span class="min-w-0 flex-1 leading-snug">{{ tab.label }}</span>
                <Icon
                  icon="mdi:chevron-right"
                  width="16"
                  height="16"
                  class="hidden shrink-0 transition-transform md:block"
                  :class="activeFaqTab === tab.id ? 'translate-x-0.5' : 'text-white/40 group-hover:translate-x-0.5'"
                  aria-hidden="true"
                />
              </button>
            </div>

            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:border-cyan-300/50 hover:bg-cyan-400/10 hover:text-cyan-200 md:mt-5"
            >
              <Icon icon="ic:round-whatsapp" width="18" height="18" aria-hidden="true" />
              {{ whatsappLabel }}
            </a>
          </div>
        </aside>

        <div
          class="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-6 lg:p-8"
        >
          <div
            v-if="activeFaqTab === 'faq'"
            id="faq-panel-faq"
            role="tabpanel"
            aria-labelledby="faq-tab-faq"
          >
            <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <p class="flex items-center gap-2.5 text-sm text-slate-600">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-azure-50 text-azure-600"
                  aria-hidden="true"
                >
                  <Icon icon="mdi:information-outline" width="18" height="18" />
                </span>
                {{ t('faq_key_info') }}
              </p>
              <span
                class="hidden shrink-0 items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 sm:inline-flex"
              >
                FAQ
                <span class="text-sm font-bold tracking-normal text-[#1b1f2e]">{{ faqs.length }}</span>
              </span>
            </div>

            <div class="mt-4 flex flex-col gap-2.5">
              <details
                v-for="(item, index) in faqs"
                :key="item.question"
                name="brasper-faq"
                class="faq-item group rounded-2xl border border-slate-200 bg-white transition-colors hover:border-azure-300"
              >
                <summary
                  class="flex cursor-pointer list-none items-center gap-3 px-3.5 py-3.5 sm:gap-4 sm:px-5 sm:py-4"
                >
                  <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-azure-600 to-cyan-400 text-xs font-bold text-white shadow-sm shadow-azure-600/20 sm:h-9 sm:w-9 sm:text-sm"
                  >
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <span
                    class="flex-1 text-sm font-semibold leading-snug text-[#1b1f2e] transition-colors group-hover:text-azure-700 sm:text-base"
                  >
                    {{ item.question }}
                  </span>
                  <span
                    class="faq-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-hover:bg-azure-50 group-hover:text-azure-600"
                  >
                    <Icon icon="mdi:chevron-down" width="18" height="18" aria-hidden="true" />
                  </span>
                </summary>
                <div
                  class="faq-answer border-t border-slate-100 px-3.5 pb-4 pt-3 text-sm leading-relaxed text-slate-600 sm:px-5 sm:pb-5 sm:pl-[4.25rem]"
                >
                  {{ item.answer }}
                </div>
              </details>
            </div>
          </div>

          <div
            v-else
            id="faq-panel-terms"
            role="tabpanel"
            aria-labelledby="faq-tab-terms"
            class="space-y-4"
          >
            <div
              class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b1f2e] via-azure-700 to-cyan-500 p-6 text-white shadow-lg sm:p-7"
            >
              <div
                class="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                aria-hidden="true"
              ></div>
              <p
                class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cyan-100 ring-1 ring-inset ring-white/20"
              >
                <Icon icon="mdi:scale-balance" width="14" height="14" aria-hidden="true" />
                Legal
              </p>
              <h2 class="mt-3 text-xl font-bold sm:text-2xl">
                {{ termsTabLabel }}
              </h2>
              <p class="mt-2.5 max-w-2xl text-sm leading-relaxed text-white/85">
                {{ termsDescription }}
              </p>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
              <p class="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                <Icon
                  icon="mdi:file-document-outline"
                  width="20"
                  height="20"
                  class="mt-0.5 shrink-0 text-azure-600"
                  aria-hidden="true"
                />
                <span>{{ t('faq_terms_doc_text') }}</span>
              </p>
              <a
                :href="TERMS_DOC_URL"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1b1f2e] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-azure-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-500/50"
              >
                {{ termsButtonLabel }}
                <Icon icon="mdi:open-in-new" width="16" height="16" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

type FaqTab = 'faq' | 'terms'
type SupportedLocale = 'es' | 'en' | 'pt'

const TERMS_DOC_URL =
  'https://drive.google.com/file/d/1ACrx6qdwvws_pSuUrlL2w4AgNydPMlW6/view?usp=sharing'
const WHATSAPP_PHONE_NUMBER = '51966991933'

const whatsappCopy: Record<SupportedLocale, { label: string; message: string }> = {
  es: {
    label: 'Atención por WhatsApp',
    message: 'Hola, tengo una consulta sobre las condiciones del servicio.'
  },
  en: {
    label: 'WhatsApp support',
    message: 'Hello, I have a question about the service conditions.'
  },
  pt: {
    label: 'Atendimento pelo WhatsApp',
    message: 'Olá, tenho uma dúvida sobre as condições do serviço.'
  }
}

const { t, locale } = useI18n()
const activeFaqTab = ref<FaqTab>('faq')

const currentLocale = computed<SupportedLocale>(() => {
  const value = locale.value
  return value === 'es' || value === 'en' || value === 'pt' ? value : 'es'
})

const termsTabLabel = computed(() => {
  if (currentLocale.value === 'en') return 'Terms and Conditions'
  if (currentLocale.value === 'pt') return 'Termos e Condicoes'
  return 'Terminos y Condiciones'
})

const termsDescription = computed(() => {
  if (currentLocale.value === 'en') {
    return 'Review the conditions, policies, and operating details before making your transfer.'
  }
  if (currentLocale.value === 'pt') {
    return 'Revise as condicoes, politicas e detalhes operacionais antes de realizar sua transferencia.'
  }
  return 'Revisa las condiciones, politicas y detalles operativos antes de realizar tu transferencia.'
})

const termsButtonLabel = computed(() => {
  if (currentLocale.value === 'en') return 'Open terms document'
  if (currentLocale.value === 'pt') return 'Abrir documento de termos'
  return 'Abrir documento de terminos'
})

const tabs = computed<Array<{ id: FaqTab; label: string; icon: string }>>(() => [
  { id: 'faq', label: t('faq'), icon: 'mdi:comment-question-outline' },
  { id: 'terms', label: termsTabLabel.value, icon: 'mdi:file-document-outline' }
])

const whatsappLabel = computed(() => whatsappCopy[currentLocale.value].label)
const whatsappUrl = computed(() => {
  const message = encodeURIComponent(whatsappCopy[currentLocale.value].message)
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`
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
  border-color: rgb(34 211 238 / 0.75);
  box-shadow: 0 14px 32px -18px rgba(14, 165, 233, 0.55);
}

.faq-item[open] .faq-icon {
  transform: rotate(180deg);
  background: rgb(34 211 238 / 0.16);
  color: #124ad4;
}

.faq-item[open] .faq-answer {
  animation: faq-reveal 0.22s ease-out;
}

@keyframes faq-reveal {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-item[open] .faq-answer {
    animation: none;
  }
}
</style>
