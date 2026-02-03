import type { Currency, DocumentType } from '../../domain/models'

export interface GlobalRepository {
  getCurrencies(): Promise<Currency[]>
  getDocumentTypes(): Promise<DocumentType[]>
  createCurrency(currency: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>): Promise<Currency>
}
