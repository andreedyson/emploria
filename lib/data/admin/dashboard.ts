import prisma from "@/lib/db";
import {
  EmployeePerDepartmentProps,
  TopEmployeeListProps,
} from "@/types/admin/dashboard";
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

export async function getEmployeesPerDepartments(
  companyId: string,
): Promise<EmployeePerDepartmentProps[]> {
  try {
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

    const data = departments.map((dept) => ({
      name: dept.name,
      count: dept.employees.length,
      color: dept.color,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTopEmployeesList(
  companyId: string,
): Promise<TopEmployeeListProps[]> {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const attendanceGroups = await prisma.attendance.groupBy({
      by: ["employeeId"],
      where: {
        employee: { companyId },
        date: { gte: monthStart, lt: nextMonthStart },
        status: "PRESENT",
      },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const topEmployeeIds = attendanceGroups.map((group) => group.employeeId);
    if (topEmployeeIds.length === 0) {
      return [];
    }

    const employees = await prisma.employee.findMany({
      where: { id: { in: topEmployeeIds } },
      include: {
        user: { select: { name: true, image: true } },
        department: { select: { name: true } },
      },
    });

    const topEmployees = attendanceGroups
      .map((group) => {
        const employee = employees.find((e) => e.id === group.employeeId)!;
        return {
          id: employee.id,
          name: employee.user.name,
          image: employee.user.image ?? null,
          department: employee.department?.name ?? null,
          attendance: group._count._all,
        };
      })
      .filter((emp) => emp != null);

    return topEmployees;
  } catch (error) {
    console.error(error);
    return [];
  }
}
