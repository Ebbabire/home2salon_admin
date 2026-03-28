import { memo, useCallback } from "react"
import type { IProfessional } from "@/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AssignDialogProfessionalListProps {
  activeProfessionalsCount: number
  professionalsForActiveService: IProfessional[]
  activeServiceSelectedProId: string | undefined
  hasActiveLine: boolean
  onPickProfessional: (professionalId: string) => void
}

interface RowProps {
  pro: IProfessional
  disabled: boolean
  isChosen: boolean
  onPick: (id: string) => void
}

const AssignDialogProfessionalRow = memo(function AssignDialogProfessionalRow({
  pro,
  disabled,
  isChosen,
  onPick,
}: RowProps) {
  const pid = pro._id ?? ""
  const handleClick = useCallback(() => {
    onPick(pid)
  }, [onPick, pid])

  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "flex w-full flex-col gap-1 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm transition-colors",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "hover:border-border hover:bg-muted/40",
          isChosen && "border-primary/40 bg-primary/5",
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
          <span className="font-medium">{pro.full_name}</span>
          <span className="text-xs text-muted-foreground">{pro.phone_number}</span>
        </div>
        {pro.skills?.length ? (
          <div className="flex flex-wrap gap-1">
            {pro.skills.slice(0, 6).map((skill) => (
              <Badge
                key={skill._id}
                variant="secondary"
                className="text-[10px] font-normal"
              >
                {skill.name}
              </Badge>
            ))}
            {pro.skills.length > 6 ? (
              <Badge variant="outline" className="text-[10px] font-normal">
                +{pro.skills.length - 6}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </button>
    </li>
  )
})

function AssignDialogProfessionalListInner({
  activeProfessionalsCount,
  professionalsForActiveService,
  activeServiceSelectedProId,
  hasActiveLine,
  onPickProfessional,
}: AssignDialogProfessionalListProps) {
  if (activeProfessionalsCount === 0) {
    return (
      <p className="px-2 py-6 text-center text-sm text-muted-foreground">
        No active professionals available
      </p>
    )
  }

  if (professionalsForActiveService.length === 0) {
    return (
      <p className="px-2 py-6 text-center text-sm text-muted-foreground">
        No active professionals offer this service. Try another search or pick a
        different service.
      </p>
    )
  }

  return (
    <ul className="space-y-1" role="list">
      {professionalsForActiveService.map((pro) => (
        <AssignDialogProfessionalRow
          key={pro._id}
          pro={pro}
          disabled={!hasActiveLine}
          isChosen={activeServiceSelectedProId === (pro._id ?? "")}
          onPick={onPickProfessional}
        />
      ))}
    </ul>
  )
}

export const AssignDialogProfessionalList = memo(AssignDialogProfessionalListInner)
