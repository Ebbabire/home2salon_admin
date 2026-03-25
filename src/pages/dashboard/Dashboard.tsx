import Loading from "@/components/loader";
import ErrorDisplay from "@/components/error-display";
import { DashboardStatsGrid } from "@/pages/dashboard/components/DashboardStatsGrid";
import { RecentOrdersTable } from "@/pages/dashboard/components/RecentOrdersTable";
import { useDashboardData } from "@/pages/dashboard/hooks/useDashboardData";

export const Dashboard = () => {
  const { isLoading, error, recentOrders, stats } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading isLoading />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} size="8rem" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold tracking-tight md:text-2xl">Dashboard</h1>
      <DashboardStatsGrid stats={stats} />
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
};
