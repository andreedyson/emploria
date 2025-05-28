import prisma from "@/lib/db";
import { LeaveColumnProps } from "@/types/admin/leave";

export async function getAllLeaves(
  companyId: string,
): Promise<LeaveColumnProps[]> {
  try {
    const leaves = await prisma.leave.findMany({
      where: {
        employee: {
          companyId: companyId,
        },
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                gender: true,
              },
            },
          },
        },
      },
    });

    const data = leaves.map((leave) => ({
      employee: {
        id: leave.employee.id,
        name: leave.employee.user.name,
        image: leave.employee.user.image,
        gender: leave.employee.user.gender,
      },
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
