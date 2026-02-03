import { apiClient } from '@/interface/api/client'
import { Domain } from '@/interface/infrastructure/services'
import type { GlobalRepository } from './GlobalRepository'
import type { Currency, DocumentType } from '../../domain/models'

function parseCurrency(item: unknown): Currency | null {
  if (item == null || typeof item !== 'object') return null
  const o = item as Record<string, unknown>
  const id = o.id != null ? String(o.id) : ''
  if (!id) return null
  return {
    id,
    code: String(o.code ?? ''),
    name: String(o.name ?? ''),
    symbol: String(o.symbol ?? ''),
    isActive: Boolean(o.isActive ?? o.is_active ?? true),
    createdAt: String(o.createdAt ?? o.created_at ?? ''),
    updatedAt: String(o.updatedAt ?? o.updated_at ?? '')
  }
}

function parseDocumentType(item: unknown): DocumentType | null {
  if (item == null || typeof item !== 'object') return null
  const o = item as Record<string, unknown>
  const id = o.id != null ? String(o.id) : ''
  if (!id) return null
  return {
    id,
    code: String(o.code ?? ''),
    name: String(o.name ?? ''),
    isActive: Boolean(o.isActive ?? o.is_active ?? true),
    createdAt: String(o.createdAt ?? o.created_at ?? ''),
    updatedAt: String(o.updatedAt ?? o.updated_at ?? '')
  }
}

export class GlobalApiAdapter implements GlobalRepository {
  private coinBase() {
    return Domain.http('coin')
  }

  private globalBase() {
    return Domain.http('global')
  }

  async getCurrencies(): Promise<Currency[]> {
    const url = `${this.coinBase()}/currencies`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: [] }))
    const data = response.data
    if (!Array.isArray(data)) return []
    return data.map((item) => parseCurrency(item)).filter((c): c is Currency => c != null)
  }

  async getDocumentTypes(): Promise<DocumentType[]> {
    const url = `${this.globalBase()}/document-types/`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: [] }))
    const data = response.data
    if (!Array.isArray(data)) return []
    return data.map((item) => parseDocumentType(item)).filter((d): d is DocumentType => d != null)
  }

  async createCurrency(
    currency: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Currency> {
    const url = `${this.coinBase()}/currencies`
    const body = {
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      is_active: currency.isActive
    }
    const response = await apiClient.post<unknown>(url, body)
    const parsed = parseCurrency(response.data)
    if (!parsed) throw new Error('Respuesta de creación de moneda inválida')
    return parsed
  }
}
