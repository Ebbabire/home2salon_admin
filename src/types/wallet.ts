export type WalletTransactionType = "earning" | "deduction"

/** Alias for wallet transaction `type` field */
export type TransactionType = WalletTransactionType

export interface IWalletTransactionProfessional {
  _id: string
  full_name: string
  phone_number: string
}

export interface IWalletTransactionOrder {
  _id: string
  total_price: number
  status: string
}

export interface IWalletTransaction {
  _id: string
  wallet_id: string
  professional_id: IWalletTransactionProfessional
  order_id?: IWalletTransactionOrder
  type: WalletTransactionType
  amount: number
  note?: string
  createdAt: string
  updatedAt: string
  __v?: number
}
