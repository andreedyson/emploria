import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AttendanceButton from "@/components/dashboard/user/attendance/attendance-button";
import AttendanceHistoryCard from "@/components/dashboard/user/attendance/attendance-history-card";
import AttendanceStatsCard from "@/components/dashboard/user/attendance/attendance-stats-card";
import { Separator } from "@/components/ui/separator";
import {
  getDepartmentAttendances,
  getEmployeeAttendanceHistory,
  getEmployeeAttendanceSummary,
} from "@/lib/data/user/attendance";
import { getTodayAttendanceStatus } from "@/lib/data/user/dashboard";
import { getUserProfileData } from "@/lib/data/user/profile";
import { convertToGmt7TimeString } from "@/lib/utils";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Attendance",
  description: "Attendance page view for Emploria User Dashboard",
};

async function UserAttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;
  const attendanceSummary = await getEmployeeAttendanceSummary(userId);
  const todaysAttendance = await getTodayAttendanceStatus(userId);
  const attendanceHistory = await getEmployeeAttendanceHistory(userId);
  const userData = await getUserProfileData(userId);
  const departmentAttendances = await getDepartmentAttendances(
    session.user.companyId as string,
    userData?.department.id as string,
  );
  return (
    <section className="space-y-4">
      {/* Attendance Stats Card */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {attendanceSummary.map((attendance) => (
          <AttendanceStatsCard
            key={attendance.status}
            status={attendance.status}
            total={attendance.total}
            icon={attendance.icon}
            textColor={attendance.textColor}
          />
        ))}
      </div>

      {/* Employee Today's Attendance */}
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-bold md:text-xl">
            Today&apos;s Attendance
          </h3>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5 text-xs font-semibold md:h-5 md:flex-row md:items-center md:text-sm">
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
      </div>

      {/* Employee Attendance History */}
      <div>
        <AttendanceHistoryCard
          employeeRole={userData?.employee.role}
          attendance={attendanceHistory}
          departmentAttendances={departmentAttendances.filter(
            (attendance) => attendance.employee.id !== userData?.employee.id,
          )}
        />
      </div>
    </section>
  );
}

export default UserAttendancePage;
