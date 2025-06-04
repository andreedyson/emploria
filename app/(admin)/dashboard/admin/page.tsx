import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SuperAdminCompanyStatsCard from "@/components/admin/stats-card";
import { getSuperAdminCompanyStatsCardData } from "@/lib/data/admin/dashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function SuperAdminCompanyPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId;

  const statsCardData = await getSuperAdminCompanyStatsCardData(
    companyId as string,
  );

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

      {/* Department Overview */}
      {/* Top Employees List */}
      {/* Gender Diversity Chart */}
      {/* Salaries Paid per Month Chart */}
      {/* Employee Activity */}
    </section>
  );
}

export default SuperAdminCompanyPage;
