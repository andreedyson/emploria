import prisma from "@/lib/db";
import { UserStatsCardProps } from "@/types/user/dashboard";
import { endOfMonth, startOfMonth } from "date-fns";
import { Banknote, Calendar1, CalendarCog, CalendarX } from "lucide-react";

export async function getUserStatsCardData(
  userId: string,
): Promise<UserStatsCardProps[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true },
    });

    if (!user || !user.employee) throw new Error("User or employee not found");

    const employeeId = user.employee.id;

    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    // Total Attendance This Month
    const attendanceCount = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: start, lte: end },
        status: { in: ["PRESENT", "LATE"] },
      },
    });

    // Current Leave Requests
    const currentLeaves = await prisma.leave.count({
      where: {
        employeeId,
        OR: [
          { status: "PENDING" },
          {
            status: "APPROVED",
            endDate: { gte: now },
          },
        ],
      },
    });

    // Latest Paid Salary
    const latestSalary = await prisma.salary.findFirst({
      where: {
        employeeId,
        status: "PAID",
      },
      orderBy: {
        paidAt: "desc",
      },
    });

    // Remaining Annual Leave
    const leavePolicy = await prisma.leavePolicy.findFirst({
      where: {
        companyId: user.companyId!,
        leaveType: "ANNUAL",
      },
    });

    let totalAnnualLeaveTaken = 0;

    if (leavePolicy) {
      const leaveStart =
        leavePolicy.frequency === "YEARLY"
          ? new Date(now.getFullYear(), 0, 1)
          : start;

      const leaveEnd =
        leavePolicy.frequency === "YEARLY"
          ? new Date(now.getFullYear(), 11, 31)
          : end;

      const approvedLeaves = await prisma.leave.findMany({
        where: {
          employeeId,
          leaveType: "ANNUAL",
          status: "APPROVED",
          startDate: { gte: leaveStart },
          endDate: { lte: leaveEnd },
        },
      });

      totalAnnualLeaveTaken = approvedLeaves.reduce((sum, leave) => {
        const duration =
          (leave.endDate.getTime() - leave.startDate.getTime()) /
            (1000 * 60 * 60 * 24) +
          1;
        return sum + duration;
      }, 0);
    }

    const remainingAnnualLeave = leavePolicy
      ? Math.max(0, leavePolicy.allowedDays - totalAnnualLeaveTaken)
      : 0;

    const data = [
      {
        title: "Att. This Month",
        text: `${attendanceCount.length} Attendance`,
        icon: Calendar1,
        textColor: "text-yellow-500",
      },
      {
        title: "Current Leave Request",
        text: `${currentLeaves} Leaves`,
        icon: CalendarX,
        textColor: "text-purple-500",
      },
      {
        title: "Latest Salary",
        data: latestSalary
          ? {
              month: latestSalary.month,
              year: latestSalary.year,
              total: latestSalary.total,
            }
          : null,
        icon: Banknote,
        textColor: "text-green-500",
      },
      {
        title: "Remaining Annual Leave",
        text: `${remainingAnnualLeave} Leaves`,
        icon: CalendarCog,
        textColor: "text-orange-500",
      },
    ];

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
