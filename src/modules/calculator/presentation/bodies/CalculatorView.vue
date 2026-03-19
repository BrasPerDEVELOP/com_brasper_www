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
          <input
            :value="amountSendLocal"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            :class="variant === 'banner' ? 'flex-1 rounded-lg border text-black border-gray-300 px-4 py-3 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
            placeholder="1000"
            @focus="activeInput = 'send'"
            @input="onAmountSendInput"
            @blur="onAmountSendBlur"
          />
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
          <input
            :value="amountReceiveLocal"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            :class="variant === 'banner' ? 'flex-1 rounded-lg border text-black border-gray-300 px-4 py-3 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20' : 'flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'"
            placeholder="0.00"
            @focus="activeInput = 'receive'"
            @input="onAmountReceiveInput"
            @blur="onAmountReceiveBlur"
          />
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
        v-if="calculatorStore.currentAutomaticCoupon"
        class="rounded-2xl border border-teal-200 bg-stone-100 px-4 py-3"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex min-w-0 flex-1 gap-3">
            <div
              v-if="!calculatorStore.skipAutomaticCoupon"
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-500 text-teal-500"
            >
              <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42.003l-3.3-3.3a1 1 0 1 1 1.414-1.414l2.59 2.59 6.49-6.547a1 1 0 0 1 1.42-.006Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="min-w-0 text-sm">
              <template v-if="!calculatorStore.skipAutomaticCoupon">
                <p class="font-medium text-slate-700">
                  {{ t('coupon_auto_applied') }}
                </p>
                <p class="truncate font-bold leading-none text-teal-500">
                  {{ calculatorStore.currentAutomaticCoupon.code }}
                </p>
                <p v-if="automaticCouponDetail" class="text-teal-600">
                  {{ t('coupon_savings', { amount: automaticCouponDetail.savings, currency: calculatorStore.currencyFrom.toUpperCase() }) }}
                </p>
              </template>
              <template v-else>
                <p class="font-medium text-slate-700">
                  {{ t('coupon_available') }}
                </p>
                <p class="truncate font-bold leading-none text-teal-500">
                  {{ calculatorStore.currentAutomaticCoupon.code }}
                </p>
              </template>
            </div>
          </div>
          <button
            type="button"
            class="flex shrink-0 items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
            :class="calculatorStore.skipAutomaticCoupon
              ? 'min-h-9 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium hover:bg-teal-600'
              : 'h-8 w-8 rounded-full bg-black hover:bg-slate-800'"
            :aria-label="calculatorStore.skipAutomaticCoupon ? t('coupon_apply') : t('close')"
            @click="calculatorStore.setSkipAutomaticCoupon(!calculatorStore.skipAutomaticCoupon)"
          >
            <span v-if="calculatorStore.skipAutomaticCoupon">{{ t('coupon_apply') }}</span>
            <span v-else class="text-lg leading-none">×</span>
          </button>
        </div>
      </div>

      <!-- Send Money Button -->
      <button v-if="showButton" type="button"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-cyan-600"
        @click="handleButtonClick">
        <Icon icon="ic:round-whatsapp" class="h-6 w-6 shrink-0" aria-hidden="true" />
        {{ buttonText || t('send_money') }}
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
import { Icon } from '@iconify/vue'
import { useCalculatorStore } from '../controllers/useCalculatorStore'
import { CURRENCY_CODES, CURRENCY_OPTIONS } from '../../domain/models'
import type { CurrencyCode } from '../../domain/models'

type SupportedLocale = 'es' | 'en' | 'pt'

