import prisma from "@/lib/db";
import { SalaryColumnsProps } from "@/types/admin/salary";

export async function getAllSalaries(
  companyId: string,
): Promise<SalaryColumnsProps[]> {
  try {
    const salaries = await prisma.salary.findMany({
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
                id: true,
                name: true,
                image: true,
              },
            },
            attendance: true,
            company: true,
          },
        },
      },
    });

    const data = salaries.map((salary) => ({
      id: salary.id,
      companyId: companyId,
      employee: {
        id: salary.employee.id,
        name: salary.employee.user.name,
        image: salary.employee.user.image,
      },
      month: salary.month,
      year: salary.year,
      baseSalary: salary.baseSalary,
      bonus: salary.bonus,
      deduction: salary.deduction,
      attendanceBonus: salary.attendanceBonus,
      total: salary.total,
      totalPresentAttendance: salary.employee.attendance.filter(
        (att) => att.status === "PRESENT",
      ).length,
      totalLateAttendance: salary.employee.attendance.filter(
        (att) => att.status === "LATE",
      ).length,
      attendanceBonusRate: salary.employee.company.attendanceBonusRate,
      lateAttendancePenaltyRate:
        salary.employee.company.lateAttendancePenaltyRate,
      date: salary.date,
      status: salary.status,
      paidAt: salary.paidAt,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
