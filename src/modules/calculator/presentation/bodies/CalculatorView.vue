<template>
  <section :class="getContainerClasses">
    <!-- Header -->
    <template v-if="showTitle" >
      <div class="mb-6 flex items-center justify-center gap-2">
       <img src="/assets/images/logo/logo.png" alt="Logo" class="w-10 h-10" />
        <h1
          :class="variant === 'banner' ? 'text-xl font-semibold text-gray-900' : 'text-2xl font-semibold text-on-surface'">
          {{ t('calculatorTitle')}}
        </h1>
      </div>
      <!-- <p v-if="subtitle || (variant === 'default' && !subtitle)" class="mb-4 text-sm text-on-surface/80">
        {{ t('calculatorTitle') }}
      </p> -->
    </template>

    <!-- Diseño unificado para todos los contextos -->
    <div class="mt-4 space-y-4">
      <!-- YOU SEND Section -->
      <div>
        <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {{ t('you_send') }}
        </label>
        <div class="flex gap-2">
          <input v-model.number="amountSendLocal" type="number" min="0" step="0.01"
            :class="variant === 'banner' ? 'flex-1 rounded-lg border text-black border-gray-300 px-4 py-3 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
            placeholder="1000" @input="onAmountSendInput" />
          <select :value="calculatorStore.currencyFrom"
            :class="variant === 'banner' ? 'rounded-lg border text-black border-gray-300 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
            @change="onFromChange($event)">
            <option v-for="code in CURRENCY_CODES" :key="code" :value="code">
              {{ code.toUpperCase() }}
            </option>
          </select>
        </div>
      </div>

      <!-- Transfer Arrow -->
      <div class="flex justify-center">
        <button
          type="button"
          class="group flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover"
          :title="t('exchange_rate')"
          @click="swapCurrencies"
        >
          <svg class="h-6 w-6" viewBox="0 0 48 48" fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            :class="'transition-transform duration-200 group-hover:rotate-180'">
            <path d="M14 4  L4 14       Q2 16 4 18       Q6 20 8 18       L12 14       V36       Q12 40 16 40       Q20 40 20 36       V14       L24 18       Q26 20 28 18       Q30 16 28 14       L18 4       Q16 2 14 4Z" />
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
          <input v-model.number="amountReceiveLocal" type="number" min="0" step="0.01"
            :class="variant === 'banner' ? 'flex-1 rounded-lg border text-black border-gray-300 px-4 py-3 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
            placeholder="0.00" @input="onAmountReceiveInput" />
          <select :value="calculatorStore.currencyTo"
            :class="variant === 'banner' ? 'rounded-lg border text-black border-gray-300 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
            @change="onToChange($event)">
            <option v-for="code in calculatorStore.destinationOptions" :key="code" :value="code">
              {{ code.toUpperCase() }}
            </option>
          </select>
        </div>
      </div>

      <!-- Reductions (Commission Fee and Exchange Rate) -->
      <div v-if="showReductions" class="space-y-2 border-t border-gray-200 pt-4">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">{{ t('commission_fee') }}</span>
          <span class="font-semibold text-green-600">
            {{ summaryCommission }} {{ calculatorStore.currencyFrom.toUpperCase() }}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">{{ t('total_to_send') }}</span>
          <span class="font-semibold text-green-600">
            {{ summaryTotalToSend }} {{ calculatorStore.currencyFrom.toUpperCase() }}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">{{ t('exchange_rate') }}</span>
          <span class="font-semibold text-gray-900">
            1 {{ calculatorStore.currencyFrom.toUpperCase() }} = {{ summaryRate }} {{ calculatorStore.currencyTo.toUpperCase() }}
          </span>
        </div>
      </div>

      <div
        v-if="automaticCouponDetail"
        class="rounded-2xl border border-teal-200 bg-stone-100 px-4 py-3"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 gap-3">
            <div class="mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-teal-500 text-teal-500">
              <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42.003l-3.3-3.3a1 1 0 1 1 1.414-1.414l2.59 2.59 6.49-6.547a1 1 0 0 1 1.42-.006Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-700">
                Cupón automático aplicado
              </p>
              <p class="truncate text-2xl font-bold leading-none text-teal-500">
                {{ automaticCouponDetail.code }}
              </p>
              <p class="text-sm text-teal-600">
                Ahorras {{ automaticCouponDetail.savings }} {{ calculatorStore.currencyFrom.toUpperCase() }}
              </p>
            </div>
          </div>
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
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useCalculatorStore } from '../controllers/useCalculatorStore'
import { CURRENCY_CODES, CURRENCY_OPTIONS } from '../../domain/models'
import type { CurrencyCode } from '../../domain/models'

