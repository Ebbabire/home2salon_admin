import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type Admin } from "./Admins";

const useColumns = () => {
  const columns: ColumnDef<Admin>[] = useMemo(
    () => [
      {
        accessorKey: "fullName",
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
          <div className="px-4 capitalize">{row.getValue("fullName")}</div>
        ),
      },

      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: () => <div className="w-32">Phone Number</div>,
        cell: ({ row }) => {
          return <div>0{row.getValue("phoneNumber")}</div>;
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
            className={`${row.getValue("status") === "Active" ? "text-green-600" : "text-red-600"} font-semibold`}
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
