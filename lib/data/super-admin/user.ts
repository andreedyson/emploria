import prisma from "@/lib/db";
import { SuperAdminCompanyUserProps } from "@/types/super-admin/user";

export async function getAllSuperAdminCompanyUsers(): Promise<
  SuperAdminCompanyUserProps[]
> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        image: true,
        company: true,
      },
    });

    const data = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      image: user.image,
      company: {
        id: user.company?.id,
        name: user.company?.name,
      },
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
