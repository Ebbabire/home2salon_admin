import { memo } from "react"
import type { ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { SearchField } from "./constants"

interface AssignDialogSearchRowProps {
  search: string
  searchField: SearchField
  searchPlaceholder: string
  activeServiceName?: string
  isRefetching: boolean
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSearchFieldChange: (value: string) => void
}

export const AssignDialogSearchRow = memo(function AssignDialogSearchRow({
  search,
  searchField,
  searchPlaceholder,
  activeServiceName,
  isRefetching,
  onSearchChange,
  onSearchFieldChange,
}: AssignDialogSearchRowProps) {
  return (
    <div className="shrink-0 space-y-2 border-b p-4">
      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="w-full shrink-0 space-y-1.5 sm:w-[11rem]">
          <Label
            htmlFor="assign-search-field"
            className="text-xs text-muted-foreground"
          >
            Search by
          </Label>
          <Select value={searchField} onValueChange={onSearchFieldChange}>
            <SelectTrigger id="assign-search-field" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_name">Full name</SelectItem>
              <SelectItem value="phone_number">Phone number</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative min-w-0 flex-1 space-y-1.5">
          <Label
            htmlFor="professional-search"
            className="text-xs text-muted-foreground"
          >
            Query
          </Label>
          <Input
            id="professional-search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={onSearchChange}
            disabled={isRefetching}
            className={cn(isRefetching && "opacity-60")}
          />
          {isRefetching ? (
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-end rounded-md pb-2 pl-3 pr-3 pt-8"
              aria-hidden
            >
              <Skeleton className="h-9 w-full opacity-70" />
            </div>
          ) : null}
        </div>
      </div>
      {activeServiceName ? (
        <p className="text-xs text-muted-foreground">
          Assigning for:{" "}
          <span className="font-medium text-foreground">{activeServiceName}</span>
        </p>
      ) : null}
    </div>
  )
})
