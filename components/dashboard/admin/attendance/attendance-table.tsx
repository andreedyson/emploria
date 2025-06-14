"use client";

import { DataTableFilter } from "@/components/tables/data-table-filter";
import { DataTable } from "@/components/ui/data-table";
import { AttendanceColumnsProps } from "@/types/admin/attendance";
import { Building2, User } from "lucide-react";
import { AttendanceColumns } from "./attendance-columns";

type AttendanceTableProps = {
  attendances: AttendanceColumnsProps[];
};

function AttendanceTable({ attendances }: AttendanceTableProps) {
  const filterConfigs = [
    {
      title: "Employee",
      key: "name",
      options: Array.from(
        new Map(
          attendances.map((item) => [
            item.employee.name ?? "",
            {
              label: item.employee.name ?? "",
              value: item.employee.name ?? "",
            },
          ]),
        ).values(),
      ),
      toggleIcon: User,
    },
    {
      title: "Department",
      key: "department",
      options: Array.from(
        new Map(
          attendances.map((item) => [
            item.department.name ?? "",
            {
              label: item.department.name ?? "",
              value: item.department.name ?? "",
            },
          ]),
        ).values(),
      ),
      toggleIcon: Building2,
    },
  ];

  return (
    <DataTable
      columns={AttendanceColumns}
      data={attendances}
      filters={(table) => (
        <>
          {filterConfigs.map((config) => (
            <DataTableFilter
              key={config.key}
              title={config.title}
              column={table.getColumn(config.key)}
              options={config.options}
              toggleIcon={config.toggleIcon}
            />
          ))}
        </>
      )}
    />
  );
}

export default AttendanceTable;
