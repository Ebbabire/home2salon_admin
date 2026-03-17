import type { IWalletBalance, IWalletTransaction } from "@/types";
import {
  mockWalletBalances,
  mockWalletTransactions,
  nextId,
} from "./mock/data";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getWalletBalances(): Promise<IWalletBalance[]> {
  await delay();
  return [...mockWalletBalances];
}

export async function getWalletTransactions(
  professionalId: string,
): Promise<IWalletTransaction[]> {
  await delay();
  return [...(mockWalletTransactions[professionalId] ?? [])];
}

export async function recordPayout(payload: {
  professionalId: string;
  amount: number;
  notes?: string;
}): Promise<IWalletTransaction> {
  await delay();

  const balIdx = mockWalletBalances.findIndex(
    (w) => w.professional._id === payload.professionalId,
  );
  if (balIdx === -1) throw new Error("Professional wallet not found");

  if (mockWalletBalances[balIdx].balance < payload.amount) {
    throw new Error("Insufficient wallet balance");
  }

  mockWalletBalances[balIdx] = {
    ...mockWalletBalances[balIdx],
    balance: mockWalletBalances[balIdx].balance - payload.amount,
  };

  const tx: IWalletTransaction = {
    _id: nextId(),
    professional: payload.professionalId,
    type: "deduction",
    amount: payload.amount,
    date: new Date().toISOString(),
    notes: payload.notes,
    createdAt: new Date().toISOString(),
  };

  if (!mockWalletTransactions[payload.professionalId]) {
    mockWalletTransactions[payload.professionalId] = [];
  }
  mockWalletTransactions[payload.professionalId].unshift(tx);

  return tx;
}
