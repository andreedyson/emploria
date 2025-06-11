import prisma from "@/lib/db";

export async function getEmployeeSalaryHistory(userId: string) {
  try {
    const salaries = await prisma.salary.findMany({
      where: {
        employee: {
          userId,
        },
      },
    });

    return salaries;
  } catch (error) {
    console.error(error);
    return [];
  }
}
