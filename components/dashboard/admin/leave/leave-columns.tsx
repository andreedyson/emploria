"use client";

import LeaveStatusBadge from "@/components/badges/leave-status-badge";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { getImageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { LeaveColumnProps } from "@/types/admin/leave";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Layers, User } from "lucide-react";
import Image from "next/image";
import ApproveRejectLeaveDialog from "./approve-reject-leave-dialog";
import DeleteLeaveDialog from "./delete-leave-dialog";
import ViewLeaveDialog from "./view-leave-dialog";

export const LeaveColumns: ColumnDef<LeaveColumnProps>[] = [
  {
    id: "name",
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
              className="size-8 rounded-full object-cover"
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const leave = row.original;
      const status = leave.status;

      return <LeaveStatusBadge status={status} />;
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
          <ViewLeaveDialog leaveData={leave} />
          <ApproveRejectLeaveDialog
            leaveId={leave.id}
            currentStatus={leave.status}
          />
          <DeleteLeaveDialog leaveData={leave} />
        </div>
      );
    },
  },
];
