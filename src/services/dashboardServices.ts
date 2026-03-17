import { getSession } from "./session";

const BASE = import.meta.env.VITE_BASE_URL;

function authHeaders() {
  const { token } = getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  assignedOrders: number;
  completedOrders: number;
  totalProfessionals: number;
  totalServices: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE}/dashboard/stats`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  const data = await res.json();
  return data.data ?? data;
}
