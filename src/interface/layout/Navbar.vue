<template>
  <nav
    ref="navbarRef"
    class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <router-link :to="{ name: 'homepage' }" class="flex items-center">
        <img
          src="/assets/images/logo/logo_completo.png"
          alt="Brasper"
          class="h-10 w-auto sm:h-11"
        />
      </router-link>

      <div class="hidden items-center gap-8 lg:flex">
        <a href="#about" class="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
          {{ t('about_us') }}
        </a>
        <a href="#how-it-works" class="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
          {{ t('nav_how_it_works') }}
        </a>
        <a href="#coverage" class="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
          {{ t('nav_coverage') }}
        </a>
        <a href="#faq" class="text-sm font-medium text-slate-700 transition-colors hover:text-primary">
          {{ t('faq') }}
        </a>
      </div>

      <div class="hidden items-center gap-3 md:flex">
        <div class="relative">
          <button
            type="button"
            class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            @click="showLanguageMenu = !showLanguageMenu"
          >
            <span>{{ localeLabel }}</span>
            <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="showLanguageMenu"
            class="absolute right-0 top-full z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              type="button"
              class="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
              :class="{ 'bg-primary/10 text-primary': locale === lang.code }"
              @click="changeLanguage(lang.code)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>

        <router-link
          :to="authStore.user ? { name: 'home' } : { name: 'auth' }"
          class="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {{ authStore.user ? t('dashboard') : t('login') }}
        </router-link>
      </div>

      <button
        type="button"
        class="inline-flex rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden"
        aria-label="Abrir menú"
        @click="showMobileMenu = !showMobileMenu"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <div v-if="showMobileMenu" class="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
      <div class="space-y-3">
        <a href="#about" class="block text-sm font-medium text-slate-700"> {{ t('about_us') }} </a>
        <a href="#how-it-works" class="block text-sm font-medium text-slate-700"> {{ t('nav_how_it_works') }} </a>
        <a href="#coverage" class="block text-sm font-medium text-slate-700"> {{ t('nav_coverage') }} </a>
        <a href="#faq" class="block text-sm font-medium text-slate-700"> {{ t('faq') }} </a>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <button
          v-for="lang in languages"
          :key="`mobile-${lang.code}`"
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
          :class="{ 'border-primary bg-primary/10 text-primary': locale === lang.code }"
          @click="changeLanguage(lang.code)"
        >
          {{ lang.code.toUpperCase() }}
        </button>
      </div>

      <router-link
        :to="authStore.user ? { name: 'home' } : { name: 'auth' }"
        class="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
      >
        {{ authStore.user ? t('dashboard') : t('login') }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/modules/auth/presentation/controllers/useAuthStore'
import { useLanguage } from '@/interface/presentation/composables/useLanguage'
import type { Locale } from '@/interface/presentation/composables/useLanguage'

const authStore = useAuthStore()
const { locale, localeLabel, setLocale, t } = useLanguage()
const navbarRef = ref<HTMLElement | null>(null)
const showLanguageMenu = ref(false)
const showMobileMenu = ref(false)

const languages: Array<{ code: Locale; label: string }> = [
  { code: 'pt', label: 'Português (PT)' },
  { code: 'es', label: 'Español (ES)' },
  { code: 'en', label: 'English (EN)' }
]

function changeLanguage(lang: Locale) {
  setLocale(lang)
  showLanguageMenu.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (!navbarRef.value?.contains(target)) {
    showLanguageMenu.value = false
    showMobileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
