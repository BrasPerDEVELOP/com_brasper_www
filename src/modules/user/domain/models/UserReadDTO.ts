import type { DocumentType, UserRole, PhoneCode } from '@/interface/enums'

/** Respuesta al crear usuario (POST /user/). */
export interface UserReadDTO {
  id: string
  names: string | null
  lastnames: string | null
  email: string | null
  profile_image: string | null
  document_number: string | null
  document_type: DocumentType | null
  role: UserRole | null
  phone: number | null
  code_phone: PhoneCode | null
}
