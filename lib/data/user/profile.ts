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
        phone: true,
        createdAt: true,
        isActive: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        employee: {
          include: {
            department: true,
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
      phone: user.phone ?? "",
      joinedDate: user.createdAt,
      isActive: user.isActive,
      company: {
        id: user.company?.id ?? "",
        name: user.company?.name ?? "",
      },
      department: {
        id: user.employee?.department?.id ?? "",
        name: user.employee?.department?.name ?? "",
      },
      employee: {
        id: user.employee?.id,
        role: user.employee?.role ?? EmployeeRole.STAFF,
      },
    };

    return data;
  } catch (error) {
    console.error("[GET_USER_PROFILE_ERROR]", error);
    return null;
  }
}
