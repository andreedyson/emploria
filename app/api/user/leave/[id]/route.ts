import prisma from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { editLeaveSchema } from "@/validations/admin";
import { ActivityAction, ActivityTarget } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const { status } = await req.json();
  try {
    const leaveId = params.id;

    const validatedFields = editLeaveSchema.safeParse({ status });

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: validatedFields.error.errors[0].message },
        { status: 400 },
      );
    }

    const existingLeave = await prisma.leave.findUnique({
      where: { id: leaveId },
    });

    if (!existingLeave) {
      return NextResponse.json(
        { message: "Leave not found." },
        { status: 404 },
      );
    }

    const updatedLeave = await prisma.leave.update({
      where: { id: leaveId },
      data: {
        status: validatedFields.data.status,
      },
      include: {
        employee: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            companyId: true,
          },
        },
      },
    });

    await logActivity({
      userId: updatedLeave.employee.user.id,
      companyId: updatedLeave.employee.companyId,
      action: ActivityAction.CANCELLED,
      targetType: ActivityTarget.LEAVE,
      targetId: updatedLeave.employeeId,
      description: `${updatedLeave.employee.user.name} cancelled a leave request`,
    });

    return NextResponse.json(
      {
        message: `Leave ${status.toLowerCase()} successfully`,
        data: updatedLeave,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[USER_UPDATE_LEAVE_ERROR]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
