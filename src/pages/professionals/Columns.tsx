import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { IProfessional } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

const useProfessionalColumns = () => {
  const columns: ColumnDef<IProfessional, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "full_name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="px-4 capitalize">{row.getValue("full_name")}</div>
        ),
      },
      {
        accessorKey: "phone_number",
        header: () => <div className="w-32">Phone Number</div>,
        cell: ({ row }) => <div>{row.getValue("phone_number")}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div
            className={`font-semibold ${row.getValue("status") === "Active" ? "text-green-600" : "text-red-600"}`}
          >
            {row.getValue("status")}
          </div>
        ),
      },
    ],
    []
  )
  return columns
}

export default useProfessionalColumns
