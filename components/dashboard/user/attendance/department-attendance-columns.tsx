"use client";

import AttendanceStatusBadge from "@/components/badges/attendance-status-badge";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { getImageUrl } from "@/lib/supabase";
import {
  convertToGmt7TimeString,
  formatDate,
  getDurationCompact,
} from "@/lib/utils";
import { AttendanceColumnsProps } from "@/types/admin/attendance";
import { ColumnDef } from "@tanstack/react-table";
import {
  Building,
  Calendar,
  Clock5,
  Clock9,
  Hourglass,
  User,
} from "lucide-react";
import Image from "next/image";

export const DepartmentAttendanceColumns: ColumnDef<AttendanceColumnsProps>[] =
  [
    {
      id: "name",
      accessorKey: "employee.name",
      enableSorting: true,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      header: ({ column }) => {
        return (
          <DataTableColumnHeader title="Employee" column={column} icon={User} />
        );
      },
      cell: ({ row }) => {
        const attendance = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full">
              <Image
                src={
                  getImageUrl(attendance.employee.image as string, "users") ||
                  "/assets/image-placeholder.svg"
                }
                alt={attendance.employee.name}
                width={80}
                height={80}
                className="size-8 rounded-full object-contain"
              />
            </div>
            <p>{attendance.employee.name}</p>
          </div>
        );
      },
    },
    {
      id: "department",
      accessorFn: (row) => row.department?.name ?? "",
      enableSorting: true,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      header: () => {
        return (
          <div className="flex items-center gap-1">
            <Building className="text-muted-foreground size-4" />
            <p>Department</p>
          </div>
        );
      },
      cell: ({ row }) => {
        const attendance = row.original;

        return (
          <div className="font-semibold">
            {attendance.department?.name ?? "-"}
          </div>
        );
      },
    },
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
          <DataTableColumnHeader
            column={column}
            title="Check In"
            icon={Clock9}
          />
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
