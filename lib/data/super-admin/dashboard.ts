import prisma from "@/lib/db";
import { StatsCardProps } from "@/types/super-admin/dashboard";
import { Building, Building2, Users, UserSquare } from "lucide-react";

export async function getStatsCardData(): Promise<StatsCardProps[]> {
  try {
    const companies = await prisma.company.findMany({});
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        role: true,
      },
    });

    const data = [
      {
        name: "Companies",
        total: companies.length,
        icon: Building,
        bgGradient: "from-red-500 to-orange-600",
      },
      {
        name: "Active Companies",
        total: companies.filter((company) => {
          return company.isActive;
        }).length,
        icon: Building2,
        bgGradient: "from-teal-400 to-green-500",
      },
      {
        name: "Company Admin",
        total: users.filter((user) => {
          return user.role === "SUPER_ADMIN_COMPANY";
        }).length,
        icon: Users,
        bgGradient: "from-amber-500 to-yellow-500",
      },
      {
        name: "Users",
        total: users.filter((user) => {
          return user.role === "USER";
        }).length,
        icon: UserSquare,
        bgGradient: "from-blue-600 to-violet-600",
      },
    ];

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
