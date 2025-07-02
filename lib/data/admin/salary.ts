"use server";

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
            company: {
              select: {
                id: true,
                name: true,
                image: true,
                lateAttendancePenaltyRate: true,
                attendanceBonusRate: true,
              },
            },
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
        company: {
          id: salary.employee.company.id,
          name: salary.employee.company.name,
          image: salary.employee.company.image,
        },
        employee: {
          id: salary.employee.id,
          name: salary.employee.user.name,
          image: salary.employee.user.image,
          userId: salary.employee.user.id,
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

export async function getSalaryById(
  salaryId: string,
): Promise<SalaryColumnsProps | null> {
  try {
    const salary = await prisma.salary.findUnique({
      where: { id: salaryId },
      include: {
        employee: {
          select: {
            id: true,
            attendance: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                image: true,
                lateAttendancePenaltyRate: true,
                attendanceBonusRate: true,
              },
            },
          },
        },
      },
    });

    if (!salary) {
      return null;
    }

    const { month: salaryMonth, year: salaryYear, employee } = salary;

    // Count PRESENT for this salary’s month/year
    const presentThisMonth = employee.attendance.filter((att) => {
      const attDate = new Date(att.date);
      return (
        att.status === "PRESENT" &&
        attDate.getMonth() + 1 === parseInt(salaryMonth, 10) &&
        attDate.getFullYear() === parseInt(salaryYear, 10)
      );
    });

    // Count LATE for this salary’s month/year
    const lateThisMonth = employee.attendance.filter((att) => {
      const attDate = new Date(att.date);
      return (
        att.status === "LATE" &&
        attDate.getMonth() + 1 === parseInt(salaryMonth, 10) &&
        attDate.getFullYear() === parseInt(salaryYear, 10)
      );
    });

    return {
      id: salary.id,
      company: {
        id: salary.employee.company.id,
        name: salary.employee.company.name,
        image: salary.employee.company.image,
      },
      employee: {
        id: employee.id,
        name: employee.user.name,
        image: employee.user.image,
        userId: employee.user.id,
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
      attendanceBonusRate: employee.company.attendanceBonusRate,
      lateAttendancePenaltyRate: employee.company.lateAttendancePenaltyRate,
      date: salary.date,
      status: salary.status,
      paidAt: salary.paidAt,
    };
  } catch (error) {
    console.error("getSalaryById:", error);
    return null;
  }
}
