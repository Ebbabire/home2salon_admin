import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  getOrdersPaginated,
  ORDER_PAGE_STATUSES,
} from "@/services/orderServices"
import { usePageParam } from "@/hooks/use-page-param"
import Loading from "@/components/loader"
import Error from "@/components/error-display"
import { OrderDataTable } from "../components/order-data-table"
import usePendingColumns from "./Columns"

export const PendingOrders = () => {
  const columns = usePendingColumns()
  const { page, setPage } = usePageParam("page")
  const limit = 10

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pendingOrders", page, limit],
    queryFn: () =>
      getOrdersPaginated({
        statuses: ORDER_PAGE_STATUSES.pending,
        page,
        limit,
      }),
  })

  const orders = response?.data.orders ?? []
  const totalPages = response?.totalPages ?? 0
  const totalResults = response?.totalResults ?? orders.length

  useEffect(() => {
    if (!response) return
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [response, page, setPage, totalPages])

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight md:text-2xl">
        Pending Orders
      </h1>
      <div className="flex-1 rounded-xl border bg-card px-4 py-4 shadow-sm">
        {isLoading || isError ? (
          <div className="flex h-full items-center justify-center">
            <Loading isLoading={isLoading} />
            <Error error={error} />
          </div>
        ) : (
          <OrderDataTable
            columns={columns}
            data={orders}
            page={page}
            totalPages={totalPages}
            totalResults={totalResults}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  )
}
