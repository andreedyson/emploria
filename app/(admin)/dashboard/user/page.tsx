import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AttendanceButton from "@/components/dashboard/user/attendance/attendance-button";
import SalariesGrowthCard from "@/components/dashboard/user/dashboard/salaries-growth-card";
import UserActivityCard from "@/components/dashboard/user/dashboard/user-activity-card";
import UserStatsCard from "@/components/dashboard/user/dashboard/user-stats-card";
import { Separator } from "@/components/ui/separator";
import { getActivitiesByUserId } from "@/lib/data/user/activity";
import {
  getTodayAttendanceStatus,
  getUserStatsCardData,
} from "@/lib/data/user/dashboard";
import { convertToGmt7TimeString } from "@/lib/utils";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page view for Emploria Employee Dashboard",
};

async function UserDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;
  const [statsCardData, todaysAttendance, activities] = await Promise.all([
    getUserStatsCardData(userId),
    getTodayAttendanceStatus(userId),
    getActivitiesByUserId(userId),
  ]);

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

      {/* Employee Today's Attendance */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5 text-xs font-semibold md:h-5 md:flex-row md:items-center lg:text-sm">
          <p aria-label="Check in for today" title="Check in for today">
            {todaysAttendance?.checkIn
              ? `✅ You checked-in at ${convertToGmt7TimeString(todaysAttendance.checkIn)}`
              : "🕘 You haven't check in today"}
          </p>
          <Separator orientation="vertical" className="max-md:hidden" />
          <p aria-label="Check out for today" title="Check out for today">
            {todaysAttendance?.checkOut
              ? `✅ You checked-out at ${convertToGmt7TimeString(todaysAttendance.checkOut)}`
              : "🕔 You haven't checked out yet"}
          </p>
        </div>
        <AttendanceButton userId={userId} attendance={todaysAttendance} />
      </div>

      <UserStatsCard stats={statsCardData} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SalariesGrowthCard userId={userId} />
        <UserActivityCard activities={activities} />
      </div>
    </section>
  );
}

export default UserDashboardPage;
