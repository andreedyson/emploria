"use client";

import AttendanceStatusBadge from "@/components/badges/attendance-status-badge";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import {
  convertToGmt7TimeString,
  formatDate,
  getDurationCompact,
} from "@/lib/utils";
import { Attendance } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock5, Clock9, Hourglass } from "lucide-react";

export const UserAttendanceColumns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "date",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Date" icon={Calendar} />
      );
    },
    cell: ({ row }) => {
      const attendance = row.original;
      return <div>{attendance.date ? formatDate(attendance.date) : "-"}</div>;
    },
  },
  {
    accessorKey: "checkIn",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Check In" icon={Clock9} />
      );
    },
    cell: ({ row }) => {
      const attendance = row.original;
      return (
        <div>
          {attendance.checkIn
            ? convertToGmt7TimeString(attendance.checkIn)
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "checkOut",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Check Out"
          icon={Clock5}
        />
      );
    },
    cell: ({ row }) => {
      const attendance = row.original;
      return (
        <div>
          {attendance.checkOut
            ? convertToGmt7TimeString(attendance.checkOut)
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Duration"
          icon={Hourglass}
        />
      );
    },
    cell: ({ row }) => {
      const attendance = row.original;
      return (
        <div>
          {attendance.checkIn && attendance.checkOut
            ? getDurationCompact(attendance.checkIn, attendance.checkOut)
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    cell: ({ row }) => {
      const attendance = row.original;

      return <AttendanceStatusBadge status={attendance.status} />;
    },
  },
];
