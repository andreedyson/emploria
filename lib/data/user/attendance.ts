import prisma from "@/lib/db";
import { AttendanceColumnsProps } from "@/types/admin/attendance";
import { AttendanceStatsCardProps } from "@/types/user/attendance";
import { Attendance } from "@prisma/client";
import {
  CalendarX,
  CheckCircle2,
  Clock4,
  LucideIcon,
  Plane,
} from "lucide-react";

export async function getEmployeeAttendanceSummary(
  userId: string,
): Promise<AttendanceStatsCardProps[]> {
  try {
    const attendances = await prisma.attendance.groupBy({
      by: ["status"],
      where: { employee: { userId } },
      _count: { status: true },
    });

    const statusMap: Record<string, { icon: LucideIcon; textColor: string }> = {
      PRESENT: { icon: CheckCircle2, textColor: "text-green-600" },
      ABSENT: { icon: CalendarX, textColor: "text-red-500" },
      LATE: { icon: Clock4, textColor: "text-yellow-500" },
      ON_LEAVE: { icon: Plane, textColor: "text-blue-500" },
    };

    const data = (["PRESENT", "ABSENT", "LATE", "ON_LEAVE"] as const).map(
      (status) => {
        const found = attendances.find((item) => item.status === status);
        return {
          status,
          total: found?._count.status ?? 0,
          icon: statusMap[status].icon,
          textColor: statusMap[status].textColor,
        };
      },
    );

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEmployeeAttendanceHistory(
  userId: string,
): Promise<Attendance[]> {
  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        employee: {
          userId,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return attendances;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getDepartmentAttendances(
  companyId: string,
  departmentId: string,
): Promise<AttendanceColumnsProps[]> {
  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        employee: {
          companyId: companyId,
          departmentId: departmentId,
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const data = attendances.map((attendance) => ({
      id: attendance.id,
      employee: {
        id: attendance.employeeId,
        name: attendance.employee.user.name,
        image: attendance.employee.user.image,
      },
      company: {
        id: attendance.employee.company.id,
        name: attendance.employee.company.name,
      },
      department: {
        id: attendance.employee.department?.id,
        name: attendance.employee.department?.name,
      },
      date: attendance.date,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      status: attendance.status,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
