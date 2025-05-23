"use client";

import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { formatDate } from "@/lib/utils";
import { Department } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, IdCard, LetterText } from "lucide-react";
import EditDepartmentDialog from "./edit-department-dialog";

export const DepartmentColumns: ColumnDef<Department>[] = [
  {
    accessorKey: "id",
    enableSorting: true,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" icon={IdCard} />;
    },
  },
  {
    accessorKey: "name",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Name" icon={LetterText} />
      );
    },
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Created At"
          icon={Calendar}
        />
      );
    },
    cell: ({ row }) => {
      const department = row.original;
      return <div>{formatDate(department.createdAt)}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const department = row.original;
      return (
        <div className="flex items-center gap-1">
          <EditDepartmentDialog
            departmentData={department}
            companyId={department.companyId}
          />
        </div>
      );
    },
  },
];
