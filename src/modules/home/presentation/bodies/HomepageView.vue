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
          <div class="flex items-center gap-2">

            <Icon icon="ic:round-whatsapp" width="40" height="40" />
            <span
              class="inline-flex rounded-full border  bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">

              <p class="text-yellow-500">{{ t('landing_badge_title') }}</p>
              {{ t('landing_badge') }}
            </span>
          </div>


          <h1 class="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {{ t('landing_title') }}
          </h1>

          <!--      <p class="mt-6 max-w-2xl text-lg  mx-auto lg:mx-0">
            {{ t('landing_description') }}
          </p> -->

          <div class="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <!--     <router-link :to="{ name: 'auth' }"
              class="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
              {{ t('landing_cta_start') }}
            </router-link>
 -->

            <img src="/assets/images/home/es.webp" alt="banner" loading="eager" decoding="async"
              class="w-4/5 h-auto scale-110 transform transition-transform duration-700 ease-out hover:-translate-y-1" />
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

    <BancosSlider />

    <ScheduleTransferForm />

  
<!--     <section id="coverage" class="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <article
          class="group relative overflow-hidden rounded-3xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-cyan-400">
          <div class="absolute top-0 right-0 h-32 w-32 rounded-full bg-cyan-200/20 blur-3xl"></div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 mb-3">{{ t('landing_section_brazil') }}
          </p>
          <h3 class="text-2xl font-bold text-slate-900 mb-4">{{ t('landing_section_brazil_title') }}</h3>
          <p class="text-sm leading-relaxed text-slate-600 relative z-10">
            {{ t('landing_section_brazil_description') }}
          </p>
          <div class="mt-6 flex items-center gap-2 text-cyan-700 font-semibold">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">Transferencias rápidas y seguras</span>
          </div>
        </article>

        <article
          class="group relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-400">
          <div class="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-200/20 blur-3xl"></div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-3">{{ t('landing_section_peru') }}
          </p>
          <h3 class="text-2xl font-bold text-slate-900 mb-4">{{ t('landing_section_peru_title') }}</h3>
          <p class="text-sm leading-relaxed text-slate-600 relative z-10">
            {{ t('landing_section_peru_description') }}
          </p>
          <div class="mt-6 flex items-center gap-2 text-emerald-700 font-semibold">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">Pagos confiables y transparentes</span>
          </div>
        </article>
      </div>
    </section> -->

    <!-- Vision and Mission -->
