import type { DocumentType, UserRole, PhoneCode } from '@/interface/enums'

/** Payload de registro (form). Todos los campos opcionales en API; en UI email y password suelen ser obligatorios. */
export interface UserCreateCmd {
  names?: string
  lastnames?: string
  email?: string
  password?: string
  profile_image?: File
  document_number?: string
  document_type?: DocumentType
  role?: UserRole
  phone?: number
  code_phone?: PhoneCode
}
