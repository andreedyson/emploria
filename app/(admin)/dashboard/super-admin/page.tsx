import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import StatsCard from "@/components/super-admin/stats-card";
import { getStatsCardData } from "@/lib/data/super-admin/dashboard";
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

  const statsCardData = await getStatsCardData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold md:text-xl">
          Welcome Back, {session.user.name} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          Here&apos;s an overview of the Emploria applications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {statsCardData.map((data, i) => (
          <StatsCard
            key={i}
            name={data.name}
            total={data.total}
            icon={data.icon}
            bgGradient={data.bgGradient}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
