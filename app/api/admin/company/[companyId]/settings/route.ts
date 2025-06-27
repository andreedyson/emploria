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

  // ✅ Full field-label mapping
  const fieldLabels: Record<string, string> = {
    lateAttendancePenaltyRate: "Late Attendance Penalty Rate",
    attendanceBonusRate: "Attendance Bonus Rate",
    checkInStartTime: "Check-In Start Time",
    checkInEndTime: "Check-In End Time",
    minimumWorkHours: "Minimum Work Hours",
  };

  // Filter for only valid fields
  const validUpdateKeys = Object.keys(updates).filter((key) =>
    Object.keys(fieldLabels).includes(key),
  );

  if (validUpdateKeys.length === 0) {
    return NextResponse.json(
      { message: "No valid fields provided for update" },
      { status: 400 },
    );
  }

  // Check minimumWorkHours
  if ("minimumWorkHours" in updates) {
    const parsed = parseInt(updates.minimumWorkHours);
    if (isNaN(parsed) || parsed < 0) {
      return NextResponse.json(
        { message: "Minimum Work Hours must be a positive number" },
        { status: 400 },
      );
    }
    updates.minimumWorkHours = parsed;
  }

  try {
    const updatedCompany = await prisma.company.update({
      where: { id: params.companyId },
      data: updates,
    });

    const messages = validUpdateKeys.map(
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
