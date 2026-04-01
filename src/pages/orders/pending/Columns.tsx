import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import moment from "moment"
import type { IOrder } from "@/types"
import { OrderStatus } from "@/types"
import StatusBadge from "@/components/status-badge"
import ImagePreviewDialog from "@/components/image-preview-dialog"
import { Button } from "@/components/ui/button"
import { Eye, Receipt } from "lucide-react"
import RequestPaymentDialog from "./components/request-payment-dialog"
import VerifyPaymentDialog from "./components/verify-payment-dialog"
import AssignProfessionalDialog from "./components/assign-professional-dialog"

const usePendingColumns = () => {
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
        accessorKey: "total_price",
        header: "Total",
        cell: ({ row }) => <div>{row.original.total_price} ETB</div>,
      },
      {
        accessorKey: "scheduled_date",
        header: "Scheduled",
        cell: ({ row }) => (
          <div className="text-sm">
            {moment(row.original.scheduled_date).format("ll")}{" "}
            {moment(row.original.scheduled_time, "HH:mm", true).isValid()
              ? moment(row.original.scheduled_time, "HH:mm").format("hh:mm A")
              : row.original.scheduled_time}
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
              {order.status === OrderStatus.PENDING_REVIEW && (
                <RequestPaymentDialog orderId={order._id ?? ""} />
              )}

              {order.status === OrderStatus.ADVANCE_PAYMENT_SUBMITTED && (
                <>
                  {order.advance_payment_id?.receipt_image && (
                    <ImagePreviewDialog
                      src={`${import.meta.env.VITE_BASE_URL}/users/get-images?name=${order.advance_payment_id.receipt_image}`}
                      alt="Payment Receipt"
                      trigger={
                        <button className="rounded p-1 hover:bg-muted">
                          <Receipt className="h-4 w-4 text-blue-600" />
                        </button>
                      }
                    />
                  )}
                  <VerifyPaymentDialog
                    paymentId={order.advance_payment_id?._id as string}
                    receiptUrl={order.advance_payment_id?.receipt_image ?? ""}
                    orderId={order._id ?? ""}
                  />
                </>
              )}

              {order.status === OrderStatus.PAYMENT_APPROVED && (
                <AssignProfessionalDialog
                  orderId={order._id ?? ""}
                  services={order.services}
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

export default usePendingColumns
