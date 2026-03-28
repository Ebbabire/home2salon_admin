import { useEffect, useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/hooks/use-toast"
import moment from "moment"
import { getProfessionals } from "@/services/professionalServices"
import { assignProfessional } from "@/services/orderServices"
import type { IOrderServiceItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Loading from "@/components/loader"

interface Props {
  orderId: string
  services: IOrderServiceItem[]
}

const AssignProfessionalDialog = ({ orderId, services }: Props) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedByService, setSelectedByService] = useState<
    Record<string, string>
  >({})
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: professionalsResponse, isLoading: loadingPros } = useQuery({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
    enabled: open,
  })

  const activeProfessionals = professionalsResponse?.professionals?.filter(
    (p) => p.status === "Active"
  )
  const filteredProfessionals = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return activeProfessionals ?? []
    return (activeProfessionals ?? []).filter((pro) => {
      const name = pro.full_name.toLowerCase()
      const phone = pro.phone_number.toLowerCase()
      return name.includes(query) || phone.includes(query)
    })
  }, [activeProfessionals, search])

  useEffect(() => {
    if (!open) return
    const defaults = services.reduce<Record<string, string>>((acc, service) => {
      const assignedId = service.assigned_professionals[0]?._id
      if (assignedId) {
        acc[service.service_id._id] = assignedId
      }
      return acc
    }, {})
    setSelectedByService(defaults)
    setSearch("")
  }, [open, services])

  const { mutate, isPending } = useMutation({
    mutationFn: assignProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] })
      queryClient.invalidateQueries({ queryKey: ["assignedOrders"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardOrders"] })
      setOpen(false)
      setSelectedByService({})
      toast({
        title: "Professional Assigned",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: (err: Error) => {
      toast({
        title: "Assignment Failed",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const handleAssign = () => {
    const serviceAssignments = services
      .map((service) => {
        const professionalId = selectedByService[service.service_id._id]
        if (!professionalId) return null
        return {
          service_id: service.service_id._id,
          professionals: [professionalId],
        }
      })
      .filter(Boolean) as { service_id: string; professionals: string[] }[]

    if (!serviceAssignments.length) return
    mutate({ order_id: orderId, services: serviceAssignments })
  }

  const allServicesAssigned = services.every(
    (service) => !!selectedByService[service.service_id._id]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          Assign Professional
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Professional</DialogTitle>
        </DialogHeader>
        {loadingPros ? (
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-300" />
            {[...Array(Math.max(services.length, 1)).keys()].map((idx) => (
              <div key={idx} className="h-24 rounded-md border p-3">
                <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-300" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
                  <div className="h-4 w-3/5 animate-pulse rounded bg-gray-300" />
                </div>
              </div>
            ))}
            <div className="h-9 w-full animate-pulse rounded bg-primary/30" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="professional-search">Search professionals</Label>
              <Input
                id="professional-search"
                placeholder="Search by name or phone number"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="space-y-2 rounded-md border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">
                      {service.service_id.name}
                    </div>
                    {selectedByService[service.service_id._id] ? (
                      <Badge variant="secondary">Assigned</Badge>
                    ) : (
                      <Badge variant="outline" className="text-destructive">
                        Required
                      </Badge>
                    )}
                  </div>
                  <Select
                    value={selectedByService[service.service_id._id] ?? ""}
                    onValueChange={(value) =>
                      setSelectedByService((prev) => ({
                        ...prev,
                        [service.service_id._id]: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select professional" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProfessionals.length > 0 ? (
                        filteredProfessionals.map((pro) => (
                          <SelectItem
                            key={`${service._id}-${pro._id}`}
                            value={pro._id ?? ""}
                            className="flex w-full gap-1"
                          >
                            <p className="flex w-full items-center justify-between gap-1">
                              <span>{pro.full_name}</span>
                              <span>({pro.phone_number})</span>
                            </p>
                            <div className="flex w-full flex-wrap gap-1">
                              {pro.skills.map((skill) => (
                                <Badge key={skill._id} variant="secondary">
                                  {skill.name}
                                </Badge>
                              ))}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-2 text-xs text-muted-foreground">
                          No matching active professionals
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <Button
              className="bg-primary hover:bg-primary/80"
              disabled={!allServicesAssigned || isPending}
              onClick={handleAssign}
            >
              {isPending ? (
                <span className="w-14">
                  <Loading isLoading={isPending} />
                </span>
              ) : (
                "Assign"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AssignProfessionalDialog
