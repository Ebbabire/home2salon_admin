import { useMemo } from "react";

// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type IAdmin } from "./Admins";

const useColumns = () => {
  const columns: ColumnDef<IAdmin, unknown>[] = useMemo(
    () => [
     
      {
        accessorKey: "full_name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Full Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 capitalize">{row.getValue("full_name")}</div>
        ),
      },
      {
        accessorKey: "phone_number",
        header: () => <div className="w-32">Phone Number</div>,
        cell: ({ row }) => {
          return <div>{row.getValue("phone_number")}</div>;
        },
      },
      {
        accessorKey: "role",
        header: () => <div>Role</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.getValue("role")}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div
            className={`font-semibold ${row.getValue("status") === "Active" ? "text-green-600" : "text-red-600"} font-semibold`}
          >
            {row.getValue("status")}
          </div>
        ),
      },
      
    ],
    [],
  );
  return columns;
};

export default useColumns;
