x<template>
  <nav class="sticky top-0 z-50 w-full bg-white shadow-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <router-link :to="{ name: 'homepage' }" class="flex items-center">
        <img
          src="/assets/images/logo/logo_completo.png"
          alt="BrasPer"
          class="h-10 w-auto"
        />
      </router-link>

      <!-- Navigation Links -->
      <div class="hidden items-center gap-8 md:flex">
        <router-link
          :to="{ name: 'homepage' }"
          class="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
          active-class="text-primary"
        >
          {{ t('home') }}
        </router-link>
        <a
          href="#about"
          class="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
        >
          {{ t('about_us') }}
        </a>
        <router-link
          :to="{ name: 'tasas' }"
          class="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
        >
          {{ t('rates') }}
        </router-link>
        <a
          href="#faq"
          class="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
        >
          {{ t('faq') }}
        </a>
        <a
          href="#blog"
          class="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
        >
          {{ t('blog') }}
        </a>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-4">
        <!-- Language Selector -->
        <div class="relative hidden md:block">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            @click="showLanguageMenu = !showLanguageMenu"
          >
            <span class="text-gray-600">{{ localeLabel }}</span>
            <svg
              class="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <!-- Language Dropdown Menu -->
          <div
            v-if="showLanguageMenu"
            class="absolute right-0 top-full mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg z-50"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              type="button"
              class="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50"
              :class="{ 'bg-primary/10 text-primary': locale === lang.code }"
              @click="changeLanguage(lang.code)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>

        <!-- Login Button -->
        <router-link
          v-if="!authStore.user"
          to="/auth"
          class="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {{ t('login') }}
        </router-link>
        <router-link
          v-else
          :to="{ name: 'home' }"
          class="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {{ t('dashboard') }}
        </router-link>
      </div>
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
const showLanguageMenu = ref(false)

const languages: Array<{ code: Locale; label: string }> = [
  { code: 'pt', label: 'Português (PT)' },
  { code: 'es', label: 'Español (ES)' },
  { code: 'en', label: 'English (EN)' }
]

function changeLanguage(lang: Locale) {
  setLocale(lang)
  showLanguageMenu.value = false
}

// Cerrar menú al hacer click fuera
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (showLanguageMenu.value && !target.closest('.relative')) {
      showLanguageMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>
