"use server";

import prisma from "@/lib/db";
import { Department } from "@prisma/client";

export async function getAllDepartments(
  companyId: string,
): Promise<Department[]> {
  try {
    const departments = await prisma.department.findMany({
      where: {
        companyId: companyId,
      },
    });

    return departments;
  } catch (error) {
    console.error(error);
    return [];
  }
}
