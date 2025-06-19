"use server";

import prisma from "@/lib/db";
import { AllCompaniesProps } from "@/types/super-admin/company";
import { Company, Employee, LeavePolicy } from "@prisma/client";

export async function getAllCompanies(): Promise<AllCompaniesProps[]> {
  try {
    const companies = await prisma.company.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const data = companies.map(({ ...company }) => ({
      ...company,
      totalUsers: company.users.length,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCompanyById(
  companyId: string,
): Promise<
  (Company & { LeavePolicy: LeavePolicy[]; employee: Employee[] }) | null
> {
  try {
    return await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        LeavePolicy: true,
        employee: true,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
