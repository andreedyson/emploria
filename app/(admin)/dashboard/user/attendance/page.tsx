import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AttendanceStatsCard from "@/components/dashboard/user/attendance/attendance-stats-card";
import { getEmployeeAttendanceSummary } from "@/lib/data/user/attendance";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function UserAttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;
  const attendanceSummary = await getEmployeeAttendanceSummary(userId);
  return (
    <section className="space-y-4">
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
    </section>
  );
}

export default UserAttendancePage;
