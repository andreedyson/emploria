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
          },
        },
      },
    });

    const data = salaries.map((salary) => ({
      id: salary.id,
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
