import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/hooks/use-toast"
import moment from "moment"
import { verifyAdvancePayment } from "@/services/orderServices"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loading from "@/components/loader"
import SmartImage from "@/components/smart-image"

interface Props {
  paymentId: string
  receiptUrl: string
  orderId: string
}

const VerifyPaymentDialog = ({ paymentId, receiptUrl, orderId }: Props) => {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: verifyAdvancePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardOrders"] })
      queryClient.invalidateQueries({ queryKey: ["order", orderId] })
      setOpen(false)
      setApproving(false)
      setRejecting(false)
      toast({
        title: "Payment Verified",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: (err: Error) => {
      setApproving(false)
      setRejecting(false)
      toast({
        title: "Verification Failed",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          Verify Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Verify Advance Payment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center rounded-lg border bg-muted/30 p-2">
            <SmartImage
              src={`${import.meta.env.VITE_BASE_URL}/users/get-images?name=${receiptUrl}`}
              alt="Payment receipt"
              loading="eager"
              showRetry
              wrapperClassName="h-64 w-full max-w-md rounded-md"
              className="max-h-64 rounded-md object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Rejection Reason (if rejecting)</Label>
            <Input
              placeholder="Optional reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                setRejecting(true)
                mutate({ payment_id: paymentId, approved: false, reason })
              }}
            >
              {isPending && rejecting ? (
                <Loading isLoading={isPending && rejecting} width="w-14" />
              ) : (
                "Reject"
              )}
            </Button>
            <Button
              className="bg-primary hover:bg-primary/80"
              disabled={isPending && approving}
              onClick={() => {
                setApproving(true)
                mutate({ payment_id: paymentId, approved: true })
              }}
            >
              {isPending && approving ? (
                <Loading isLoading={isPending && approving} width="w-14" />
              ) : (
                "Approve"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyPaymentDialog
