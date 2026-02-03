import type { Currency } from '../../domain/models'
import type { GlobalRepository } from '../../infrastructure/adapters/GlobalRepository'

export class GetCurrenciesUseCase {
  constructor(private globalRepository: GlobalRepository) {}

  async execute(): Promise<Currency[]> {
    return await this.globalRepository.getCurrencies()
  }
}
