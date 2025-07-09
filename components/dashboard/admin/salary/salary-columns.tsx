"use client";

import SalaryStatusBadge from "@/components/badges/salary-status-badge";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Button } from "@/components/ui/button";
import { BASE_URL, months } from "@/constants";
import { getImageUrl } from "@/lib/supabase";
import { convertRupiah } from "@/lib/utils";
import { SalaryColumnsProps } from "@/types/admin/salary";
import { ColumnDef } from "@tanstack/react-table";
import {
  Banknote,
  Calendar1,
  CalendarArrowUp,
  DollarSign,
  Download,
  User,
} from "lucide-react";
import Image from "next/image";
import { ConfirmPaidDialog } from "./confirm-paid-dialog";
import EditSalaryDialog from "./edit-salary-dialog";
import ViewSalaryDialog from "./view-salary-dialog";

export const SalaryColumns: ColumnDef<SalaryColumnsProps>[] = [
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
              className="size-8 rounded-full object-cover"
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
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    cell: ({ row }) => {
      const salary = row.original;

      return <SalaryStatusBadge status={salary.status} />;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const salary = row.original;
      const isPaid = salary.status === "PAID";

      return (
        <div className="flex items-center gap-1">
          <ViewSalaryDialog salaryData={salary} />
          <EditSalaryDialog salaryData={salary} companyId={salary.company.id} />
          <ConfirmPaidDialog
            salaryId={salary.id}
            salaryStatus={salary.status}
          />
          <Button variant="ghost" size="icon" disabled={!isPaid}>
            <a
              href={
                isPaid
                  ? `${BASE_URL}/dashboard/admin/salary/${salary.id}`
                  : undefined
              }
              className={`hover:bg-muted flex h-8 w-8 items-center justify-center rounded ${!isPaid ? "pointer-events-none opacity-50" : ""} `}
              aria-disabled={!isPaid}
            >
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      );
    },
  },
];
