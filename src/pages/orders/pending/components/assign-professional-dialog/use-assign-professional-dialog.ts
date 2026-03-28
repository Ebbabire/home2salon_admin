import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useToast } from "@/components/hooks/use-toast"
import moment from "moment"
import { getProfessionals } from "@/services/professionalServices"
import { assignProfessional } from "@/services/orderServices"
import type { IOrderServiceItem, IProfessional } from "@/types"
import { SEARCH_DEBOUNCE_MS, type SearchField } from "./constants"
import { professionalAssignDialogQueryKey } from "./query-keys"

export type { SearchField } from "./constants"

interface UseAssignProfessionalDialogArgs {
  orderId: string
  services: IOrderServiceItem[]
  open: boolean
  onRequestClose: () => void
}

export function useAssignProfessionalDialog({
  orderId,
  services,
  open,
  onRequestClose,
}: UseAssignProfessionalDialogArgs) {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [searchField, setSearchField] = useState<SearchField>("full_name")
  const [activeLineId, setActiveLineId] = useState<string | null>(null)
  const [selectedByService, setSelectedByService] = useState<
    Record<string, string>
  >({})

  const queryClient = useQueryClient()
  const { toast } = useToast()

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [search])

  const {
    data: professionalsResponse,
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: professionalAssignDialogQueryKey(searchField, debouncedSearch),
    queryFn: () => {
      if (!debouncedSearch) {
        return getProfessionals()
      }
      if (searchField === "full_name") {
        return getProfessionals({ full_name: debouncedSearch })
      }
      return getProfessionals({ phone_number: debouncedSearch })
    },
    enabled: open,
    placeholderData: keepPreviousData,
  })

  const fetchedProfessionals = useMemo(
    () => professionalsResponse?.professionals ?? [],
    [professionalsResponse]
  )

  const activeProfessionals = useMemo(
    () => fetchedProfessionals.filter((p) => p.status === "Active"),
    [fetchedProfessionals]
  )

  const activeLine = useMemo(
    () => services.find((s) => s._id === activeLineId),
    [services, activeLineId]
  )

  const professionalsForActiveService = useMemo(() => {
    if (!activeLine) return activeProfessionals
    const serviceId = activeLine.service_id._id
    return activeProfessionals.filter((pro) =>
      (pro.skills ?? []).some((sk) => sk._id === serviceId)
    )
  }, [activeProfessionals, activeLine])

  const professionalById = useMemo(() => {
    const map = new Map<string, IProfessional>()
    for (const p of fetchedProfessionals) {
      if (p._id) map.set(p._id, p)
    }
    return map
  }, [fetchedProfessionals])

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
    setDebouncedSearch("")
    setSearchField("full_name")
    const firstUnassigned = services.find((s) => !defaults[s.service_id._id])
    setActiveLineId(firstUnassigned?._id ?? services[0]?._id ?? null)
  }, [open, services])

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: assignProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] })
      queryClient.invalidateQueries({ queryKey: ["assignedOrders"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardOrders"] })
      queryClient.invalidateQueries({ queryKey: ["order", orderId] })
      onRequestClose()
      setSelectedByService({})
      setActiveLineId(null)
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

  const allServicesAssigned = useMemo(
    () =>
      services.every((service) => !!selectedByService[service.service_id._id]),
    [services, selectedByService]
  )

  const assignedCount = useMemo(
    () => services.filter((s) => !!selectedByService[s.service_id._id]).length,
    [services, selectedByService]
  )

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    },
    []
  )

  const handleSearchFieldChange = useCallback((value: string) => {
    setSearchField(value as SearchField)
  }, [])

  const handleSelectServiceLine = useCallback((lineId: string) => {
    setActiveLineId(lineId)
  }, [])

  const handlePickProfessional = useCallback(
    (professionalId: string) => {
      const line = services.find((s) => s._id === activeLineId)
      if (!line) return
      let nextMap: Record<string, string> = {}
      setSelectedByService((prev) => {
        nextMap = {
          ...prev,
          [line.service_id._id]: professionalId,
        }
        return nextMap
      })
      const nextUnassigned = services.find((s) => !nextMap[s.service_id._id])
      setActiveLineId(nextUnassigned?._id ?? line._id)
    },
    [services, activeLineId]
  )

  const handleAssign = useCallback(() => {
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
  }, [services, selectedByService, orderId, mutate])

  const showFullSkeleton = isPending && !professionalsResponse

  const searchPlaceholder =
    searchField === "full_name"
      ? "Search by full name…"
      : "Search by phone number…"

  return {
    search,
    searchField,
    searchPlaceholder,
    activeLineId,
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
  }
}
