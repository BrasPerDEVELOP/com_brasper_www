import type { TransferRepository } from '../../infrastructure/adapters'
import type { TransactionCreateCmd, TransactionReadDTO } from '../../domain/models'

export class CreateTransactionUseCase {
  constructor(private readonly repository: TransferRepository) {}

  async execute(cmd: TransactionCreateCmd): Promise<TransactionReadDTO> {
    return this.repository.createTransaction(cmd)
  }
}
