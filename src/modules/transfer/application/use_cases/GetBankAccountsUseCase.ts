import type { TransferRepository } from '../../infrastructure/adapters'
import type { BankAccount } from '../../domain/models'

export class GetBankAccountsUseCase {
  constructor(private readonly repository: TransferRepository) {}

  async execute(): Promise<BankAccount[]> {
    return this.repository.getBankAccounts()
  }
}
