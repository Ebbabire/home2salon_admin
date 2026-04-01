import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import useColumns from "./Column"
import { getAdminsPaginated } from "@/services/adminServices"

import AddAdmin from "./component/add-admin"
import Loading from "@/components/loader"
import Error from "@/components/error-display"
import { useQuery } from "@tanstack/react-query"
import { usePageParam } from "@/hooks/use-page-param"

export interface IAdmin {
  _id?: string
  full_name: string
  email?: string
  phone_number: string
  role: "admin" | "superadmin"
  status?: string
  created_at?: Date
}

export const Admins = () => {
  const columns = useColumns()
  const { page, setPage } = usePageParam("page")
  const [limit] = useState(10)

  const {
    data: adminResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admins", page, limit],
    queryFn: () => getAdminsPaginated({ page, limit }),
  })

  const admins = adminResponse?.data.admins ?? []
  const totalPages = adminResponse?.totalPages ?? 0
  const totalResults = adminResponse?.totalResults ?? 0

  useEffect(() => {
    if (!adminResponse) return
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
  }, [adminResponse, page, totalPages, setPage])

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Admins</h1>
        {!isLoading && !isError && admins ? <AddAdmin /> : null}
      </div>
      <div className="flex-1 rounded-xl border bg-card px-4 py-4 shadow-sm">
        {!isLoading && !isError && admins ? (
          <>
            {admins.length ? (
              <DataTable
                columns={columns}
                data={admins}
                page={page}
                totalPages={totalPages}
                totalResults={totalResults}
                onPageChange={setPage}
              />
            ) : (
              <div className="flex h-full flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    There are no admins
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You can add an <span className="font-semibold">admin</span>.
                  </p>
                  <AddAdmin />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Loading isLoading={isLoading} />
            <Error error={error} />
          </div>
        )}
      </div>
    </>
  )
}
