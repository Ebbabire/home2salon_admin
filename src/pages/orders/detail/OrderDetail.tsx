import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/services/orderServices";
import moment from "moment";
import type { IProfessional } from "@/types";
import { OrderStatus } from "@/types";
import StatusBadge from "@/components/status-badge";
import ImagePreviewDialog from "@/components/image-preview-dialog";
import Loading from "@/components/loader";
import Error from "@/components/error-display";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Receipt } from "lucide-react";
import AdjustAppointmentDialog from "./components/adjust-appointment-dialog";
import ConfirmCompletionDialog from "./components/confirm-completion-dialog";
import RequestPaymentDialog from "../pending/components/request-payment-dialog";
import VerifyPaymentDialog from "../pending/components/verify-payment-dialog";
import AssignProfessionalDialog from "../pending/components/assign-professional-dialog";

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  if (isLoading || isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading isLoading={isLoading} />
        <Error error={error} />
      </div>
    );
  }

  if (!order) return null;

  const professional = order.professional as IProfessional | undefined;
  const serviceNames = order.services.map((s) =>
    typeof s.service === "string" ? s.service : s.service.name,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold md:text-2xl">Order Details</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium capitalize">
                {order.customer.fullName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">
                0{order.customer.phoneNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">{order.location}</span>
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
                {moment(order.scheduledDate).format("ll")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{order.scheduledTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Price</span>
              <span className="font-medium">{order.totalPrice} ETB</span>
            </div>
            {order.advancePaymentAmount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Advance Amount</span>
                <span className="font-medium">
                  {order.advancePaymentAmount} ETB
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
                  <span>{serviceNames[i]}</span>
                  <span className="font-medium">{s.price} ETB</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Professional & Receipts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Professional</span>
              <span className="font-medium capitalize">
                {professional?.fullName ?? "Not assigned"}
              </span>
            </div>

            {order.advancePaymentReceipt && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Advance Receipt</span>
                <ImagePreviewDialog
                  src={order.advancePaymentReceipt}
                  alt="Advance Payment Receipt"
                  trigger={
                    <button className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Receipt className="h-4 w-4" /> View
                    </button>
                  }
                />
              </div>
            )}

            {order.finalPaymentReceipt && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Final Receipt</span>
                <ImagePreviewDialog
                  src={order.finalPaymentReceipt}
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

      <div className="flex flex-wrap gap-2">
        {order.status === OrderStatus.PENDING_REVIEW && (
          <RequestPaymentDialog orderId={order._id ?? ""} />
        )}
        {order.status === OrderStatus.ADVANCE_PAYMENT_SUBMITTED && (
          <VerifyPaymentDialog
            orderId={order._id ?? ""}
            receiptUrl={order.advancePaymentReceipt ?? ""}
          />
        )}
        {order.status === OrderStatus.PAYMENT_APPROVED && (
          <AssignProfessionalDialog orderId={order._id ?? ""} />
        )}
        <AdjustAppointmentDialog
          orderId={order._id ?? ""}
          currentDate={order.scheduledDate}
          currentTime={order.scheduledTime}
        />
        {order.status ===
          OrderStatus.AWAITING_COMPLETION_CONFIRMATION && (
          <ConfirmCompletionDialog orderId={order._id ?? ""} />
        )}
      </div>
    </div>
  );
};
