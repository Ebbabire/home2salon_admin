import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { recordPayout } from "@/services/walletServices";
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
import { Minus } from "lucide-react";

interface Props {
  professionalId: string;
  professionalName: string;
}

const RecordPayoutDialog = ({ professionalId, professionalName }: Props) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: recordPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletBalances"] });
      queryClient.invalidateQueries({
        queryKey: ["walletTransactions", professionalId],
      });
      setOpen(false);
      setAmount("");
      setNotes("");
      toast({
        title: "Payout Recorded",
        className: "bg-[#16432D] text-muted",
        description: moment().format("LL"),
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to record payout",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    mutate({ professionalId, amount: Number(amount), notes: notes || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1 text-xs">
          <Minus className="h-3.5 w-3.5" />
          Record Payout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">
            Payout to {professionalName}
          </DialogTitle>
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
            <Label>Notes (optional)</Label>
            <Input
              placeholder="e.g. Bank transfer"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              "Record Payout"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPayoutDialog;
