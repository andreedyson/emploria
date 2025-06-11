import prisma from "@/lib/db";
import { UserProfileProps } from "@/types/user/profile";
import { EmployeeRole } from "@prisma/client";

export async function getUserProfileData(
  userId: string,
): Promise<UserProfileProps | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        createdAt: true,
        company: {
          select: {
            name: true,
          },
        },
        employee: {
          select: {
            role: true,
            position: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      gender: user.gender,
      address: user.address,
      dateOfBirth: user.dateOfBirth ?? new Date(),
      joinedDate: user.createdAt,
      companyName: user.company?.name ?? "",
      departmentName: user.employee?.department?.name ?? "",
      employeePosition: user.employee?.position ?? "",
      employeeRole: user.employee?.role ?? EmployeeRole.STAFF,
    };

    return data;
  } catch (error) {
    console.error("[GET_USER_PROFILE_ERROR]", error);
    return null;
  }
}
