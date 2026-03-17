export interface IProfessional {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  password?: string;
  status?: "Active" | "Inactive";
  assignedOrders?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionType = "earning" | "deduction";

export interface IWalletTransaction {
  _id?: string;
  professional: string | IProfessional;
  type: TransactionType;
  amount: number;
  date?: string;
  order?: string;
  notes?: string;
  createdAt?: string;
}

export interface IWalletBalance {
  professional: IProfessional;
  balance: number;
}
