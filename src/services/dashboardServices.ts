import { apiFetch } from "./api";

export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  assigned_orders: number;
  completed_orders: number;
  total_professionals: number;
  total_services: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/dashboard/stats");
}
