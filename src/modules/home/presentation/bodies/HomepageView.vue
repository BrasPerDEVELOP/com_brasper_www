<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Navbar -->
    <Navbar />

    <!-- Banner Section with Calculator -->
    <section class="relative bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <!-- Left Side - Marketing Content -->
          <div class="flex flex-col justify-center space-y-6 text-white">
            <div class="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              {{ t('fast_via_whatsapp_transfers') }}
            </div>
            <h1 class="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {{ t('send_money_to_brazil_peru') }}
            </h1>
            <p class="text-lg text-blue-100 sm:text-xl">
              {{ t('safe_fast_transparent') }}
            </p>
            <div class="grid gap-4 sm:grid-cols-3">
              <div>
                <div class="text-sm font-semibold uppercase tracking-wide">{{ t('support_24_7') }}</div>
                <div class="mt-1 text-sm text-blue-100">{{ t('always_here_for_you') }}</div>
              </div>
              <div>
                <div class="text-sm font-semibold uppercase tracking-wide">{{ t('best_exchange_rates') }}</div>
                <div class="mt-1 text-sm text-blue-100">{{ t('competitive_pricing') }}</div>
              </div>
              <div>
                <div class="text-sm font-semibold uppercase tracking-wide">{{ t('secure_ssl_encryption') }}</div>
                <div class="mt-1 text-sm text-blue-100">{{ t('your_data_is_safe') }}</div>
              </div>
            </div>
          </div>

          <!-- Right Side - Calculator Card -->
          <div class="flex items-start justify-center lg:justify-end">
            <CalculatorView 
              variant="banner" 
              :initial-amount="1000"
              :show-button="true"
              :show-terms="true"
              :show-reductions="true"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Navbar from '@/interface/layout/Navbar.vue'
import CalculatorView from '@/modules/calculator/presentation/bodies/CalculatorView.vue'

const { t } = useI18n()
</script>
