"use server";

import { ActivityAction, ActivityTarget, Prisma } from "@prisma/client";
import prisma from "./db";

interface LogActivityParams {
  userId?: string;
  companyId?: string;
  action: ActivityAction;
  targetType: ActivityTarget;
  targetId?: string;
  description: string;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}

export async function logActivity({
  userId,
  companyId,
  action,
  targetType,
  targetId,
  description,
  metadata,
}: LogActivityParams) {
  await prisma.activity.create({
    data: {
      userId,
      companyId,
      action,
      targetType,
      targetId,
      description,
      metadata,
    },
  });
}
