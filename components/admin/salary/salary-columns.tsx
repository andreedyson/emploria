"use client";

import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/supabase";
import { convertRupiah } from "@/lib/utils";
import { SalaryColumnsProps } from "@/types/admin/salary";
import { ColumnDef } from "@tanstack/react-table";
import {
  Banknote,
  BanknoteX,
  Calendar1,
  CalendarArrowUp,
  CalendarCheck,
  CheckCircle,
  DollarSign,
  HandCoins,
  Loader,
  User,
} from "lucide-react";
import Image from "next/image";

export const SalaryColumns: ColumnDef<SalaryColumnsProps>[] = [
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
    accessorKey: "Month",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Month"
          icon={CalendarArrowUp}
        />
      );
    },
    cell: ({ row }) => {
      const salary = row.original;

      return <div className="font-semibold">{salary.month ?? "-"}</div>;
    },
  },
  {
    accessorKey: "Year",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Year" icon={Calendar1} />
      );
    },
    cell: ({ row }) => {
      const salary = row.original;

      return <div className="font-semibold">{salary.year ?? "-"}</div>;
    },
  },
  {
    accessorKey: "baseSalary",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Base Salary"
          icon={DollarSign}
        />
      );
    },
    cell: ({ row }) => {
      const Salary = row.original;
      return (
        <div>{Salary.baseSalary ? convertRupiah(Salary.baseSalary) : "-"}</div>
      );
    },
  },
  {
    accessorKey: "bonus",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Bonus" icon={HandCoins} />
      );
    },
    cell: ({ row }) => {
      const Salary = row.original;
      return <div>{Salary.bonus ? convertRupiah(Salary.bonus) : "-"}</div>;
    },
  },
  {
    accessorKey: "deduction",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="deduction"
          icon={BanknoteX}
        />
      );
    },
    cell: ({ row }) => {
      const Salary = row.original;
      return (
        <div>{Salary.deduction ? convertRupiah(Salary.deduction) : "-"}</div>
      );
    },
  },
  {
    accessorKey: "attendanceBonus",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Attendance Bonus"
          icon={CalendarCheck}
        />
      );
    },
    cell: ({ row }) => {
      const Salary = row.original;
      return (
        <div>
          {Salary.attendanceBonus ? convertRupiah(Salary.attendanceBonus) : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Total" icon={Banknote} />
      );
    },
    cell: ({ row }) => {
      const Salary = row.original;
      return <div>{Salary.total ? convertRupiah(Salary.total) : "-"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const salary = row.original;
      const badgeStyle =
        salary.status === "UNPAID"
          ? "bg-orange-300/40 text-orange-500 border-orange-200"
          : salary.status === "PAID"
            ? "bg-green-300/40 text-green-500 border-green-200"
            : "bg-gray-300/40 text-gray-500 border-gray-200";

      return (
        <Badge
          className={`${badgeStyle} rounded-full border-2 px-3 font-semibold`}
        >
          {salary.status === "UNPAID" ? (
            <Loader size={12} />
          ) : salary.status === "PAID" ? (
            <CheckCircle size={12} />
          ) : (
            ""
          )}
          {salary.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: () => {
      // const attendance = row.original;
      return <div className="flex items-center gap-1"></div>;
    },
  },
];
