import type { IProfessional } from "@/types"
import { apiFetch, type PaginatedResponse } from "./api"

export async function getProfessionals(): Promise<{
  professionals: IProfessional[]
}> {
  return apiFetch<{ professionals: IProfessional[] }>("/professionals")
}

interface ListParams {
  page?: number
  limit?: number
}

export async function getProfessionalsPaginated(
  params: ListParams = {}
): Promise<PaginatedResponse<IProfessional[]>> {
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  return apiFetch<PaginatedResponse<IProfessional[]>>(
    `/professionals?page=${page}&limit=${limit}`,
    { unwrapData: false }
  )
}

export async function getProfessionalById(id: string): Promise<IProfessional> {
  return apiFetch<IProfessional>(`/professionals/${id}`)
}

export async function addProfessional(
  professional: Pick<
    IProfessional,
    "full_name" | "phone_number" | "password"
  > & { skills: string[] }
): Promise<IProfessional> {
  return apiFetch<IProfessional>("/professionals", {
    method: "POST",
    body: professional,
  })
}

export async function updateProfessional(
  professional: Pick<IProfessional, "full_name" | "phone_number" | "_id"> & {
    skills: string[]
  }
): Promise<IProfessional> {
  if (!professional._id) throw new Error("Professional id is required")

  return apiFetch<IProfessional>(`/professionals/${professional._id}`, {
    method: "PATCH",
    body: professional,
  })
}

export async function changeProfessionalStatus(payload: {
  id: string
  status: string
}): Promise<IProfessional> {
  return apiFetch<IProfessional>(`/professionals/${payload.id}/status`, {
    method: "PATCH",
    body: { status: payload.status },
  })
}
