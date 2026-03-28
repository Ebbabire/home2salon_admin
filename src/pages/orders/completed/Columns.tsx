import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import moment from "moment"
import type { IOrder } from "@/types"
import StatusBadge from "@/components/status-badge"
import ImagePreviewDialog from "@/components/image-preview-dialog"
import { Button } from "@/components/ui/button"
import { Eye, Receipt } from "lucide-react"

const useCompletedColumns = () => {
  const navigate = useNavigate()

  const columns: ColumnDef<IOrder, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "user_id",
        header: "Customer",
        cell: ({ row }) => (
          <div className="capitalize">
            {row.original.user_id.phone_number ?? "—"}
          </div>
        ),
      },
      {
        id: "professional",
        header: "Professional",
        cell: ({ row }) => {
          const pro = row.original.services[0]?.assigned_professionals?.[0]
          if (!pro) return <span className="text-muted-foreground">—</span>
          return <div className="capitalize">{pro.full_name}</div>
        },
      },
      {
        id: "services",
        header: "Services",
        cell: ({ row }) => {
          const names = row.original.services.map((s) => s.service_id.name)
          return (
            <div className="max-w-[200px] truncate">{names.join(", ")}</div>
          )
        },
      },
      {
        accessorKey: "total_price",
        header: "Total",
        cell: ({ row }) => <div>{row.original.total_price} ETB</div>,
      },
      {
        accessorKey: "updatedAt",
        header: "Completed",
        cell: ({ row }) => (
          <div className="text-sm">
            {moment(row.original.updatedAt).format("ll")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const order = row.original
          return (
            <div className="flex items-center justify-end gap-2">
              {order.final_payment_receipt && (
                <ImagePreviewDialog
                  src={order.final_payment_receipt}
                  alt="Final Receipt"
                  trigger={
                    <button className="rounded p-1 hover:bg-muted">
                      <Receipt className="h-4 w-4 text-green-600" />
                    </button>
                  }
                />
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [navigate]
  )

  return columns
}

export default useCompletedColumns
