<template>
  <nav
    ref="navbarRef"
    class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
      <router-link :to="{ name: 'homepage', params: { locale: routeLocale } }" class="flex shrink-0 items-center">
        <img :src="logoCompleto" alt="Brasper" class="h-9 w-auto sm:h-14" width="166" height="40" fetchpriority="high" />
      </router-link>

      <div class="hidden items-center gap-8 lg:flex">
        <router-link
          :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#about' }"
          class="nav-link"
        >
          {{ t('about_us') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#bancos-section' }"
          class="nav-link"
        >
          {{ t('nav_banks') }}
        </router-link>
        <router-link
          :to="{ name: 'blog-list', params: { locale: routeLocale } }"
          class="nav-link"
        >
          {{ t('nav_blog') }}
        </router-link>
        <router-link
          :to="{ name: 'faq', params: { locale: routeLocale } }"
          class="nav-link"
        >
          {{ t('faq') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#agenda' }"
          class="nav-link"
        >
          {{ t('nav_agent') }}
        </router-link>
      </div>

      <div class="flex items-center gap-2 md:gap-3">
        <div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-1 shadow-sm md:hidden">
          <button
            v-for="lang in languages"
            :key="`header-${lang.code}`"
            type="button"
            class="rounded-full p-1 transition-transform focus:outline-none focus:ring-2 focus:ring-azure-500/40"
            :class="locale === lang.code ? 'ring-2 ring-azure-500 ring-offset-1 ring-offset-white' : 'opacity-75'"
            :title="lang.label"
            :aria-label="lang.label"
            @click="changeLanguage(lang.code)"
          >
            <img :src="lang.flag" :alt="lang.label" class="h-5 w-5 rounded-full object-cover" />
          </button>
        </div>

        <div class="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm md:flex">
          <button
            v-for="lang in languages"
            :key="lang.code"
            type="button"
            class="rounded-full p-1.5 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-azure-500/40"
            :class="locale === lang.code ? 'ring-2 ring-azure-500 ring-offset-2 ring-offset-white' : 'opacity-80 hover:opacity-100'"
            :title="lang.label"
            :aria-label="lang.label"
            @click="changeLanguage(lang.code)"
          >
            <img :src="lang.flag" :alt="lang.label" class="h-6 w-6 rounded-full object-cover" />
          </button>
        </div>

        <!-- Botón Login comentado
        <router-link
          :to="authStore.user ? { name: 'home' } : { name: 'auth' }"
          class="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {{ authStore.user ? t('dashboard') : t('login') }}
        </router-link>
        -->

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
    </div>

    <div v-if="showMobileMenu" class="border-t border-slate-200 bg-white px-4 py-4 shadow-sm md:hidden">
      <div class="space-y-1">
        <router-link
          :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#about' }"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          @click="showMobileMenu = false"
        >
          {{ t('about_us') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#bancos-section' }"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          @click="showMobileMenu = false"
        >
          {{ t('nav_banks') }}
        </router-link>
        <router-link
          :to="{ name: 'blog-list', params: { locale: routeLocale } }"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          @click="showMobileMenu = false"
        >
          {{ t('nav_blog') }}
        </router-link>
        <router-link
          :to="{ name: 'faq', params: { locale: routeLocale } }"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          @click="showMobileMenu = false"
        >
          {{ t('faq') }}
        </router-link>
        <router-link
          :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#agenda' }"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          @click="showMobileMenu = false"
        >
          {{ t('nav_agent') }}
        </router-link>
      </div>

      <!-- Botón Login comentado
      <router-link
        :to="authStore.user ? { name: 'home' } : { name: 'auth' }"
        class="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
      >
        {{ authStore.user ? t('dashboard') : t('login') }}
      </router-link>
      -->
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// import { useAuthStore } from '@/modules/auth/presentation/controllers/useAuthStore'
import { useLanguage } from '@/interface/presentation/composables/useLanguage'
import type { Locale } from '@/interface/presentation/composables/useLanguage'

// const authStore = useAuthStore() // descomentar al restaurar el botón de login
const { locale, routeLocale, setLocale, t } = useLanguage()
const logoCompleto = '/assets/images/logo/logo-completo-332.png'
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

<style scoped>
.nav-link {
  position: relative;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155; /* slate-700 */
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.35rem;
  height: 2px;
  width: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #165efc, #01e8fc);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}

.nav-link:hover {
  color: #165efc; /* azure-600 */
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  transform: scaleX(1);
}
</style>
