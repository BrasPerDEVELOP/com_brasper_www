import type { UserRepository } from '../../infrastructure/adapters/UserRepository'
import type { UserCreateCmd, UserReadDTO } from '../../domain/models'

export class RegisterUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(cmd: UserCreateCmd): Promise<UserReadDTO> {
    return this.repository.register(cmd)
  }
}
