import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  try {
    // Check employee data
    const employee = await prisma.employee.findUnique({
      where: { userId: userId },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there is already an existing attendance
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: today,
      },
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return NextResponse.json(
        { message: "Already checked in today." },
        { status: 400 },
      );
    }

    // Check if the check in is late or not
    const now = new Date();
    const scheduledCheckIn = new Date();
    scheduledCheckIn.setHours(9, 0, 0, 0); // 9:00 AM check-in standard

    const status = now > scheduledCheckIn ? "LATE" : "PRESENT";

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
    console.error("Check-in error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
