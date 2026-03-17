import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/orderServices";
import { COMPLETED_STATUSES } from "@/types";
import Loading from "@/components/loader";
import Error from "@/components/error-display";
import { OrderDataTable } from "../components/order-data-table";
import useCompletedColumns from "./Columns";

export const CompletedOrders = () => {
  const columns = useCompletedColumns();

  const {
    data: allOrders,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["orders"], queryFn: getOrders });

  const orders =
    allOrders?.filter((o) => COMPLETED_STATUSES.includes(o.status)) ?? [];

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Completed Orders</h1>
      <div className="flex-1 rounded-lg border border-dashed px-4 py-4 shadow-sm">
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
              No completed orders
            </h3>
          </div>
        )}
      </div>
    </>
  );
};
