import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { requestAdvancePayment } from "@/services/orderServices";
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
}

const RequestPaymentDialog = ({ orderId }: Props) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [instructions, setInstructions] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: requestAdvancePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setOpen(false);
      setAmount("");
      setInstructions("");
      toast({
        title: "Payment Request Sent",
        className: "bg-[#16432D] text-muted",
        description: moment().format("LL"),
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to request payment",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    mutate({
      orderId,
      amount: Number(amount),
      instructions,
    });
  };

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
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Amount (ETB)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Payment Instructions</Label>
            <Input
              placeholder="e.g. Transfer to CBE account 100..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="bg-[#16432d] hover:bg-[#16432d]/80"
            disabled={isPending}
          >
            {isPending ? (
              <span className="w-14">
                <Loading isLoading={isPending} />
              </span>
            ) : (
              "Send Request"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPaymentDialog;
