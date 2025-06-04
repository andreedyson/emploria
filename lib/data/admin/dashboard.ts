import prisma from "@/lib/db";
import { StatsCardProps } from "@/types/super-admin/dashboard";
import { CalendarX, Receipt, Users, UserX } from "lucide-react";

export async function getSuperAdminCompanyStatsCardData(
  companyId: string,
): Promise<StatsCardProps[]> {
  try {
    const activeEmployees = await prisma.employee.findMany({
      where: {
        isActive: true,
        companyId: companyId,
      },
    });

    const inactiveEmployees = await prisma.employee.findMany({
      where: {
        isActive: false,
        companyId: companyId,
      },
    });

    const leaves = await prisma.leave.findMany({
      where: {
        employee: {
          companyId: companyId,
        },
      },
    });

    const payslips = await prisma.salary.findMany({
      where: {
        status: "PAID",
        employee: {
          companyId: companyId,
        },
      },
    });

    const data = [
      {
        name: "Employees",
        title: "Active Employees",
        total: activeEmployees.length,
        icon: Users,
        textColor: "text-picton-blue-500",
      },
      {
        name: "Employees",
        title: "Inactive Employees",
        total: inactiveEmployees.length,
        icon: UserX,
        textColor: "text-red-500",
      },
      {
        name: "Leave Requests",
        title: "Total Leave Requests",
        total: leaves.length,
        icon: CalendarX,
        textColor: "text-blue-500",
      },
      {
        name: "Payslips",
        title: "Payslips Generated",
        total: payslips.length,
        icon: Receipt,
        textColor: "text-yellow-500",
      },
    ];

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEmployeesPerDepartments(companyId: string) {
  const departments = await prisma.department.findMany({
    where: {
      companyId,
    },
    include: {
      employees: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
        },
      },
    },
  });

  return departments.map((dept) => ({
    name: dept.name,
    count: dept.employees.length,
    color: dept,
  }));
}
