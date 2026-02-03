import { defineStore } from 'pinia'
import type { UserCreateCmd, UserReadDTO } from '../../domain/models'
import { RegisterUseCase } from '../../application/use_cases'
import { UserApiAdapter } from '../../infrastructure/adapters'

interface RegisterState {
  isLoading: boolean
  error: string | null
  createdUser: UserReadDTO | null
}

export const useRegisterStore = defineStore('register', {
  state: (): RegisterState => ({
    isLoading: false,
    error: null,
    createdUser: null
  }),

  actions: {
    async register(cmd: UserCreateCmd): Promise<UserReadDTO> {
      this.isLoading = true
      this.error = null
      this.createdUser = null
      try {
        const repository = new UserApiAdapter()
        const useCase = new RegisterUseCase(repository)
        const user = await useCase.execute(cmd)
        this.createdUser = user
        return user
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al registrar'
        this.error = message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
