import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import type { IWalletTransaction } from "@/types"
import { Badge } from "@/components/ui/badge"

const useWalletColumns = () => {
  const columns: ColumnDef<IWalletTransaction, unknown>[] = useMemo(
    () => [
      {
        id: "createdAt",
        accessorFn: (row) => row.createdAt,
        header: "Date",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {moment(row.original.createdAt).format("lll")}
          </span>
        ),
      },
      {
        id: "full_name",
        accessorFn: (row) => row.professional_id.full_name,
        header: "Professional",
        cell: ({ row }) => (
          <div className="capitalize">
            {row.original.professional_id?.full_name ?? "—"}
          </div>
        ),
      },
      {
        id: "phone_number",
        accessorFn: (row) => row.professional_id?.phone_number ?? "—",
        header: "Phone",
        cell: ({ row }) => (
          <div>{row.original.professional_id?.phone_number ?? "—"}</div>
        ),
      },
      {
        id: "type",
        accessorFn: (row) => row.type,
        header: "Type",
        cell: ({ row }) => {
          const { type } = row.original
          return (
            <Badge
              variant="outline"
              className={
                type === "earning"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {type === "earning" ? "Earning" : "Deduction"}
            </Badge>
          )
        },
      },
      {
        accessorKey: "amount",
        header: "Amount (ETB)",
        cell: ({ row }) => {
          const { type, amount } = row.original
          return (
            <div
              className={
                type === "earning"
                  ? "font-semibold text-green-700"
                  : "font-semibold text-red-700"
              }
            >
              {type === "earning" ? "+" : "-"}
              {amount.toLocaleString()} ETB
            </div>
          )
        },
      },

      {
        id: "note",
        accessorFn: (row) => row.note ?? "",
        header: "Note",
        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-[200px] text-xs text-muted-foreground">
            {row.original.note ?? "—"}
          </span>
        ),
      },
    ],
    []
  )
  return columns
}

export default useWalletColumns
