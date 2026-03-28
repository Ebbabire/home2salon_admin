import type { IService } from "./service"

export interface IProfessional {
  _id?: string
  full_name: string
  phone_number: string
  password?: string
  skills: IService[]
  wallet_id: {
    _id: string
    professional_id: string
    balance: number
    createdAt: string
    updatedAt: string
  }
  status?: "Active" | "Inactive"
  createdAt?: string
  updatedAt?: string
}
