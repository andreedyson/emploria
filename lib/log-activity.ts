import { ActivityAction, ActivityTarget } from "@prisma/client";
import prisma from "./db";

interface LogActivityParams {
  userId?: string;
  companyId?: string;
  action: ActivityAction;
  targetType: ActivityTarget;
  targetId?: string;
  description: string;
}

export async function logActivity({
  userId,
  companyId,
  action,
  targetType,
  targetId,
  description,
}: LogActivityParams) {
  await prisma.activity.create({
    data: {
      userId,
      companyId,
      action,
      targetType,
      targetId,
      description,
    },
  });
}
