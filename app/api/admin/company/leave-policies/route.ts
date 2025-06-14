import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// PATCH
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, allowedDays, frequency } = body;

  try {
    const updated = await prisma.leavePolicy.update({
      where: { id },
      data: {
        allowedDays,
        frequency,
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