<!--     <section id="vymision" class="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-12">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
            {{ t('landing_vision_mission_kicker') }}
          </p>
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">
            {{ t('landing_vision_mission_title') }}
          </h2>
        </div>
        <div class="mt-12 grid gap-8 md:grid-cols-2">
          <article
            class="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-10 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
            <div class="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl"></div>
            <div class="relative z-10">
              <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-4">{{ t('landing_mission_title') }}</h3>
              <p class="text-sm leading-relaxed text-slate-600">{{ t('landing_mission_description') }}</p>
            </div>
          </article>
          <article
            class="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-10 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
            <div class="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl"></div>
            <div class="relative z-10">
              <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-4">{{ t('landing_vision_title') }}</h3>
              <p class="text-sm leading-relaxed text-slate-600">{{ t('landing_vision_description') }}</p>
            </div>
          </article>
        </div>
      </div>
    </section> -->

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
                <a :href="`tel:${t('landing_contact_phone').replace(/\\s/g, '')}`" class="font-bold text-gray-900">
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
          <img src="/assets/images/acerca/img1.png" alt="Acerca de Brasper"
            class="z-10 w-72 rounded-lg object-cover shadow-lg md:w-96" />
          <img src="/assets/images/acerca/img2.png" alt="Acerca secundario"
            class="absolute bottom-0 left-0 w-48 -translate-x-[20%] translate-y-[30%] rounded-lg object-cover shadow-md md:w-60" />
          <div class="absolute right-0 top-0 h-20 w-20 translate-x-[50%] -translate-y-[30%] rounded-full bg-cyan-400/30 blur-sm md:h-24 md:w-24"></div>
          <div class="absolute bottom-0 right-0 h-16 w-16 translate-x-[50%] rounded-full bg-indigo-300/40 md:h-20 md:w-20"></div>
        </div>
      </div>
    </section>

    <!-- Get Informed -->
 <section class="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary text-center">
          {{ t('landing_get_informed_title') }}
        </p>
        <h2 class="mt-3 text-center text-3xl font-semibold text-slate-900 sm:text-4xl mb-10">
          {{ t('landing_get_informed_subtitle') }}
        </h2>
        <div class="grid gap-8 md:grid-cols-2">
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div class="aspect-video bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
              <span class="text-slate-400">▶ Video</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ t('landing_get_informed_subtitle') }}</h3>
          </article>
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">{{ t('landing_security_title') }}</h3>
            <p class="text-sm text-slate-600 mb-4">{{ t('landing_security_description') }}</p>
            <ul class="space-y-2">
              <li class="flex items-center text-sm text-slate-600">
                <span class="mr-2">✔</span>{{ t('landing_security_feature_1') }}
              </li>
              <li class="flex items-center text-sm text-slate-600">
                <span class="mr-2">✔</span>{{ t('landing_security_feature_2') }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section> 

    <!-- Partners -->
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
                class="flex min-h-[300px] w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-8 lg:w-2/5 lg:p-12">
                <div class="text-center">
                  <img
                    v-if="!logoErrors[currentPartner.id]"
                    :src="currentPartner.logo"
                    :alt="currentPartner.name"
                    class="mx-auto mb-4 max-h-[200px] max-w-full object-contain"
                    @error="markLogoError(currentPartner.id)"
                  />
                  <div v-else class="text-sm text-gray-400">
                    Logo no disponible
                  </div>
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

    <section id="services" class="bg-[#1b1f2e] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 text-center">
          <h2 class="text-2xl font-bold sm:text-3xl">
            {{ t('landing_best_rates_title') }}
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-8 text-left md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(service, index) in services"
            :key="`service-${index}`"
            class="flex items-start gap-4"
          >
            <span class="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.icon" />
              </svg>
            </span>
            <div>
              <h4 class="mb-1 text-sm font-bold">
                {{ service.title }}
              </h4>
              <p class="text-sm text-gray-300">
                {{ service.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Simple Guide -->
   
<!-- 
    <section class="border-y border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">{{
            t('landing_section_testimonials')
          }}
          </p>
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ t('landing_section_testimonials_title') }}
          </h2>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <article v-for="testimonial in testimonials" :key="testimonial.author"
            class="group rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
            <div class="mb-4 flex gap-1 text-yellow-400">
              <svg v-for="i in 5" :key="i" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-sm leading-relaxed text-slate-600 italic">"{{ testimonial.quote }}"</p>
            <div class="mt-6 flex items-center gap-3 pt-6 border-t border-slate-200">
              <div
                class="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                {{ testimonial.author.charAt(0) }}
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900">{{ testimonial.author }}</p>
                <p class="text-xs text-slate-500">{{ testimonial.location }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section> -->

<!--     <section id="faq" class="px-4 py-20 sm:px-6 lg:px-8 bg-white">
      <div class="mx-auto max-w-5xl">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">{{ t('faq') }}</p>
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl">{{ t('landing_section_faq_title')
          }}</h2>
        </div>

        <div class="mt-12 space-y-4">
          <article v-for="item in faqs" :key="item.question"
            class="group rounded-xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30">
            <div class="flex items-start gap-4">
              <div class="mt-1 flex-shrink-0">
                <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-bold text-slate-900 mb-2">{{ item.question }}</h3>
                <p class="text-sm leading-relaxed text-slate-600">{{ item.answer }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section> -->

   <!--  <section class="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div
        class="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50 p-12 text-center shadow-xl">
        <div class="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div class="relative z-10">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">{{ t('landing_section_cta') }}</p>
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">{{ t('landing_section_cta_title') }}</h2>
          <p class="mx-auto max-w-2xl text-base text-slate-600 mb-8">
            {{ t('landing_section_cta_description') }}
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link :to="{ name: 'register' }"
              class="rounded-xl bg-gradient-to-r from-primary to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 hover:from-blue-600 hover:to-primary">
              {{ t('landing_cta_register') }}
            </router-link>
            <router-link :to="{ name: 'auth' }"
              class="rounded-xl border-2 border-slate-300 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-primary hover:text-primary">
              {{ t('login') }}
            </router-link>
          </div>
        </div>
      </div>
    </section> -->
 <!--    <section class="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
            {{ t('landing_simple_guide_title') }}
          </h2>
          <p class="text-base text-slate-600">{{ t('landing_simple_guide_subtitle') }}</p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <article v-for="(step, index) in [
            { num: '01', title: t('landing_simple_guide_step_1_title'), desc: t('landing_simple_guide_step_1_description') },
            { num: '02', title: t('landing_simple_guide_step_2_title'), desc: t('landing_simple_guide_step_2_description') },
            { num: '03', title: t('landing_simple_guide_step_3_title'), desc: t('landing_simple_guide_step_3_description') },
            { num: '04', title: t('landing_simple_guide_step_4_title'), desc: t('landing_simple_guide_step_4_description') }
          ]" :key="index"
            class="group relative rounded-2xl border-2 border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
            <span
              class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-lg font-bold text-white shadow-lg mb-6">
              {{ step.num }}
            </span>
            <h3 class="text-lg font-bold text-slate-900 mb-3">{{ step.title }}</h3>
            <p class="text-sm text-slate-600">{{ step.desc }}</p>
            <div v-if="index < 3"
              class="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </article>
        </div>
      </div>
    </section> -->
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

    <section id="how-it-works" class="relative z-10 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
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
            <path d="M40 120C220 20 380 20 560 120C740 20 900 20 1160 120" stroke="#cbd5e1" stroke-width="6"
              stroke-linecap="round" />
          </svg>
        </div>

        <div class="flex w-full max-w-5xl justify-between px-4">
          <div
            v-for="(step, index) in processSteps"
            :key="`process-badge-${step.number}`"
            class="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-lg font-bold text-white ring-4 ring-white shadow-xl"
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

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import CalculatorView from '@/modules/calculator/presentation/bodies/CalculatorView.vue'
import BancosSlider from '../widgets/BancosSlider.vue'
import ScheduleTransferForm from '../widgets/ScheduleTransferForm.vue'
import { Icon } from '@iconify/vue'

