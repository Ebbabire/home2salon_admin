import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getCategoriesPaginated } from "@/services/categoryServices"
import Loading from "@/components/loader"
import Error from "@/components/error-display"
import CategoryList from "./components/category-list"
import ServiceTable from "./components/service-table"

export const Services = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

  const {
    data: categoryResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categoriesPaginated"],
    queryFn: () => getCategoriesPaginated(),
  })

  const categories = categoryResponse?.data.categories ?? []

  if (isLoading || isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading isLoading={isLoading} />
        <Error error={error} />
      </div>
    )
  }

  return (
    <>
      {/* <h1 className="text-xl font-bold tracking-tight md:text-2xl">Services</h1> */}
      <div className="flex flex-1 gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <CategoryList
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
        <div className="flex-1">
          {selectedCategoryId ? (
            <ServiceTable categoryId={selectedCategoryId} />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a category to view its services
            </div>
          )}
        </div>
      </div>
    </>
  )
}
