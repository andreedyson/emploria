import prisma from "@/lib/db";
import {
  StatsCardProps,
  UserPerCompaniesProps,
} from "@/types/super-admin/dashboard";
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
        textColor: "text-orange-600",
      },
      {
        name: "Active Companies",
        total: companies.filter((company) => {
          return company.isActive;
        }).length,
        icon: Building2,
        textColor: "text-green-500",
      },
      {
        name: "Company Admin",
        total: users.filter((user) => {
          return user.role === "SUPER_ADMIN_COMPANY";
        }).length,
        icon: Users,
        textColor: "text-yellow-500",
      },
      {
        name: "Users",
        total: users.filter((user) => {
          return user.role === "USER";
        }).length,
        icon: UserSquare,
        textColor: "text-violet-600",
      },
    ];

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTotalUserPerCompanies(): Promise<
  UserPerCompaniesProps[]
> {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const data = companies.map((company) => ({
      id: company.id,
      name: company.name,
      totalUsers: company.users.filter((user) => {
        return user.role === "USER";
      }).length,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
