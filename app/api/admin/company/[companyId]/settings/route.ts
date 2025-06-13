// app/api/admin/company/settings/route.ts

import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ companyId: string }> },
) {
  const params = await props.params;
  const { ...updates } = await req.json();

  if (!params.companyId) {
    return NextResponse.json(
      { message: "Missing company ID" },
      { status: 400 },
    );
  }

  // Readable field mapping
  const fieldLabels: Record<string, string> = {
    lateAttendancePenaltyRate: "Late Attendance Penalty Rate",
    attendanceBonusRate: "Attendance Bonus Rate",
  };

  // Identify which known field is being updated
  const updatedFieldKeys = Object.keys(updates).filter(
    (key) => key in fieldLabels,
  );

  if (updatedFieldKeys.length === 0) {
    return NextResponse.json(
      { message: "No valid fields provided" },
      { status: 400 },
    );
  }

  try {
    const updatedCompany = await prisma.company.update({
      where: { id: params.companyId },
      data: updates,
    });

    const messages = updatedFieldKeys.map(
      (key) => `${fieldLabels[key]} updated successfully`,
    );

    return NextResponse.json({
      data: updatedCompany,
      message: messages.join(" and "),
    });
  } catch (error) {
    console.error("[PATCH_COMPANY_SETTINGS]", error);
    return NextResponse.json(
      { message: "Error updating settings" },
      { status: 500 },
    );
  }
}
