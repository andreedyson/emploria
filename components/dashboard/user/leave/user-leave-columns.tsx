"use client";

import LeaveStatusBadge from "@/components/badges/leave-status-badge";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { formatDate } from "@/lib/utils";
import { Leave } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Layers, Text } from "lucide-react";
import UserViewLeaveDialog from "./user-view-leave-dialog";
import UserCancelLeaveDialog from "./user-cancel-leave-dialog";
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
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
    size: 200,
    header: () => {
      return (
        <div className="flex items-center gap-1">
          <Text className="text-muted-foreground h-4 w-4" />
          <span>Reason</span>
        </div>
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
  {
    id: "actions",
    cell: ({ row }) => {
      const leave = row.original;

      return (
        <div className="flex items-center gap-2">
          <UserViewLeaveDialog leave={leave} />
          <UserCancelLeaveDialog leave={leave} />
        </div>
      );
    },
  },
];
