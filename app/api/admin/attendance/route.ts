// /app/api/admin/attendance/route.ts
import prisma from "@/lib/db";
import { attendanceSchema } from "@/validations/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { employeeId, date, status, checkIn, checkOut } = await req.json();
  try {
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
