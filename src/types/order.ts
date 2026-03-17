import type { IProfessional } from "./professional";
import type { IService } from "./service";

export enum OrderStatus {
  PENDING_REVIEW = "Pending Review",
  ADVANCE_PAYMENT_REQUESTED = "Advance Payment Requested",
  ADVANCE_PAYMENT_SUBMITTED = "Advance Payment Submitted",
  PAYMENT_APPROVED = "Payment Approved",
  PROFESSIONAL_ASSIGNED = "Professional Assigned",
  SCHEDULED = "Scheduled",
  IN_PROGRESS = "In Progress",
  AWAITING_COMPLETION_CONFIRMATION = "Awaiting Completion Confirmation",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export const PENDING_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING_REVIEW,
  OrderStatus.ADVANCE_PAYMENT_REQUESTED,
  OrderStatus.ADVANCE_PAYMENT_SUBMITTED,
  OrderStatus.PAYMENT_APPROVED,
];

export const ASSIGNED_STATUSES: OrderStatus[] = [
  OrderStatus.PROFESSIONAL_ASSIGNED,
  OrderStatus.SCHEDULED,
  OrderStatus.IN_PROGRESS,
  OrderStatus.AWAITING_COMPLETION_CONFIRMATION,
];

export const COMPLETED_STATUSES: OrderStatus[] = [OrderStatus.COMPLETED];

export interface ICustomerInfo {
  _id?: string;
  fullName: string;
  phoneNumber: string;
}

export interface IOrderedService {
  service: string | IService;
  price: number;
}

export interface IOrder {
  _id?: string;
  customer: ICustomerInfo;
  services: IOrderedService[];
  totalPrice: number;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  notes?: string;
  status: OrderStatus;
  advancePaymentAmount?: number;
  advancePaymentInstructions?: string;
  advancePaymentReceipt?: string;
  finalPaymentReceipt?: string;
  professional?: string | IProfessional;
  createdAt?: string;
  updatedAt?: string;
}
