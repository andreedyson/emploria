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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceColumnsProps } from "@/types/admin/attendance";
import { Attendance, EmployeeRole } from "@prisma/client";
import { BadgeCheck, Ban, Building2, Clock, Plane, User } from "lucide-react";
import { DepartmentAttendanceColumns } from "./department-attendance-columns";
import { UserAttendanceColumns } from "./user-attendance-columns";

type AttendanceHistoryCardProps = {
  employeeRole?: EmployeeRole;
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
  employeeRole,
  attendance,
  departmentAttendances,
}: AttendanceHistoryCardProps) {
  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Attendance History
        </CardTitle>
        <CardDescription>
          Detailed look at past attendance records.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {employeeRole === "MANAGER" ? (
          <Tabs defaultValue="personal" className="h-full w-full">
            <div className="w-full">
              <TabsList className="w-[160px]">
                <TabsTrigger
                  value="personal"
                  className="w-full"
                  title="Personal Attendances"
                >
                  <User size={20} />
                </TabsTrigger>
                <TabsTrigger
                  value="department"
                  className="w-full"
                  title="Department Attendances"
                >
                  <Building2 size={20} />
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="personal"
              className="mt-2 grid grid-cols-1 gap-4"
            >
              <div className="text-sm">
                <h3 className="font-semibold">Personal Attendances</h3>
                <div className="text-muted-foreground">
                  Your personal attendance history.
                </div>
              </div>
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
            </TabsContent>
            <TabsContent
              value="department"
              className="mt-2 grid h-full grid-cols-1 gap-4"
            >
              <div className="text-sm">
                <h3 className="font-semibold">Department Attendances</h3>
                <div className="text-muted-foreground">
                  Your department employee attendances history.
                </div>
              </div>
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
            </TabsContent>
          </Tabs>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}

export default AttendanceHistoryCard;
