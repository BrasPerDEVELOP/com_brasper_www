/** Titular de la cuenta (alta/edición de cuenta bancaria). */
export const AccountHolderType = {
  PERSONAL: 'personal',
  LEGAL: 'legal'
} as const
export type AccountHolderType = (typeof AccountHolderType)[keyof typeof AccountHolderType]

export const ACCOUNT_HOLDER_LABEL: Record<string, string> = {
  personal: 'Personal',
  legal: 'Jurídica'
}
