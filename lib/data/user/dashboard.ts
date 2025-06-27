"use server";

import { months } from "@/constants";
import prisma from "@/lib/db";
import { SalariesPaidPerMonthProps } from "@/types/admin/dashboard";
import { UserStatsCardDataProps } from "@/types/user/dashboard";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { Banknote, Calendar1, CalendarCog, CalendarX } from "lucide-react";

export async function getUserStatsCardData(
  userId: string,
): Promise<UserStatsCardDataProps[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true },
    });

    const employeeId = user?.employee?.id;

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
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
        {
          paidAt: "desc",
        },
      ],
    });

    // Remaining Annual Leave
    const leavePolicy = await prisma.leavePolicy.findFirst({
      where: {
        companyId: user?.companyId ?? "",
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
        text: `${attendanceCount.length} Attendances`,
        icon: Calendar1,
        textColor: "text-yellow-500",
      },
      {
        title: "Recent Leaves",
        text: `${currentLeaves} ${currentLeaves > 1 ? "Leaves" : "Leave"}`,
        icon: CalendarX,
        textColor: "text-red-500",
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
        title: "Annual Leave Left",
        text: `${remainingAnnualLeave} Days`,
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

export async function getTodayAttendanceStatus(userId: string) {
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  const attendance = await prisma.attendance.findFirst({
    where: {
      employee: { userId },
      date: { gte: start, lte: end },
    },
  });

  return attendance;
}

export async function getEmployeeSalariesGrowth(
  userId: string,
): Promise<SalariesPaidPerMonthProps[]> {
  try {
    const salaries = await prisma.salary.groupBy({
      by: ["month", "year"],
      where: {
        status: "PAID",
        employee: {
          userId,
        },
      },
      _sum: {
        total: true,
      },
      orderBy: { month: "asc" },
      take: 6,
    });

    const data = salaries.map((item) => ({
      month: months.find((month) => month.value === item.month)?.label,
      year: item.year,
      totalPaidInMillions: item._sum.total
        ? +(item._sum.total / 1_000_000).toFixed(1)
        : 0,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
