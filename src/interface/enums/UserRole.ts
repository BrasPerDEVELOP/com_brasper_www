/** Rol de usuario (p. ej. UserCreateCmd). */
export type UserRole = 'sales' | 'admin' | 'client' | 'marketing' | 'accounting'

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'client', label: 'Cliente' },
  { value: 'sales', label: 'Ventas' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'accounting', label: 'Contabilidad' }
]
