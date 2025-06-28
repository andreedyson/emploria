import prisma from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { ActivityAction, ActivityTarget } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;

    const { name, email, companyId, isActive } = await req.json();

    if (!name || !email || !companyId) {
      return NextResponse.json(
        { message: "Name, email, and company are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    const updateData = {
      name,
      email,
      companyId,
      isActive,
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
        isActive: true,
      },
    });

    if (isActive !== user.isActive) {
      await logActivity({
        userId: token.sub,
        companyId: updatedUser.companyId ?? undefined,
        action: isActive ? ActivityAction.ACTIVATE : ActivityAction.DEACTIVATE,
        targetType: ActivityTarget.USER,
        targetId: updatedUser.id,
        description: `Admin ${token.name} ${isActive ? "activated" : "deactivated"} user ${updatedUser.email}`,
        metadata: {
          userId: updatedUser.id,
          name: updatedUser.name,
          status: isActive ? "active" : "inactive",
        },
      });
    } else {
      await logActivity({
        userId: token.sub,
        action: ActivityAction.UPDATE,
        targetType: ActivityTarget.USER,
        targetId: updatedUser.id,
        companyId: updatedUser.companyId ?? undefined,
        description: `Admin ${token.name} updated ${company.name} ${updatedUser.role === "SUPER_ADMIN_COMPANY" ? "Company Admin" : "User"} account data`,
        metadata: {
          company: company.name,
          updatedUser: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
          },
        },
      });
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[UPDATE_SUPER_ADMIN_USER_ERROR]", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
