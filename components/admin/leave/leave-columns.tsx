"use client";

import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { LeaveColumnProps } from "@/types/admin/leave";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Layers, User } from "lucide-react";
import Image from "next/image";
import EditLeaveDialog from "./edit-leave-dialog";

export const LeaveColumns: ColumnDef<LeaveColumnProps>[] = [
  {
    id: "employee",
    accessorKey: "employee.name",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader title="Employee" column={column} icon={User} />
      );
    },
    cell: ({ row }) => {
      const leave = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full">
            <Image
              src={
                getImageUrl(leave.employee.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={leave.employee.name}
              width={80}
              height={80}
              className="size-8 rounded-full object-contain"
            />
          </div>
          <p>{leave.employee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "leaveType",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Type" icon={Layers} />
      );
    },
    cell: ({ row }) => {
      const leave = row.original;

      return <div className="font-semibold">{leave.leaveType ?? "-"}</div>;
    },
  },
  {
    accessorKey: "startDate",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Start Date"
          icon={Calendar}
        />
      );
    },
    cell: ({ row }) => {
      const leave = row.original;
      return <div>{leave.startDate ? formatDate(leave.startDate) : "-"}</div>;
    },
  },
  {
    accessorKey: "endDate",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="End Date"
          icon={Calendar}
        />
      );
    },
    cell: ({ row }) => {
      const leave = row.original;
      return <div>{leave.endDate ? formatDate(leave.endDate) : "-"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const leave = row.original;
      const status = leave.status;
      const badgeStyle =
        status === "PENDING"
          ? "text-orange-600 bg-orange-300/30 border-orange-400"
          : status === "APPROVED"
            ? "text-green-600 bg-green-300/30 border-green-400"
            : status === "REJECTED"
              ? "text-red-600 bg-red-300/30 border-red-400"
              : "text-gray-500 bg-gray-300/30 border-gray-400";

      return (
        <Badge
          className={`${badgeStyle} rounded-full border-2 px-3 font-semibold`}
        >
          {status.replace(
            /^([A-Z])([A-Z]*)$/,
            (match, firstLetter, restOfWord) => {
              return firstLetter + restOfWord.toLowerCase();
            },
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const leave = row.original;
      return (
        <div className="flex items-center gap-1">
          <EditLeaveDialog companyId={leave.company.id} leaveData={leave} />
        </div>
      );
    },
  },
];
