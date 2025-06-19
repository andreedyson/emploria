"use client";

import { DataTableFilter } from "@/components/tables/data-table-filter";
import { DataTable } from "@/components/ui/data-table";
import { SalaryColumnsProps } from "@/types/admin/salary";
import { CheckCircle, Loader } from "lucide-react";
import { SalaryColumns } from "./salary-columns";

type SalaryTableProps = {
  salaries: SalaryColumnsProps[];
};

function SalaryTable({ salaries }: SalaryTableProps) {
  const filterConfigs = [
    {
      title: "Status",
      key: "status",
      options: [
        { label: "Paid", value: "PAID", icon: CheckCircle },
        { label: "Unpaid", value: "UNPAID", icon: Loader },
      ],
      toggleIcon: Loader,
    },
  ];
  return (
    <DataTable
      columns={SalaryColumns}
      data={salaries}
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

export default SalaryTable;
