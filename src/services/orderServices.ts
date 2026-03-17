import type { IOrder } from "@/types";
import { OrderStatus } from "@/types";
import { mockOrders, mockProfessionals } from "./mock/data";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getOrders(): Promise<IOrder[]> {
  await delay();
  return [...mockOrders];
}

export async function getOrderById(id: string): Promise<IOrder> {
  await delay();
  const order = mockOrders.find((o) => o._id === id);
  if (!order) throw new Error("Order not found");
  return { ...order };
}

export async function requestAdvancePayment(payload: {
  orderId: string;
  amount: number;
  instructions: string;
}): Promise<IOrder> {
  await delay();
  const idx = mockOrders.findIndex((o) => o._id === payload.orderId);
  if (idx === -1) throw new Error("Order not found");
  mockOrders[idx] = {
    ...mockOrders[idx],
    status: OrderStatus.ADVANCE_PAYMENT_REQUESTED,
    advancePaymentAmount: payload.amount,
    advancePaymentInstructions: payload.instructions,
    updatedAt: new Date().toISOString(),
  };
  return mockOrders[idx];
}

export async function verifyAdvancePayment(payload: {
  orderId: string;
  approved: boolean;
  reason?: string;
}): Promise<IOrder> {
  await delay();
  const idx = mockOrders.findIndex((o) => o._id === payload.orderId);
  if (idx === -1) throw new Error("Order not found");
  mockOrders[idx] = {
    ...mockOrders[idx],
    status: payload.approved
      ? OrderStatus.PAYMENT_APPROVED
      : OrderStatus.PENDING_REVIEW,
    updatedAt: new Date().toISOString(),
  };
  return mockOrders[idx];
}

export async function adjustAppointment(payload: {
  orderId: string;
  scheduledDate: string;
  scheduledTime: string;
}): Promise<IOrder> {
  await delay();
  const idx = mockOrders.findIndex((o) => o._id === payload.orderId);
  if (idx === -1) throw new Error("Order not found");
  mockOrders[idx] = {
    ...mockOrders[idx],
    scheduledDate: payload.scheduledDate,
    scheduledTime: payload.scheduledTime,
    updatedAt: new Date().toISOString(),
  };
  return mockOrders[idx];
}

export async function assignProfessional(payload: {
  orderId: string;
  professionalId: string;
}): Promise<IOrder> {
  await delay();
  const idx = mockOrders.findIndex((o) => o._id === payload.orderId);
  if (idx === -1) throw new Error("Order not found");

  const pro = mockProfessionals.find((p) => p._id === payload.professionalId);

  mockOrders[idx] = {
    ...mockOrders[idx],
    status: OrderStatus.PROFESSIONAL_ASSIGNED,
    professional: pro ?? payload.professionalId,
    updatedAt: new Date().toISOString(),
  };
  return mockOrders[idx];
}

export async function confirmOrderCompletion(
  orderId: string,
): Promise<IOrder> {
  await delay();
  const idx = mockOrders.findIndex((o) => o._id === orderId);
  if (idx === -1) throw new Error("Order not found");
  mockOrders[idx] = {
    ...mockOrders[idx],
    status: OrderStatus.COMPLETED,
    updatedAt: new Date().toISOString(),
  };
  return mockOrders[idx];
}
