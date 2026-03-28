import type { ICategory } from "@/types"
import { apiFetch, type PaginatedResponse } from "./api"

export async function getCategories(): Promise<{ categories: ICategory[] }> {
  return apiFetch<{ categories: ICategory[] }>("/categories")
}

interface ListParams {
  page?: number
  limit?: number
}

export async function getCategoriesPaginated(
  params: ListParams = {}
): Promise<PaginatedResponse<ICategory[]>> {
  const page = params.page ?? undefined
  const limit = params.limit ?? undefined

  return apiFetch<PaginatedResponse<ICategory[]>>(
    `/categories?${page ? `page=${page}` : ""}${limit ? `&limit=${limit}` : ""}`,
    { unwrapData: false }
  )
}

export async function getCategoryById(id: string): Promise<ICategory> {
  return apiFetch<ICategory>(`/categories/${id}`)
}

export async function addCategory(
  category: Pick<ICategory, "name" | "image_url">
): Promise<ICategory> {
  return apiFetch<ICategory>("/categories", {
    method: "POST",
    body: category,
  })
}

export async function updateCategory(
  id: string,
  category: Pick<ICategory, "name" | "image_url">
): Promise<ICategory> {
  if (!id) throw new Error("Category id is required")

  return apiFetch<ICategory>(`/categories/${id}`, {
    method: "PATCH",
    body: category,
  })
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<unknown>(`/categories/${id}`, {
    method: "DELETE",
  })
}
