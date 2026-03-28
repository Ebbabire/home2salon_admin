import {
  useCallback,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/hooks/use-toast"
import moment from "moment"
import { recordPayout } from "@/services/walletServices"
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

export interface WalletDeductDialogProps {
  professionalId: string
  professionalName: string
  /** When set, client-side validation: amount must be in (0, maxDeductible] */
  maxDeductible?: number
  trigger: ReactNode
  title?: string
  submitLabel?: string
}

export function WalletDeductDialog({
  professionalId,
  professionalName,
  maxDeductible,
  trigger,
  title = "Deduct from wallet",
  submitLabel = "Confirm deduction",
}: WalletDeductDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: recordPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletTransactionsAdmin"] })
      queryClient.invalidateQueries({
        queryKey: ["walletTransactions", professionalId],
      })
      queryClient.invalidateQueries({
        queryKey: ["professional", professionalId],
      })
      queryClient.invalidateQueries({ queryKey: ["professionals"] })
      setOpen(false)
      setAmount("")
      setNotes("")
      toast({
        title: "Wallet updated",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: (err: Error) => {
      toast({
        title: "Deduction failed",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
  }, [])

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value)
    },
    [],
  )

  const handleNotesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNotes(event.target.value)
    },
    [],
  )

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      const value = Number(amount)
      if (!amount || Number.isNaN(value) || value <= 0) {
        toast({
          title: "Invalid amount",
          description: "Enter a positive amount in ETB.",
          variant: "destructive",
        })
        return
      }
      if (maxDeductible !== undefined && value > maxDeductible) {
        toast({
          title: "Amount too high",
          description: `Maximum deductible balance is ${maxDeductible.toLocaleString()} ETB.`,
          variant: "destructive",
        })
        return
      }
      mutate({
        professional_id: professionalId,
        amount: value,
        notes: notes.trim() || undefined,
      })
    },
    [amount, maxDeductible, mutate, notes, professionalId, toast],
  )

  const deductDisabled =
    isPending ||
    maxDeductible === 0 ||
    (maxDeductible !== undefined && maxDeductible < 0)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <p className="text-left text-sm font-normal text-muted-foreground">
            Record a payout or adjustment for{" "}
            <span className="font-medium text-foreground">
              {professionalName}
            </span>
            . This reduces their wallet balance by the amount you enter.
          </p>
          {maxDeductible !== undefined ? (
            <p className="text-left text-sm text-muted-foreground">
              Current balance:{" "}
              <span className="font-semibold text-foreground">
                {maxDeductible.toLocaleString()} ETB
              </span>
            </p>
          ) : null}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="wallet-deduct-amount">Amount (ETB)</Label>
            <Input
              id="wallet-deduct-amount"
              type="number"
              min={0}
              step="1"
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              required
              disabled={deductDisabled}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="wallet-deduct-notes">Note (optional)</Label>
            <Input
              id="wallet-deduct-notes"
              placeholder="e.g. Bank transfer"
              value={notes}
              onChange={handleNotesChange}
              disabled={isPending}
            />
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/80"
            disabled={deductDisabled}
          >
            {isPending ? (
              <span className="w-14">
                <Loading isLoading={isPending} />
              </span>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
