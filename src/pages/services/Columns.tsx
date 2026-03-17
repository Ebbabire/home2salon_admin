import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { IService } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import EditService from "./components/edit-service";
import DeleteService from "./components/delete-service";

const useServiceColumns = () => {
  const columns: ColumnDef<IService, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "image",
        header: () => <div className="w-12">Image</div>,
        cell: ({ row }) => {
          const img = row.getValue("image") as string | undefined;
          return img ? (
            <img
              src={img}
              alt=""
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
              N/A
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="px-4 font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="px-4">{row.getValue("price")} ETB</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate text-muted-foreground">
            {(row.getValue("description") as string) || "—"}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const service = row.original;
          return (
            <div className="flex justify-end gap-2">
              <EditService service={service} />
              <DeleteService serviceId={service._id ?? ""} />
            </div>
          );
        },
      },
    ],
    [],
  );
  return columns;
};

export default useServiceColumns;
