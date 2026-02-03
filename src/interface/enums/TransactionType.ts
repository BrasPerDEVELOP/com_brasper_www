/** Tipo de transacción (deposit, withdrawal, transfer). */
export const TransactionType = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer'
} as const
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]
