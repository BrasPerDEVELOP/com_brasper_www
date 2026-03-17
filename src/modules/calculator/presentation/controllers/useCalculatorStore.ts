import { defineStore } from 'pinia'
import type { CurrencyCode, ExchangeRate, CommissionRange, Coupon, CalculatorResult } from '../../domain/models'
import type { CurrencyReadDTO } from '../../infrastructure/adapters/CalculatorRepository'
import { getCurrencyPairKey, CURRENCY_OPTIONS } from '../../domain/models'
import { LoadCalculatorDataUseCase } from '../../application/use_cases'
import { CalculatorApiAdapter } from '../../infrastructure/adapters'

interface CalculatorState {
  currencies: CurrencyReadDTO[]
  currencyFrom: CurrencyCode
  currencyTo: CurrencyCode
  amountSend: number
  amountReceive: number
  inputMode: 'send' | 'receive'
  taxRates: ExchangeRate[]
  commissions: CommissionRange[]
  coupons: Coupon[]
  /** Si true, no se aplica el cupón automático (usuario lo quitó). Se puede volver a aplicar con "Aplicar". */
  skipAutomaticCoupon: boolean
  /** IDs para POST /transactions/ (tasa y comisión usadas en la calculadora). */
  selectedTaxRateId: string | null
  selectedCommissionId: string | null
  isLoading: boolean
  error: string | null
}

const DEFAULT_FROM: CurrencyCode = 'pen'
const DEFAULT_TO: CurrencyCode = 'brl'

