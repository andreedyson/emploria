import prisma from "@/lib/db";
import { Activity } from "@prisma/client";

export async function getActivitiesByUserId(
  userId: string,
): Promise<Activity[]> {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        userId: userId,
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