interface PartnerItem {
  id: number
  logo: string
  name: string
  title: string
  description: string
  benefits: string[]
}

const { t, locale } = useI18n()

const scrollToVisionMission = () => {
  const section = document.getElementById('vymision')
  section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const secondaryPartnerCopy = computed(() => {
  if (locale.value === 'en') {
    return {
      name: 'Strategic Partner',
      title: 'Trusted Alliances',
      description:
        'We work with strategic partners who share our vision of making international transfers secure and efficient. These alliances allow us to deliver quality service and competitive exchange rates.',
      benefits: ['Trusted partner network', 'Cutting-edge technology', 'Service excellence']
    }
  }

  if (locale.value === 'pt') {
    return {
      name: 'Parceiro Estratégico',
      title: 'Alianças de Confiança',
      description:
        'Trabalhamos com parceiros estratégicos que compartilham nossa visão de facilitar transferências internacionais seguras e eficientes. Nossas alianças nos permitem oferecer serviços de qualidade e taxas competitivas.',
      benefits: ['Rede de parceiros confiáveis', 'Tecnologia de ponta', 'Excelência no atendimento']
    }
  }

  return {
    name: 'Partner Estratégico',
    title: 'Alianzas de Confianza',
    description:
      'Trabajamos con socios estratégicos que comparten nuestra visión de facilitar transferencias internacionales seguras y eficientes. Nuestras alianzas nos permiten ofrecer servicios de calidad y las mejores tasas de cambio del mercado.',
    benefits: ['Red de socios confiables', 'Tecnología de vanguardia', 'Servicio de excelencia']
  }
})

const partners = computed<PartnerItem[]>(() => [
  {
    id: 1,
    logo: '/assets/images/bancos/CLL.png',
    name: t('landing_partner_ccl_subtitle'),
    title: t('landing_partner_ccl_title'),
    description: t('landing_partner_ccl_description'),
    benefits: [
      t('landing_partner_ccl_feature_1'),
      t('landing_partner_ccl_feature_2'),
      t('landing_partner_ccl_feature_3')
    ]
  },
  {
    id: 2,
    logo: '/assets/images/bancos/Fintech.png',
    name: secondaryPartnerCopy.value.name,
    title: secondaryPartnerCopy.value.title,
    description: secondaryPartnerCopy.value.description,
    benefits: secondaryPartnerCopy.value.benefits
  }
])

const currentIndex = ref(0)
const isAutoPlaying = ref(true)
const logoErrors = ref<Record<number, boolean>>({})

let autoplayInterval: ReturnType<typeof setInterval> | null = null
let resumeTimeout: ReturnType<typeof setTimeout> | null = null

const currentPartner = computed(() => partners.value[currentIndex.value])

const clearAutoplayInterval = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

const clearResumeTimeout = () => {
  if (resumeTimeout) {
    clearTimeout(resumeTimeout)
    resumeTimeout = null
  }
}

const startAutoplay = () => {
  clearAutoplayInterval()

  if (!isAutoPlaying.value || partners.value.length <= 1) {
    return
  }

  autoplayInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % partners.value.length
  }, 5000)
}

