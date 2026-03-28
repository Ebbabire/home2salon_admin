import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/services/categoryServices"
import { getServices } from "@/services/serviceServices"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, Loader2 } from "lucide-react"
import type { ICategory, IService } from "@/types"

interface SkillsPickerProps {
  value: string[]
  onChange: (ids: string[]) => void
}

export default function SkillsPicker({ value, onChange }: SkillsPickerProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const { data: categoryResponse, isLoading: loadingCats } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const { data: allServices, isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  })

  const grouped = useMemo(() => {
    const map = new Map<string, IService[]>()
    for (const svc of allServices?.services ?? []) {
      const catId =
        typeof svc.category_id === "string"
          ? svc.category_id
          : (svc.category_id as ICategory)?._id ?? ""
      if (!catId) continue
      const list = map.get(catId) ?? []
      list.push(svc)
      map.set(catId, list)
    }
    return map
  }, [allServices?.services])

  const selectedSet = useMemo(() => new Set(value), [value])

  const toggleService = (id: string) => {
    const next = new Set(selectedSet)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onChange(Array.from(next))
  }

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) {
        next.delete(catId)
      } else {
        next.add(catId)
      }
      return next
    })
  }

  if (loadingCats || loadingServices) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading services...
      </div>
    )
  }

  const visibleCategories =
    categoryResponse?.categories.filter(
      (cat) => grouped.get(cat._id!)?.length
    ) ?? []

  if (!visibleCategories.length) {
    return (
      <p className="py-2 text-sm text-muted-foreground">
        No services available.
      </p>
    )
  }

  return (
    <div className="space-y-1 rounded-md border p-2">
      {visibleCategories.map((cat) => {
        const catServices = grouped.get(cat._id!) ?? []
        const selectedCount = catServices.filter((s) =>
          selectedSet.has(s._id!)
        ).length

        return (
          <Collapsible
            key={cat._id}
            open={openCategories.has(cat._id!)}
            onOpenChange={() => toggleCategory(cat._id!)}
          >
            <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted">
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform ${
                  openCategories.has(cat._id!) ? "rotate-90" : ""
                }`}
              />
              <span className="flex-1 text-left">{cat.name}</span>
              {selectedCount > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {selectedCount}
                </Badge>
              )}
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-6 py-2">
                {catServices.map((svc) => (
                  <label
                    key={svc._id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedSet.has(svc._id!)}
                      onCheckedChange={() => toggleService(svc._id!)}
                    />
                    {svc.name}
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}
