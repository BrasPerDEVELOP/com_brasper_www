<template>
  <section :class="getContainerClasses">
    <!-- Header -->
    <template v-if="showTitle">
      <div class="mb-6 flex items-center gap-2">
        <svg v-if="variant === 'banner'" class="h-5 w-5 text-primary" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h1
          :class="variant === 'banner' ? 'text-xl font-semibold text-gray-900' : 'text-2xl font-semibold text-on-surface'">
          {{ title || (variant === 'banner' ? t('your_shipment_in_minutes') : t('calculator')) }}
        </h1>
      </div>
      <p v-if="subtitle || (variant === 'default' && !subtitle)" class="mb-4 text-sm text-on-surface/80">
        {{ subtitle || t('calculator_description') }}
      </p>
    </template>

    <div v-if="calculatorStore.isLoading" class="mt-4 py-8 text-center text-on-surface/70">
      {{ t('loading_rates_commissions') }}
    </div>
    <template v-else>
      <!-- Diseño unificado para todos los contextos -->
      <div class="mt-4 space-y-4">
        <!-- YOU SEND Section -->
        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            {{ t('you_send') }}
          </label>
          <div class="flex gap-2">
            <input v-model.number="amountSendLocal" type="number" min="0" step="0.01"
              :class="variant === 'banner' ? 'flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
              placeholder="1000" @input="onAmountSendInput" />
            <select :value="calculatorStore.currencyFrom"
              :class="variant === 'banner' ? 'rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
              @change="onFromChange($event)">
              <option v-for="code in CURRENCY_CODES" :key="code" :value="code">
                {{ code.toUpperCase() }}
              </option>
            </select>
          </div>
        </div>

        <!-- Transfer Arrow -->
        <div class="flex justify-center">
          <button type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover">
            <svg class="h-6 w-6" viewBox="0 0 48 48" fill="currentColor"
              xmlns="http://www.w3.org/2000/svg">
              <!-- Flecha arriba -->
              <path d="M14 4  L4 14       Q2 16 4 18       Q6 20 8 18       L12 14       V36       Q12 40 16 40       Q20 40 20 36       V14       L24 18       Q26 20 28 18       Q30 16 28 14       L18 4       Q16 2 14 4Z" />
                            <!-- Flecha abajo -->
              <path d="M34 44       L44 34       Q46 32 44 30       Q42 28 40 30       L36 34       V12       Q36 8 32 8       Q28 8 28 12       V34       L24 30       Q22 28 20 30       Q18 32 20 34       L30 44       Q32 46 34 44Z" />
            </svg>
            


          </button>
        </div>

        <!-- RECIPIENT RECEIVES Section -->
        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            {{ t('recipient_receives') }}
          </label>
          <div class="flex gap-2">
            <input :value="calculatorStore.result ? calculatorStore.result.amountReceive.toFixed(2) : '0.00'"
              type="text" readonly
              :class="variant === 'banner' ? 'flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-900' : 'flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900'"
              placeholder="0.00" />
            <select :value="calculatorStore.currencyTo"
              :class="variant === 'banner' ? 'rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
              @change="onToChange($event)">
              <option v-for="code in calculatorStore.destinationOptions" :key="code" :value="code">
                {{ code.toUpperCase() }}
              </option>
            </select>
          </div>
        </div>

        <!-- Reductions (Commission Fee and Exchange Rate) -->
        <div v-if="showReductions && calculatorStore.result" class="space-y-2 border-t border-gray-200 pt-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{ t('commission_fee') }}</span>
            <span class="font-semibold text-green-600">
              {{ calculatorStore.result.commission.toFixed(2) }} {{ calculatorStore.currencyFrom.toUpperCase() }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{ t('exchange_rate') }}</span>
            <span class="font-semibold text-gray-900">
              1 {{ calculatorStore.currencyFrom.toUpperCase() }} = {{ calculatorStore.result.rate.toFixed(4) }} {{
                calculatorStore.currencyTo.toUpperCase() }}
            </span>
          </div>
        </div>

        <!-- Send Money Button -->
        <button v-if="showButton" type="button"
          class="w-full rounded-lg bg-cyan-500 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-cyan-600"
          @click="handleButtonClick">
          {{ buttonText || t('send_money_now') }}
        </button>

        <!-- Terms and Conditions -->
        <p v-if="showTerms" class="text-center text-xs text-gray-500">
          {{ t('terms_and_conditions') }}
          <a href="#" class="text-primary hover:underline">{{ t('terms_and_conditions_link') }}</a>
        </p>
      </div>

      <p v-if="calculatorStore.error" class="mt-4 text-sm text-red-600">
        {{ calculatorStore.error }}
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCalculatorStore } from '../controllers/useCalculatorStore'
import { CURRENCY_CODES } from '../../domain/models'
import type { CurrencyCode } from '../../domain/models'

