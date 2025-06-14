"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { EmployeeColumns } from "./employee-columns";
import { EmployeeColumnProps } from "@/types/admin/employee";
import { Briefcase, MarsIcon, MarsStroke } from "lucide-react";
import { DataTableFilter } from "@/components/tables/data-table-filter";

type EmployeeTableProps = {
  employees: EmployeeColumnProps[];
};

function EmployeeTable({ employees }: EmployeeTableProps) {
  const filterConfigs = [
    {
      title: "Gender",
      key: "gender",
      options: [
        { label: "Male", value: "MALE", icon: MarsIcon },
        { label: "Female", value: "FEMALE", icon: MarsStroke },
      ],
    },
    {
      title: "Role",
      key: "employeeRole",
      options: [
        { label: "Manager", value: "MANAGER" },
        { label: "Staff", value: "STAFF" },
      ],
      toggleIcon: Briefcase,
    },
  ];
  return (
    <DataTable
      columns={EmployeeColumns}
      data={employees}
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

export default EmployeeTable;
