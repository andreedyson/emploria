import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  try {
    // Check employee data
    const employee = await prisma.employee.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    const company = employee.company;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user already checked in
    const existingAttendance = await prisma.attendance.findFirst({
      where: { employeeId: employee.id, date: today },
    });

    if (existingAttendance?.checkIn) {
      return NextResponse.json(
        { message: "Already checked in today." },
        { status: 400 },
      );
    }

    // Parse company check-in policy
    const checkInEndTime = company?.checkInEndTime || "09:00";
    const [checkInEndHour, checkInMinute] = checkInEndTime
      .split(":")
      .map(Number);

    const lateTime = new Date(now);
    lateTime.setHours(checkInEndHour, checkInMinute, 0, 0);

    const status = now > lateTime ? "LATE" : "PRESENT";

    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: today,
        },
      },
      update: {
        checkIn: now,
        status,
      },
      create: {
        employeeId: employee.id,
        date: today,
        checkIn: now,
        status,
      },
    });

    return NextResponse.json(
      { message: "Check In Successful", data: attendance },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CHECK_IN_ATTENDANCE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