const { t } = useI18n()

interface Props {
  variant?: 'default' | 'banner' | 'compact' | 'inline'
  initialAmount?: number
  initialCurrencyFrom?: CurrencyCode
  initialCurrencyTo?: CurrencyCode
  showTitle?: boolean
  showButton?: boolean
  showReductions?: boolean
  showTerms?: boolean
  buttonText?: string
  title?: string
  subtitle?: string
  customClasses?: string
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  initialAmount: 0,
  initialCurrencyFrom: undefined,
  initialCurrencyTo: undefined,
  showTitle: true,
  showButton: false,
  showReductions: true,
  showTerms: false,
  buttonText: 'SEND MONEY NOW',
  title: undefined,
  subtitle: undefined,
  customClasses: '',
  autoLoad: true
})

const emit = defineEmits<{
  calculate: [result: { amountSend: number; amountReceive: number; commission: number; rate: number }]
  currencyChange: [from: CurrencyCode, to: CurrencyCode]
}>()

const calculatorStore = useCalculatorStore()
const amountSendLocal = ref(props.initialAmount || 0)
const amountReceiveLocal = ref(0)

watch(
  () => calculatorStore.amountSend,
  (v) => { amountSendLocal.value = v || props.initialAmount || 0 },
  { immediate: true }
)
watch(
  () => calculatorStore.amountReceive,
  (v) => { amountReceiveLocal.value = v },
  { immediate: true }
)

function onAmountSendInput() {
  calculatorStore.setAmountSend(amountSendLocal.value || 0)
  calculatorStore.recalcFromSend()
  amountReceiveLocal.value = calculatorStore.amountReceive
}

function onFromChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as CurrencyCode
  calculatorStore.setCurrencyFrom(value)
  emit('currencyChange', value, calculatorStore.currencyTo)
  handleCalculate()
}

function onToChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as CurrencyCode
  calculatorStore.setCurrencyTo(value)
  emit('currencyChange', calculatorStore.currencyFrom, value)
  handleCalculate()
}

function handleCalculate() {
  const result = calculatorStore.result
  if (result) {
    emit('calculate', {
      amountSend: result.amountSend,
      amountReceive: result.amountReceive,
      commission: result.commission,
      rate: result.rate
    })
  }
}

function handleButtonClick() {
  handleCalculate()
}

const getContainerClasses = computed(() => {
  const baseClasses = {
    'default': 'rounded-lg bg-white p-6 shadow-sm',
    'banner': 'w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl',
    'compact': 'rounded-lg bg-white p-4 shadow-sm',
    'inline': 'bg-transparent p-0 shadow-none'
  }
  return `${baseClasses[props.variant]} ${props.customClasses}`.trim()
})

watch(
  () => calculatorStore.result,
  () => {
    handleCalculate()
  },
  { deep: true }
)

onMounted(() => {
  if (props.autoLoad) {
    calculatorStore.loadData()
  }

  // Set initial currencies if provided
  if (props.initialCurrencyFrom) {
    calculatorStore.setCurrencyFrom(props.initialCurrencyFrom)
  }
  if (props.initialCurrencyTo) {
    calculatorStore.setCurrencyTo(props.initialCurrencyTo)
  }

  // Set initial amount
  if (props.initialAmount > 0) {
    calculatorStore.setAmountSend(props.initialAmount)
    calculatorStore.recalcFromSend()
  }
})
</script>
