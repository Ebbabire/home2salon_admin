import type { IService } from "./service"

export interface IProfessional {
  _id?: string
  full_name: string
  phone_number: string
  password?: string
  skills: IService[]
  status?: "Active" | "Inactive"
  assigned_orders?: number
  created_at?: string
  updated_at?: string
}

export type TransactionType = "earning" | "deduction"

export interface IWalletTransaction {
  _id?: string
  professional: string | IProfessional
  type: TransactionType
  amount: number
  date?: string
  order?: string
  notes?: string
  created_at?: string
}

export interface IWalletBalance {
  professional: IProfessional
  balance: number
}
