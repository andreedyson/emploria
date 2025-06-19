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

export async function getDepartmentLeaves(
  companyId: string,
  departmentId: string,
) {
  try {
    const leaves = await prisma.leave.findMany({
      where: {
        employee: {
          companyId: companyId,
          departmentId: departmentId,
        },
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                gender: true,
              },
            },
            company: true,
          },
        },
      },
    });

    const data = leaves.map((leave) => ({
      id: leave.id,
      employee: {
        id: leave.employee.id,
        name: leave.employee.user.name,
        image: leave.employee.user.image,
        gender: leave.employee.user.gender,
      },
      company: {
        id: leave.employee.company.id,
        name: leave.employee.company.name,
      },
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      reason: leave.reason,
      createdAt: leave.createdAt,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
