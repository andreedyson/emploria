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
import { SalaryColumnsProps } from "@/types/admin/salary";
import { EmployeeSalaryHistoryProps } from "@/types/user/salary";
import { EmployeeRole } from "@prisma/client";
import { Banknote, Building2, CheckCircle, Loader, User } from "lucide-react";
import { DepartmentSalaryColumns } from "./department-salary-columns";
import { UserSalaryColumns } from "./user-salary-columns";

type SalaryHistoryCardProps = {
  employeeRole?: EmployeeRole;
  salaries: EmployeeSalaryHistoryProps[];
  departmentSalaries: SalaryColumnsProps[];
};

function SalaryHistoryCard({
  employeeRole,
  salaries,
  departmentSalaries,
}: SalaryHistoryCardProps) {
  const personalFilterConfig = [
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

  const departmentFilterConfig = [
    {
      title: "Employee",
      key: "name",
      options: Array.from(
        new Map(
          salaries.map((item) => [
            item.employee.user.name ?? "",
            {
              label: item.employee.user.name ?? "",
              value: item.employee.user.name ?? "",
            },
          ]),
        ).values(),
      ),
      toggleIcon: User,
    },
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
    <Card className="bg-background space-y-3 rounded-lg border-2">
      {employeeRole === "STAFF" && (
        <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <CardTitle className="flex items-center gap-2">
              <Banknote className="size-6 md:size-8" />
              Your Salaries
            </CardTitle>
            <CardDescription>
              View a summary of monthly salary records, including payment status
              and amounts.
            </CardDescription>
          </div>
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
                  title="Personal Attendances"
                >
                  <User size={20} />
                </TabsTrigger>
                <TabsTrigger
                  value="department"
                  className="w-full"
                  title="Department Salaries"
                >
                  <Building2 size={20} />
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="personal" className="grid grid-cols-1 gap-4">
              <div className="text-sm">
                <h3 className="font-semibold">Personal Salaries</h3>
                <div className="text-muted-foreground">
                  Your personal salaries history.
                </div>
              </div>
              <DataTable
                columns={UserSalaryColumns}
                data={salaries}
                searchEnabled={false}
                columnFilter="name"
                filters={(table) => (
                  <>
                    {personalFilterConfig.map((config) => (
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
                <h3 className="font-semibold">Department Salaries</h3>
                <div className="text-muted-foreground">
                  Your department employee salaries history.
                </div>
              </div>
              <DataTable
                columns={DepartmentSalaryColumns}
                data={departmentSalaries}
                searchEnabled={false}
                columnFilter="name"
                filters={(table) => (
                  <>
                    {departmentFilterConfig.map((config) => (
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
            columns={UserSalaryColumns}
            data={salaries}
            searchEnabled={false}
            columnFilter="name"
            filters={(table) => (
              <>
                {personalFilterConfig.map((config) => (
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

export default SalaryHistoryCard;
