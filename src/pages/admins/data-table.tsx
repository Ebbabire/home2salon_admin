import { useEffect, useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AdminDetail from "./component/detaile-page"
import { IAdmin } from "./Admins"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface DataTableProps {
  columns: ColumnDef<IAdmin, unknown>[]
  data: IAdmin[]
  page: number
  totalPages: number
  totalResults: number
  onPageChange: (page: number) => void
}

export function DataTable({
  columns,
  data,
  page,
  totalPages,
  totalResults,
  onPageChange,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    if (!data.length) {
      setIsOpen(false)
      setUserId("")
      return
    }

    setIsOpen(true)
    setUserId(data[0]._id ?? "")
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleClick = (id: string | undefined) => {
    setIsOpen(true)
    id && setUserId(id)
  }
  const handleClose = () => {
    setIsOpen(false)
    setUserId("")
  }

  return (
    <div className="flex flex-col justify-between gap-4 overflow-hidden lg:flex-row">
      <div
        className={`${
          isOpen ? "lg:w-[70%] xl:w-[72%]" : "mx-auto w-[90%]"
        } transition-all duration-150`}
      >
        {/* <Filter table={table} /> */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`cursor-pointer hover:bg-green-300/20 ${row.original._id === userId ? "bg-green-700/20" : ""}`}
                    onClick={() => handleClick(row.original._id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({totalResults} total)
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (page > 1) onPageChange(page - 1)
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (page < totalPages) onPageChange(page + 1)
                  }}
                  className={
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      {isOpen && (
        <div className="mx-auto w-[85%] transition-all duration-150 sm:w-[55%] lg:w-[25%]">
          <AdminDetail
            userId={userId ? userId : data[0]._id}
            close={handleClose}
          />
        </div>
      )}
    </div>
  )
}
