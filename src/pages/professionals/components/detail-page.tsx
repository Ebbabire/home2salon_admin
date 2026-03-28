import { useQuery } from "@tanstack/react-query"
import { getProfessionalById } from "@/services/professionalServices"
import moment from "moment"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Loading from "@/components/loader"
import Error from "@/components/error-display"
import { WalletDeductDialog } from "@/components/wallet-deduct-dialog"
import EditProfessional from "./edit-professional"
import ChangeProfessionalStatus from "./change-status"

interface Props {
  professionalId: string | undefined
  close: () => void
}

export default function ProfessionalDetail({ professionalId, close }: Props) {
  const {
    data: professional,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["professional", professionalId],
    queryFn: () => getProfessionalById(professionalId!),
    enabled: !!professionalId,
  })

  if (isLoading || isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading isLoading={isLoading} width="w-20" />
        <Error error={error} size="10rem" />
      </div>
    )
  }

  if (!professional) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg capitalize">
            {professional.full_name}
          </CardTitle>
          <CardDescription>Professional</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2 text-green-600">
          <EditProfessional professional={professional} />
        </div>
      </CardHeader>
      <CardContent className="overflow-auto p-3 text-sm scrollbar-none">
        <div className="flex flex-col gap-3">
          <div className="font-semibold">Contact</div>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Phone Number</span>
              <span className="font-medium">{professional.phone_number}</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <div className="font-semibold">Details</div>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Registered At</span>
              <span className="font-medium">
                {moment(professional.createdAt).format("ll")}
              </span>
            </li>
            <li className="flex flex-wrap items-center justify-between gap-2 gap-y-2">
              <span className="text-muted-foreground">Wallet Balance</span>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="font-medium">
                  {professional.wallet_id
                    ? `${professional.wallet_id.balance.toLocaleString()} ETB`
                    : "—"}
                </span>
                {professional._id && professional.wallet_id ? (
                  <WalletDeductDialog
                    professionalId={professional._id}
                    professionalName={professional.full_name}
                    maxDeductible={professional.wallet_id.balance}
                    title="Deduct from wallet"
                    submitLabel="Deduct amount"
                    trigger={
                      <Button
                        disabled={professional.wallet_id.balance === 0}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        Deduct
                      </Button>
                    }
                  />
                ) : null}
              </div>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`flex items-center gap-2 font-medium capitalize ${professional.status === "Active" ? "text-green-600" : "text-red-600"}`}
              >
                {professional.status}
                <ChangeProfessionalStatus
                  id={professional._id ?? ""}
                  status={professional.status ?? ""}
                />
              </span>
            </li>
          </ul>

          {professional.skills.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="font-semibold">Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {professional.skills?.map((skill) => (
                  <Badge key={skill._id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <Button
          variant="ghost"
          className="border border-red-500 px-12 transition-all duration-150 hover:bg-red-500 hover:text-white"
          onClick={close}
        >
          Close
        </Button>
      </CardFooter>
    </Card>
  )
}
