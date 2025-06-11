import prisma from "@/lib/db";
import { applyLeaveSchema } from "@/validations/user";
import { LeaveType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, startDate, endDate, reason, leaveType } = await req.json();
  try {
    const validatedFields = applyLeaveSchema.safeParse({
      userId,
      startDate,
      endDate,
      reason,
      leaveType,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }
    // Check employee data
    const employee = await prisma.employee.findUnique({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            gender: true,
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // Check start and end date
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return NextResponse.json(
        { message: "Start date cannot be after end date." },
        { status: 400 },
      );
    }

    // Only allow maternity for FEMALE employee
    if (leaveType === LeaveType.MATERNITY) {
      if (!employee || employee.user.gender !== "FEMALE") {
        return NextResponse.json(
          {
            message: "Maternity leave is only applicable for female employees.",
          },
          { status: 400 },
        );
      }
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId: employee.id,
        leaveType: validatedFields.data.leaveType,
        startDate: start,
        endDate: end,
        reason: validatedFields.data.reason,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Leave applied successfully", data: leave },
      { status: 201 },
    );
  } catch (error) {
    console.error("[APPLY_LEAVE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