interface CalculationBreakdown {
  amountSend: number
  amountSendWithoutPromotion: number
  amountReceive: number
  commission: number
  commissionRate: number
  totalToSend: number
  couponDiscountPercentage: number
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function getPairCommissionRanges(
  commissions: CommissionRange[],
  currencyFrom: CurrencyCode,
  currencyTo: CurrencyCode
): CommissionRange[] {
  return commissions
    .filter((commission) => commission.coin_a === currencyFrom && commission.coin_b === currencyTo)
    .sort((a, b) => a.min_amount - b.min_amount)
}

function getCommissionRateForAmount(ranges: CommissionRange[], amount: number): number {
  if (ranges.length === 0) return 0.03

  for (const range of ranges) {
    if (amount >= range.min_amount && amount <= range.max_amount) {
      return range.percentage / 100
    }
  }

  return ranges[ranges.length - 1].percentage / 100
}

function getReverseFactorForAmount(ranges: CommissionRange[], amount: number): number {
  if (ranges.length === 0) return 0.97

  for (const range of ranges) {
    if (amount >= range.min_amount && amount <= range.max_amount) {
      const reverseFactor = Number(range.reverse)
      return reverseFactor > 0 ? reverseFactor : 1 - range.percentage / 100
    }
  }

  const lastRange = ranges[ranges.length - 1]
  const reverseFactor = Number(lastRange.reverse)
  return reverseFactor > 0 ? reverseFactor : 1 - lastRange.percentage / 100
}

function getAutomaticCouponForPair(
  coupons: Coupon[],
  currencyFrom: CurrencyCode,
  currencyTo: CurrencyCode
): Coupon | null {
  const now = new Date()

  return (
    coupons.find((coupon) => {
      if (!coupon.isAutomatic || !coupon.isActive) return false
      if (coupon.originCurrency && coupon.originCurrency !== currencyFrom) return false
      if (coupon.destinationCurrency && coupon.destinationCurrency !== currencyTo) return false

      const startsAt = coupon.startDate ? new Date(coupon.startDate) : null
      const endsAt = coupon.endDate ? new Date(coupon.endDate) : null

      if (startsAt && Number.isNaN(startsAt.getTime())) return false
      if (endsAt && Number.isNaN(endsAt.getTime())) return false
      if (startsAt && startsAt > now) return false
      if (endsAt && endsAt < now) return false

      return coupon.discount > 0
    }) ?? null
  )
}

function getCouponDiscountAmount(coupon: Coupon | null, baseCommission: number): number {
  if (!coupon || baseCommission <= 0) return 0

  if (coupon.type === 'fixed') {
    return Math.min(roundMoney(coupon.discount), baseCommission)
  }

  return Math.min(roundMoney(baseCommission * coupon.discount / 100), baseCommission)
}

function getCouponDiscountFraction(coupon: Coupon | null, baseCommission: number): number {
  if (!coupon || baseCommission <= 0) return 0

  if (coupon.type === 'fixed') {
    return Math.min(roundMoney(coupon.discount) / baseCommission, 1)
  }

  return Math.min(Math.max(coupon.discount / 100, 0), 1)
}

function calculateBreakdown(
  amountSend: number,
  rate: number,
  ranges: CommissionRange[],
  coupon: Coupon | null
): CalculationBreakdown {
  const normalizedAmountSend = roundMoney(amountSend)
  const commissionRate = getCommissionRateForAmount(ranges, normalizedAmountSend)
  const baseCommission = roundMoney(normalizedAmountSend * commissionRate)
  const couponDiscountAmount = getCouponDiscountAmount(coupon, baseCommission)
  const commission = roundMoney(Math.max(baseCommission - couponDiscountAmount, 0))
  const totalToSend = roundMoney(normalizedAmountSend - commission)
  const amountReceive = roundMoney(totalToSend * rate)

  return {
    amountSend: normalizedAmountSend,
    amountSendWithoutPromotion: normalizedAmountSend,
    amountReceive,
    commission,
    commissionRate: commissionRate * 100,
    totalToSend,
    couponDiscountPercentage:
      baseCommission > 0 ? roundMoney((couponDiscountAmount / baseCommission) * 100) : 0
  }
}

function estimateBaseAmountSendFromReceive(
  desiredReceive: number,
  rate: number,
  ranges: CommissionRange[]
): number {
  const normalizedDesiredReceive = roundMoney(desiredReceive)
  let estimateSend = Math.max(roundMoney(normalizedDesiredReceive / rate), 0.01)

  for (let i = 0; i < 8; i++) {
    const reverseFactor = getReverseFactorForAmount(ranges, estimateSend)
    if (!Number.isFinite(reverseFactor) || reverseFactor <= 0) {
      break
    }

    const nextEstimate = roundMoney((normalizedDesiredReceive / reverseFactor) / rate)
    if (Math.abs(nextEstimate - estimateSend) < 0.01) {
      estimateSend = nextEstimate
      break
    }

    estimateSend = nextEstimate
  }

  return estimateSend
}

function calculateInverseBreakdown(
  desiredReceive: number,
  rate: number,
  ranges: CommissionRange[],
  coupon: Coupon | null
): CalculationBreakdown {
  const baseAmountSend = estimateBaseAmountSendFromReceive(desiredReceive, rate, ranges)
  const commissionRate = getCommissionRateForAmount(ranges, baseAmountSend)
  const baseCommission = roundMoney(baseAmountSend * commissionRate)
  const totalToSend = roundMoney(baseAmountSend - baseCommission)
  const discountFraction = getCouponDiscountFraction(coupon, baseCommission)
  const promotionalAmountSend = roundMoney(baseAmountSend - (baseCommission * discountFraction))

  return {
    amountSend: promotionalAmountSend,
    amountSendWithoutPromotion: roundMoney(baseAmountSend),
    amountReceive: roundMoney(desiredReceive),
    commission: baseCommission,
    commissionRate: roundMoney(commissionRate * 100),
    totalToSend,
    couponDiscountPercentage: roundMoney(discountFraction * 100)
  }
}

export const useCalculatorStore = defineStore('calculator', {
  state: (): CalculatorState => ({
    currencies: [],
    currencyFrom: DEFAULT_FROM,
    currencyTo: DEFAULT_TO,
    amountSend: 0,
    amountReceive: 0,
    inputMode: 'send',
    taxRates: [],
    commissions: [],
    coupons: [],
    skipAutomaticCoupon: false,
    selectedTaxRateId: null,
    selectedCommissionId: null,
    isLoading: false,
    error: null
  }),

  getters: {
    destinationOptions(state): CurrencyCode[] {
      return CURRENCY_OPTIONS[state.currencyFrom] ?? []
    },

    /** Tasa de cambio del par actual (desde API tax-rate). */
    currentRate(state): number {
      const pair = getCurrencyPairKey(state.currencyFrom, state.currencyTo)
      const found = state.taxRates.find((r) => r.pair === pair)
      return found?.rate ?? 0
    },

    /** Comisiones del par actual (desde API commission), ordenadas por min_amount ascendente. */
    currentCommissionRanges(state): CommissionRange[] {
      return getPairCommissionRanges(state.commissions, state.currencyFrom, state.currencyTo)
    },

    /** Comisión del par actual según el monto (busca el rango correcto). */
    currentCommission(state): CommissionRange | null {
      const ranges = getPairCommissionRanges(state.commissions, state.currencyFrom, state.currencyTo)
      if (ranges.length === 0) return null

      let amount = state.inputMode === 'receive' ? 0 : state.amountSend

      if (amount <= 0 && state.amountReceive > 0) {
        const rate = state.taxRates.find(
          (r) => r.from === state.currencyFrom && r.to === state.currencyTo
        )?.rate

        if (rate && rate > 0) {
          amount = estimateBaseAmountSendFromReceive(state.amountReceive, rate, ranges)
        } else {
          amount = state.amountReceive
        }
      }

      if (amount <= 0) return null

      for (const range of ranges) {
        if (amount >= range.min_amount && amount <= range.max_amount) {
          return range
        }
      }

      return ranges[ranges.length - 1]
    },

    /** Porcentaje de comisión aplicable al monto (respeta min_amount/max_amount). */
    currentCommissionPercentage(): number {
      const commission = this.currentCommission
      if (!commission) return 0.03 // fallback 3%
      return commission.percentage
    },

    currentAutomaticCoupon(state): Coupon | null {
      return getAutomaticCouponForPair(state.coupons, state.currencyFrom, state.currencyTo)
    },

    /** Resultado calculado: destination = (origin - commission) * tax. */
    result(state): CalculatorResult | null {
      const rate = state.taxRates.find(
        (r) => r.from === state.currencyFrom && r.to === state.currencyTo
      )?.rate
      if (!rate || rate <= 0) return null

      const ranges = getPairCommissionRanges(state.commissions, state.currencyFrom, state.currencyTo)
      const coupon = state.skipAutomaticCoupon
        ? null
        : getAutomaticCouponForPair(state.coupons, state.currencyFrom, state.currencyTo)
      let amountSend = state.inputMode === 'receive' ? 0 : state.amountSend

      if (amountSend <= 0 && state.amountReceive > 0) {
        const inverseCalculation = calculateInverseBreakdown(state.amountReceive, rate, ranges, coupon)
        return {
          amountSend: inverseCalculation.amountSend,
          amountSendWithoutPromotion: inverseCalculation.amountSendWithoutPromotion,
          amountReceive: inverseCalculation.amountReceive,
          rate,
          commission: inverseCalculation.commission,
          commissionRate: inverseCalculation.commissionRate,
          totalToSend: inverseCalculation.totalToSend,
          couponDiscount: inverseCalculation.couponDiscountPercentage
        }
      }

      if (amountSend <= 0) return null

      const calculation = calculateBreakdown(amountSend, rate, ranges, coupon)

      return {
        amountSend: calculation.amountSend,
        amountSendWithoutPromotion: calculation.amountSendWithoutPromotion,
        amountReceive: calculation.amountReceive,
        rate,
        commission: calculation.commission,
        commissionRate: calculation.commissionRate,
        totalToSend: calculation.totalToSend,
        couponDiscount: calculation.couponDiscountPercentage
      }
    },

    minAmount(state): number {
      const ranges = getPairCommissionRanges(state.commissions, state.currencyFrom, state.currencyTo)
      return ranges.length > 0 ? ranges[0].min_amount : 100
    },

    maxAmount(state): number {
      const ranges = getPairCommissionRanges(state.commissions, state.currencyFrom, state.currencyTo)
      return ranges.length > 0 ? ranges[ranges.length - 1].max_amount : 50000
    }
  },

  actions: {
    async loadData() {
      this.isLoading = true
      this.error = null
      try {
        const repo = new CalculatorApiAdapter()
        const useCase = new LoadCalculatorDataUseCase(repo)
        const data = await useCase.execute()
        this.currencies = data.currencies
        this.taxRates = data.taxRates
        this.commissions = data.commissions
        this.coupons = data.coupons
        this.updateSelectedIds()
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Error al cargar datos'
      } finally {
        this.isLoading = false
      }
    },

    /** Actualiza selectedTaxRateId y selectedCommissionId según el par actual y monto. */
    updateSelectedIds() {
      const pair = getCurrencyPairKey(this.currencyFrom, this.currencyTo)
      const rate = this.taxRates.find((r) => r.pair === pair)
      this.selectedTaxRateId = rate?.id ?? null

      // Buscar la comisión correcta según el monto actual
      const amount = this.amountSend || this.amountReceive
      if (amount > 0) {
        const commission = this.currentCommission
        this.selectedCommissionId = commission?.id ?? null
      } else {
        // Si no hay monto, usar la primera comisión del par
        const firstCommission = this.commissions.find(
          (c) => c.coin_a === this.currencyFrom && c.coin_b === this.currencyTo
        )
        this.selectedCommissionId = firstCommission?.id ?? null
      }
    },

    setCurrencyFrom(code: CurrencyCode) {
      this.currencyFrom = code
      const options = CURRENCY_OPTIONS[code] ?? []
      if (!options.includes(this.currencyTo)) this.currencyTo = options[0] ?? this.currencyTo
      this.skipAutomaticCoupon = false
      this.updateSelectedIds()
    },

    setCurrencyTo(code: CurrencyCode) {
      this.currencyTo = code
      this.skipAutomaticCoupon = false
      this.updateSelectedIds()
    },

    setSkipAutomaticCoupon(skip: boolean) {
      this.skipAutomaticCoupon = skip
    },

    setAmountSend(value: number) {
      this.inputMode = 'send'
      this.amountSend = value
      this.amountReceive = 0
      const res = this.result
      if (res) this.amountReceive = res.amountReceive
      this.updateSelectedIds()
    },

    setAmountReceive(value: number) {
      this.inputMode = 'receive'
      this.amountReceive = value
      this.amountSend = 0
      const res = this.result
      if (res) this.amountSend = res.amountSend
      this.updateSelectedIds()
    },

    recalcFromSend() {
      this.inputMode = 'send'
      const res = this.result
      if (res && this.amountSend > 0) {
        this.amountReceive = res.amountReceive
        this.updateSelectedIds()
      }
    },

    recalcFromReceive() {
      this.inputMode = 'receive'
      const res = this.result
      if (res && this.amountReceive > 0) {
        this.amountSend = res.amountSend
        this.updateSelectedIds()
      }
    },

    resetAmounts() {
      this.amountSend = 0
      this.amountReceive = 0
      this.inputMode = 'send'
    }
  }
})
