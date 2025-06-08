import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserStatsCard from "@/components/dashboard/user/dashboard/user-stats-card";
import { getUserStatsCardData } from "@/lib/data/user/dashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const statsCardData = await getUserStatsCardData(session.user.id);

  return (
    <section className="space-y-4">
      {/* User Dashboard Header */}
      <div>
        <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
          Welcome back, {session.user.name} 👋
        </h1>
        <p className="text-muted-foreground">
          Manage your data and analyze your performance from one place.
        </p>
      </div>

      <UserStatsCard stats={statsCardData} />
    </section>
  );
}

export default UserDashboardPage;