type SupportedLocale = 'es' | 'en' | 'pt'

interface WhatsAppCopy {
  emptyCalculation: string
  template: string
}

const WHATSAPP_PHONE_NUMBER = '51966991933'

const { t, locale } = useI18n()
const route = useRoute()

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
  whatsappPhone?: string
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
  autoLoad: true,
  whatsappPhone: WHATSAPP_PHONE_NUMBER
})

const emit = defineEmits<{
  calculate: [result: { amountSend: number; amountReceive: number; commission: number; rate: number }]
  currencyChange: [from: CurrencyCode, to: CurrencyCode]
}>()

const calculatorStore = useCalculatorStore()
const amountSendLocal = ref(props.initialAmount || 0)
const amountReceiveLocal = ref(0)

const whatsappCopy: Record<SupportedLocale, WhatsAppCopy> = {
  es: {
    emptyCalculation: 'Completa el cálculo antes de enviar el mensaje por WhatsApp.',
    template:
      'Hola, quiero cotizar una transferencia con Brasper:\n\n*Monto a enviar:* {amountSend} {currencyFrom}\n*Monto a recibir:* {amountReceive} {currencyTo}\n*Comisión:* {commission} {currencyFrom}\n*Total a enviar:* {totalToSend} {currencyFrom}\n*Tipo de cambio:* 1 {currencyFrom} = {rate} {currencyTo}'
  },
  en: {
    emptyCalculation: 'Complete the calculator before sending the WhatsApp message.',
    template:
      'Hello, I would like to quote a transfer with Brasper:\n\n*Amount to send:* {amountSend} {currencyFrom}\n*Amount to receive:* {amountReceive} {currencyTo}\n*Commission:* {commission} {currencyFrom}\n*Total to send:* {totalToSend} {currencyFrom}\n*Exchange rate:* 1 {currencyFrom} = {rate} {currencyTo}'
  },
  pt: {
    emptyCalculation: 'Preencha a calculadora antes de enviar a mensagem pelo WhatsApp.',
    template:
      'Olá, quero simular uma transferência com a Brasper:\n\n*Valor a enviar:* {amountSend} {currencyFrom}\n*Valor a receber:* {amountReceive} {currencyTo}\n*Comissão:* {commission} {currencyFrom}\n*Total a enviar:* {totalToSend} {currencyFrom}\n*Taxa de câmbio:* 1 {currencyFrom} = {rate} {currencyTo}'
  }
}

const currentLocale = computed<SupportedLocale>(() => {
  const localeValue = locale.value
  return localeValue === 'es' || localeValue === 'en' || localeValue === 'pt' ? localeValue : 'es'
})

const shouldSendWhatsappOnClick = computed(() => route.name === 'homepage')
const summaryCommission = computed(() => formatNumber(calculatorStore.result?.commission ?? 0))
const summaryTotalToSend = computed(() => formatNumber(calculatorStore.result?.totalToSend ?? 0))
const summaryRate = computed(() => (calculatorStore.result?.rate ?? 0).toFixed(4))
const automaticCouponDetail = computed(() => {
  const coupon = calculatorStore.currentAutomaticCoupon
  const result = calculatorStore.result

  if (!coupon || !result || result.amountSend <= 0 || result.commission <= 0) return null

  const commissionRate = calculatorStore.currentCommissionPercentage / 100
  const baseCommission = result.amountSend * commissionRate
  const savings =
    coupon.type === 'fixed'
      ? Math.min(coupon.discount, baseCommission)
      : Math.min(baseCommission * coupon.discount / 100, baseCommission)

  if (savings <= 0) return null

  return {
    code: coupon.code,
    savings: formatNumber(savings)
  }
})

function toTwoDecimals(n: number): number {
  return Number((n || 0).toFixed(2))
}

function formatNumber(n: number): string {
  return Number(n || 0).toFixed(2)
}

