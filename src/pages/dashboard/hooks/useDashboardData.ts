import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  Scissors,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getOrders } from "@/services/orderServices";
import { getProfessionals } from "@/services/professionalServices";
import { getServices } from "@/services/serviceServices";
import {
  ASSIGNED_STATUSES,
  COMPLETED_STATUSES,
  PENDING_STATUSES,
  type IOrder,
} from "@/types";

interface DashboardStat {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  href: string;
}

interface UseDashboardDataResult {
  isLoading: boolean;
  error: Error | null;
  recentOrders: IOrder[];
  stats: DashboardStat[];
}

export const useDashboardData = (): UseDashboardDataResult => {
  const {
    data: orders = [],
    isLoading: loadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["dashboardOrders"],
    queryFn: getOrders,
  });

  const {
    data: professionalsResponse,
    isLoading: loadingProfessionals,
    error: professionalsError,
  } = useQuery({
    queryKey: ["professionals"],
    queryFn: () => getProfessionals(),
  });

  const {
    data: servicesResponse,
    isLoading: loadingServices,
    error: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const professionals = professionalsResponse?.professionals ?? []
  const services = servicesResponse?.services ?? []

  const isLoading = loadingOrders || loadingProfessionals || loadingServices;

  const error = useMemo(() => {
    const firstError = ordersError ?? professionalsError ?? servicesError;
    if (!firstError) {
      return null;
    }

    if (firstError instanceof Error) {
      return firstError;
    }

    return new Error("Failed to load dashboard data.");
  }, [ordersError, professionalsError, servicesError]);

  const { pendingCount, assignedCount, completedCount } = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        if (PENDING_STATUSES.includes(order.status)) {
          acc.pendingCount += 1;
          return acc;
        }

        if (ASSIGNED_STATUSES.includes(order.status)) {
          acc.assignedCount += 1;
          return acc;
        }

        if (COMPLETED_STATUSES.includes(order.status)) {
          acc.completedCount += 1;
        }

        return acc;
      },
      { pendingCount: 0, assignedCount: 0, completedCount: 0 },
    );
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [orders]);

  const stats = useMemo<DashboardStat[]>(() => {
    return [
      {
        title: "Pending Orders",
        value: pendingCount,
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        href: "/orders/pending",
      },
      {
        title: "Assigned Orders",
        value: assignedCount,
        icon: ClipboardList,
        color: "text-blue-600",
        bg: "bg-blue-50",
        href: "/orders/assigned",
      },
      {
        title: "Completed Orders",
        value: completedCount,
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        href: "/orders/completed",
      },
      {
        title: "Professionals",
        value: professionals.length,
        icon: Users,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        href: "/professionals",
      },
      {
        title: "Services",
        value: services.length,
        icon: Scissors,
        color: "text-purple-600",
        bg: "bg-purple-50",
        href: "/services",
      },
    ];
  }, [
    assignedCount,
    completedCount,
    pendingCount,
    professionals.length,
    services.length,
  ]);

  return { isLoading, error, recentOrders, stats };
};
