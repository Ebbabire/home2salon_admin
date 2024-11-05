import { useMemo } from "react";

import { type IProduct } from "./products";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

const useColumns = () => {
  const navigate = useNavigate();
  const columns: ColumnDef<IProduct>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Product Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 capitalize">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "shortDescription",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Short Description
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="px-4 capitalize">
            {row.getValue("shortDescription")}
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("price")}</div>
        ),
      },

      {
        accessorKey: "brand",
        header: () => <div className="w-32">Brand</div>,
        cell: ({ row }) => {
          return <div>{row.getValue("brand")}</div>;
        },
      },
      {
        accessorKey: "condition",
        header: () => <div>Condition</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.getValue("condition")}</div>;
        },
      },
      {
        accessorKey: "status",
        header: () => <div className={`w-32`}>Status</div>,
        cell: ({ row }) => {
          return (
            <div
              className={`${row.getValue("status") === "Active" ? "text-green-600" : "text-red-600"} font-semibold`}
            >
              {row.getValue("status")}
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/products/${row.original._id}`)}
                >
                  View Product
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger>delete</DialogTrigger>
                    <DialogContent>hello</DialogContent>
                  </Dialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );
  return columns;
};

export default useColumns;