function buildWhatsappMessage() {
  const result = calculatorStore.result
  if (!result) return null

  const from = calculatorStore.currencyFrom.toUpperCase()
  const to = calculatorStore.currencyTo.toUpperCase()
  const messageTemplate = whatsappCopy[currentLocale.value].template
  return messageTemplate
    .replace('{amountSend}', formatNumber(result.amountSend))
    .replace('{currencyFrom}', from)
    .replace('{amountReceive}', formatNumber(result.amountReceive))
    .replace('{currencyTo}', to)
    .replace('{commission}', formatNumber(result.commission))
    .replace('{totalToSend}', formatNumber(result.totalToSend))
    .replace('{rate}', result.rate.toFixed(4))
}

function openWhatsappQuote() {
  const message = buildWhatsappMessage()
  if (!message) {
    window.alert(whatsappCopy[currentLocale.value].emptyCalculation)
    return
  }

  const phoneNumber = props.whatsappPhone || WHATSAPP_PHONE_NUMBER
  window.open(
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener,noreferrer'
  )
}

watch(
  () => calculatorStore.amountSend,
  (v) => { amountSendLocal.value = toTwoDecimals(v || props.initialAmount || 0) },
  { immediate: true }
)
watch(
  () => calculatorStore.amountReceive,
  (v) => { amountReceiveLocal.value = toTwoDecimals(v) },
  { immediate: true }
)

function onAmountSendInput() {
  const value = toTwoDecimals(amountSendLocal.value || 0)
  amountSendLocal.value = value
  calculatorStore.setAmountSend(value)
  calculatorStore.recalcFromSend()
  amountReceiveLocal.value = toTwoDecimals(calculatorStore.amountReceive)
}

function onAmountReceiveInput() {
  const value = toTwoDecimals(amountReceiveLocal.value ?? 0)
  amountReceiveLocal.value = value
  calculatorStore.setAmountReceive(value)
  amountSendLocal.value = toTwoDecimals(calculatorStore.amountSend)
}

function onFromChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as CurrencyCode
  calculatorStore.setCurrencyFrom(value)
  recalculateAfterCurrencyChange()
}

function onToChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as CurrencyCode
  calculatorStore.setCurrencyTo(value)
  recalculateAfterCurrencyChange()
}

function swapCurrencies() {
  const from = calculatorStore.currencyFrom
  const to = calculatorStore.currencyTo
  const reverseOptions = CURRENCY_OPTIONS[to] ?? []
  if (reverseOptions.length === 0) return

  const nextTo = reverseOptions.includes(from) ? from : reverseOptions[0]
  const previousResult = calculatorStore.result

  calculatorStore.setCurrencyFrom(to)
  calculatorStore.setCurrencyTo(nextTo)

  if (previousResult && previousResult.amountReceive > 0) {
    amountSendLocal.value = Number(previousResult.amountReceive.toFixed(2))
    calculatorStore.setAmountSend(amountSendLocal.value)
  }

  recalculateAfterCurrencyChange()
}

function recalculateAfterCurrencyChange() {
  const effectiveAmount = amountSendLocal.value > 0 ? amountSendLocal.value : calculatorStore.amountSend
  if (effectiveAmount > 0) {
    calculatorStore.setAmountSend(effectiveAmount)
    calculatorStore.recalcFromSend()
    amountReceiveLocal.value = toTwoDecimals(calculatorStore.amountReceive)
  }

  emit('currencyChange', calculatorStore.currencyFrom, calculatorStore.currencyTo)
  handleCalculate()
}

function syncCalculatedFields() {
  if (calculatorStore.amountSend > 0) {
    calculatorStore.recalcFromSend()
    amountSendLocal.value = toTwoDecimals(calculatorStore.amountSend)
    amountReceiveLocal.value = toTwoDecimals(calculatorStore.amountReceive)
    return
  }

  if (calculatorStore.amountReceive > 0) {
    calculatorStore.recalcFromReceive()
    amountSendLocal.value = toTwoDecimals(calculatorStore.amountSend)
    amountReceiveLocal.value = toTwoDecimals(calculatorStore.amountReceive)
  }
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
  if (shouldSendWhatsappOnClick.value) {
    openWhatsappQuote()
  }
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
    syncCalculatedFields()
    handleCalculate()
  },
  { deep: true }
)

onMounted(async () => {
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
    amountSendLocal.value = toTwoDecimals(props.initialAmount)
  }

  if (props.autoLoad) {
    await calculatorStore.loadData()
  }

  syncCalculatedFields()
})
</script>
