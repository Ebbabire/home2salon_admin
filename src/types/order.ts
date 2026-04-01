export enum OrderStatus {
  PENDING_REVIEW = "pendingReview",
  ADVANCE_PAYMENT_REQUESTED = "advancePaymentRequested",
  ADVANCE_PAYMENT_SUBMITTED = "advancePaymentSubmitted",
  PAYMENT_APPROVED = "paymentApproved",
  PROFESSIONAL_ASSIGNED = "professionalAssigned",
  AWAITING_COMPLETION_CONFIRMATION = "awaitingCompletionConfirmation",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const PENDING_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING_REVIEW,
  OrderStatus.ADVANCE_PAYMENT_REQUESTED,
  OrderStatus.ADVANCE_PAYMENT_SUBMITTED,
  OrderStatus.PAYMENT_APPROVED,
]

export const ASSIGNED_STATUSES: OrderStatus[] = [
  OrderStatus.PROFESSIONAL_ASSIGNED,
  OrderStatus.AWAITING_COMPLETION_CONFIRMATION,
]

export const COMPLETED_STATUSES: OrderStatus[] = [OrderStatus.COMPLETED]

export interface IOrderUser {
  _id: string
  full_name?: string
  phone_number: string
}

export interface IOrderLocation {
  type: "Point"
  coordinates: [number, number]
  address: string
  description?: string
}

export interface IOrderServiceRef {
  _id: string
  name: string
  price: number
  image_url?: string
  commission_percentage?: number
}

export interface IOrderAssignedProfessional {
  _id: string
  full_name: string
  phone_number: string
}

export interface IOrderServiceItem {
  _id: string
  service_id: IOrderServiceRef
  price: number
  assigned_professionals: IOrderAssignedProfessional[]
}

export interface IAdvancePayment {
  amount: number
  receipt_image?: string
  _id: string
}

export interface IOrder {
  _id: string
  user_id: IOrderUser
  location: IOrderLocation
  services: IOrderServiceItem[]
  total_price: number
  remaining_amount: number
  scheduled_date: string
  scheduled_time: string
  notes?: string
  status: OrderStatus
  advance_amount: number
  advance_percentage: number
  advance_payment_id?: IAdvancePayment
  final_payment_id?: IAdvancePayment
  created_at: string
  updated_at: string
}
