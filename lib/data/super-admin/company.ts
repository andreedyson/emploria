import prisma from "@/lib/db";
import { AllCompaniesProps } from "@/types/super-admin/company";

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
