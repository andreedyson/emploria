import prisma from "@/lib/db";
import { applyLeaveSchema } from "@/validations/user";
import { LeaveType, LeaveFrequency } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth, startOfYear } from "date-fns";

export async function POST(req: NextRequest) {
  const { userId, startDate, endDate, reason, leaveType } = await req.json();

  try {
    // Validate request
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

    // Fetch employee data
    const employee = await prisma.employee.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            gender: true,
          },
        },
        company: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return NextResponse.json(
        { message: "Start date cannot be after end date." },
        { status: 400 },
      );
    }

    if (
      leaveType === LeaveType.MATERNITY &&
      employee.user.gender !== "FEMALE"
    ) {
      return NextResponse.json(
        { message: "Maternity leave is only applicable for female employees." },
        { status: 400 },
      );
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

    // Apply leave with PENDING status
    const leave = await prisma.leave.create({
      data: {
        employeeId: employee.id,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
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
