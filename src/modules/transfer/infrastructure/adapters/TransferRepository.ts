import type { Bank, BankAccount, BanksByCountryCurrency, TransactionCreateCmd, TransactionReadDTO } from '../../domain/models'

export interface TransferRepository {
  getBanks(): Promise<Bank[]>
  getBanksByCountryCurrency(): Promise<BanksByCountryCurrency>
  getBank(id: string): Promise<Bank | null>
  getBankAccounts(): Promise<BankAccount[]>
  getBankAccount(id: string): Promise<BankAccount | null>
  createTransaction(cmd: TransactionCreateCmd): Promise<TransactionReadDTO>
}
