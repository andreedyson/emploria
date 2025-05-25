import prisma from "@/lib/db";
import { AttendanceColumnsProps } from "@/types/admin/attendance";

export async function getAllAttendances(
  companyId: string,
): Promise<AttendanceColumnsProps[]> {
  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        employee: {
          companyId: companyId,
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
