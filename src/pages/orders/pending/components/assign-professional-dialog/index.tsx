import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Loading from "@/components/loader"
import type { IOrderServiceItem } from "@/types"
import { AssignDialogLoading } from "./assign-dialog-loading"
import { AssignDialogProfessionalList } from "./assign-dialog-professional-list"
import { AssignDialogSearchRow } from "./assign-dialog-search-row"
import { AssignDialogServiceList } from "./assign-dialog-service-list"
import { useAssignProfessionalDialog } from "./use-assign-professional-dialog"

interface Props {
  orderId: string
  services: IOrderServiceItem[]
}

const AssignProfessionalDialog = ({ orderId, services }: Props) => {
  const [open, setOpen] = useState(false)

  const handleRequestClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
  }, [])

  const {
    search,
    searchField,
    searchPlaceholder,
    activeLine,
    selectedByService,
    professionalById,
    activeProfessionals,
    professionalsForActiveService,
    assignedCount,
    allServicesAssigned,
    isSubmitting,
    isRefetching,
    showFullSkeleton,
    handleSearchChange,
    handleSearchFieldChange,
    handleSelectServiceLine,
    handlePickProfessional,
    handleAssign,
    activeLineId,
  } = useAssignProfessionalDialog({
    orderId,
    services,
    open,
    onRequestClose: handleRequestClose,
  })

  const activeServiceSelectedProId = activeLine
    ? selectedByService[activeLine.service_id._id]
    : undefined

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          Assign Professional
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(90vh,720px)] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="border-b px-6 pb-4 pt-6">
          <DialogHeader>
            <DialogTitle>Assign professionals</DialogTitle>
            <p className="text-left text-sm font-normal text-muted-foreground">
              Choose a service on the left, then pick a professional on the
              right. Selection moves to the next unassigned service automatically.
              Only professionals who offer the selected service are listed.
            </p>
          </DialogHeader>
        </div>

        {showFullSkeleton ? (
          <AssignDialogLoading />
        ) : (
          <>
            <div className="grid min-h-0 flex-1 grid-cols-1 divide-y sm:grid-cols-[minmax(0,240px)_1fr] sm:divide-x sm:divide-y-0">
              <AssignDialogServiceList
                services={services}
                activeLineId={activeLineId}
                selectedByService={selectedByService}
                professionalById={professionalById}
                onSelectLine={handleSelectServiceLine}
              />

              <div className="flex min-h-0 flex-col">
                <AssignDialogSearchRow
                  search={search}
                  searchField={searchField}
                  searchPlaceholder={searchPlaceholder}
                  activeServiceName={activeLine?.service_id.name}
                  isRefetching={isRefetching}
                  onSearchChange={handleSearchChange}
                  onSearchFieldChange={handleSearchFieldChange}
                />
                <div className="min-h-0 flex-1 overflow-y-auto p-2">
                  <AssignDialogProfessionalList
                    activeProfessionalsCount={activeProfessionals.length}
                    professionalsForActiveService={professionalsForActiveService}
                    activeServiceSelectedProId={activeServiceSelectedProId}
                    hasActiveLine={!!activeLine}
                    onPickProfessional={handlePickProfessional}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {assignedCount}
                </span>{" "}
                of {services.length} services assigned
              </p>
              <Button
                className="bg-primary hover:bg-primary/80 sm:min-w-[120px]"
                disabled={!allServicesAssigned || isSubmitting}
                onClick={handleAssign}
              >
                {isSubmitting ? (
                  <span className="inline-flex w-14 justify-center">
                    <Loading isLoading={isSubmitting} />
                  </span>
                ) : (
                  "Submit assignment"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AssignProfessionalDialog
