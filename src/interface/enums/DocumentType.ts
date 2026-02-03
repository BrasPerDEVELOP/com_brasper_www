/** Tipo de documento (p. ej. UserCreateCmd). */
export type DocumentType = 'dni' | 'ce' | 'ruc' | 'passport' | 'other'

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'dni', label: 'DNI' },
  { value: 'ce', label: 'Cédula de extranjería' },
  { value: 'ruc', label: 'RUC' },
  { value: 'passport', label: 'Pasaporte' },
  { value: 'other', label: 'Otro' }
]
