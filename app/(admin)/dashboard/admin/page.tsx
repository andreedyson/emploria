import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SuperAdminCompanyStatsCard from "@/components/admin/stats-card";
import {
  getEmployeesPerDepartments,
  getSuperAdminCompanyStatsCardData,
  getTopEmployeesList,
} from "@/lib/data/admin/dashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import CompanyAdminActivityCard from "@/components/admin/dashboard/company-admin-activity-card";
import DepartmentOverviewCard from "@/components/admin/dashboard/department-overview-card";
import GenderDiversityCard from "@/components/admin/dashboard/gender-diversity-card";
import SalariesPaidPerMonthCard from "@/components/admin/dashboard/salaries-paid-per-month-card";
import TopEmployeesCard from "@/components/admin/dashboard/top-employees-card";

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

      {/* 2nd Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <DepartmentOverviewCard departments={departments} />
        <TopEmployeesCard topEmployees={topEmployees} />
        <GenderDiversityCard companyId={companyId} />
      </div>

      {/* 3rd Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SalariesPaidPerMonthCard companyId={companyId} />
        <CompanyAdminActivityCard />
      </div>
    </section>
  );
}

export default SuperAdminCompanyPage;
