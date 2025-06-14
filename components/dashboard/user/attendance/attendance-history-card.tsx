"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { UserAttendanceColumns } from "./user-attendance-columns";
import { Attendance } from "@prisma/client";
import { DataTableFilter } from "@/components/tables/data-table-filter";
import { BadgeCheck, Ban, Clock, Plane } from "lucide-react";

type AttendanceHistoryCardProps = {
  attendance: Attendance[];
};

const statusOptions = [
  { label: "Present", value: "PRESENT", icon: BadgeCheck },
  { label: "Absent", value: "ABSENT", icon: Ban },
  { label: "Late", value: "LATE", icon: Clock },
  { label: "On Leave", value: "ON_LEAVE", icon: Plane },
];

function AttendanceHistoryCard({ attendance }: AttendanceHistoryCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Attendance History
        </CardTitle>
        <CardDescription>Your attendance history data</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <DataTable
          columns={UserAttendanceColumns}
          data={attendance}
          searchEnabled={false}
          columnFilter="name"
          filters={(table) => (
            <DataTableFilter
              title="Status"
              column={table.getColumn("status")}
              options={statusOptions}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}

export default AttendanceHistoryCard;
