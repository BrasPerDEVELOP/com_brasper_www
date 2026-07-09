<template>
  <section :class="getContainerClasses">
    <!-- Header -->
    <template v-if="showTitle" >
      <div
        class="mb-4 flex items-center justify-center gap-2 sm:mb-6"
        :class="variant === 'banner' ? 'hidden md:flex' : ''"
      >
       <img src="/assets/images/logo/logo-80.png" alt="Logo Brasper" class="h-9 w-9 sm:h-10 sm:w-10" width="40" height="40" />
        <h1
          :class="variant === 'banner' ? 'text-lg font-semibold text-slate-900 sm:text-xl' : 'text-2xl font-semibold text-on-surface'">
          {{ t('calculatorTitle')}}
        </h1>
      </div>
      <!-- <p v-if="subtitle || (variant === 'default' && !subtitle)" class="mb-4 text-sm text-on-surface/80">
        {{ t('calculatorTitle') }}
      </p> -->
    </template>

    <!-- Diseño unificado para todos los contextos -->
    <div :class="variant === 'banner' ? 'space-y-3 sm:space-y-4' : 'mt-4 space-y-4'">
      <!-- YOU SEND Section -->
      <div class="overflow-visible rounded-xl border border-slate-200 px-3 py-2.5 shadow-sm sm:border-slate-300 sm:py-2 sm:shadow-lg">
        <label class="block text-xs font-semibold uppercase pl-2 tracking-wide text-slate-500">
          {{ t('you_send') }}
        </label>
        <div class="flex items-center gap-2">
          <input
            :value="amountSendLocal"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            :class="variant === 'banner' ? 'min-w-0 flex-1 py-1 pl-2 text-lg font-semibold text-black focus:outline-none sm:text-xl' : 'min-w-0 flex-1 rounded-lg border px-3 sm:px-4 py-3 text-base  focus:outline-none focus:ring-2 '"
            placeholder="300"
            @focus="activeInput = 'send'"
            @input="onAmountSendInput"
            @blur="onAmountSendBlur"
          />
          <div class="relative w-[7.5rem] shrink-0 sm:w-auto">
            <img
              :src="currencyFromFlagSrc"
              alt=""
              aria-hidden="true"
              class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full"
            />
            <select
              :value="calculatorStore.currencyFrom"
              aria-label="Moneda de origen"
              :class="variant === 'banner' ? 'w-full cursor-pointer bg-white py-2.5 pl-9 pr-2 text-base font-semibold text-black focus:outline-none sm:text-lg' : 'w-full cursor-pointer rounded-lg border bg-white py-3 pl-9 pr-3 text-sm focus:outline-none focus:ring-2'"
              @change="onFromChange($event)"
            >
              <option v-for="code in CURRENCY_CODES" :key="code" :value="code">
                {{ code.toUpperCase() }}
              </option>
            </select>
          </div>
        </div>
      </div>


      <!-- RECIPIENT RECEIVES Section -->
      <div class="overflow-visible rounded-xl border border-slate-200 px-3 py-2.5 shadow-sm sm:border-slate-300 sm:py-2 sm:shadow-lg">
        <label class="block text-xs font-semibold uppercase pl-2 tracking-wide text-slate-500">
          {{ t('recipient_receives') }}
        </label>
      <div class="flex items-center gap-2">
          <input
            :value="amountReceiveLocal"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            :class="variant === 'banner' ? 'min-w-0 flex-1 py-1 pl-2 text-lg font-semibold text-black focus:outline-none sm:text-xl' : 'min-w-0 flex-1 rounded-lg border px-3 sm:px-4 py-3 text-base  focus:outline-none focus:ring-2 '"
            placeholder="0.00"
            @focus="activeInput = 'receive'"
            @input="onAmountReceiveInput"
            @blur="onAmountReceiveBlur"
          />
          <div class="relative w-[7.5rem] shrink-0 sm:w-auto">
            <img
              :src="currencyToFlagSrc"
              alt=""
              aria-hidden="true"
              class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full"
            />
            <select
              :value="calculatorStore.currencyTo"
              aria-label="Moneda de destino"
              :class="variant === 'banner' ? 'w-full cursor-pointer bg-white py-2.5 pl-9 pr-2 text-base font-semibold text-black focus:outline-none sm:text-lg' : 'w-full cursor-pointer rounded-lg border bg-white py-3 pl-9 pr-3 text-sm focus:outline-none focus:ring-2'"
              @change="onToChange($event)"
            >
              <option v-for="code in calculatorStore.destinationOptions" :key="code" :value="code">
                {{ code.toUpperCase() }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <p
        v-if="amountOutOfRange"
        class="text-center text-sm font-medium text-red-600"
      >
        {{ t('calculator_amount_out_of_range_contact_us') }}
      </p>

      <!-- Reductions (Commission Fee and Exchange Rate) -->
      <div v-if="showReductions" class="space-y-2 border-t border-slate-100 pt-3 sm:border-slate-200 sm:pt-4">
        <div class="flex justify-between text-sm">
          <span class="text-slate-600">{{ t('commission_fee') }}</span>
          <span class="font-semibold text-green-600">
            {{ summaryCommission }} {{ calculatorStore.currencyFrom.toUpperCase() }}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-slate-600">{{ t('total_to_send') }}</span>
          <span class="font-semibold text-green-600">
            {{ summaryTotalToSend }} {{ calculatorStore.currencyFrom.toUpperCase() }}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-slate-600">{{ t('exchange_rate') }}</span>
          <span class="font-semibold text-slate-900">
            1 {{ calculatorStore.currencyFrom.toUpperCase() }} = {{ summaryRate }} {{ calculatorStore.currencyTo.toUpperCase() }}
          </span>
        </div>
      </div>

      <div
        v-if="calculatorStore.currentAutomaticCoupon"
        class="rounded-2xl border border-cyan-200 bg-stone-100 px-4 py-3"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex min-w-0 flex-1 gap-3">
            <!-- Cupón de la campaña del Mundial: microescena de gol -->
            <span
              v-if="isWorldCupCoupon && !calculatorStore.skipAutomaticCoupon"
              class="gol-scene relative block h-11 w-16 shrink-0 self-center"
              aria-hidden="true"
            >
              <span class="gol-flash"></span>
              <svg class="gol-net" viewBox="0 0 26 30" fill="none" preserveAspectRatio="xMidYMid meet">
                <g stroke="rgba(74,82,216,.32)" stroke-width="0.7">
                  <line x1="6" y1="5" x2="6" y2="26" />
                  <line x1="12" y1="5" x2="12" y2="26" />
                  <line x1="18" y1="5" x2="18" y2="26" />
                  <line x1="24" y1="5" x2="24" y2="26" />
                  <line x1="6" y1="10" x2="24" y2="10" />
                  <line x1="6" y1="16" x2="24" y2="16" />
                  <line x1="6" y1="22" x2="24" y2="22" />
                </g>
                <path d="M6 27 V5 H24 V27" fill="none" stroke="#165efc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="gol-ball">
                <svg viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="16" fill="#ffffff" />
                  <polygon points="20,15 24.76,18.45 22.94,24.05 17.06,24.05 15.24,18.45" fill="#1b1f2e" />
                  <g stroke="#1b1f2e" stroke-width="1.4" stroke-linecap="round">
                    <line x1="20" y1="15" x2="20" y2="4.2" />
                    <line x1="24.76" y1="18.45" x2="34.8" y2="15.4" />
                    <line x1="22.94" y1="24.05" x2="29.1" y2="32.4" />
                    <line x1="17.06" y1="24.05" x2="10.9" y2="32.4" />
                    <line x1="15.24" y1="18.45" x2="5.2" y2="15.4" />
                  </g>
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#1b1f2e" stroke-width="1.8" />
                </svg>
              </span>
              <span class="gol-label">¡GOL!</span>
            </span>
            <!-- Otros cupones automáticos: check -->
            <div
              v-else-if="!calculatorStore.skipAutomaticCoupon"
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan-500 text-cyan-500"
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
                <p class="font-medium text-on-surface">
                  {{ t('coupon_auto_applied') }}
                </p>
                <p class="truncate font-bold leading-none text-secondary">
                  {{ calculatorStore.currentAutomaticCoupon.code }}
                </p>
                <p v-if="automaticCouponDetail" class="text-secondary">
                  {{ t('coupon_savings', { amount: automaticCouponDetail.savings, currency: calculatorStore.currencyFrom.toUpperCase() }) }}
                </p>
              </template>
              <template v-else>
                <p class="font-medium text-on-surface">
                  {{ t('coupon_available') }}
                </p>
                <p class="truncate font-bold leading-none text-secondary">
                  {{ calculatorStore.currentAutomaticCoupon.code }}
                </p>
              </template>
            </div>
          </div>
          <button
            type="button"
            class="flex shrink-0 items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            :class="calculatorStore.skipAutomaticCoupon
              ? 'min-h-9 rounded-lg bg-azure-600 px-4 py-2 text-sm font-medium hover:bg-azure-600'
              : 'h-8 w-8 rounded-full bg-on-surface hover:bg-on-surface/80'"
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
        class="relative z-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-azure-600 px-[30px] py-[12px] text-base font-bold capitalize text-on-surface transition-colors duration-500 hover:text-white after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-[calc(100%+5px)] after:w-[calc(100%+5px)] after:content-[''] after:bg-primary after:-translate-x-1/2 after:-translate-y-1/2 after:scale-100 after:transition-transform after:duration-700 hover:after:scale-0 hover:after:rounded-full max-[575px]:px-[25px] max-[575px]:py-[9px]"
        @click="handleButtonClick">
        <Icon icon="ic:round-whatsapp" class="h-6 w-6 shrink-0" aria-hidden="true" />
        {{ buttonText || t('send_money') }}
      </button>

      <!-- Terms and Conditions -->
      <p v-if="showTerms" class="text-center text-xs text-slate-500">
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
import { CURRENCY_CODES } from '../../domain/models'
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
  buttonText: 'SEND MONEY',
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
const amountOutOfRange = ref(false)

const whatsappCopy: Record<SupportedLocale, WhatsAppCopy> = {
  es: {
    emptyCalculation: 'Completa el cálculo antes de enviar el mensaje por WhatsApp.',
    template:
      'Perfecto, los detalles de tu envío de Brasper hoy son los siguientes:\n *Monto a Enviar: {amountSend} {currencyFrom}*\n Tipo de Cambio: {rate}\n *Comisión de envío: {commission} {currencyFrom}*\n Neto a convertir: {totalToSend} {currencyFrom}\n *Total a Recibir: {amountReceive} {currencyTo}*\n{couponLine}\n\n*Resumen: Para su envío de {amountSend} {currencyFrom}, recibirá directo en su cuenta de destino {amountReceive} {currencyTo}*',
    couponLine: '*CUPÓN APLICADO: {couponCode}*'
  },
  en: {
    emptyCalculation: 'Complete the calculator before sending the WhatsApp message.',
    template:
      'Great! Here are the details of your Brasper transfer today\n *Amount to Send: {amountSend} {currencyFrom}*\n Exchange Rate: {rate}\n *Shipping Commission: {commission} {currencyFrom}*\n Net to Convert: {totalToSend} {currencyFrom}\n *Total to Receive: {amountReceive} {currencyTo}*\n{couponLine}\n\n*Summary: For your transfer of {amountSend} {currencyFrom}, you will receive directly in your destination account {amountReceive} {currencyTo}*',
    couponLine: '*COUPON APPLIED: {couponCode}*'
  },
  pt: {
    emptyCalculation: 'Preencha a calculadora antes de enviar a mensagem pelo WhatsApp.',
    template:
      'Perfeito, os detalhes para seu envio Brasper de hoje é o seguinte:\n *Valor a Enviar: {amountSend} {currencyFrom}*\n Taxa de Câmbio: {rate}\n *Custo de envio: {commission} {currencyFrom}*\n Neto por converter: {totalToSend} {currencyFrom}\n *Total a Receber: {amountReceive} {currencyTo}*\n{couponLine}\n\n*Resumo: Para seu envio de {amountSend} {currencyFrom}, chegará direto na sua conta de destino {amountReceive} {currencyTo}*',
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
const currencyFlagSrcByCode: Record<CurrencyCode, string> = {
  pen: '/assets/flags/peru.svg',
  usd: '/assets/flags/usa.png',
  brl: '/assets/flags/bra.svg',
}
const currencyFromFlagSrc = computed(() => currencyFlagSrcByCode[calculatorStore.currencyFrom])
const currencyToFlagSrc = computed(() => currencyFlagSrcByCode[calculatorStore.currencyTo])
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

/** Cupón de la campaña del Mundial: su código sigue la plantilla MUNDIAL-{HOME}-{AWAY}. */
const isWorldCupCoupon = computed(() =>
  /^MUNDIAL/i.test(calculatorStore.currentAutomaticCoupon?.code ?? '')
)

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

/**
 * Sanitiza el input para que solo permita números y un separador decimal.
 * - Elimina letras o caracteres no numéricos.
 * - Permite como máximo 2 decimales.
 */
function sanitizeNumericInput(raw: string): string {
  let normalized = normalizeAmountInput(raw)
  normalized = normalized.replace(/[^\d.]/g, '')
  if (!normalized) return ''

  const parts = normalized.split('.')
  const intPart = parts[0] ?? ''
  const decPart = parts.slice(1).join('').slice(0, 2)

  if (parts.length === 1) return intPart
  if (decPart.length === 0) return `${intPart}.`
  return `${intPart}.${decPart}`
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
  const sanitized = sanitizeNumericInput(rawValue)
  amountSendLocal.value = sanitized
  activeInput.value = 'send'
  const parsedValue = parseAmountInput(sanitized)

  if (parsedValue === null) {
    amountOutOfRange.value = false
    if (!sanitized) {
      calculatorStore.resetAmounts()
      amountReceiveLocal.value = ''
    }
    return
  }

  const value = toTwoDecimals(parsedValue)

  const min = calculatorStore.minAmount
  const max = calculatorStore.maxAmount
  if (value < min || value > max) {
    amountOutOfRange.value = true
    calculatorStore.resetAmounts()
    amountReceiveLocal.value = ''
    return
  }
  amountOutOfRange.value = false

  calculatorStore.setAmountSend(value)
  calculatorStore.recalcFromSend()
  amountReceiveLocal.value = formatInputValue(calculatorStore.amountReceive)
}

function onAmountReceiveInput(event: Event) {
  const rawValue = (event.target as HTMLInputElement).value
  const sanitized = sanitizeNumericInput(rawValue)
  amountReceiveLocal.value = sanitized
  activeInput.value = 'receive'
  const parsedValue = parseAmountInput(sanitized)

  if (parsedValue === null) {
    amountOutOfRange.value = false
    if (!sanitized) {
      calculatorStore.resetAmounts()
      amountSendLocal.value = ''
    }
    return
  }

  const value = toTwoDecimals(parsedValue)
  calculatorStore.setAmountReceive(value)

  const min = calculatorStore.minAmount
  const max = calculatorStore.maxAmount
  if (calculatorStore.amountSend < min || calculatorStore.amountSend > max) {
    amountOutOfRange.value = true
    calculatorStore.resetAmounts()
    return
  }

  amountOutOfRange.value = false
  amountSendLocal.value = formatInputValue(calculatorStore.amountSend)
}

function onAmountSendBlur() {
  activeInput.value = null
  const parsedValue = parseAmountInput(amountSendLocal.value)
  amountSendLocal.value = parsedValue === null ? '' : formatInputValue(parsedValue)

  if (parsedValue !== null) {
    const min = calculatorStore.minAmount
    const max = calculatorStore.maxAmount
    amountOutOfRange.value = parsedValue < min || parsedValue > max
  } else {
    amountOutOfRange.value = false
  }

  amountReceiveLocal.value = formatInputValue(calculatorStore.amountReceive)
}

function onAmountReceiveBlur() {
  activeInput.value = null
  const parsedValue = parseAmountInput(amountReceiveLocal.value)
  amountReceiveLocal.value = parsedValue === null ? '' : formatInputValue(parsedValue)

  if (parsedValue !== null) {
    const min = calculatorStore.minAmount
    const max = calculatorStore.maxAmount
    // En modo "receive", validamos con el monto derivado que usa el backend para el rango.
    amountOutOfRange.value = calculatorStore.amountSend < min || calculatorStore.amountSend > max
  } else {
    amountOutOfRange.value = false
  }

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
    'banner': 'w-full max-w-full rounded-2xl bg-white p-4 shadow-xl sm:p-6 sm:shadow-2xl',
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

<style scoped>
/* Microescena: la pelota describe un arco y entra al arco = ¡GOL! */
.gol-scene { overflow: visible; }

.gol-net {
  position: absolute;
  right: 2px;
  top: 50%;
  height: 30px;
  width: 26px;
  transform: translateY(-50%);
  animation: gol-net-shake 3.2s ease-in-out infinite;
}
.gol-flash {
  position: absolute;
  right: 4px;
  top: 50%;
  height: 30px;
  width: 30px;
  margin-top: -15px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(1, 232, 252, 0.85) 0%, rgba(22, 94, 252, 0.45) 45%, rgba(1, 232, 252, 0) 72%);
  opacity: 0;
  transform: scale(0.4);
  pointer-events: none;
  animation: gol-flash 3.2s ease-out infinite;
}
.gol-ball {
  position: absolute;
  left: 0;
  top: 50%;
  height: 16px;
  width: 16px;
  margin-top: -8px;
  will-change: transform;
  animation: gol-ball 3.2s cubic-bezier(0.45, 0.05, 0.35, 1) infinite;
}
.gol-ball :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
.gol-label {
  position: absolute;
  top: -7px;
  right: 0;
  font-size: 9px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: #165efc;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(2px) scale(0.6);
  pointer-events: none;
  animation: gol-pop 3.2s ease-out infinite;
}

@keyframes gol-ball {
  0%   { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  10%  { transform: translate(9px, -9px) rotate(150deg); opacity: 1; }
  22%  { transform: translate(24px, -10px) rotate(330deg); }
  30%  { transform: translate(38px, 6px) rotate(470deg); }   /* entra a la red */
  35%  { transform: translate(35px, 1px) rotate(478deg); }   /* rebote */
  40%  { transform: translate(38px, 5px) rotate(482deg); }
  80%  { transform: translate(38px, 5px) rotate(482deg); opacity: 1; }
  86%  { transform: translate(38px, 5px) rotate(482deg); opacity: 0; }
  87%  { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  97%  { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
}
@keyframes gol-flash {
  0%, 27% { opacity: 0; transform: scale(0.4); }
  31%     { opacity: 0.9; transform: scale(1.25); }
  46%     { opacity: 0; transform: scale(1.6); }
  100%    { opacity: 0; transform: scale(0.4); }
}
@keyframes gol-net-shake {
  0%, 28%   { transform: translateY(-50%) translateX(0); }
  31%       { transform: translateY(-50%) translateX(1.6px); }
  34%       { transform: translateY(-50%) translateX(-1.1px); }
  37%       { transform: translateY(-50%) translateX(0.6px); }
  40%, 100% { transform: translateY(-50%) translateX(0); }
}
@keyframes gol-pop {
  0%, 28% { opacity: 0; transform: translateY(2px) scale(0.6); }
  34%     { opacity: 1; transform: translateY(-3px) scale(1.08); }
  40%     { opacity: 1; transform: translateY(-3px) scale(1); }
  64%     { opacity: 1; }
  76%     { opacity: 0; transform: translateY(-6px) scale(1); }
  100%    { opacity: 0; }
}

/* Sin movimiento: pelota en reposo frente al arco. */
@media (prefers-reduced-motion: reduce) {
  .gol-net { animation: none; transform: translateY(-50%); }
  .gol-flash,
  .gol-label { animation: none; opacity: 0; }
  .gol-ball { animation: none; transform: translate(30px, 2px); }
}
</style>
