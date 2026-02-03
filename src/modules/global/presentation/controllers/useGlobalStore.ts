import { defineStore } from 'pinia'
import type { Currency, DocumentType } from '../../domain/models'
import { GetCurrenciesUseCase } from '../../application/use_cases'
import { GlobalApiAdapter } from '../../infrastructure/adapters'

interface GlobalState {
  currencies: Currency[]
  documentTypes: DocumentType[]
  isLoading: boolean
  error: string | null
}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    currencies: [],
    documentTypes: [],
    isLoading: false,
    error: null
  }),

  getters: {
    activeCurrencies: (state) => state.currencies.filter(currency => currency.isActive)
  },

  actions: {
    async fetchCurrencies() {
      this.isLoading = true
      this.error = null

      try {
        const repository = new GlobalApiAdapter()
        const getCurrenciesUseCase = new GetCurrenciesUseCase(repository)
        this.currencies = await getCurrenciesUseCase.execute()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al cargar monedas'
      } finally {
        this.isLoading = false
      }
    }
  }
})
