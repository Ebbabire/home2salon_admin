import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/orderServices";
import { ASSIGNED_STATUSES } from "@/types";
import Loading from "@/components/loader";
import Error from "@/components/error-display";
import { OrderDataTable } from "../components/order-data-table";
import useAssignedColumns from "./Columns";

export const AssignedOrders = () => {
  const columns = useAssignedColumns();

  const {
    data: allOrders,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["orders"], queryFn: getOrders });

  const orders =
    allOrders?.filter((o) => ASSIGNED_STATUSES.includes(o.status)) ?? [];

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight md:text-2xl">Assigned Orders</h1>
      <div className="flex-1 rounded-xl border bg-card px-4 py-4 shadow-sm">
        {isLoading || isError ? (
          <div className="flex h-full items-center justify-center">
            <Loading isLoading={isLoading} />
            <Error error={error} />
          </div>
        ) : orders.length ? (
          <OrderDataTable columns={columns} data={orders} />
        ) : (
          <div className="flex h-full flex-1 items-center justify-center">
            <h3 className="text-lg text-muted-foreground">
              No assigned orders
            </h3>
          </div>
        )}
      </div>
    </>
  );
};
