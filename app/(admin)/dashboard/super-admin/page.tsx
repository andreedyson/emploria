import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import RecentlyAddedCompaniesUserscard from "@/components/dashboard/super-admin/dashboard/recently-added-companies-users-card";
import UserPerCompanycard from "@/components/dashboard/super-admin/dashboard/user-per-company-card";
import StatsCard from "@/components/dashboard/super-admin/stats-card";
import {
  getRecentCompanies,
  getRecentUsers,
  getStatsCardData,
} from "@/lib/data/super-admin/dashboard";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
};

async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const [statsCardData, recentlyAddedUsers, recentlyAddedCompanies] =
    await Promise.all([
      getStatsCardData(),
      getRecentUsers(),
      getRecentCompanies(),
    ]);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-lg font-semibold md:text-xl">
          Welcome Back, {session.user.name} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          Here&apos;s an overview of the Emploria applications.
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {statsCardData.map((data, i) => (
          <StatsCard
            key={i}
            name={data.name}
            total={data.total}
            icon={data.icon}
            bgColor={data.bgColor}
          />
        ))}
      </div>

      <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-2">
        {/* User Per Company Card */}
        <UserPerCompanycard />

        {/* Recently Added Card */}
        <RecentlyAddedCompaniesUserscard
          recentlyAddedUsers={recentlyAddedUsers}
          recentlyAddedCompanies={recentlyAddedCompanies}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
