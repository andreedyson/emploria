"use client";

import { DataTableFilter } from "@/components/tables/data-table-filter";
import { DataTable } from "@/components/ui/data-table";
import { LeaveColumnProps } from "@/types/admin/leave";
import {
  Baby,
  BanknoteX,
  Calendar,
  CheckCircle,
  CircleX,
  Layers,
  Loader,
  Pill,
} from "lucide-react";
import { LeaveColumns } from "./leave-columns";

type LeaveTableProps = {
  leaves: LeaveColumnProps[];
};

function LeaveTable({ leaves }: LeaveTableProps) {
  const filterConfigs = [
    {
      title: "Type",
      key: "leaveType",
      options: [
        { label: "Sick", value: "SICK", icon: Pill },
        { label: "Unpaid", value: "UNPAID", icon: BanknoteX },
        { label: "Annual", value: "ANNUAL", icon: Calendar },
        { label: "Maternity", value: "MATERNITY", icon: Baby },
      ],
      toggleIcon: Layers,
    },
    {
      title: "Status",
      key: "status",
      options: [
        { label: "Pending", value: "PENDING", icon: Loader },
        { label: "Approved", value: "APPROVED", icon: CheckCircle },
        { label: "Rejected", value: "REJECTED", icon: CircleX },
      ],
      toggleIcon: Loader,
    },
  ];
  return (
    <DataTable
      columns={LeaveColumns}
      data={leaves}
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

export default LeaveTable;