interface WhatsAppCopy {
  emptyCalculation: string
  template: string
  couponLine?: string
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
const amountSendLocal = ref(props.initialAmount > 0 ? props.initialAmount.toFixed(2) : '')
const amountReceiveLocal = ref('')
const activeInput = ref<'send' | 'receive' | null>(null)

const whatsappCopy: Record<SupportedLocale, WhatsAppCopy> = {
  es: {
    emptyCalculation: 'Completa el cálculo antes de enviar el mensaje por WhatsApp.',
    template:
      'Perfecto, los detalles de tu envío de Brasper hoy son los siguientes:\n *Monto a Enviar:* {amountSend} {currencyFrom}\n Tipo de Cambio: {rate}\n *Comisión de envío:* {commission} {currencyFrom}\n Neto a convertir: {totalToSend} {currencyFrom}\n *Total a Recibir:* {amountReceive} {currencyTo}\n{couponLine}\n\nResumen: Para su envío de {amountSend} {currencyFrom}, recibirá directo en su cuenta de destino {amountReceive} {currencyTo}',
    couponLine: '*CUPÓN APLICADO: {couponCode}*'
  },
  en: {
    emptyCalculation: 'Complete the calculator before sending the WhatsApp message.',
    template:
      'Great! Here are the details of your Brasper transfer today\n *Amount to Send:* {amountSend} {currencyFrom}\n Exchange Rate: {rate}\n *Shipping Commission:* {commission} {currencyFrom}\n Net to Convert: {totalToSend} {currencyFrom}\n *Total to Receive:* {amountReceive} {currencyTo}\n{couponLine}\n\nSummary: For your transfer of {amountSend} {currencyFrom}, you will receive directly in your destination account {amountReceive} {currencyTo}',
    couponLine: '*COUPON APPLIED: {couponCode}*'
  },
  pt: {
    emptyCalculation: 'Preencha a calculadora antes de enviar a mensagem pelo WhatsApp.',
    template:
      'Perfeito, os detalhes para seu envio Brasper de hoje é o seguinte:\n *Valor a Enviar:* {amountSend} {currencyFrom}\n Taxa de Câmbio: {rate}\n *Custo de envio:* {commission} {currencyFrom}\n Neto por converter: {totalToSend} {currencyFrom}\n *Total a Receber:* {amountReceive} {currencyTo}\n{couponLine}\n\nResumo: Para seu envio de {amountSend} {currencyFrom}, chegará direto na sua conta de destino {amountReceive} {currencyTo}',
    couponLine: '*CUPOM APLICADO: {couponCode}*'
  }
}

const currentLocale = computed<SupportedLocale>(() => {
  const localeValue = locale.value
  return localeValue === 'es' || localeValue === 'en' || localeValue === 'pt' ? localeValue : 'es'
})

const shouldSendWhatsappOnClick = computed(() => route.name === 'homepage')
const summaryCommission = computed(() => formatNumber(calculatorStore.result?.commission ?? 0))
const summaryTotalToSend = computed(() => formatNumber(calculatorStore.result?.totalToSend ?? 0))
const summaryRate = computed(() => formatRate(calculatorStore.result?.rate ?? 0))
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

function formatInputValue(n: number): string {
  return n > 0 ? toTwoDecimals(n).toFixed(2) : ''
}

function normalizeAmountInput(raw: string): string {
  const compact = raw.replace(/\s+/g, '')

  if (compact.includes(',') && compact.includes('.')) {
    return compact.replace(/,/g, '')
  }

  return compact.replace(',', '.')
}

function parseAmountInput(raw: string): number | null {
  const normalized = normalizeAmountInput(raw)

  if (!normalized || normalized === '.') return null
  if (!/^\d*\.?\d*$/.test(normalized)) return null

  const value = Number(normalized)
  return Number.isFinite(value) && value >= 0 ? value : null
}

function formatNumber(n: number): string {
  return Number(n || 0).toFixed(2)
}

function formatRate(n: number): string {
  return Number(n || 0).toFixed(4).replace(/\.?0+$/, '')
}

function buildWhatsappMessage() {
  const result = calculatorStore.result
  if (!result) return null

  const from = calculatorStore.currencyFrom.toUpperCase()
  const to = calculatorStore.currencyTo.toUpperCase()
  const couponCode = calculatorStore.currentAutomaticCoupon?.code
  const couponLine = couponCode
    ? (whatsappCopy[currentLocale.value].couponLine ?? '').replace('{couponCode}', couponCode)
    : ''
  const messageTemplate = whatsappCopy[currentLocale.value].template
  const replacements: Record<string, string> = {
    amountSend: formatNumber(result.amountSend),
    currencyFrom: from,
    amountReceive: formatNumber(result.amountReceive),
    currencyTo: to,
    commission: formatNumber(result.commission),
    totalToSend: formatNumber(result.totalToSend),
    rate: formatRate(result.rate),
    couponLine
  }

  return Object.entries(replacements).reduce((message, [key, value]) => {
    return message.split(`{${key}}`).join(value)
  }, messageTemplate)
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
  (v) => {
    if (activeInput.value !== 'send') {
      amountSendLocal.value = formatInputValue(v || props.initialAmount || 0)
    }
  },
  { immediate: true }
)
watch(
  () => calculatorStore.amountReceive,
  (v) => {
    if (activeInput.value !== 'receive') {
      amountReceiveLocal.value = formatInputValue(v)
    }
  },
  { immediate: true }
)

function onAmountSendInput(event: Event) {
  const rawValue = (event.target as HTMLInputElement).value
  amountSendLocal.value = rawValue
  activeInput.value = 'send'
  const parsedValue = parseAmountInput(rawValue)

  if (parsedValue === null) {
    if (!normalizeAmountInput(rawValue)) {
      calculatorStore.resetAmounts()
      amountReceiveLocal.value = ''
    }
    return
  }

  const value = toTwoDecimals(parsedValue)
  calculatorStore.setAmountSend(value)
  calculatorStore.recalcFromSend()
  amountReceiveLocal.value = formatInputValue(calculatorStore.amountReceive)
}

function onAmountReceiveInput(event: Event) {
  const rawValue = (event.target as HTMLInputElement).value
  amountReceiveLocal.value = rawValue
  activeInput.value = 'receive'
  const parsedValue = parseAmountInput(rawValue)

  if (parsedValue === null) {
    if (!normalizeAmountInput(rawValue)) {
      calculatorStore.resetAmounts()
      amountSendLocal.value = ''
    }
    return
  }

  const value = toTwoDecimals(parsedValue)
  calculatorStore.setAmountReceive(value)
  amountSendLocal.value = formatInputValue(calculatorStore.amountSend)
}

function onAmountSendBlur() {
  activeInput.value = null
  const parsedValue = parseAmountInput(amountSendLocal.value)
  amountSendLocal.value = parsedValue === null ? '' : formatInputValue(parsedValue)
  amountReceiveLocal.value = formatInputValue(calculatorStore.amountReceive)
}

function onAmountReceiveBlur() {
  activeInput.value = null
  const parsedValue = parseAmountInput(amountReceiveLocal.value)
  amountReceiveLocal.value = parsedValue === null ? '' : formatInputValue(parsedValue)
  amountSendLocal.value = formatInputValue(calculatorStore.amountSend)
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
    const nextAmount = toTwoDecimals(previousResult.amountReceive)
    amountSendLocal.value = formatInputValue(nextAmount)
    calculatorStore.setAmountSend(nextAmount)
  }

