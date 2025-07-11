"use client";

import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { EmployeeColumnProps } from "@/types/admin/employee";
import { ColumnDef } from "@tanstack/react-table";
import { Briefcase, Calendar, LetterText, Mail, Mars } from "lucide-react";
import Image from "next/image";
import DeleteEmployeeDialog from "./delete-employee-dialog";
import EditEmployeeDialog from "./edit-employee-dialog";
import ViewEmployeeDialog from "./view-employee-dialog";

export const EmployeeColumns: ColumnDef<EmployeeColumnProps>[] = [
  {
    accessorKey: "name",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Name" icon={LetterText} />
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-1">
          <div className="size-8 rounded-full">
            <Image
              src={
                getImageUrl(user.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={user.name}
              width={80}
              height={80}
              className="size-8 rounded-full object-cover"
            />
          </div>
          <p>{user.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Email" icon={Mail} />
      );
    },
  },
  {
    accessorKey: "gender",
    enableSorting: true,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Gender" icon={Mars} />
      );
    },
  },
  {
    id: "department",
    accessorKey: "department.name",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Department"
          icon={LetterText}
        />
      );
    },
    cell: ({ row }) => {
      const employee = row.original;

      return <div className="font-semibold">{employee.department?.name}</div>;
    },
  },
  {
    accessorKey: "employeeRole",
    enableSorting: true,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Role" icon={Briefcase} />
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const company = row.original;
      const badgeStyle = company.isActive
        ? "bg-green-400/30 text-green-500 border-green-500"
        : "bg-gray-400/30 text-gray-500 border-gray-500 dark:text-white";

      return (
        <Badge
          className={`${badgeStyle} rounded-full border-2 px-3 font-semibold`}
        >
          {company.isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "joinDate",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Joined" icon={Calendar} />
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return <div>{formatDate(new Date(user.joinDate))}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center gap-1">
          <ViewEmployeeDialog employeeData={employee} />
          <EditEmployeeDialog employeeData={employee} />
          <DeleteEmployeeDialog employeeData={employee} />
        </div>
      );
    },
  },
];
