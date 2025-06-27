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
import { LeaveColumnProps } from "@/types/admin/leave";
import { EmployeeRole, Leave } from "@prisma/client";
import {
  Baby,
  BanknoteX,
  Building2,
  Calendar,
  CheckCircle,
  CircleX,
  Layers,
  Loader,
  Pill,
  User,
} from "lucide-react";
import { DepartmentLeaveColumns } from "./department-leave-columns";
import { UserLeaveColumns } from "./user-leave-columns";

type LeaveHistoryCardProps = {
  employeeRole?: EmployeeRole;
  leave: Leave[];
  departmentLeaves: LeaveColumnProps[];
};

function LeaveHistoryCard({
  employeeRole,
  leave,
  departmentLeaves,
}: LeaveHistoryCardProps) {
  const personalFilterConfigs = [
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

  const departmentFilterConfigs = [
    {
      title: "Employee",
      key: "name",
      options: Array.from(
        new Map(
          departmentLeaves.map((item) => [
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
    <Card className="col-span-1 w-full">
      {employeeRole === "STAFF" && (
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Leave History</CardTitle>
          <CardDescription>
            A detailed log of all your past leave requests, including dates,
            types, and approval status.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {employeeRole === "MANAGER" ? (
          <Tabs defaultValue="personal" className="h-full w-full">
            <div className="w-full">
              <TabsList className="w-[160px]">
                <TabsTrigger
                  value="personal"
                  className="w-full"
                  title="Personal Leaves"
                >
                  <User size={20} />
                </TabsTrigger>
                <TabsTrigger
                  value="department"
                  className="w-full"
                  title="Department Leaves"
                >
                  <Building2 size={20} />
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="personal" className="grid grid-cols-1 gap-4">
              <div className="text-sm">
                <h3 className="font-semibold">Personal Leaves</h3>
                <div className="text-muted-foreground">
                  Your personal leaves history.
                </div>
              </div>
              <DataTable
                columns={UserLeaveColumns}
                data={leave}
                searchEnabled={false}
                filters={(table) => (
                  <>
                    {personalFilterConfigs.map((config) => (
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
            </TabsContent>
            <TabsContent
              value="department"
              className="grid h-full grid-cols-1 gap-4"
            >
              <div className="text-sm">
                <h3 className="font-semibold">Department Leaves</h3>
                <div className="text-muted-foreground">
                  Your department employee leaves history.
                </div>
              </div>
              <DataTable
                columns={DepartmentLeaveColumns}
                data={departmentLeaves}
                searchEnabled={false}
                filters={(table) => (
                  <>
                    {departmentFilterConfigs.map((config) => (
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
            </TabsContent>
          </Tabs>
        ) : (
          <DataTable
            columns={UserLeaveColumns}
            data={leave}
            searchEnabled={false}
            filters={(table) => (
              <>
                {personalFilterConfigs.map((config) => (
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
        )}
      </CardContent>
    </Card>
  );
}

export default LeaveHistoryCard;
