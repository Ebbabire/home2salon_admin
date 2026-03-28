import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWalletTransactions } from "@/services/walletServices";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/loader";
import { History } from "lucide-react";

interface Props {
  professionalId: string;
  professionalName: string;
}

const TransactionHistoryDialog = ({
  professionalId,
  professionalName,
}: Props) => {
  const [open, setOpen] = useState(false);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["walletTransactions", professionalId],
    queryFn: () => getWalletTransactions(professionalId),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1 text-xs">
          <History className="h-3.5 w-3.5" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {professionalName} — Transactions
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loading isLoading />
        ) : (
          <div className="space-y-2">
            {!transactions?.length && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No transactions yet
              </p>
            )}
            {transactions?.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <div className="flex flex-col gap-0.5">
                  <Badge
                    variant="outline"
                    className={
                      tx.type === "earning"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {tx.type}
                  </Badge>
                  {tx.notes && (
                    <span className="text-xs text-muted-foreground">
                      {tx.notes}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`font-semibold ${tx.type === "earning" ? "text-green-700" : "text-red-700"}`}
                  >
                    {tx.type === "earning" ? "+" : "-"}
                    {tx.amount} ETB
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {moment(tx.date ?? tx.created_at).format("ll")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionHistoryDialog;
