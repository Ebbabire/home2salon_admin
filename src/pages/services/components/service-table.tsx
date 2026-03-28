import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getServicesByCategoryPaginated } from "@/services/serviceServices"
import Loading from "@/components/loader"
import Error from "@/components/error-display"
import AddService from "./add-service"
import { ServiceDataTable } from "./service-data-table"
import useServiceColumns from "../Columns"
import { usePageParam } from "@/hooks/use-page-param"

interface ServiceTableProps {
  categoryId: string
}

const ServiceTable = ({ categoryId }: ServiceTableProps) => {
  const columns = useServiceColumns()
  const { page, setPage } = usePageParam("servicePage")
  const [limit] = useState(5)
  const previousCategoryId = useRef(categoryId)

  useEffect(() => {
    if (previousCategoryId.current !== categoryId) {
      previousCategoryId.current = categoryId
      setPage(1)
    }
  }, [categoryId, setPage])

  const {
    data: serviceResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["services", categoryId, page, limit],
    queryFn: () => getServicesByCategoryPaginated(categoryId, { page, limit }),
    enabled: !!categoryId,
  })

  const services = serviceResponse?.data.services ?? []
  const totalPages = serviceResponse?.totalPages ?? 0
  const totalResults = serviceResponse?.totalResults ?? 0

  useEffect(() => {
    if (!serviceResponse) return
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
  }, [serviceResponse, page, totalPages, setPage])

  if (isLoading || isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading isLoading={isLoading} />
        <Error error={error} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Services</h2>
        <AddService categoryId={categoryId} />
      </div>
      {services.length > 0 ? (
        <ServiceDataTable
          columns={columns}
          data={services}
          page={page}
          totalPages={totalPages}
          totalResults={totalResults}
          onPageChange={setPage}
        />
      ) : (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          No services in this category
        </div>
      )}
    </div>
  )
}

export default ServiceTable
