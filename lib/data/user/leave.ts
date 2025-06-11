import prisma from "@/lib/db";
import { LeaveStatsCardProps } from "@/types/user/leave";
import { Leave } from "@prisma/client";
import { Baby, BanknoteX, Calendar, LucideIcon, Pill } from "lucide-react";

export async function getEmployeeLeaveSummary(
  userId: string,
): Promise<LeaveStatsCardProps[]> {
  try {
    const leaves = await prisma.leave.groupBy({
      by: ["leaveType"],
      where: { employee: { userId } },
      _count: { status: true },
    });

    const statusMap: Record<string, { icon: LucideIcon; textColor: string }> = {
      ANNUAL: { icon: Calendar, textColor: "text-orange-600" },
      SICK: { icon: Pill, textColor: "text-red-500" },
      UNPAID: { icon: BanknoteX, textColor: "text-yellow-500" },
      MATERNITY: { icon: Baby, textColor: "text-indigo-500" },
    };

    const data = (["ANNUAL", "SICK", "UNPAID", "MATERNITY"] as const).map(
      (type) => {
        const found = leaves.find((item) => item.leaveType === type);
        return {
          type,
          total: found?._count.status ?? 0,
          icon: statusMap[type].icon,
          textColor: statusMap[type].textColor,
        };
      },
    );

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEmployeeLeaveHistory(
  userId: string,
): Promise<Leave[]> {
  try {
    const leaves = await prisma.leave.findMany({
      where: {
        employee: {
          userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return leaves;
  } catch (error) {
    console.error(error);
    return [];
  }
}
