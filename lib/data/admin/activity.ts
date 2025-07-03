import prisma from "@/lib/db";
import { Activity } from "@prisma/client";

export async function getActivitiesByCompany(
  companyId: string,
): Promise<Activity[]> {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        companyId: companyId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return activities;
  } catch (error) {
    console.error(error);
    return [];
  }
}
