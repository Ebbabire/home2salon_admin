import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import moment from "moment"
import type { IOrder } from "@/types"
import StatusBadge from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const useAssignedColumns = () => {
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
        accessorKey: "scheduled_date",
        header: "Scheduled",
        cell: ({ row }) => (
          <div className="text-sm">
            {moment(row.original.scheduled_date).format("ll")}{" "}
            {row.original.scheduled_time}
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
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => navigate(`/orders/${row.original._id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [navigate]
  )

  return columns
}

export default useAssignedColumns
