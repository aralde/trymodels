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
import { ArrowUpDown, ExternalLink, Search, Cpu, Wrench } from "lucide-react"

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
    tpm?: number | string;
    rpm?: number | string;
    rpd?: number | string;
    tpd?: number | string;
    ash?: number;
    asd?: number;
    apiModelName?: string;
    toolCall?: boolean;
    reasoning?: boolean;
    input?: string[];
    output?: string[];
    contextLimit?: number;
    outputLimit?: number;
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
      const val = row.getValue("tpm") as number | string | undefined
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
      const val = row.getValue("rpm") as number | string | undefined
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
      const val = row.getValue("rpd") as number | string | undefined
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
      const val = row.getValue("tpd") as number | string | undefined
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
    accessorKey: "contextLimit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Context Limit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const val = row.getValue("contextLimit") as number | undefined
      return <div className="text-center font-mono text-xs">{val ? val.toLocaleString() : "-"}</div>
    },
  },
  {
    accessorKey: "outputLimit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Output Limit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const val = row.getValue("outputLimit") as number | undefined
      return <div className="text-center font-mono text-xs">{val ? val.toLocaleString() : "-"}</div>
    },
  },
  {
    id: "features",
    header: "Features",
    cell: ({ row }) => {
      const toolCall = row.original.toolCall
      const reasoning = row.original.reasoning
      
      if (toolCall === undefined && reasoning === undefined) return <div className="text-center">-</div>
      
      return (
        <div className="flex justify-center gap-1">
          {toolCall && (
            <Badge variant="outline" className="px-1 py-0!" title="Tool Calling Support">
              <Wrench className="w-3 h-3 mr-1" /> Tools
            </Badge>
          )}
          {reasoning && (
            <Badge variant="outline" className="px-1 py-0!" title="Reasoning Support">
              <Cpu className="w-3 h-3 mr-1" /> Reason
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "io",
    header: "I/O",
    cell: ({ row }) => {
      const input = row.original.input || []
      const output = row.original.output || []
      
      if (input.length === 0 && output.length === 0) return <div className="text-center">-</div>
      
      return (
        <div className="flex flex-col gap-1 items-center">
          {input.length > 0 && (
            <div className="flex gap-1 text-[10px]" title={`Input: ${input.join(", ")}`}>
              <span className="text-muted-foreground mr-1">In:</span>
              <span className="truncate max-w-[80px]">{input.join(",")}</span>
            </div>
          )}
          {output.length > 0 && (
            <div className="flex gap-1 text-[10px]" title={`Output: ${output.join(", ")}`}>
              <span className="text-muted-foreground mr-1">Out:</span>
              <span className="truncate max-w-[80px]">{output.join(",")}</span>
            </div>
          )}
        </div>
      )
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

import { ChevronDown, ChevronRight } from "lucide-react"

export function ProvidersTable({ data, renderedContent }: { data: Provider[], renderedContent?: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")


  // Transform Provider[] -> ModelRow[]
  const flattenedData = React.useMemo(() => {
    const rows: ModelRow[] = [];
    data.forEach((provider, pIndex) => {
      // Create a composite ID if provider.id is missing
      const providerId = provider.id || provider.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      if (provider.models && provider.models.length > 0) {
        provider.models.forEach((modelObj, mIndex) => {
          // Check if modelObj is a string (legacy/transition) or object (new schema)
          const modelName = typeof modelObj === 'string' ? modelObj : modelObj.model_id;
          const modelLimits = typeof modelObj === 'object' ? modelObj.limits : {};

          rows.push({
            id: `${providerId}-${mIndex}`,
            modelName: modelName,
            providerName: provider.name,
            providerUrl: provider.url || provider.link_url || "",
            type: (provider.type as "Free" | "Trial") || "Free",
            
            // Map V2 limits to table columns
            // provider.notes top level contains general notes
            limits: provider.notes || "",
            
            // Limits are now per-model in the new schema
            tpm: modelLimits?.TPM || modelLimits?.tpm,
            rpm: modelLimits?.RPM || modelLimits?.rpm,
            rpd: modelLimits?.RPD || modelLimits?.rpd,
            tpd: modelLimits?.TPD || modelLimits?.tpd,
            
            
            // Preserve legacy/other fields if they exist
            ash: modelLimits?.ash,
            asd: modelLimits?.asd,
            
            // V2 detailed model specifications
            apiModelName: typeof modelObj === 'object' ? modelObj.api_model_name : undefined,
            toolCall: typeof modelObj === 'object' ? modelObj.tool_call : undefined,
            reasoning: typeof modelObj === 'object' ? modelObj.reasoning : undefined,
            input: typeof modelObj === 'object' ? modelObj.input : undefined,
            output: typeof modelObj === 'object' ? modelObj.output : undefined,
            contextLimit: typeof modelObj === 'object' ? modelObj.context_limit : undefined,
            outputLimit: typeof modelObj === 'object' ? modelObj.output_limit : undefined,
          });
        });
      } else {
        // Fallback for providers with no models list
        rows.push({
          id: `${providerId}-generic`,
          modelName: "Various Models",
          providerName: provider.name,
          providerUrl: provider.url || provider.link_url || "",
          type: (provider.type as "Free" | "Trial") || "Free",
          limits: provider.notes || "",
          tpm: undefined,
          rpm: undefined,
          rpd: undefined,
          tpd: undefined,
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

        {renderedContent && (
        <div className="mt-4 flex justify-end">
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Verified Sources
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Data Verification Sources</DialogTitle>
                        <DialogDescription>
                            This data was ground-truth verified using Google Search. The following sources were used to validate the limits.
                        </DialogDescription>
                    </DialogHeader>
                     <div 
                        className="
                          mt-4 prose prose-sm dark:prose-invert max-w-none 
                          [&_.container]:!bg-transparent [&_.container]:!p-0 [&_.container]:!shadow-none [&_.container]:!gap-4
                          [&_.headline]:hidden
                          [&_.carousel]:!flex [&_.carousel]:!flex-wrap [&_.carousel]:!gap-2 [&_.carousel]:!overflow-visible [&_.carousel]:!mr-0
                          [&_.chip]:!inline-flex [&_.chip]:!items-center [&_.chip]:!justify-center [&_.chip]:!whitespace-normal [&_.chip]:!text-left [&_.chip]:!break-words [&_.chip]:!rounded-md [&_.chip]:!text-xs [&_.chip]:!font-medium [&_.chip]:!ring-offset-background [&_.chip]:!transition-colors [&_.chip]:!py-2 [&_.chip]:!px-3 [&_.chip]:!w-full
                          [&_.chip]:!border [&_.chip]:!border-input [&_.chip]:!bg-secondary/50 [&_.chip]:!hover:bg-secondary [&_.chip]:!hover:text-secondary-foreground
                          [&_.chip]:!text-foreground [&_.chip]:!no-underline [&_.chip]:!m-0
                        "
                        dangerouslySetInnerHTML={{ __html: renderedContent }} 
                     />
                </DialogContent>
            </Dialog>
        </div>
      )}
    </div>
  )
}
