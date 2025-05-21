"use server";

import prisma from "@/lib/db";
import {
  RecentlyAddedCompaniesProps,
  RecentlyAddedUsersProps,
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
      image: company.image,
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

export async function getRecentUsers(): Promise<RecentlyAddedUsersProps[]> {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: oneMonthAgo, //
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        isActive: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 5,
    });

    const data = recentUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      image: user.image,
      createdAt: user.createdAt,
      role: user.role,
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

export async function getRecentCompanies(): Promise<
  RecentlyAddedCompaniesProps[]
> {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentCompanies = await prisma.company.findMany({
      where: {
        createdAt: {
          gte: oneMonthAgo, //
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,

        image: true,
        isActive: true,
        createdAt: true,
      },
      take: 5,
    });

    const data = recentCompanies.map((company) => ({
      id: company.id,
      name: company.name,
      isActive: company.isActive,
      image: company.image,
      createdAt: company.createdAt,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
