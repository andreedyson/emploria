import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AttendanceButton from "@/components/dashboard/user/attendance/attendance-button";
import UserStatsCard from "@/components/dashboard/user/dashboard/user-stats-card";
import { Separator } from "@/components/ui/separator";
import {
  getTodayAttendanceStatus,
  getUserStatsCardData,
} from "@/lib/data/user/dashboard";
import { convertToGmt7TimeString } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function UserDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;
  const statsCardData = await getUserStatsCardData(userId);
  const todaysAttendance = await getTodayAttendanceStatus(userId);

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
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 text-xs font-semibold md:h-5 md:flex-row md:items-center md:text-sm">
          <p aria-label="Check in for today" title="Check in for today">
            {todaysAttendance?.checkIn
              ? `✅ You checked-in at ${convertToGmt7TimeString(todaysAttendance.checkIn)}`
              : "🕘 You haven't check in today"}
          </p>
          <Separator orientation="vertical" className="max-md:hidden" />
          <p aria-label="Check out for today" title="Check out for today">
            {todaysAttendance?.checkOut
              ? `✅ You checked-out at ${convertToGmt7TimeString(todaysAttendance.checkOut)}`
              : "🕘 You haven't checked out yet"}
          </p>
        </div>
        <AttendanceButton userId={userId} attendance={todaysAttendance} />
      </div>

      <UserStatsCard stats={statsCardData} />
    </section>
  );
}

export default UserDashboardPage;
