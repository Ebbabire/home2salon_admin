import type { IWalletBalance, IWalletTransaction } from "@/types";
import { apiFetch, type PaginatedResponse } from "./api";

export async function getWalletBalances(): Promise<IWalletBalance[]> {
  return apiFetch<IWalletBalance[]>("/wallet");
}

interface ListParams {
  page?: number;
  limit?: number;
}

export async function getWalletBalancesPaginated(
  params: ListParams = {},
): Promise<PaginatedResponse<IWalletBalance[]>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return apiFetch<PaginatedResponse<IWalletBalance[]>>(
    `/wallet?page=${page}&limit=${limit}`,
    { unwrapData: false },
  );
}

export async function getWalletTransactions(
  professional_id: string,
): Promise<IWalletTransaction[]> {
  return apiFetch<IWalletTransaction[]>(
    `/wallet/${professional_id}/transactions`,
  );
}

export async function recordPayout(payload: {
  professional_id: string;
  amount: number;
  notes?: string;
}): Promise<IWalletTransaction> {
  return apiFetch<IWalletTransaction>(`/wallet/${payload.professional_id}/deduct`, {
    method: "POST",
    body: {
      amount: payload.amount,
      notes: payload.notes,
    },
  });
}
