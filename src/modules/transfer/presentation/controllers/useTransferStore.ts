import { defineStore } from 'pinia'
import { TransactionStatus } from '@/interface/enums'
import type { BankAccount, BanksByCountryCurrency, TransactionReadDTO } from '../../domain/models'
import { TransferApiAdapter } from '../../infrastructure/adapters'
import { GetBanksByCountryCurrencyUseCase, GetBankAccountsUseCase, CreateTransactionUseCase } from '../../application/use_cases'
import { useAuthStore } from '@/modules/auth/presentation/controllers/useAuthStore'
import { useCalculatorStore } from '@/modules/calculator/presentation/controllers/useCalculatorStore'

/** Estado del flujo de transferencia (pasos 1-4). */
interface TransferState {
  currentStep: number
  /** Cuenta origen (bank_account_id) para POST /transactions/. */
  originAccountId: string | null
  destinationAccountId: string | null
  notes: string
  /** Bancos por país/moneda (GET /transactions/banks/by-country-currency). */
  banksByCountryCurrency: BanksByCountryCurrency
  /** Cuentas bancarias del usuario (GET /transactions/bank-accounts/). */
  bankAccounts: BankAccount[]
  /** Última transacción creada (POST /transactions/). */
  createdTransaction: TransactionReadDTO | null
  isLoading: boolean
  error: string | null
}

const TOTAL_STEPS = 4

function generateTransactionCode(): string {
  return `TRF-${Date.now()}`
}

export const useTransferStore = defineStore('transfer', {
  state: (): TransferState => ({
    currentStep: 1,
    originAccountId: null,
    destinationAccountId: null,
    notes: '',
    banksByCountryCurrency: {},
    bankAccounts: [],
    createdTransaction: null,
    isLoading: false,
    error: null
  }),

  getters: {
    totalSteps: () => TOTAL_STEPS,
    isFirstStep(state): boolean {
      return state.currentStep <= 1
    },
    isLastStep(state): boolean {
      return state.currentStep >= TOTAL_STEPS
    },
    canGoNext(state): boolean {
      if (state.currentStep === 1) return true
      if (state.currentStep === 2) return !!state.originAccountId
      return true
    },
    /** Cuentas con account_flow === 'origin' para elegir como origen. */
    originAccounts(state): BankAccount[] {
      return state.bankAccounts.filter((a) => a.account_flow === 'origin')
    }
  },

  actions: {
    setStep(step: number) {
      if (step >= 1 && step <= TOTAL_STEPS) this.currentStep = step
    },

    nextStep() {
      if (this.currentStep < TOTAL_STEPS) this.currentStep++
    },

    prevStep() {
      if (this.currentStep > 1) this.currentStep--
    },

    setOriginAccount(id: string | null) {
      this.originAccountId = id
    },

    setDestinationAccount(id: string | null) {
      this.destinationAccountId = id
    },

    setNotes(notes: string) {
      this.notes = notes
    },

    async loadBanksByCountryCurrency() {
      this.isLoading = true
      this.error = null
      try {
        const repo = new TransferApiAdapter()
        const useCase = new GetBanksByCountryCurrencyUseCase(repo)
        this.banksByCountryCurrency = await useCase.execute()
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Error al cargar bancos'
      } finally {
        this.isLoading = false
      }
    },

    async loadBankAccounts() {
      this.isLoading = true
      this.error = null
      try {
        const repo = new TransferApiAdapter()
        const useCase = new GetBankAccountsUseCase(repo)
        this.bankAccounts = await useCase.execute()
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Error al cargar cuentas'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Crea la transacción con datos de la calculadora (tax_rate_id, commission_id, montos)
     * y la cuenta origen elegida (bank_account_id).
     */
    async createTransaction(): Promise<TransactionReadDTO> {
      const authStore = useAuthStore()
      const calculatorStore = useCalculatorStore()
      const userId = authStore.user?.id
      const taxRateId = calculatorStore.selectedTaxRateId
      const commissionId = calculatorStore.selectedCommissionId
      const result = calculatorStore.result
      const bankAccountId = this.originAccountId

      if (!userId) throw new Error('Debes iniciar sesión para crear la transferencia')
      if (!taxRateId || !commissionId) throw new Error('Faltan tasa o comisión; completa el paso de calculadora')
      if (!result || result.amountSend <= 0 || result.amountReceive <= 0) throw new Error('Montos inválidos; revisa la calculadora')
      if (!bankAccountId) throw new Error('Elige una cuenta origen')

      this.isLoading = true
      this.error = null
      try {
        const repo = new TransferApiAdapter()
        const useCase = new CreateTransactionUseCase(repo)
        const cmd = {
          bank_account_id: bankAccountId,
          user_id: userId,
          tax_rate_id: taxRateId,
          commission_id: commissionId,
          status: TransactionStatus.PENDING,
          origin_amount: result.amountSend,
          destination_amount: result.amountReceive,
          code: generateTransactionCode(),
          send_date: null,
          payment_date: null,
          send_voucher: null,
          payment_voucher: null
        }
        const created = await useCase.execute(cmd)
        this.createdTransaction = created
        return created
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Error al crear la transacción'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    /** Reinicia el flujo para una nueva transferencia. */
    reset() {
      this.currentStep = 1
      this.originAccountId = null
      this.destinationAccountId = null
      this.notes = ''
      this.createdTransaction = null
      this.error = null
    }
  }
})
