import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/hooks/use-toast"
import moment from "moment"
import { requestAdvancePayment } from "@/services/orderServices"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import Loading from "@/components/loader"

interface Props {
  orderId: string
}

const RequestPaymentDialog = ({ orderId }: Props) => {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: requestAdvancePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardOrders"] })

      queryClient.invalidateQueries({ queryKey: ["order", orderId] })
      setOpen(false)

      toast({
        title: "Payment Request Sent",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to request payment",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      order_id: orderId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          Request Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Advance Payment</DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            <span>Please request the advance payment for the order.</span>
            <span className="text-sm text-muted-foreground">
              User will pay 50% of the total amount. You will be able to verify
              the payment after it is received.
            </span>
          </DialogDescription>
        </DialogHeader>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/80"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {isPending ? (
            <span className="w-14">
              <Loading isLoading={isPending} />
            </span>
          ) : (
            "Send Request"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default RequestPaymentDialog
