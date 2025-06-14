"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Leave } from "@prisma/client";
import { UserLeaveColumns } from "./user-leave-columns";
import { DataTableFilter } from "@/components/tables/data-table-filter";
import {
  Baby,
  BanknoteX,
  Calendar,
  CheckCircle,
  CircleX,
  Pill,
} from "lucide-react";

type LeaveHistoryCardProps = {
  leave: Leave[];
};

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
  },
  {
    title: "Status",
    key: "status",
    options: [
      { label: "Approved", value: "APPROVED", icon: CheckCircle },
      { label: "Rejected", value: "REJECTED", icon: CircleX },
    ],
  },
];

function LeaveHistoryCard({ leave }: LeaveHistoryCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Leave History</CardTitle>
        <CardDescription>
          A detailed log of all your past leave requests, including dates,
          types, and approval status.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <DataTable
          columns={UserLeaveColumns}
          data={leave}
          searchEnabled={false}
          filters={(table) => (
            <>
              {filterConfigs.map((config) => (
                <DataTableFilter
                  key={config.key}
                  title={config.title}
                  column={table.getColumn(config.key)}
                  options={config.options}
                />
              ))}
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}

export default LeaveHistoryCard;
