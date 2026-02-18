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
  taxRates: ExchangeRate[]
  commissions: CommissionRange[]
  coupons: Coupon[]
  /** IDs para POST /transactions/ (tasa y comisión usadas en la calculadora). */
  selectedTaxRateId: string | null
  selectedCommissionId: string | null
  isLoading: boolean
  error: string | null
}

const DEFAULT_FROM: CurrencyCode = 'pen'
const DEFAULT_TO: CurrencyCode = 'brl'

export const useCalculatorStore = defineStore('calculator', {
  state: (): CalculatorState => ({
    currencies: [],
    currencyFrom: DEFAULT_FROM,
    currencyTo: DEFAULT_TO,
    amountSend: 0,
    amountReceive: 0,
    taxRates: [],
    commissions: [],
    coupons: [],
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
      return state.commissions
        .filter((c) => c.coin_a === state.currencyFrom && c.coin_b === state.currencyTo)
        .sort((a, b) => a.min_amount - b.min_amount)
    },

    /** Comisión del par actual según el monto (busca el rango correcto). */
    currentCommission(state): CommissionRange | null {
      const ranges = state.commissions
        .filter((c) => c.coin_a === state.currencyFrom && c.coin_b === state.currencyTo)
        .sort((a, b) => a.min_amount - b.min_amount)
      
      if (ranges.length === 0) return null

      // Determinar el monto a usar para buscar el rango
      let amount = state.amountSend
      
      // Si el usuario ingresó amountReceive pero no amountSend, necesitamos calcular amountSend
      if (amount <= 0 && state.amountReceive > 0) {
        const rate = state.taxRates.find(
          (r) => r.from === state.currencyFrom && r.to === state.currencyTo
        )?.rate
        
        if (rate && rate > 0) {
          // Calcular amountSend iterativamente
          let estimateSend = state.amountReceive / rate
          for (let i = 0; i < 5; i++) {
            // Buscar el rango para este estimateSend
            let commissionRate = 0.03 // fallback
            for (const range of ranges) {
              if (estimateSend >= range.min_amount && estimateSend <= range.max_amount) {
                commissionRate = range.percentage / 100
                break
              }
            }
            // Si excede todos los rangos, usar el último
            if (estimateSend > ranges[ranges.length - 1].max_amount) {
              commissionRate = ranges[ranges.length - 1].percentage / 100
            }
            
            const effectiveMultiplier = 1 - commissionRate
            const nextEstimate = state.amountReceive / (rate * effectiveMultiplier)
            if (Math.abs(nextEstimate - estimateSend) < 0.01) {
              break
            }
            estimateSend = nextEstimate
          }
          amount = estimateSend
        } else {
          amount = state.amountReceive
        }
      }
      
      if (amount <= 0) return null

      // Buscar el rango que contiene el monto
      for (const range of ranges) {
        if (amount >= range.min_amount && amount <= range.max_amount) {
          return range
        }
      }

      // Si excede todos los rangos, devolver el último (mayor rango)
      return ranges[ranges.length - 1]
    },

    /** Porcentaje de comisión aplicable al monto (respeta min_amount/max_amount). */
    currentCommissionPercentage(): number {
      const commission = this.currentCommission
      if (!commission) return 0.03 // fallback 3%
      return commission.percentage
    },

    /** Resultado calculado: destination = (origin - commission) * tax. */
    result(state): CalculatorResult | null {
      const rate = state.taxRates.find(
        (r) => r.from === state.currencyFrom && r.to === state.currencyTo
      )?.rate
      if (!rate || rate <= 0) return null

      const pair = getCurrencyPairKey(state.currencyFrom, state.currencyTo)
      
      // Función helper para calcular la tasa de comisión según el monto
      const calculateCommissionRate = (amount: number): number => {
        const ranges = state.commissions
          .filter((c) => {
            const cPair = getCurrencyPairKey(c.coin_a, c.coin_b)
            return cPair === pair
          })
          .sort((a, b) => a.min_amount - b.min_amount)

        if (ranges.length === 0) return 0.03 // fallback 3%

        // Buscar el rango que contiene el monto
        for (const range of ranges) {
          if (amount >= range.min_amount && amount <= range.max_amount) {
            return range.percentage / 100 // convertir a decimal
          }
        }

        // Si excede todos los rangos, usar el último (mayor rango)
        return ranges[ranges.length - 1].percentage / 100
      }
      
      // Calcular amountSend basado en lo que el usuario ingresó
      let amountSend = state.amountSend
      if (amountSend <= 0 && state.amountReceive > 0) {
        // Si el usuario ingresó amountReceive, calcular iterativamente amountSend
        let estimateSend = state.amountReceive / rate
        for (let i = 0; i < 5; i++) {
          const currentRate = calculateCommissionRate(estimateSend)
          const effectiveMultiplier = 1 - currentRate
          const nextEstimate = state.amountReceive / (rate * effectiveMultiplier)
          if (Math.abs(nextEstimate - estimateSend) < 0.01) {
            break
          }
          estimateSend = nextEstimate
        }
        amountSend = estimateSend
      }

      if (amountSend <= 0) return null

      // Calcular comisión usando el rango correcto
      const commissionRate = calculateCommissionRate(amountSend)
      const baseCommission = amountSend * commissionRate
      
      // Por ahora no hay descuentos, pero se puede agregar después
      const couponDiscount = 0
      const variableDiscount = 0
      const discountToApply = Math.max(couponDiscount, variableDiscount)
      
      const commission = baseCommission * (1 - discountToApply)
      const totalToSend = amountSend - commission
      const amountReceive = totalToSend * rate

      return {
        amountSend,
        amountReceive,
        rate,
        commission,
        commissionRate: commissionRate * 100,
        totalToSend,
        couponDiscount
      }
    },

    minAmount(state): number {
      const ranges = state.commissions
        .filter((c) => c.coin_a === state.currencyFrom && c.coin_b === state.currencyTo)
        .sort((a, b) => a.min_amount - b.min_amount)
      return ranges.length > 0 ? ranges[0].min_amount : 100
    },

    maxAmount(state): number {
      const ranges = state.commissions
        .filter((c) => c.coin_a === state.currencyFrom && c.coin_b === state.currencyTo)
        .sort((a, b) => a.max_amount - b.max_amount)
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
      this.updateSelectedIds()
    },

    setCurrencyTo(code: CurrencyCode) {
      this.currencyTo = code
      this.updateSelectedIds()
    },

    setAmountSend(value: number) {
      this.amountSend = value
      this.amountReceive = 0
      const res = this.result
      if (res) this.amountReceive = res.amountReceive
      this.updateSelectedIds()
    },

    setAmountReceive(value: number) {
      this.amountReceive = value
      this.amountSend = 0
      const res = this.result
      if (res) this.amountSend = res.amountSend
      this.updateSelectedIds()
    },

    recalcFromSend() {
      const res = this.result
      if (res && this.amountSend > 0) {
        this.amountReceive = res.amountReceive
        this.updateSelectedIds()
      }
    },

    recalcFromReceive() {
      const res = this.result
      if (res && this.amountReceive > 0) {
        this.amountSend = res.amountSend
        this.updateSelectedIds()
      }
    },

    resetAmounts() {
      this.amountSend = 0
      this.amountReceive = 0
    }
  }
})
