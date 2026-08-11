import { defineStore } from 'pinia'
import type { User } from '../../domain/models'
import { LoginUseCase } from '../../application/use_cases'
import { AuthApiAdapter } from '../../infrastructure/adapters'
import { refreshAccessToken } from '@/interface/api/client'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null
  },

  actions: {
    async login(username: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const repository = new AuthApiAdapter()
        const loginUseCase = new LoginUseCase(repository)
        const { user, token } = await loginUseCase.execute(username, password)
        this.user = user
        this.token = token
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al iniciar sesión'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      const repository = new AuthApiAdapter()
      try {
        await repository.logout()
      } finally {
        this.user = null
        this.token = null
      }
    },

    setAccessToken(token: string | null) {
      this.token = token
    },

    clearSession() {
      this.user = null
      this.token = null
    },

    /**
     * Restaura la sesión desde la cookie HttpOnly y valida el usuario en el API.
     */
    async restoreSession(): Promise<boolean> {
      if (this.token && this.user) return true
      try {
        if (!this.token) this.token = await refreshAccessToken()
        const repository = new AuthApiAdapter()
        const user = await repository.getCurrentUser()
        if (user) {
          this.user = user
          return true
        }
      } catch {
        this.clearSession()
      }
      return false
    }
  }
})