const pauseAutoplayTemporarily = () => {
  isAutoPlaying.value = false
  clearResumeTimeout()
  resumeTimeout = setTimeout(() => {
    isAutoPlaying.value = true
  }, 10000)
}

const goToPartner = (index: number) => {
  currentIndex.value = index
  pauseAutoplayTemporarily()
}

const nextPartner = () => {
  currentIndex.value = (currentIndex.value + 1) % partners.value.length
  pauseAutoplayTemporarily()
}

const prevPartner = () => {
  currentIndex.value = (currentIndex.value - 1 + partners.value.length) % partners.value.length
  pauseAutoplayTemporarily()
}

const markLogoError = (partnerId: number) => {
  logoErrors.value = { ...logoErrors.value, [partnerId]: true }
}

watch(
  () => [isAutoPlaying.value, partners.value.length] as const,
  () => {
    if (currentIndex.value > partners.value.length - 1) {
      currentIndex.value = 0
    }
    startAutoplay()
  },
  { immediate: true }
)

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  clearAutoplayInterval()
  clearResumeTimeout()
})

const processSteps = computed(() => [
  { number: '01', title: t('landing_simple_guide_step_1_title'), description: t('landing_simple_guide_step_1_description') },
  { number: '02', title: t('landing_simple_guide_step_2_title'), description: t('landing_simple_guide_step_2_description') },
  { number: '03', title: t('landing_simple_guide_step_3_title'), description: t('landing_simple_guide_step_3_description') },
  { number: '04', title: t('landing_simple_guide_step_4_title'), description: t('landing_simple_guide_step_4_description') }
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
void testimonials
void faqs

const services = computed(() => [
  {
    title: t('landing_best_rates_transfers_title'),
    description: t('landing_best_rates_transfers_description'),
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
  },
  {
    title: t('landing_best_rates_quotations_title'),
    description: t('landing_best_rates_quotations_description'),
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    title: t('landing_best_rates_shipments_title'),
    description: t('landing_best_rates_shipments_description'),
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    title: t('landing_best_rates_services_title'),
    description: t('landing_best_rates_services_description'),
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  {
    title: t('landing_best_rates_improvement_title'),
    description: t('landing_best_rates_improvement_description'),
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  }
])
</script>
