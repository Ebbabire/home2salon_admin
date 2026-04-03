import { IOrder } from "@/types"
import { apiFetch } from "./api"

/** Row from `GET /orders/dashboard` — `key` drives icon/link mapping; omit only if `title` is still a stable machine id. */
export interface DashboardStatFromApi {
  key?: string
  title: string
  count: number
}

export interface DashboardData {
  stats: DashboardStatFromApi[]
  pendingOrders: IOrder[]
  assigned_orders: number
  completed_orders: number
  total_professionals: number
  total_services: number
}

export async function getDashboardData(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/orders/dashboard")
}
