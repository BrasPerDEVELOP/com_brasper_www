<template>
  <section class="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
    <div class="mx-auto max-w-4xl">
      <div class="text-center mb-12">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          {{ t('landing_schedule_transfer_kicker') }}
        </p>
        <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
          {{ t('landing_schedule_transfer_title') }}
        </h2>
        <p class="text-base text-slate-600">
          {{ t('landing_schedule_transfer_description') }}
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-3 mb-10">
        <div class="group text-center p-6 rounded-xl border-2 border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
          <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm font-bold text-slate-900">{{ t('landing_schedule_feature_1_title') }}</p>
        </div>
        <div class="group text-center p-6 rounded-xl border-2 border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
          <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p class="text-sm font-bold text-slate-900">{{ t('landing_schedule_feature_2_title') }}</p>
        </div>
        <div class="group text-center p-6 rounded-xl border-2 border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
          <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-sm font-bold text-slate-900">{{ t('landing_schedule_feature_3_title') }}</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="relative overflow-hidden bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-10 shadow-xl">
        <div class="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="relative z-10">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('landing_schedule_transfer_date') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.transferDate"
              type="date"
              required
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('landing_schedule_amount') }}
            </label>
            <div class="flex">
              <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-sm text-slate-600">
                S/
              </span>
              <input
                v-model.number="form.amount"
                type="number"
                min="0"
                step="0.01"
                class="flex-1 rounded-r-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('landing_schedule_dni_cpf') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.dniCpf"
              type="text"
              required
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              :placeholder="t('landing_schedule_dni_cpf_placeholder')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('landing_schedule_full_names') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.fullNames"
              type="text"
              required
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              :placeholder="t('landing_schedule_full_names_placeholder')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('landing_schedule_phone') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              :placeholder="t('landing_schedule_phone_placeholder')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('landing_schedule_email') }}
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="email@example.com"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('landing_schedule_currency_range') }}
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label class="group flex items-center p-4 rounded-xl border-2 border-slate-200 cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <input
                  v-model="form.currencyRange"
                  type="radio"
                  value="pen-brl"
                  class="mr-3 h-4 w-4 text-primary focus:ring-primary"
                />
                <span class="text-sm font-medium text-slate-700 group-has-[:checked]:text-primary">PEN → BRL</span>
              </label>
              <label class="group flex items-center p-4 rounded-xl border-2 border-slate-200 cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <input
                  v-model="form.currencyRange"
                  type="radio"
                  value="brl-pen"
                  class="mr-3 h-4 w-4 text-primary focus:ring-primary"
                />
                <span class="text-sm font-medium text-slate-700 group-has-[:checked]:text-primary">BRL → PEN</span>
              </label>
              <label class="group flex items-center p-4 rounded-xl border-2 border-slate-200 cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <input
                  v-model="form.currencyRange"
                  type="radio"
                  value="usd-brl"
                  class="mr-3 h-4 w-4 text-primary focus:ring-primary"
                />
                <span class="text-sm font-medium text-slate-700 group-has-[:checked]:text-primary">USD → BRL</span>
              </label>
              <label class="group flex items-center p-4 rounded-xl border-2 border-slate-200 cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <input
                  v-model="form.currencyRange"
                  type="radio"
                  value="brl-usd"
                  class="mr-3 h-4 w-4 text-primary focus:ring-primary"
                />
                <span class="text-sm font-medium text-slate-700 group-has-[:checked]:text-primary">BRL → USD</span>
              </label>
            </div>
          </div>
        </div>

        <div class="mt-10">
          <button
            type="submit"
            class="group w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 hover:from-blue-600 hover:to-primary"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {{ t('landing_schedule_send_whatsapp') }}
            </span>
          </button>
        </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = ref({
  transferDate: '',
  amount: '',
  dniCpf: '',
  fullNames: '',
  phone: '',
  email: '',
  currencyRange: 'pen-brl'
})

const handleSubmit = () => {
  const whatsappNumber = '51966991933'
  const message = encodeURIComponent(
    `Hola, quiero programar una transferencia:\n\n` +
    `Fecha: ${form.value.transferDate}\n` +
    `Monto: S/ ${form.value.amount}\n` +
    `DNI/CPF: ${form.value.dniCpf}\n` +
    `Nombres completos: ${form.value.fullNames}\n` +
    `Teléfono: ${form.value.phone}\n` +
    `Email: ${form.value.email}\n` +
    `Rango de moneda: ${form.value.currencyRange}`
  )
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
}
</script>
