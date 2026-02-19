<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />

    <section id="banner" class="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 text-white">
      <!-- Background decorativo -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-300/40 blur-3xl">
        </div>
        <div class="absolute right-0 top-28 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl"></div>
        <div class="absolute left-0 top-64 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl"></div>
      </div>

      <!-- Contenedor principal (igual estructura que el primero) -->
      <div
        class="relative z-10  mx-auto flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 py-20 gap-12">
        <!-- 🔹 Columna Izquierda: Texto -->
        <div class="lg:w-1/2 w-full text-center lg:text-left">
          <span
            class="inline-flex rounded-full border border-cyan-300 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            {{ t('landing_badge') }}
          </span>

          <h1 class="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {{ t('landing_title') }}
          </h1>

          <p class="mt-6 max-w-2xl text-lg  mx-auto lg:mx-0">
            {{ t('landing_description') }}
          </p>

          <div class="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
        <!--     <router-link :to="{ name: 'auth' }"
              class="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
              {{ t('landing_cta_start') }}
            </router-link>
 -->

          <img
            src="/assets/images/home/es.webp"
            alt="banner"
            loading="eager"
            decoding="async"

            className="w-4/5 h-auto scale-110 transform transition-transform duration-700 ease-out hover:-translate-y-1"
          />
