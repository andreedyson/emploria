// /app/api/admin/attendance/route.ts
import prisma from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { attendanceSchema } from "@/validations/admin";
import { ActivityAction, ActivityTarget } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { employeeId, date, status, checkIn, checkOut } = await req.json();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const validatedFields = attendanceSchema.safeParse({
      employeeId,
      date,
      status,
      checkIn,
      checkOut,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    // Check if record already exists for the same employee and date
    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId: validatedFields.data.employeeId,
        date: validatedFields.data.date,
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Attendance already exists for this date." },
        { status: 400 },
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: validatedFields.data.employeeId,
        date: validatedFields.data.date,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status,
      },
      select: {
        id: true,
        date: true,
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
      userId: token.sub,
      action: ActivityAction.CREATE,
      targetType: ActivityTarget.ATTENDANCE,
      targetId: attendance.id,
      companyId: attendance.employee.companyId ?? undefined,
      description: `Company Admin: ${token.name} generated a new manual attendance data for 
      ${attendance.employee.user.name}`,
      metadata: {
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        newAttendance: {
          id: attendance.id,
          employee: attendance.employee.user.name,
          date: attendance.date,
        },
      },
    });

    return NextResponse.json(
      { message: "Attendance created successfully", data: attendance },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_ATTENDANCE_ERROR]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { attendanceId, employeeId, date, status, checkIn, checkOut } =
    await req.json();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const validatedFields = attendanceSchema.safeParse({
      employeeId,
      date,
      status,
      checkIn,
      checkOut,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    const { status: validatedStatus } = validatedFields.data;

    const isTimeRequired =
      validatedStatus === "PRESENT" || validatedStatus === "LATE";
    const isTimeProvided = checkIn && checkOut;

    if (isTimeRequired && !isTimeProvided) {
      return NextResponse.json(
        {
          message:
            "Check In and Check Out times are required for PRESENT or LATE status.",
        },
        { status: 400 },
      );
    }

    if (!isTimeRequired && (checkIn || checkOut)) {
      return NextResponse.json(
        {
          message:
            "Check In and Check Out times must be empty for ABSENT or ON_LEAVE status.",
        },
        { status: 400 },
      );
    }

    const existing = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Attendance not found." },
        { status: 404 },
      );
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        employeeId,
        date,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        status,
      },
      select: {
        id: true,
        date: true,
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
      userId: token.sub,
      action: ActivityAction.CREATE,
      targetType: ActivityTarget.ATTENDANCE,
      targetId: updatedAttendance.id,
      companyId: updatedAttendance.employee.companyId ?? undefined,
      description: `Company Admin: ${token.name} updated an attendance data for 
      ${updatedAttendance.employee.user.name}`,
      metadata: {
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        updatedAttendance: {
          id: updatedAttendance.id,
          employee: updatedAttendance.employee.user.name,
          date: updatedAttendance.date,
        },
      },
    });

    return NextResponse.json(
      { message: "Attendance updated successfully", data: updatedAttendance },
      { status: 200 },
    );
  } catch (error) {
    console.error("[UPDATE_ATTENDANCE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { attendanceId } = await req.json();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check attendance data
    const attendance = await prisma.attendance.findUnique({
      where: {
        id: attendanceId,
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { message: "Attendance data not found" },
        { status: 404 },
      );
    }

    const deletedAttendance = await prisma.attendance.delete({
      where: {
        id: attendanceId,
      },
      select: {
        id: true,
        date: true,
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
      userId: token.sub,
      action: ActivityAction.DELETE,
      targetType: ActivityTarget.ATTENDANCE,
      targetId: deletedAttendance.id,
      companyId: deletedAttendance.employee.companyId ?? undefined,
      description: `Company Admin: ${token.name} deleted an attendance data of 
      ${deletedAttendance.employee.user.name}`,
      metadata: {
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        deletedAttendance: {
          id: deletedAttendance.id,
          employee: deletedAttendance.employee.user.name,
          date: deletedAttendance.date,
        },
      },
    });

    return NextResponse.json(
      { message: "Attendance deleted successfully", data: deletedAttendance },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE_ATTENDANCE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
