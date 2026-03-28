import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getWalletTransactionsAdminPaginated } from "@/services/walletServices"
import { getSession } from "@/services/session"
import Loading from "@/components/loader"
import Error from "@/components/error-display"
import { WalletDataTable } from "./data-table"
import useWalletColumns from "./Columns"
import { usePageParam } from "@/hooks/use-page-param"
import type { IWalletTransaction } from "@/types"

export const Wallet = () => {
  const { userRole } = getSession()
  const columns = useWalletColumns()
  const { page, setPage } = usePageParam("page")
  const [limit] = useState(10)

  const {
    data: txResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["walletTransactionsAdmin", page, limit],
    queryFn: () => getWalletTransactionsAdminPaginated({ page, limit }),
    enabled: userRole === "superadmin",
  })

  const transactions: IWalletTransaction[] = txResponse?.data.transactions ?? []
  const totalPages = txResponse?.totalPages ?? 0
  const totalResults = txResponse?.totalResults ?? 0

  console.log(transactions)

  useEffect(() => {
    if (!txResponse) return
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
  }, [txResponse, page, totalPages, setPage])

  if (userRole !== "superadmin") {
    return (
      <div className="flex h-full items-center justify-center">
        <h3 className="text-lg text-muted-foreground">
          Only Super Admin can access wallet management.
        </h3>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight md:text-2xl">
        Wallet transactions
      </h1>
      <p className="mb-2 text-sm text-muted-foreground">
        All wallet movements across professionals (admin view).
      </p>
      <div className="flex-1 rounded-xl border bg-card px-4 py-4 shadow-sm">
        {isLoading || isError ? (
          <div className="flex h-full items-center justify-center">
            <Loading isLoading={isLoading} />
            <Error error={error} />
          </div>
        ) : transactions.length > 0 ? (
          <WalletDataTable
            columns={columns}
            data={transactions}
            page={page}
            totalPages={totalPages}
            totalResults={totalResults}
            onPageChange={setPage}
          />
        ) : (
          <div className="flex h-full flex-1 items-center justify-center">
            <h3 className="text-lg text-muted-foreground">
              No wallet transactions yet
            </h3>
          </div>
        )}
      </div>
    </>
  )
}