  recalculateAfterCurrencyChange()
}

function recalculateAfterCurrencyChange() {
  if (calculatorStore.inputMode === 'receive') {
    const parsedReceive = parseAmountInput(amountReceiveLocal.value)
    const effectiveReceive = parsedReceive !== null && parsedReceive > 0
      ? parsedReceive
      : calculatorStore.amountReceive

    if (effectiveReceive > 0) {
      calculatorStore.setAmountReceive(effectiveReceive)
      calculatorStore.recalcFromReceive()
      if (activeInput.value !== 'send') {
        amountSendLocal.value = formatInputValue(calculatorStore.amountSend)
      }
      if (activeInput.value !== 'receive') {
        amountReceiveLocal.value = formatInputValue(calculatorStore.amountReceive)
      }
    }
  } else {
    const parsedAmount = parseAmountInput(amountSendLocal.value)
    const effectiveAmount = parsedAmount !== null && parsedAmount > 0
      ? parsedAmount
      : calculatorStore.amountSend

    if (effectiveAmount > 0) {
      calculatorStore.setAmountSend(effectiveAmount)
      calculatorStore.recalcFromSend()
      if (activeInput.value !== 'send') {
        amountSendLocal.value = formatInputValue(calculatorStore.amountSend)
      }
      if (activeInput.value !== 'receive') {
        amountReceiveLocal.value = formatInputValue(calculatorStore.amountReceive)
      }
    }
  }

  emit('currencyChange', calculatorStore.currencyFrom, calculatorStore.currencyTo)
  handleCalculate()
}

function syncCalculatedFields() {
  if (calculatorStore.inputMode === 'receive' && calculatorStore.amountReceive > 0) {
    calculatorStore.recalcFromReceive()
    if (activeInput.value !== 'send') {
      amountSendLocal.value = formatInputValue(calculatorStore.amountSend)
    }
    if (activeInput.value !== 'receive') {
      amountReceiveLocal.value = formatInputValue(calculatorStore.amountReceive)
    }
    return
  }

  if (calculatorStore.amountSend > 0) {
    calculatorStore.recalcFromSend()
    if (activeInput.value !== 'send') {
      amountSendLocal.value = formatInputValue(calculatorStore.amountSend)
    }
    if (activeInput.value !== 'receive') {
      amountReceiveLocal.value = formatInputValue(calculatorStore.amountReceive)
    }
    return
  }

  if (activeInput.value !== 'send') {
    amountSendLocal.value = ''
  }
  if (activeInput.value !== 'receive') {
    amountReceiveLocal.value = ''
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
    amountSendLocal.value = formatInputValue(props.initialAmount)
  }

  if (props.autoLoad) {
    await calculatorStore.loadData()
  }

  syncCalculatedFields()
})
</script>
