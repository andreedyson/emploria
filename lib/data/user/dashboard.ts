"use server";

import { months } from "@/constants";
import prisma from "@/lib/db";
import { SalariesPaidPerMonthProps } from "@/types/admin/dashboard";
import { UserStatsCardDataProps } from "@/types/user/dashboard";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { Banknote, Calendar1, CalendarCog, CalendarX } from "lucide-react";
import { toZonedTime } from "date-fns-tz";
import { Attendance } from "@prisma/client";

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
        bgColor: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      },
      {
        title: "Recent Leaves",
        text: `${currentLeaves} ${currentLeaves > 1 ? "Leaves" : "Leave"}`,
        icon: CalendarX,
        bgColor: "bg-gradient-to-r from-red-600 to-red-500",
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
        bgColor: "bg-gradient-to-r from-green-600 to-green-500",
      },
      {
        title: "Annual Leave Left",
        text: `${remainingAnnualLeave} Days`,
        icon: CalendarCog,
        bgColor: "bg-gradient-to-r from-orange-600 to-orange-500",
      },
    ];

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTodayAttendanceStatus(
  userId: string,
): Promise<Attendance | null> {
  const timeZone = "Asia/Jakarta";
  const now = new Date();
  const zonedNow = toZonedTime(now, timeZone);

  const start = startOfDay(zonedNow);
  const end = endOfDay(zonedNow);

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
