import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ApplyLeaveDialog from "@/components/dashboard/user/leave/apply-leave-dialog";
import LeaveHistoryCard from "@/components/dashboard/user/leave/leave-history-card";
import LeaveStatsCard from "@/components/dashboard/user/leave/leave-stats-card";
import {
  getEmployeeLeaveHistory,
  getEmployeeLeaveSummary,
} from "@/lib/data/user/leave";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function UserLeavePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;
  const leaveSummary = await getEmployeeLeaveSummary(userId);
  const leaveHistory = await getEmployeeLeaveHistory(userId);

  return (
    <section className="space-y-4">
      {/* Leave Summary Card */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {leaveSummary.map((leave) => (
          <LeaveStatsCard
            key={leave.type}
            type={leave.type}
            total={leave.total}
            icon={leave.icon}
            textColor={leave.textColor}
          />
        ))}
      </div>

      {/* Apply for Leave Dialog */}
      <div className="flex items-end justify-end">
        <ApplyLeaveDialog userId={userId} />
      </div>

      <div>
        <LeaveHistoryCard leave={leaveHistory} />
      </div>
    </section>
  );
}

export default UserLeavePage;
