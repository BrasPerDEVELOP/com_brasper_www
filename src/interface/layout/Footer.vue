<template>
  <footer class="relative bg-azure-900 text-white">
    <!-- Línea de acento de marca -->
    <div class="h-1 w-full bg-gradient-to-r from-azure-500 via-cyan-400 to-azure-500" />
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Columna 1: Logo y descripción -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <img :src="logoBlanco" alt="Brasper" class="h-9 w-auto" width="166" height="40" loading="lazy" />
          </div>
          <p class="text-sm leading-relaxed text-white/90">
            {{ t('footer_description') }}
          </p>
          <div class="pt-4 border-t border-white/20">
            <div class="inline-flex flex-col items-start px-4 py-3 bg-white/10 rounded-lg border border-white/20">
              <span class="text-sm font-bold text-white">CCL ASOCIADO</span>
              <span class="text-xs text-white/80 mt-1">CÁMARA DE COMERCIO - LIMA</span>
            </div>
          </div>
        </div>

        <!-- Columna 2: SERVICIOS -->
        <div>
          <h3 class="text-sm font-bold uppercase mb-4">{{ t('footer_services_title') }}</h3>
          <ul class="space-y-2">
            <li>
              <router-link :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#bancos-section' }" class="text-sm text-white/80 hover:text-white transition-colors">
                {{ t('footer_services_banks') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#about' }" class="text-sm text-white/80 hover:text-white transition-colors">
                {{ t('footer_services_about') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#services' }" class="text-sm text-white/80 hover:text-white transition-colors">
                {{ t('footer_services_services') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'blog-list', params: { locale: routeLocale } }" class="text-sm text-white/80 hover:text-white transition-colors">
                {{ t('footer_services_blog') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Columna 3: ¿QUIÉNES SOMOS? -->
        <div>
          <h3 class="text-sm font-bold uppercase mb-4">{{ t('footer_who_we_are_title') }}</h3>
          <ul class="space-y-2">
            <li>
              <router-link :to="{ name: 'homepage', params: { locale: routeLocale }, hash: '#vymision' }" class="text-sm text-white/80 hover:text-white transition-colors">
                {{ t('footer_who_we_are_vision_mission') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Columna 4: CONTÁCTANOS -->
        <div>
          <h3 class="text-sm font-bold uppercase mb-4">{{ t('footer_contact_title') }}</h3>
          <ul class="space-y-2">
            <li>
              <a
                href="mailto:info@braspertransferencias.com"
                class="text-sm text-white/80 hover:text-white transition-colors"
              >
                info@braspertransferencias.com
              </a>
            </li>
            <li>
              <a
                href="https://drive.google.com/file/d/1ACrx6qdwvws_pSuUrlL2w4AgNydPMlW6/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-white/80 hover:text-white transition-colors"
              >
                {{ t('footer_contact_terms') }}
              </a>
            </li>
            <li>
              <a href="#complaints" class="text-sm text-white/80 hover:text-white transition-colors">
                {{ t('footer_contact_complaints') }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/70 sm:flex-row">
        <p>© {{ year }} Brasper Transferências. {{ t('footer_rights') }}</p>
        <p>Brasil · Perú · EUA</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLanguage } from '@/interface/presentation/composables/useLanguage'

const { t } = useI18n()
const { routeLocale } = useLanguage()
const logoBlanco = '/assets/images/logo/logo-blanco.png'
const year = new Date().getFullYear()
</script>
