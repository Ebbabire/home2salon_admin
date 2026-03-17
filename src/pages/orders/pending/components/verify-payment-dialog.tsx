import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { verifyAdvancePayment } from "@/services/orderServices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loader";

interface Props {
  orderId: string;
  receiptUrl: string;
}

const VerifyPaymentDialog = ({ orderId, receiptUrl }: Props) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: verifyAdvancePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setOpen(false);
      toast({
        title: "Payment Verified",
        className: "bg-[#16432D] text-muted",
        description: moment().format("LL"),
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Verification Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

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
          <div className="flex justify-center rounded-md border bg-muted/30 p-2">
            <img
              src={receiptUrl}
              alt="Payment receipt"
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
              onClick={() =>
                mutate({ orderId, approved: false, reason })
              }
            >
              {isPending ? (
                <Loading isLoading={isPending} />
              ) : (
                "Reject"
              )}
            </Button>
            <Button
              className="bg-[#16432d] hover:bg-[#16432d]/80"
              disabled={isPending}
              onClick={() => mutate({ orderId, approved: true })}
            >
              {isPending ? (
                <Loading isLoading={isPending} />
              ) : (
                "Approve"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyPaymentDialog;
