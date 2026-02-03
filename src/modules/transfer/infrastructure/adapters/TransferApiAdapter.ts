import { apiClient } from '@/interface/api/client'
import { Domain } from '@/interface/infrastructure/services'
import type { TransferRepository } from './TransferRepository'
import type { Bank, BankAccount, BanksByCountryCurrency, TransactionCreateCmd, TransactionReadDTO } from '../../domain/models'

function parseBank(item: unknown): Bank | null {
  if (item == null || typeof item !== 'object') return null
  const o = item as Record<string, unknown>
  const id = String(o.id ?? '')
  if (!id) return null
  return {
    id,
    bank: String(o.bank ?? ''),
    account: String(o.account ?? ''),
    pix: o.pix != null ? String(o.pix) : undefined,
    company: String(o.company ?? ''),
    currency: String(o.currency ?? ''),
    currency_display: o.currency_display != null ? String(o.currency_display) : undefined,
    image: o.image != null ? String(o.image) : undefined,
    country: String(o.country ?? '')
  }
}

function parseBankAccount(item: unknown): BankAccount | null {
  if (item == null || typeof item !== 'object') return null
  const o = item as Record<string, unknown>
  const id = String(o.id ?? '')
  if (!id) return null
  return {
    id,
    user_id: String(o.user_id ?? ''),
    bank_id: String(o.bank_id ?? ''),
    account_flow: String(o.account_flow ?? ''),
    account_holder_type: String(o.account_holder_type ?? ''),
    bank_country: String(o.bank_country ?? ''),
    holder_names: String(o.holder_names ?? ''),
    holder_surnames: String(o.holder_surnames ?? ''),
    document_number: o.document_number != null ? String(o.document_number) : undefined,
    account_number: o.account_number != null ? String(o.account_number) : undefined,
    cci_number: o.cci_number != null ? String(o.cci_number) : undefined,
    pix_key: o.pix_key != null ? String(o.pix_key) : undefined,
    pix_key_type: o.pix_key_type != null ? String(o.pix_key_type) : undefined,
    cpf: o.cpf != null ? String(o.cpf) : undefined
  }
}

function parseBanksByCountryCurrency(data: unknown): BanksByCountryCurrency {
  if (data == null || typeof data !== 'object') return {}
  return data as BanksByCountryCurrency
}

function parseTransactionReadDTO(item: unknown): TransactionReadDTO | null {
  if (item == null || typeof item !== 'object') return null
  const o = item as Record<string, unknown>
  const id = String(o.id ?? '')
  if (!id) return null
  return {
    id,
    bank_account_id: String(o.bank_account_id ?? ''),
    user_id: String(o.user_id ?? ''),
    tax_rate_id: String(o.tax_rate_id ?? ''),
    commission_id: String(o.commission_id ?? ''),
    status: String(o.status ?? 'pending'),
    origin_amount: Number(o.origin_amount ?? 0),
    destination_amount: Number(o.destination_amount ?? 0),
    code: String(o.code ?? ''),
    send_date: o.send_date != null ? String(o.send_date) : null,
    payment_date: o.payment_date != null ? String(o.payment_date) : null,
    send_voucher: o.send_voucher != null ? String(o.send_voucher) : null,
    payment_voucher: o.payment_voucher != null ? String(o.payment_voucher) : null
  }
}

export class TransferApiAdapter implements TransferRepository {
  private base() {
    return Domain.http('transactions')
  }

  async getBanks(): Promise<Bank[]> {
    const url = `${this.base()}/banks/`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: [] }))
    const data = response.data
    if (!Array.isArray(data)) return []
    return data.map((item) => parseBank(item)).filter((b): b is Bank => b != null)
  }

  async getBanksByCountryCurrency(): Promise<BanksByCountryCurrency> {
    const url = `${this.base()}/banks/by-country-currency`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: {} }))
    return parseBanksByCountryCurrency(response.data ?? {})
  }

  async getBank(id: string): Promise<Bank | null> {
    const url = `${this.base()}/banks/${id}`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: null }))
    return parseBank(response.data)
  }

  async getBankAccounts(): Promise<BankAccount[]> {
    const url = `${this.base()}/bank-accounts/`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: [] }))
    const data = response.data
    if (!Array.isArray(data)) return []
    return data.map((item) => parseBankAccount(item)).filter((b): b is BankAccount => b != null)
  }

  async getBankAccount(id: string): Promise<BankAccount | null> {
    const url = `${this.base()}/bank-accounts/${id}`
    const response = await apiClient.get<unknown>(url).catch(() => ({ data: null }))
    return parseBankAccount(response.data)
  }

  async createTransaction(cmd: TransactionCreateCmd): Promise<TransactionReadDTO> {
    const url = `${this.base()}/`
    const response = await apiClient.post<unknown>(url, cmd)
    const parsed = parseTransactionReadDTO(response.data)
    if (!parsed) throw new Error('Respuesta de creación de transacción inválida')
    return parsed
  }
}
