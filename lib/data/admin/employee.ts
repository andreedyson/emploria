"use server";

import prisma from "@/lib/db";
import { EmployeeColumnProps } from "@/types/admin/employee";

export async function getAllEmployees(
  companyId: string,
): Promise<EmployeeColumnProps[]> {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        companyId: companyId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            dateOfBirth: true,
            gender: true,
            isActive: true,
            image: true,
          },
        },
        company: true,
        department: true,
      },
    });

    const data = employees.map((employee) => ({
      id: employee.id,
      name: employee.user.name,
      email: employee.user.email,
      image: employee.user.image,
      phone: employee.user.phone,
      address: employee.user.address,
      gender: employee.user.gender,
      isActive: employee.user.isActive,
      dateOfBirth: employee.user.dateOfBirth,
      userId: employee.user.id,
      company: {
        id: employee.company?.id,
        name: employee.company?.name,
      },
      department: {
        id: employee.department?.id,
        name: employee.department?.name,
      },
      employeeRole: employee.role,
      joinDate: employee.joinDate,
      baseSalary: employee.baseSalary,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEmployeeById(
  employeeId: string,
): Promise<EmployeeColumnProps | null> {
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            dateOfBirth: true,
            gender: true,
            isActive: true,
            image: true,
          },
        },
        company: true,
        department: true,
      },
    });

    if (!employee) return null;

    const data = {
      id: employee.id,
      name: employee.user.name,
      email: employee.user.email,
      image: employee.user.image,
      phone: employee.user.phone,
      address: employee.user.address,
      gender: employee.user.gender,
      isActive: employee.user.isActive,
      dateOfBirth: employee.user.dateOfBirth,
      userId: employee.user.id,
      company: {
        id: employee.company?.id,
        name: employee.company?.name,
      },
      department: {
        id: employee.department?.id,
        name: employee.department?.name,
      },
      employeeRole: employee.role,
      joinDate: employee.joinDate,
      baseSalary: employee.baseSalary,
    };

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
