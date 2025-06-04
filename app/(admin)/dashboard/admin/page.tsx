import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SuperAdminCompanyStatsCard from "@/components/admin/stats-card";
import {
  getEmployeesPerDepartments,
  getSuperAdminCompanyStatsCardData,
} from "@/lib/data/admin/dashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { User } from "lucide-react";

async function SuperAdminCompanyPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId;

  const statsCardData = await getSuperAdminCompanyStatsCardData(
    companyId as string,
  );
  const departments = await getEmployeesPerDepartments(companyId as string);
  const total = departments.reduce((sum, d) => sum + d.count, 0);

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
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Employee Allocation
            </CardTitle>
            <CardDescription>Total employees per department</CardDescription>
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

            {/* Two-column legend */}
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
      </div>
      {/* Top Employees List */}
      {/* Gender Diversity Chart */}
      {/* Salaries Paid per Month Chart */}
      {/* Employee Activity */}
    </section>
  );
}

export default SuperAdminCompanyPage;
