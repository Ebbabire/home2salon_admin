import type { IOrder } from "@/types"
import { apiFetch, type PaginatedResponse } from "./api"

type OrderStatusQuery =
  | "pendingReview"
  | "advancePaymentRequested"
  | "advancePaymentSubmitted"
  | "paymentApproved"
  | "professionalAssigned"
  | "awaitingCompletionConfirmation"
  | "completed"
  | "cancelled"

export const ORDER_PAGE_STATUSES: Record<
  "pending" | "assigned" | "completed",
  OrderStatusQuery[]
> = {
  pending: [
    "pendingReview",
    "advancePaymentRequested",
    "advancePaymentSubmitted",
    "paymentApproved",
  ],
  assigned: ["professionalAssigned", "awaitingCompletionConfirmation"],
  completed: ["completed"],
}

interface GetOrdersPaginatedParams {
  statuses: OrderStatusQuery[]
  page?: number
  limit?: number
}

export async function getOrders(): Promise<IOrder[]> {
  return apiFetch<IOrder[]>("/order")
}

export async function getOrdersPaginated({
  statuses,
  page = 1,
  limit = 10,
}: GetOrdersPaginatedParams): Promise<PaginatedResponse<IOrder[]>> {
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("limit", String(limit))
  statuses.forEach((status) => params.append("status", status))

  return apiFetch<PaginatedResponse<IOrder[]>>(`/orders?${params.toString()}`, {
    unwrapData: false,
  })
}

export async function getOrderById(id: string): Promise<IOrder> {
  return apiFetch<IOrder>(`/orders/${id}`)
}

export async function requestAdvancePayment(payload: {
  order_id: string
}): Promise<IOrder> {
  return apiFetch<IOrder>(`/orders/${payload.order_id}/request-advance`, {
    method: "POST",
  })
}

export async function verifyAdvancePayment(payload: {
  payment_id: string
  approved: boolean
  reason?: string
}): Promise<IOrder> {
  return apiFetch<IOrder>(`/orders/verify-payment`, {
    method: "POST",
    body: {
      payment_id: payload.payment_id,
      approve: payload.approved,
      reason: payload.reason,
    },
  })
}

export async function adjustAppointment(payload: {
  order_id: string
  scheduled_date: string
  scheduled_time: string
}): Promise<IOrder> {
  return apiFetch<IOrder>(`/orders/${payload.order_id}/update-schedule`, {
    method: "PATCH",
    body: {
      scheduled_date: payload.scheduled_date,
      scheduled_time: payload.scheduled_time,
    },
  })
}

export async function assignProfessional(payload: {
  order_id: string
  services: {
    service_id: string
    professionals: string[]
  }[]
}): Promise<IOrder> {
  return apiFetch<IOrder>(`/orders/assign-professionals`, {
    method: "POST",
    body: {
      order_id: payload.order_id,
      services: payload.services,
    },
  })
}

export async function confirmOrderCompletion(
  order_id: string
): Promise<IOrder> {
  return apiFetch<IOrder>(`/orders/${order_id}/complete`, {
    method: "PATCH",
  })
}
