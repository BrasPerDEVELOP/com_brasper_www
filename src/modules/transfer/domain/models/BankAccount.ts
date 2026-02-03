/** BankAccountReadDTO: GET /transactions/bank-accounts/ */
export interface BankAccount {
  id: string
  user_id: string
  bank_id: string
  account_flow: string
  account_holder_type: string
  bank_country: string
  holder_names: string
  holder_surnames: string
  document_number?: string
  account_number?: string
  cci_number?: string
  pix_key?: string
  pix_key_type?: string
  cpf?: string
}
