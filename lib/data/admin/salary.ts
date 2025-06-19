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
      orderBy: [{ year: "desc" }, { month: "desc" }, { status: "asc" }],
    });

    const data = salaries.map((salary) => {
      const salaryMonth = salary.month;
      const salaryYear = salary.year;

      const presentThisMonth = salary.employee.attendance.filter((att) => {
        const attDate = new Date(att.date);
        return (
          att.status === "PRESENT" &&
          attDate.getMonth() + 1 === parseInt(salaryMonth) &&
          attDate.getFullYear() === parseInt(salaryYear)
        );
      });

      const lateThisMonth = salary.employee.attendance.filter((att) => {
        const attDate = new Date(att.date);
        return (
          att.status === "LATE" &&
          attDate.getMonth() + 1 === parseInt(salaryMonth) &&
          attDate.getFullYear() === parseInt(salaryYear)
        );
      });

      return {
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
        totalPresentAttendance: presentThisMonth.length,
        totalLateAttendance: lateThisMonth.length,
        attendanceBonusRate: salary.employee.company.attendanceBonusRate,
        lateAttendancePenaltyRate:
          salary.employee.company.lateAttendancePenaltyRate,
        date: salary.date,
        status: salary.status,
        paidAt: salary.paidAt,
      };
    });

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
