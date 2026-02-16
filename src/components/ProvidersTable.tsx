"use strict";
"use client";

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ExternalLink, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Provider } from "@/lib/types"

// Flattened structure for the table
interface ModelRow {
    id: string; // Composite ID
    modelName: string;
    providerName: string;
    providerUrl: string;
    type: "Free" | "Trial";
    limits: string;
    tpm?: number;
    rpm?: number;
    rpd?: number;
    tpd?: number;
    ash?: number;
    asd?: number;
}


export const columns: ColumnDef<ModelRow>[] = [
  {
    accessorKey: "modelName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("modelName")}</div>,
  },
  {
    accessorKey: "providerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Provider
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        return (
            <div className="flex items-center gap-2">
                <a href={row.original.providerUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    {row.getValue("providerName")} <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
            </div>
        )
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return <Badge variant={type === "Free" ? "default" : "secondary"}>{type}</Badge>
    },
  },
  {
    accessorKey: "tpm",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TPM
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const val = row.getValue("tpm") as number | undefined
      return <div className="text-center font-mono text-xs">{val ? val.toLocaleString() : "-"}</div>
    },
  },
  {
    accessorKey: "rpm",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RPM
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const val = row.getValue("rpm") as number | undefined
      return <div className="text-center font-mono text-xs">{val ? val.toLocaleString() : "-"}</div>
    },
  },
  {
    accessorKey: "rpd",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RPD
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const val = row.getValue("rpd") as number | undefined
      return <div className="text-center font-mono text-xs">{val ? val.toLocaleString() : "-"}</div>
    },
  },
  {
    accessorKey: "tpd",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TPD
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const val = row.getValue("tpd") as number | undefined
      return <div className="text-center font-mono text-xs">{val ? val.toLocaleString() : "-"}</div>
    },
  },
  {
    accessorKey: "ash",
    header: "ASH",
    cell: ({ row }) => {
      const val = row.getValue("ash") as number | undefined
      return <div className="text-center font-mono text-xs text-muted-foreground">{val ? val.toLocaleString() : "-"}</div>
    },
  },
  {
    accessorKey: "asd",
    header: "ASD",
    cell: ({ row }) => {
      const val = row.getValue("asd") as number | undefined
      return <div className="text-center font-mono text-xs text-muted-foreground">{val ? val.toLocaleString() : "-"}</div>
    },
  },
  {
    accessorKey: "limits",
    header: "Limits Detail",
    cell: ({ row }) => {
      const limits = row.getValue("limits") as string
      if (!limits) return <div className="text-center">-</div>
      
      return (
        <div className="flex items-center gap-2">
          <div className="max-w-[150px] text-xs text-muted-foreground truncate" title={limits}>
            {limits}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-primary">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{row.original.modelName} - Limits Detail</DialogTitle>
                <DialogDescription>
                  Detailed limits and restrictions for this model from {row.original.providerName}.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {limits}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },

]

export function ProvidersTable({ data }: { data: Provider[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Transform Provider[] -> ModelRow[]
  const flattenedData = React.useMemo(() => {
      const rows: ModelRow[] = [];
      data.forEach(provider => {
          if (provider.models && provider.models.length > 0) {
              provider.models.forEach((model, index) => {
                  const isObject = typeof model === 'object' && model !== null;
                  const name = isObject ? (model as any).name : String(model);
                  const m = isObject ? (model as any) : {};

                  rows.push({
                      id: `${provider.id}-${index}`,
                      modelName: name,
                      providerName: provider.name,
                      providerUrl: provider.url,
                      type: provider.type,
                      limits: provider.limits,
                      tpm: m.tpm ?? provider.tpm,
                      rpm: m.rpm ?? provider.rpm,
                      rpd: m.rpd ?? provider.rpd,
                      tpd: m.tpd ?? provider.tpd,
                      ash: m.ash,
                      asd: m.asd,
                  });
              });
          } else {
              // Provider with no specific models listed (generic)
               rows.push({
                  id: `${provider.id}-generic`,
                  modelName: "Various Models",
                  providerName: provider.name,
                  providerUrl: provider.url,
                  type: provider.type,
                  limits: provider.limits,
                  tpm: provider.tpm,
                  rpm: provider.rpm,
                  rpd: provider.rpd,
                  tpd: provider.tpd,
              });
          }
      });

      return rows;
  }, [data]);

  const table = useReactTable({
    data: flattenedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
        const search = filterValue.toLowerCase();
        // Search in Model Name and Provider Name
        const model = (row.getValue("modelName") as string).toLowerCase();
        const provider = (row.getValue("providerName") as string).toLowerCase();
        
        return model.includes(search) || provider.includes(search);
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter models or providers..."
          value={globalFilter ?? ""}
          onChange={(event) =>
            setGlobalFilter(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto text-sm text-muted-foreground">
            {flattenedData.length} models across {data.length} providers
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
