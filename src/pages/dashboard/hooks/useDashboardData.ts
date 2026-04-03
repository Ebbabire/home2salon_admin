import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  enrichDashboardStats,
  type DashboardStatDisplay,
} from "@/pages/dashboard/dashboardStatConfig"
import { type IOrder } from "@/types"
import { getDashboardData } from "@/services/dashboardServices"

interface UseDashboardDataResult {
  isLoading: boolean
  error: Error | null
  pendingOrders: IOrder[]
  stats: DashboardStatDisplay[]
}

export const useDashboardData = (): UseDashboardDataResult => {
  const {
    data: dashboardResponse,
    isLoading: loadingDashboard,
    error: dashboardError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  })

  const isLoading = loadingDashboard

  const error = useMemo(() => {
    const firstError = dashboardError
    if (!firstError) {
      return null
    }

    if (firstError instanceof Error) {
      return firstError
    }

    return new Error("Failed to load dashboard data.")
  }, [dashboardError])

  const stats = useMemo(() => {
    return enrichDashboardStats(dashboardResponse?.stats ?? [])
  }, [dashboardResponse?.stats])

  const pendingOrders = dashboardResponse?.pendingOrders ?? []

  return { isLoading, error, stats, pendingOrders }
}