<!--             <a href="#how-it-works"
              class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">
              {{ t('landing_cta_how') }}
            </a> -->
          </div>

          <!-- Stats -->
       <!--    <div class="mt-12 grid gap-4 sm:grid-cols-3">
            <div v-for="stat in stats" :key="stat.label"
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-center lg:text-left">
              <p class="text-3xl font-semibold text-primary">
                {{ stat.value }}
              </p>
              <p class="mt-1 text-sm text-slate-600">
                {{ stat.label }}
              </p>
            </div>
          </div> -->
        </div>

        <!-- 🔹 Columna Derecha: Calculadora -->
        <div class="lg:w-1/2 w-full max-w-md">
          <div class="relative">
            <div
              class="absolute -inset-3 -z-10 rounded-[30px] bg-gradient-to-r from-cyan-300/60 via-blue-300/40 to-cyan-300/60 blur-2xl">
            </div>

            <CalculatorView variant="banner" :initial-amount="1000" :show-button="true" :show-terms="true"
              :show-reductions="true" :button-text="t('send_money_now')" :title="t('calculatorTitle')"
              :subtitle="t('calculator_description')" custom-classes="!max-w- !rounded-[30px] !p-7" />

          
          </div>
        </div>
      </div>
    </section>


    <section id="about" class="px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-10 flex items-end justify-between gap-6">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{{ t('landing_section_advantages')
            }}</p>
            <h2 class="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{{ t('landing_section_advantages_title')
            }}</h2>
          </div>
          <router-link :to="{ name: 'auth' }"
            class="hidden rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 md:inline-flex">
            {{ t('landing_open_account') }}
          </router-link>
        </div>

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="feature in features" :key="feature.title"
            class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p class="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{{ feature.kicker }}</p>
            <h3 class="mt-3 text-xl font-semibold text-slate-900">{{ feature.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ feature.description }}</p>
            <div
              class="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-100 px-3 py-4 text-center text-xs font-medium text-slate-500">
              {{ t('landing_image_placeholder') }}
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{{ t('landing_section_process') }}</p>
        <h2 class="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{{ t('landing_section_process_title') }}</h2>

        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <article v-for="step in steps" :key="step.title" class="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <span
              class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
              {{ step.number }}
            </span>
            <h3 class="mt-5 text-xl font-semibold text-slate-900">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ step.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="coverage" class="px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <article class="rounded-[28px] border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-8 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">{{ t('landing_section_brazil') }}
          </p>
          <h3 class="mt-3 text-2xl font-semibold text-slate-900">{{ t('landing_section_brazil_title') }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            {{ t('landing_section_brazil_description') }}
          </p>
          <div
            class="mt-5 rounded-xl border border-dashed border-cyan-300 bg-cyan-50 px-3 py-4 text-center text-xs font-medium text-cyan-700">
            {{ t('landing_image_placeholder') }}
          </div>
        </article>

        <article
          class="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{{ t('landing_section_peru') }}
          </p>
          <h3 class="mt-3 text-2xl font-semibold text-slate-900">{{ t('landing_section_peru_title') }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            {{ t('landing_section_peru_description') }}
          </p>
          <div
            class="mt-5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-3 py-4 text-center text-xs font-medium text-emerald-700">
            {{ t('landing_image_placeholder') }}
          </div>
        </article>
      </div>
    </section>

    <section class="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{{ t('landing_section_testimonials') }}
        </p>
        <h2 class="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{{ t('landing_section_testimonials_title') }}
        </h2>

        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <article v-for="testimonial in testimonials" :key="testimonial.author"
            class="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p class="text-sm leading-relaxed text-slate-600">"{{ testimonial.quote }}"</p>
            <p class="mt-5 text-sm font-semibold text-slate-900">{{ testimonial.author }}</p>
            <p class="text-xs text-slate-500">{{ testimonial.location }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="faq" class="px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl">
        <p class="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">{{ t('faq') }}</p>
        <h2 class="mt-3 text-center text-3xl font-semibold text-slate-900 sm:text-4xl">{{ t('landing_section_faq_title')
        }}</h2>

        <div class="mt-10 space-y-4">
          <article v-for="item in faqs" :key="item.question"
            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 class="text-base font-semibold text-slate-900">{{ item.question }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ item.answer }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="px-4 pb-16 sm:px-6 lg:px-8">
      <div
        class="mx-auto max-w-7xl rounded-[32px] border border-cyan-200 bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50 p-10 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{{ t('landing_section_cta') }}</p>
        <h2 class="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">{{ t('landing_section_cta_title') }}</h2>
        <p class="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
          {{ t('landing_section_cta_description') }}
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <router-link :to="{ name: 'register' }"
            class="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
            {{ t('landing_cta_register') }}
          </router-link>
          <router-link :to="{ name: 'auth' }"
            class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">
            {{ t('login') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/interface/layout/Navbar.vue'
import CalculatorView from '@/modules/calculator/presentation/bodies/CalculatorView.vue'

const { t } = useI18n()

const features = computed(() => [
  {
    kicker: t('landing_feature_1_kicker'),
    title: t('landing_feature_1_title'),
    description: t('landing_feature_1_description')
  },
  {
    kicker: t('landing_feature_2_kicker'),
    title: t('landing_feature_2_title'),
    description: t('landing_feature_2_description')
  },
  {
    kicker: t('landing_feature_3_kicker'),
    title: t('landing_feature_3_title'),
    description: t('landing_feature_3_description')
  },
  {
    kicker: t('landing_feature_4_kicker'),
    title: t('landing_feature_4_title'),
    description: t('landing_feature_4_description')
  }
])

const steps = computed(() => [
  { number: '1', title: t('landing_step_1_title'), description: t('landing_step_1_description') },
  { number: '2', title: t('landing_step_2_title'), description: t('landing_step_2_description') },
  { number: '3', title: t('landing_step_3_title'), description: t('landing_step_3_description') }
])

const testimonials = computed(() => [
  {
    author: t('landing_testimonial_1_author'),
    location: t('landing_testimonial_1_location'),
    quote: t('landing_testimonial_1_quote')
  },
  {
    author: t('landing_testimonial_2_author'),
    location: t('landing_testimonial_2_location'),
    quote: t('landing_testimonial_2_quote')
  },
  {
    author: t('landing_testimonial_3_author'),
    location: t('landing_testimonial_3_location'),
    quote: t('landing_testimonial_3_quote')
  }
])

const faqs = computed(() => [
  { question: t('landing_faq_1_question'), answer: t('landing_faq_1_answer') },
  { question: t('landing_faq_2_question'), answer: t('landing_faq_2_answer') },
  { question: t('landing_faq_3_question'), answer: t('landing_faq_3_answer') },
  { question: t('landing_faq_4_question'), answer: t('landing_faq_4_answer') }
])
</script>
