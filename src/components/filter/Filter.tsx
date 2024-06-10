import { useState } from "react";

import { ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { type Table } from "@tanstack/react-table";

interface FilterProps<TData> {
  table: Table<TData>;
}

function Filter<TData>({ table }: FilterProps<TData>) {
  const [filterType, setFilterType] = useState<string>("email");

  return (
    <div className="flex flex-col items-start gap-2 py-4 md:flex-row md:items-center">
      <Input
        placeholder={`Filter by ${filterType}...`}
        value={(table.getColumn(filterType)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(filterType)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Filter by <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide() && column.id !== "amount")
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  onCheckedChange={() => setFilterType(column.id)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Filter;
