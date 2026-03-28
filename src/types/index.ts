export type { ICategory, IService } from "./service";
export type { IProfessional, IWalletTransaction, IWalletBalance } from "./professional";
export type { TransactionType } from "./professional";
export type {
  IOrder,
  IOrderUser,
  IOrderLocation,
  IOrderServiceRef,
  IOrderAssignedProfessional,
  IOrderServiceItem,
  IAdvancePayment,
} from "./order";
export { OrderStatus, PENDING_STATUSES, ASSIGNED_STATUSES, COMPLETED_STATUSES } from "./order";
