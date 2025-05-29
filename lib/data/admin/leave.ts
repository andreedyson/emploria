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
            company: true,
          },
        },
      },
    });

    const data = leaves.map((leave) => ({
      id: leave.id,
      employee: {
        id: leave.employee.id,
        name: leave.employee.user.name,
        image: leave.employee.user.image,
        gender: leave.employee.user.gender,
      },
      company: {
        id: leave.employee.company.id,
        name: leave.employee.company.name,
      },
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      reason: leave.reason,
      createdAt: leave.createdAt,
    }));

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
