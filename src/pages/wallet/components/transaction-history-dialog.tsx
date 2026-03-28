import { useCallback, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { getWalletTransactions } from "@/services/walletServices"
import moment from "moment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Loading from "@/components/loader"
import { History } from "lucide-react"

interface Props {
  professionalId: string
  professionalName: string
}

const TransactionHistoryDialog = ({
  professionalId,
  professionalName,
}: Props) => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
  }, [])

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["walletTransactions", professionalId],
    queryFn: () => getWalletTransactions(professionalId),
    enabled: open,
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                className="flex flex-col gap-1 rounded-lg border px-3 py-2 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <Badge
                      variant="outline"
                      className={
                        tx.type === "earning"
                          ? "w-fit bg-green-100 text-green-800"
                          : "w-fit bg-red-100 text-red-800"
                      }
                    >
                      {tx.type}
                    </Badge>
                    {tx.note ? (
                      <span className="text-xs text-muted-foreground">
                        {tx.note}
                      </span>
                    ) : null}
                    {tx.order_id ? (
                      <Link
                        to={`/orders/${tx.order_id._id}`}
                        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                      >
                        Order {tx.order_id.status} ·{" "}
                        {tx.order_id.total_price.toLocaleString()} ETB
                      </Link>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span
                      className={`font-semibold ${tx.type === "earning" ? "text-green-700" : "text-red-700"}`}
                    >
                      {tx.type === "earning" ? "+" : "-"}
                      {tx.amount} ETB
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {moment(tx.createdAt).format("ll")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TransactionHistoryDialog
