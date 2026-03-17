import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { IWalletBalance } from "@/types";
import TransactionHistoryDialog from "./components/transaction-history-dialog";
import RecordPayoutDialog from "./components/record-payout-dialog";

const useWalletColumns = () => {
  const columns: ColumnDef<IWalletBalance, unknown>[] = useMemo(
    () => [
      {
        id: "fullName",
        accessorFn: (row) => row.professional.fullName,
        header: "Professional",
        cell: ({ row }) => (
          <div className="capitalize">
            {row.original.professional.fullName}
          </div>
        ),
      },
      {
        id: "phoneNumber",
        accessorFn: (row) => row.professional.phoneNumber,
        header: "Phone",
        cell: ({ row }) => (
          <div>0{row.original.professional.phoneNumber}</div>
        ),
      },
      {
        accessorKey: "balance",
        header: "Balance (ETB)",
        cell: ({ row }) => (
          <div className="font-semibold text-green-700">
            {row.original.balance.toLocaleString()} ETB
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const proId = row.original.professional._id ?? "";
          const proName = row.original.professional.fullName;
          return (
            <div className="flex justify-end gap-2">
              <TransactionHistoryDialog
                professionalId={proId}
                professionalName={proName}
              />
              <RecordPayoutDialog
                professionalId={proId}
                professionalName={proName}
              />
            </div>
          );
        },
      },
    ],
    [],
  );
  return columns;
};

export default useWalletColumns;
