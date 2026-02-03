import type { TransferRepository } from '../../infrastructure/adapters'
import type { BanksByCountryCurrency } from '../../domain/models'

export class GetBanksByCountryCurrencyUseCase {
  constructor(private readonly repository: TransferRepository) {}

  async execute(): Promise<BanksByCountryCurrency> {
    return this.repository.getBanksByCountryCurrency()
  }
}
