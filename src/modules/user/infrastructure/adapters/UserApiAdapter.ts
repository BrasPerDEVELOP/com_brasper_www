import { apiClient } from '@/interface/api/client'
import { Domain } from '@/interface/infrastructure/services'
import type { UserRepository } from './UserRepository'
import type { UserCreateCmd, UserReadDTO } from '../../domain/models'

function parseUserReadDTO(data: unknown): UserReadDTO | null {
  if (data === null || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  if (typeof o.id !== 'string') return null
  return {
    id: String(o.id),
    names: o.names != null ? String(o.names) : null,
    lastnames: o.lastnames != null ? String(o.lastnames) : null,
    email: o.email != null ? String(o.email) : null,
    profile_image: o.profile_image != null ? String(o.profile_image) : null,
    document_number: o.document_number != null ? String(o.document_number) : null,
    document_type: (o.document_type as UserReadDTO['document_type']) ?? null,
    role: (o.role as UserReadDTO['role']) ?? null,
    phone: typeof o.phone === 'number' ? o.phone : null,
    code_phone: (o.code_phone as UserReadDTO['code_phone']) ?? null
  }
}

export class UserApiAdapter implements UserRepository {
  private base() {
    return Domain.http('/user')
  }

  async register(cmd: UserCreateCmd): Promise<UserReadDTO> {
    const form = new FormData()
    if (cmd.names != null && cmd.names !== '') form.append('names', cmd.names)
    if (cmd.lastnames != null && cmd.lastnames !== '') form.append('lastnames', cmd.lastnames)
    if (cmd.email != null && cmd.email !== '') form.append('email', cmd.email)
    if (cmd.password != null && cmd.password !== '') form.append('password', cmd.password)
    if (cmd.profile_image != null) form.append('profile_image', cmd.profile_image)
    if (cmd.document_number != null && cmd.document_number !== '') form.append('document_number', cmd.document_number)
    if (cmd.document_type != null) form.append('document_type', cmd.document_type)
    if (cmd.role != null) form.append('role', cmd.role)
    if (cmd.phone != null) form.append('phone', String(cmd.phone))
    if (cmd.code_phone != null) form.append('code_phone', cmd.code_phone)

    const url = `${this.base()}/`
    const response = await apiClient.post<unknown>(url, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const dto = parseUserReadDTO(response.data)
    if (!dto) throw new Error('Respuesta de registro inválida')
    return dto
  }
}
