import { WalletDeductDialog } from "@/components/wallet-deduct-dialog"
import { Button } from "@/components/ui/button"
import { Minus } from "lucide-react"

interface Props {
  professionalId: string
  professionalName: string
}

const RecordPayoutDialog = ({ professionalId, professionalName }: Props) => {
  return (
    <WalletDeductDialog
      professionalId={professionalId}
      professionalName={professionalName}
      title={`Payout — ${professionalName}`}
      submitLabel="Record Payout"
      trigger={
        <Button size="sm" variant="outline" className="gap-1 text-xs">
          <Minus className="h-3.5 w-3.5" />
          Record Payout
        </Button>
      }
    />
  )
}

export default RecordPayoutDialog
