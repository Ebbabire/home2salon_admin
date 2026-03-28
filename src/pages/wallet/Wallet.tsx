import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getWalletBalancesPaginated } from "@/services/walletServices"
import { getSession } from "@/services/session"
import Loading from "@/components/loader"
import Error from "@/components/error-display"
import { WalletDataTable } from "./data-table"
import useWalletColumns from "./Columns"
import { usePageParam } from "@/hooks/use-page-param"
import type { IWalletBalance } from "@/types"

export const Wallet = () => {
  const { userRole } = getSession()
  const columns = useWalletColumns()
  const { page, setPage } = usePageParam("page")
  const [limit] = useState(10)

  const {
    data: balanceResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["walletBalances", page, limit],
    queryFn: () => getWalletBalancesPaginated({ page, limit }),
    enabled: userRole === "Super Admin",
  })

  const balances: IWalletBalance[] = balanceResponse
    ? (Object.values(balanceResponse.data)[0] ?? [])
    : []
  const totalPages = balanceResponse?.totalPages ?? 0
  const totalResults = balanceResponse?.totalResults ?? 0

  useEffect(() => {
    if (!balanceResponse) return
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
  }, [balanceResponse, page, totalPages, setPage])

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
        Wallet Management
      </h1>
      <div className="flex-1 rounded-xl border bg-card px-4 py-4 shadow-sm">
        {isLoading || isError ? (
          <div className="flex h-full items-center justify-center">
            <Loading isLoading={isLoading} />
            <Error error={error} />
          </div>
        ) : balances.length > 0 ? (
          <WalletDataTable
            columns={columns}
            data={balances}
            page={page}
            totalPages={totalPages}
            totalResults={totalResults}
            onPageChange={setPage}
          />
        ) : (
          <div className="flex h-full flex-1 items-center justify-center">
            <h3 className="text-lg text-muted-foreground">
              No wallet data available
            </h3>
          </div>
        )}
      </div>
    </>
  )
}
