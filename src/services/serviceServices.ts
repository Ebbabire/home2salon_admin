import type { IService } from "@/types"
import { apiFetch, type PaginatedResponse } from "./api"

export async function getServices(): Promise<{ services: IService[] }> {
  return apiFetch<{ services: IService[] }>("/services")
}

export async function getServicesByCategory(
  categoryId: string
): Promise<IService[]> {
  return apiFetch<IService[]>(`/services/category/${categoryId}`)
}

interface ListParams {
  page?: number
  limit?: number
}

export async function getServicesByCategoryPaginated(
  categoryId: string,
  params: ListParams = {}
): Promise<PaginatedResponse<IService[]>> {
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  return apiFetch<PaginatedResponse<IService[]>>(
    `/services/category/${categoryId}?page=${page}&limit=${limit}`,
    { unwrapData: false }
  )
}

export async function getServiceById(id: string): Promise<IService> {
  return apiFetch<IService>(`/services/${id}`)
}

export async function addService(
  payload: Pick<
    IService,
    | "name"
    | "price"
    | "description"
    | "image_url"
    | "commission_percentage"
    | "category_id"
  >
): Promise<IService> {
  return apiFetch<IService>("/services", {
    method: "POST",
    body: payload,
  })
}

export async function updateService(
  id: string,
  payload: Pick<
    IService,
    "name" | "price" | "description" | "image_url" | "commission_percentage"
  > & {
    category: string
  }
): Promise<IService> {
  return apiFetch<IService>(`/services/${id}`, {
    method: "PATCH",
    body: payload,
  })
}

export async function deleteService(id: string): Promise<void> {
  await apiFetch<unknown>(`/services/${id}`, {
    method: "DELETE",
  })
}
