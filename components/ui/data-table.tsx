"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import React from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import { Label } from "./label";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  columnFilter?: string;
  searchEnabled?: boolean;
  filters?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize,
  columnFilter,
  searchEnabled = true,
  filters,
}: DataTableProps<TData, TValue>) {
  const columFiltered = columnFilter || "name";
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: pageSize || 10,
      },
    },
  });

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {searchEnabled && (
          <div className="relative flex items-center">
            <Label htmlFor="search" className="absolute left-2">
              <Search strokeWidth={3} />
            </Label>
            <Input
              id="search"
              autoComplete="off"
              placeholder={`Search by ${columFiltered == "id" ? "ID" : columFiltered}`}
              value={
                (table.getColumn(columFiltered)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(columFiltered)
                  ?.setFilterValue(event.target.value)
              }
              className="border-input w-full border-2 pl-10 placeholder:capitalize max-md:placeholder:text-sm md:max-w-sm"
            />
          </div>
        )}
        <div className="flex w-full flex-col gap-3 sm:flex-row md:items-center md:justify-end">
          <div className="flex cursor-pointer flex-wrap gap-3">
            {filters?.(table)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Button variant="outline" size={"sm"}>
                <Eye />
                Toggle
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnName =
                    column.id.split("_").length > 1
                      ? column.id.split("_")[0] + " " + column.id.split("_")[1]
                      : column.id
                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                          .replace(/^./, (str) => str.toUpperCase());
                  return (
                    column.id !== "actions" && (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {columnName}
                      </DropdownMenuCheckboxItem>
                    )
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
        {/* Pagination Button */}
        <div className="mx-3 flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
