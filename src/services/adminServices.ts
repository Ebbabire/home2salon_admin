import { type IAdmin } from "@/pages/admins/Admins"
import { apiFetch, type PaginatedResponse } from "./api"

interface LoginRequest {
  phone_number: string
  password: string
}

export const login = async (
  authDetail: LoginRequest
): Promise<{ token: string; admin: IAdmin }> => {
  const data = await apiFetch<{ token: string; admin: IAdmin }>(
    "/admins/login",
    {
      method: "POST",
      body: authDetail,
      auth: false,
    }
  )

  sessionStorage.setItem("token", JSON.stringify(data.token))
  sessionStorage.setItem("id", JSON.stringify(data.admin._id))
  sessionStorage.setItem("userName", JSON.stringify(data.admin.full_name))
  sessionStorage.setItem("userRole", JSON.stringify(data.admin.role))

  return data
}

export async function getAdmins(): Promise<IAdmin[]> {
  return apiFetch<IAdmin[]>("/admin")
}

interface ListParams {
  page?: number
  limit?: number
}

export async function getAdminsPaginated(
  params: ListParams = {}
): Promise<PaginatedResponse<IAdmin[]>> {
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  return apiFetch<PaginatedResponse<IAdmin[]>>(
    `/admins?page=${page}&limit=${limit}`,
    { unwrapData: false }
  )
}

export async function getAdminById(id?: string): Promise<IAdmin> {
  if (!id) throw new Error("Admin id is required")
  return apiFetch<IAdmin>(`/admins/${id}`)
}

export async function addAdmin(admin: IAdmin): Promise<IAdmin> {
  return apiFetch<IAdmin>("/admins", {
    method: "POST",
    body: admin,
  })
}

export async function updateAdmin(updatedAdmin: IAdmin): Promise<IAdmin> {
  if (!updatedAdmin._id) throw new Error("Admin id is required")

  return apiFetch<IAdmin>(`/admins/${updatedAdmin._id}`, {
    method: "PATCH",
    body: updatedAdmin,
  })
}

export async function changeAdminStatus(status: {
  id: string
  status: string
}): Promise<IAdmin> {
  return apiFetch<IAdmin>(`/admins/${status.id}`, {
    method: "PATCH",
    body: { status: status.status },
  })
}

export async function changeAdminPassword(payload: {
  current_password: string
  new_password: string
}): Promise<void> {
  await apiFetch<unknown>("/admins/passwordChange", {
    method: "PATCH",
    body: {
      newPassword: payload.new_password,
      oldPassword: payload.current_password,
    },
  })
}
