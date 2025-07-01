import prisma from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { ActivityAction, ActivityTarget } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, allowedDays, frequency } = body;

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updated = await prisma.leavePolicy.update({
      where: { id },
      data: {
        allowedDays,
        frequency,
      },
      include: {
        company: true,
      },
    });

    await logActivity({
      userId: token.sub,
      action: ActivityAction.UPDATE,
      targetType: ActivityTarget.SYSTEM,
      targetId: updated.id,
      companyId: updated.companyId ?? undefined,
      description: `${token.name} (Company Admin) updated ${updated.leaveType} leave policy for ${updated.company.name}`,
      metadata: {
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        updatedPolicy: {
          id: updated.id,
          type: updated.leaveType,
          frequency: updated.frequency,
          allowedDays: updated.allowedDays,
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH_LEAVE_POLICY_ERROR]", error);
    return NextResponse.json(
      { message: "Update policy failed" },
      { status: 500 },
    );
  }
}

// POST
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { companyId, leaveType, allowedDays, frequency } = body;

  try {
    const created = await prisma.leavePolicy.create({
      data: {
        companyId,
        leaveType,
        allowedDays,
        frequency,
      },
    });
    return NextResponse.json(created);
  } catch (error) {
    console.error("[CREATE_LEAVE_POLICY_ERROR]", error);
    return NextResponse.json(
      { message: "Create policy failed" },
      { status: 500 },
    );
  }
}
