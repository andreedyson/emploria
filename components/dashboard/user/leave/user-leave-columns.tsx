"use client";

import LeaveStatusBadge from "@/components/badges/leave-status-badge";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { formatDate } from "@/lib/utils";
import { Leave } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Layers, Text } from "lucide-react";

export const UserLeaveColumns: ColumnDef<Leave>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const leave = row.original;
      const status = leave.status;

      return <LeaveStatusBadge status={status} />;
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
    accessorKey: "reason",
    enableSorting: true,
    size: 200,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Reason" icon={Text} />
      );
    },
    cell: ({ row }) => {
      const leave = row.original;

      return (
        <div className="max-w-[300px] truncate" title={leave.reason ?? "-"}>
          {leave.reason ?? "-"}
        </div>
      );
    },
  },
];
