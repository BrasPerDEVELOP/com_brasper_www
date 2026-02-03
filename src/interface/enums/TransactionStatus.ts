/** Estado de la transacción (crear/actualizar/listado). */
export const TransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]
