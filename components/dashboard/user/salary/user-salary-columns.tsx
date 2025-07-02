"use client";

import SalaryStatusBadge from "@/components/badges/salary-status-badge";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Button } from "@/components/ui/button";
import { BASE_URL, months } from "@/constants";
import { convertRupiah } from "@/lib/utils";
import { Salary } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Calendar1,
  CalendarArrowUp,
  CalendarPlus,
  DollarSign,
  Download,
} from "lucide-react";

export const UserSalaryColumns: ColumnDef<Salary>[] = [
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
      const monthLabel = months.find(
        (month) => salary.month === month.value,
      )?.label;

      return <div className="font-semibold">{monthLabel ?? "-"}</div>;
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
        <DataTableColumnHeader
          column={column}
          title="Bonus"
          icon={BanknoteArrowUp}
        />
      );
    },
    cell: ({ row }) => {
      const Salary = row.original;
      return <div>{Salary.total ? convertRupiah(Salary.bonus) : "-"}</div>;
    },
  },
  {
    accessorKey: "attendanceBonus",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Att. Bonus"
          icon={CalendarPlus}
        />
      );
    },
    cell: ({ row }) => {
      const Salary = row.original;
      return (
        <div>{Salary.total ? convertRupiah(Salary.attendanceBonus) : "-"}</div>
      );
    },
  },
  {
    accessorKey: "deduction",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Deduction"
          icon={BanknoteArrowDown}
        />
      );
    },
    cell: ({ row }) => {
      const Salary = row.original;
      return <div>{Salary.total ? convertRupiah(Salary.deduction) : "-"}</div>;
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
      return (
        <div className="font-semibold">
          {Salary.total ? convertRupiah(Salary.total) : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const salary = row.original;

      return <SalaryStatusBadge status={salary.status} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const salary = row.original;
      const isPaid = salary.status === "PAID";

      return (
        <Button variant="ghost" size="icon" disabled={!isPaid}>
          <a
            href={
              isPaid
                ? `${BASE_URL}/dashboard/user/salary/${salary.id}`
                : undefined
            }
            className={`hover:bg-muted flex h-8 w-8 items-center justify-center rounded ${!isPaid ? "pointer-events-none opacity-50" : ""} `}
            aria-disabled={!isPaid}
          >
            <Download className="h-4 w-4" />
          </a>
        </Button>
      );
    },
  },
];
