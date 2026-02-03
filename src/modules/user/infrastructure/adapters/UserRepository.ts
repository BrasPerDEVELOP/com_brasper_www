import type { UserCreateCmd, UserReadDTO } from '../../domain/models'

export interface UserRepository {
  register(cmd: UserCreateCmd): Promise<UserReadDTO>
}
