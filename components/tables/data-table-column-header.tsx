import { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  icon?: LucideIcon;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  icon,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }
  const Icon = icon;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <div className="flex items-center gap-1">
              {Icon && <Icon className="text-muted-foreground h-4 w-4" />}
              <span>{title}</span>
            </div>
            {column.getIsSorted() === "desc" ? (
              <ChevronDown
                className="text-picton-blue-500 ml-2 h-4 w-4"
                strokeWidth={3}
              />
            ) : column.getIsSorted() === "asc" ? (
              <ChevronUp
                className="text-picton-blue-500 ml-2 h-4 w-4"
                strokeWidth={3}
              />
            ) : (
              <ChevronsUpDown
                className="text-picton-blue-500 ml-2 h-4 w-4"
                strokeWidth={3}
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ChevronUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ChevronDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
