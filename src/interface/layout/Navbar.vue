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
        <router-link
          :to="{ name: 'homepage', hash: '#about' }"
          class="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
        >
          {{ t('about_us') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', hash: '#bancos-section' }"
          class="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
        >
          {{ t('nav_banks') }}
        </router-link>
        <router-link
          :to="{ name: 'blog-list' }"
          class="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
        >
          {{ t('nav_blog') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', hash: '#faq' }"
          class="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
        >
          {{ t('faq') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', hash: '#agenda' }"
          class="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
        >
          {{ t('nav_agent') }}
        </router-link>
      </div>

      <div class="hidden items-center gap-3 md:flex">
        <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
          <button
            v-for="lang in languages"
            :key="lang.code"
            type="button"
            class="rounded-full p-1.5 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40"
            :class="locale === lang.code ? 'ring-2 ring-primary ring-offset-2 ring-offset-white' : 'opacity-80 hover:opacity-100'"
            :title="lang.label"
            :aria-label="lang.label"
            @click="changeLanguage(lang.code)"
          >
            <img :src="lang.flag" :alt="lang.label" class="h-6 w-6 rounded-full object-cover" />
          </button>
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
        <router-link :to="{ name: 'homepage', hash: '#about' }" class="block text-sm font-medium text-slate-700">
          {{ t('about_us') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', hash: '#bancos-section' }"
          class="block text-sm font-medium text-slate-700"
        >
          {{ t('nav_banks') }}
        </router-link>
        <router-link :to="{ name: 'blog-list' }" class="block text-sm font-medium text-slate-700">
          {{ t('nav_blog') }}
        </router-link>
        <router-link :to="{ name: 'homepage', hash: '#faq' }" class="block text-sm font-medium text-slate-700">
          {{ t('faq') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', hash: '#agenda' }"
          class="block text-sm font-medium text-slate-700"
        >
          {{ t('nav_agent') }}
        </router-link>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <button
          v-for="lang in languages"
          :key="`mobile-${lang.code}`"
          type="button"
          class="rounded-full p-1.5 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40"
          :class="locale === lang.code ? 'ring-2 ring-primary ring-offset-2 ring-offset-white' : 'opacity-80 hover:opacity-100'"
          :title="lang.label"
          :aria-label="lang.label"
          @click="changeLanguage(lang.code)"
        >
          <img :src="lang.flag" :alt="lang.label" class="h-6 w-6 rounded-full object-cover" />
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
const { locale, setLocale, t } = useLanguage()
const navbarRef = ref<HTMLElement | null>(null)
const showMobileMenu = ref(false)

const languages: Array<{ code: Locale; label: string; flag: string }> = [
  { code: 'pt', label: 'Português', flag: '/assets/flags/banderabrasil.png' },
  { code: 'es', label: 'Español', flag: '/assets/flags/banderaespaña.png' },
  { code: 'en', label: 'English', flag: '/assets/flags/estados-unidos.png' }
]

function changeLanguage(lang: Locale) {
  setLocale(lang)
  showMobileMenu.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (!navbarRef.value?.contains(target)) {
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
