import { memo, useCallback } from "react"
import type { IOrderServiceItem, IProfessional } from "@/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type AssignedLabel = Pick<IProfessional, "full_name" | "phone_number">

interface AssignDialogServiceListProps {
  services: IOrderServiceItem[]
  activeLineId: string | null
  selectedByService: Record<string, string>
  professionalById: Map<string, IProfessional>
  onSelectLine: (lineId: string) => void
}

function resolveAssignedLabel(
  service: IOrderServiceItem,
  assignedId: string | undefined,
  professionalById: Map<string, IProfessional>,
): AssignedLabel | undefined {
  if (!assignedId) return undefined
  const fromFetch = professionalById.get(assignedId)
  if (fromFetch) {
    return {
      full_name: fromFetch.full_name,
      phone_number: fromFetch.phone_number,
    }
  }
  const fromOrder = service.assigned_professionals.find(
    (a) => a._id === assignedId,
  )
  if (fromOrder) {
    return {
      full_name: fromOrder.full_name,
      phone_number: fromOrder.phone_number,
    }
  }
  return undefined
}

function AssignDialogServiceListInner({
  services,
  activeLineId,
  selectedByService,
  professionalById,
  onSelectLine,
}: AssignDialogServiceListProps) {
  return (
    <div
      className="flex max-h-[min(420px,50vh)] flex-col gap-1 overflow-y-auto p-4 sm:max-h-[min(480px,55vh)]"
      role="tablist"
      aria-label="Order services"
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Services
      </p>
      {services.map((service) => {
        const sid = service.service_id._id
        const assignedId = selectedByService[sid]
        const assignedLabel = resolveAssignedLabel(
          service,
          assignedId,
          professionalById,
        )
        const isActive = service._id === activeLineId
        return (
          <AssignDialogServiceRow
            key={service._id}
            service={service}
            isActive={isActive}
            assignedLabel={assignedLabel}
            onSelect={onSelectLine}
          />
        )
      })}
    </div>
  )
}

interface RowProps {
  service: IOrderServiceItem
  isActive: boolean
  assignedLabel?: AssignedLabel
  onSelect: (lineId: string) => void
}

const AssignDialogServiceRow = memo(function AssignDialogServiceRow({
  service,
  isActive,
  assignedLabel,
  onSelect,
}: RowProps) {
  const handleClick = useCallback(() => {
    onSelect(service._id)
  }, [onSelect, service._id])

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={handleClick}
      className={cn(
        "flex w-full flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
        isActive
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border hover:bg-muted/50",
      )}
    >
      <span className="font-medium leading-tight">{service.service_id.name}</span>
      {assignedLabel ? (
        <span className="line-clamp-2 text-xs text-muted-foreground">
          {assignedLabel.full_name} · {assignedLabel.phone_number}
        </span>
      ) : (
        <Badge variant="outline" className="text-[10px] text-destructive">
          Required
        </Badge>
      )}
    </button>
  )
})

export const AssignDialogServiceList = memo(AssignDialogServiceListInner)
