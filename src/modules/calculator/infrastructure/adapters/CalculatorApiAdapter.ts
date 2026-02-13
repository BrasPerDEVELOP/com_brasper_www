import { apiClient } from '@/interface/api/client'
import { Domain } from '@/interface/infrastructure/services'
import type { CalculatorRepository, CurrencyReadDTO } from './CalculatorRepository'
import type { ExchangeRate, CommissionRange, Coupon } from '../../domain/models'
import { getCurrencyPairKey } from '../../domain/models'

function parseCurrencies(data: unknown): CurrencyReadDTO[] {
  if (!Array.isArray(data)) return []
  return data
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => ({
      code: String(item.code ?? '').toLowerCase(),
      name: String(item.name ?? ''),
      symbol: String(item.symbol ?? '')
    }))
    .filter((c) => c.code)
}

function parseTaxRates(data: unknown): ExchangeRate[] {
  if (!Array.isArray(data)) return []
  return data
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => {
      const coinA = String(item.coin_a ?? '').toLowerCase()
      const coinB = String(item.coin_b ?? '').toLowerCase()
      const tax = Number(item.tax ?? 0)
      const pair = getCurrencyPairKey(coinA as ExchangeRate['from'], coinB as ExchangeRate['to'])
      return {
        id: String(item.id ?? ''),
        pair,
        rate: tax,
        from: coinA as ExchangeRate['from'],
        to: coinB as ExchangeRate['to']
      }
    })
    .filter((r) => r.rate > 0 && r.id)
}

function parseCommissions(data: unknown): CommissionRange[] {
  if (!Array.isArray(data)) return []
  return data
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => {
      // El campo reverse puede venir como string ("0.97700000") o boolean
      const reverseValue = item.reverse
      const reverse = typeof reverseValue === 'string' 
        ? reverseValue !== '0' && reverseValue !== '0.0' && reverseValue !== ''
        : Boolean(reverseValue ?? false)
      
      return {
        id: String(item.id ?? ''),
        coin_a: String(item.coin_a ?? '').toLowerCase() as CommissionRange['coin_a'],
        coin_b: String(item.coin_b ?? '').toLowerCase() as CommissionRange['coin_b'],
        percentage: Number(item.percentage ?? 0),
        reverse,
        min_amount: Number(item.min_amount ?? 0),
        max_amount: Number(item.max_amount ?? 0)
      }
    })
    .filter((c) => c.id && c.percentage > 0)
}

function parseCoupons(data: unknown): Coupon[] {
  if (!Array.isArray(data)) return []
  return data
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => ({
      id: String(item.id ?? ''),
      code: String(item.code ?? ''),
      discount: Number(item.discount ?? 0),
      type: (item.type === 'fixed' ? 'fixed' : 'percent') as Coupon['type'],
      isAutomatic: Boolean(item.isAutomatic ?? item.is_automatic)
    }))
    .filter((c) => c.id)
}

export class CalculatorApiAdapter implements CalculatorRepository {
  private coinBase() {
    return Domain.http('coin')
  }

  private transactionsBase() {
    return Domain.http('transactions')
  }

  async getCurrencies(): Promise<CurrencyReadDTO[]> {
    const url = `${this.coinBase()}/currencies`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: [] }))
    return parseCurrencies(response.data ?? [])
  }

  async getTaxRates(): Promise<ExchangeRate[]> {
    const url = `${this.coinBase()}/tax-rate`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: [] }))
    return parseTaxRates(Array.isArray(response.data) ? response.data : [])
  }

  async getCommissions(): Promise<CommissionRange[]> {
    const url = `${this.coinBase()}/commission`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: [] }))
    return parseCommissions(Array.isArray(response.data) ? response.data : [])
  }

  async getAutomaticCoupons(): Promise<Coupon[]> {
    const url = `${this.transactionsBase()}/coupons/automatic/`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: [] }))
    return parseCoupons(response.data ?? [])
  }
}
