/** TransactionReadDTO: respuesta 201 de POST /transactions/ */
export interface TransactionReadDTO {
  id: string
  bank_account_id: string
  user_id: string
  tax_rate_id: string
  commission_id: string
  status: string
  origin_amount: number
  destination_amount: number
  code: string
  send_date: string | null
  payment_date: string | null
  send_voucher: string | null
  payment_voucher: string | null
}
