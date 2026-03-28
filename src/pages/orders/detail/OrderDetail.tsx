import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getOrderById } from "@/services/orderServices"
import moment from "moment"
import { OrderStatus } from "@/types"
import StatusBadge from "@/components/status-badge"
import ImagePreviewDialog from "@/components/image-preview-dialog"
import Loading from "@/components/loader"
import Error from "@/components/error-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Receipt } from "lucide-react"
import AdjustAppointmentDialog from "./components/adjust-appointment-dialog"
import ConfirmCompletionDialog from "./components/confirm-completion-dialog"
import RequestPaymentDialog from "../pending/components/request-payment-dialog"
import VerifyPaymentDialog from "../pending/components/verify-payment-dialog"
import AssignProfessionalDialog from "../pending/components/assign-professional-dialog"

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  })

  if (isLoading || isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading isLoading={isLoading} />
        <Error error={error} />
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">
          Order Details
        </h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{order.user_id.phone_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">{order.location.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Schedule & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {moment(order.scheduled_date).format("ll")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{order.scheduled_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Price</span>
              <span className="font-medium">{order.total_price} ETB</span>
            </div>
            {order.advance_amount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Advance Amount</span>
                <span className="font-medium">{order.advance_amount} ETB</span>
              </div>
            )}
            {order.remaining_amount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining Amount</span>
                <span className="font-medium">
                  {order.remaining_amount} ETB
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ordered Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {order.services.map((s, i) => (
                <li key={i} className="flex justify-between">
                  <span className="w-[40%] truncate">{s.service_id.name}</span>
                  <span className="font-medium">{s.price} ETB</span>
                  <span className="font-medium">
                    {s.assigned_professionals[0]?.full_name ?? "Not assigned"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receipts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {order.advance_payment_id?.receipt_image && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Advance Receipt</span>

                <ImagePreviewDialog
                  src={`${import.meta.env.VITE_BASE_URL}/users/get-images?name=${order.advance_payment_id.receipt_image}`}
                  alt="Advance Payment Receipt"
                  trigger={
                    <button className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Receipt className="h-4 w-4" /> View
                    </button>
                  }
                />
              </div>
            )}

            {order.final_payment_id?.receipt_image && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Final Receipt</span>
                <ImagePreviewDialog
                  src={`${import.meta.env.VITE_BASE_URL}/users/get-images?name=${order.final_payment_id.receipt_image}`}
                  alt="Final Payment Receipt"
                  trigger={
                    <button className="flex items-center gap-1 text-green-600 hover:underline">
                      <Receipt className="h-4 w-4" /> View
                    </button>
                  }
                />
              </div>
            )}

            {order.notes && (
              <>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Notes: </span>
                  <span>{order.notes}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-3">
        {order.status === OrderStatus.PENDING_REVIEW && (
          <RequestPaymentDialog orderId={order._id ?? ""} />
        )}
        {order.status === OrderStatus.ADVANCE_PAYMENT_SUBMITTED && (
          <VerifyPaymentDialog
            paymentId={order.advance_payment_id?._id as string}
            receiptUrl={order.advance_payment_id?.receipt_image ?? ""}
            orderId={order._id ?? ""}
          />
        )}
        {order.status === OrderStatus.PAYMENT_APPROVED && (
          <AssignProfessionalDialog
            orderId={order._id ?? ""}
            services={order.services}
          />
        )}
        <AdjustAppointmentDialog
          orderId={order._id ?? ""}
          currentDate={order.scheduled_date}
          currentTime={order.scheduled_time}
        />
        {order.status === OrderStatus.AWAITING_COMPLETION_CONFIRMATION && (
          <ConfirmCompletionDialog orderId={order._id ?? ""} />
        )}
      </div>
    </div>
  )
}
