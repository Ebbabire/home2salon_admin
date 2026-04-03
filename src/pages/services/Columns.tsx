import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { IService } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import EditService from "./components/edit-service"
import DeleteService from "./components/delete-service"
import SmartImage from "@/components/smart-image"
import { getSession } from "@/services/session"

const resolveImageSrc = (value?: string) => {
  if (!value) return null
  if (value.startsWith("http://") || value.startsWith("https://")) return value
  return `${import.meta.env.VITE_BASE_URL}/users/get-images/?name=${value}`
}

const useServiceColumns = () => {
  const columns: ColumnDef<IService, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "image_url",
        header: () => <div className="w-12">Image</div>,
        cell: ({ row }) => {
          const imageName = row.getValue("image_url") as string | undefined
          const imageSrc = resolveImageSrc(imageName)
          return (
            <SmartImage
              src={imageSrc}
              alt={row.original.name}
              wrapperClassName="h-10 w-10 rounded-md"
              className="h-10 w-10 rounded-md object-cover"
            />
          )
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="px-4 font-medium capitalize">
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="px-4">{row.getValue("price")} ETB</div>
        ),
      },
      // {
      //   accessorKey: "commission_percentage",
      //   header: ({ column }) => (
      //     <Button
      //       variant="ghost"
      //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      //     >
      //       Commission
      //       <ArrowUpDown className="ml-2 h-4 w-4" />
      //     </Button>
      //   ),
      //   cell: ({ row }) => {
      //     const value = row.getValue("commission_percentage") as
      //       | number
      //       | undefined
      //       | null
      //     return (
      //       <div className="px-4">
      //         {typeof value === "number" ? `${value}%` : "—"}
      //       </div>
      //     )
      //   },
      // },
      // {
      //   accessorKey: "description",
      //   header: "Description",
      //   cell: ({ row }) => (
      //     <div className="max-w-[200px] truncate text-muted-foreground">
      //       {(row.getValue("description") as string) || "—"}
      //     </div>
      //   ),
      // },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const service = row.original
          const { userRole } = getSession()
          const isSuperAdmin = userRole === "superadmin"
          return (
            <div className="flex justify-end gap-2">
              <EditService service={service} />
              {isSuperAdmin && <DeleteService serviceId={service._id ?? ""} />}
            </div>
          )
        },
      },
    ],
    []
  )
  return columns
}

export default useServiceColumns
