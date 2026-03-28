import type { IWalletTransaction } from "@/types"
import { apiFetch, type PaginatedResponse } from "./api"

interface ListParams {
  page?: number
  limit?: number
}

export async function getWalletTransactionsAdminPaginated(
  params: ListParams = {}
): Promise<PaginatedResponse<IWalletTransaction[]>> {
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  return apiFetch<PaginatedResponse<IWalletTransaction[]>>(
    `/wallet/transactions-admin?page=${page}&limit=${limit}`,
    { unwrapData: false }
  )
}

export async function getWalletTransactions(
  professional_id: string
): Promise<IWalletTransaction[]> {
  return apiFetch<IWalletTransaction[]>(
    `/wallet/${professional_id}/transactions`
  )
}

export async function recordPayout(payload: {
  professional_id: string
  amount: number
  notes?: string
}): Promise<IWalletTransaction> {
  return apiFetch<IWalletTransaction>(`/wallet/deduct`, {
    method: "POST",
    body: {
      professional_id: payload.professional_id,
      amount: payload.amount,
      note: payload.notes,
    },
  })
}
