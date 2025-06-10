import prisma from "@/lib/db";
import { AttendanceStatsCardProps } from "@/types/user/attendance";
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
