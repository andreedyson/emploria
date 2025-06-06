import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SuperAdminCompanyStatsCard from "@/components/admin/stats-card";
import {
  getEmployeesPerDepartments,
  getSuperAdminCompanyStatsCardData,
  getTopEmployeesList,
} from "@/lib/data/admin/dashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import TopEmployeeListItem from "@/components/admin/dashboard/top-employee-list";
import { GenderDiversityCharts } from "@/components/charts/gender-diversity-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { SalariesPaidPerMonthCharts } from "@/components/charts/salaries-paid-per-month-charts";

async function SuperAdminCompanyPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId ?? "";

  const statsCardData = await getSuperAdminCompanyStatsCardData(
    companyId as string,
  );
  const departments = await getEmployeesPerDepartments(companyId);
  const total = departments.reduce((sum, d) => sum + d.count, 0);
  const topEmployees = await getTopEmployeesList(companyId);

  return (
    <section className="space-y-4">
      {/* Company Admin Dashboard Header */}
      <div>
        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
          Welcome back, {session.user.name} 👋
        </h1>
        <p className="text-muted-foreground">
          Your central hub for system administration and company analytics.
        </p>
      </div>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCardData.map((data) => (
          <SuperAdminCompanyStatsCard
            key={data.title}
            name={data.name}
            icon={data.icon}
            total={data.total}
            textColor={data.textColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Department Overview */}
        <Card className="col-span-1 w-full lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Employee Allocation
              </CardTitle>

              <CardDescription>Total employees per department</CardDescription>
            </div>
            <Link
              href={"/dashboard/admin/department"}
              className="hover:text-picton-blue-500 flex items-center gap-1 text-xs duration-200 md:text-sm"
            >
              See All
              <ChevronRight size={12} />
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <User size={32} />
              <p>
                <span className="text-2xl font-bold md:text-3xl">{total}</span>{" "}
                Employees
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex h-2 w-full overflow-hidden rounded-md bg-gray-200">
              {departments.map((dept) => {
                // compute each slice as a percentage of total
                const widthPercent = total > 0 ? (dept.count / total) * 100 : 0;
                return (
                  <div
                    key={dept.name}
                    className="h-full"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: dept.color || "#000",
                    }}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-6">
              {departments.map((dept) => {
                const percentage =
                  total > 0 ? ((dept.count / total) * 100).toFixed(0) : "0";
                return (
                  <div
                    key={dept.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      {/* colored dot */}
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: dept.color || "#000" }}
                      />
                      <div>
                        <p className="line-clamp-1 text-sm font-medium">
                          {dept.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {dept.count}{" "}
                          {dept.count === 1 ? "Person" : "People"}{" "}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Employees List */}
        <Card className="col-span-1 w-full lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Top Employees
              </CardTitle>
              <CardDescription>
                Employees with the most attendances this month
              </CardDescription>
            </div>
            <Link
              href={"/dashboard/admin/employee"}
              className="hover:text-picton-blue-500 flex items-center gap-1 text-xs duration-200 md:text-sm"
            >
              See All
              <ChevronRight size={12} />
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            {topEmployees.map((employee, index) => (
              <TopEmployeeListItem
                key={employee.id}
                number={index + 1}
                employee={employee}
              />
            ))}
          </CardContent>
        </Card>

        {/* Gender Diversity Chart */}
        <Card className="col-span-1 w-full">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Gender Diversity
            </CardTitle>
            <CardDescription>Total employees by gender</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <GenderDiversityCharts companyId={companyId as string} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Salaries Paid per Month Chart */}
        <Card className="col-span-1 w-full">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Salaries Paid
            </CardTitle>
            <CardDescription>
              Total salaries paid per month for the past 6 months (in million)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <SalariesPaidPerMonthCharts companyId={companyId} />
          </CardContent>
        </Card>

        {/* Employee Activity */}
        <Card className="col-span-1 w-full">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Activities</CardTitle>
            <CardDescription>
              Latest activities by users of this company
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4"></CardContent>
        </Card>
      </div>
    </section>
  );
}

export default SuperAdminCompanyPage;
