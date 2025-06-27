import prisma from "@/lib/db";
import { leaveSchema } from "@/validations/admin";
import { LeaveFrequency, LeaveType } from "@prisma/client";
import { startOfMonth, startOfYear } from "date-fns";
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
            name: true,
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

    // Check if there is PENDING leave
    const pendingLeave = await prisma.leave.findFirst({
      where: {
        employeeId: employeeId,
        status: "PENDING",
      },
    });

    if (pendingLeave) {
      return NextResponse.json(
        {
          message: `${employee.user.name} currently have a PENDING leave that haven't been reviewed`,
        },
        { status: 400 },
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

    // UNPAID Leave Type to not have any limit
    if (leaveType !== "UNPAID") {
      const policy = await prisma.leavePolicy.findUnique({
        where: {
          companyId_leaveType: {
            companyId: employee.companyId,
            leaveType: leaveType,
          },
        },
      });

      if (!policy) {
        return NextResponse.json(
          { message: "No leave policy set for this type." },
          { status: 400 },
        );
      }

      const requestedDays =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;

      const now = new Date();
      const periodStart =
        policy.frequency === LeaveFrequency.MONTHLY
          ? startOfMonth(now)
          : startOfYear(now);

      // Fetch approved leaves for same type in same period
      const usedLeaves = await prisma.leave.findMany({
        where: {
          employeeId: employee.id,
          leaveType: leaveType,
          status: "APPROVED",
          startDate: {
            gte: periodStart,
          },
        },
      });

      const usedDays = usedLeaves.reduce((total, leave) => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        const diff =
          Math.ceil(
            (leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1;
        return total + diff;
      }, 0);

      if (usedDays + requestedDays > policy.allowedDays) {
        return NextResponse.json(
          {
            message: `You have exceeded your ${policy.frequency.toLowerCase()} quota for ${leaveType}. Used: ${usedDays}, Requested: ${requestedDays}, Limit: ${policy.allowedDays}`,
          },
          { status: 400 },
        );
      }
    }

    // Create leave
    const leave = await prisma.leave.create({
      data: {
        employeeId,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
        status,
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
