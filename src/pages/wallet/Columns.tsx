import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { IWalletBalance } from "@/types";
import TransactionHistoryDialog from "./components/transaction-history-dialog";
import RecordPayoutDialog from "./components/record-payout-dialog";

const useWalletColumns = () => {
  const columns: ColumnDef<IWalletBalance, unknown>[] = useMemo(
    () => [
      {
        id: "full_name",
        accessorFn: (row) => row.professional.full_name,
        header: "Professional",
        cell: ({ row }) => (
          <div className="capitalize">
            {row.original.professional.full_name}
          </div>
        ),
      },
      {
        id: "phone_number",
        accessorFn: (row) => row.professional.phone_number,
        header: "Phone",
        cell: ({ row }) => (
          <div>0{row.original.professional.phone_number}</div>
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
          const proName = row.original.professional.full_name;
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
