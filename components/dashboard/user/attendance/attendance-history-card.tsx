"use client";

import { DataTableFilter } from "@/components/tables/data-table-filter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { AttendanceColumnsProps } from "@/types/admin/attendance";
import { Attendance } from "@prisma/client";
import { BadgeCheck, Ban, Clock, Plane } from "lucide-react";
import { DepartmentAttendanceColumns } from "./department-attendance-columns";
import { UserAttendanceColumns } from "./user-attendance-columns";

type AttendanceHistoryCardProps = {
  attendance: Attendance[];
  departmentAttendances: AttendanceColumnsProps[];
};

const statusOptions = [
  { label: "Present", value: "PRESENT", icon: BadgeCheck },
  { label: "Absent", value: "ABSENT", icon: Ban },
  { label: "Late", value: "LATE", icon: Clock },
  { label: "On Leave", value: "ON_LEAVE", icon: Plane },
];

function AttendanceHistoryCard({
  attendance,
  departmentAttendances,
}: AttendanceHistoryCardProps) {
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
        <DataTable
          columns={DepartmentAttendanceColumns}
          data={departmentAttendances}
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
