import prisma from "@/lib/db";
import { leaveSchema } from "@/validations/admin";
import { LeaveType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { employeeId, startDate, endDate, reason, status, leaveType } =
    await req.json();
  try {
    const validatedFields = leaveSchema.safeParse({
      employeeId,
      startDate,
      endDate,
      reason,
      status,
      leaveType,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }
    // Check employee data
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
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
        employeeId: validatedFields.data.employeeId,
        leaveType: validatedFields.data.leaveType,
        startDate: start,
        endDate: end,
        reason: validatedFields.data.reason,
        status: validatedFields.data.status,
      },
    });

    return NextResponse.json(
      { message: "Leave created successfully", data: leave },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_LEAVE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { leaveId, employeeId, startDate, endDate, reason, status, leaveType } =
    await req.json();
  try {
    const validatedFields = leaveSchema.safeParse({
      employeeId,
      startDate,
      endDate,
      reason,
      status,
      leaveType,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }
    // Check leave data
    const leave = await prisma.leave.findUnique({
      where: {
        id: leaveId,
      },
    });

    if (!leave) {
      return NextResponse.json({ message: "Leave not found" }, { status: 404 });
    }

    // Check employee data
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
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

    const updatedLeave = await prisma.leave.update({
      where: {
        id: leaveId,
      },
      data: {
        employeeId: validatedFields.data.employeeId,
        leaveType: validatedFields.data.leaveType,
        startDate: start,
        endDate: end,
        reason: validatedFields.data.reason,
        status: validatedFields.data.status,
      },
    });

    return NextResponse.json(
      { message: "Leave edited successfully", data: updatedLeave },
      { status: 200 },
    );
  } catch (error) {
    console.error("[UPDATE_LEAVE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { leaveId } = await req.json();
  try {
    // Check leave data
    const leave = await prisma.leave.findUnique({
      where: {
        id: leaveId,
      },
    });

    if (!leave) {
      return NextResponse.json({ message: "Leave not found" }, { status: 404 });
    }

    const deletedLeave = await prisma.leave.delete({
      where: {
        id: leaveId,
      },
    });

    return NextResponse.json(
      { message: "Leave deleted successfully", data: deletedLeave },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE_LEAVE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
