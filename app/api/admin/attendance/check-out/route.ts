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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: { employeeId: employee.id, date: today },
    });

    if (!attendance || !attendance.checkIn) {
      return NextResponse.json(
        { message: "No check-in found." },
        { status: 400 },
      );
    }

    if (attendance.checkOut) {
      return NextResponse.json(
        { message: "Already checked out." },
        { status: 400 },
      );
    }

    // Check minimum work hours before allowing check-out
    const now = new Date();
    const checkIn = attendance.checkIn;
    const minHours = company?.minimumWorkHours ?? 4;

    const workedInMs = now.getTime() - checkIn.getTime();
    const workedHours = workedInMs / (1000 * 60 * 60);

    if (workedHours < minHours) {
      return NextResponse.json(
        {
          message: `You must work at least ${minHours} hours before checking out.`,
        },
        { status: 400 },
      );
    }

    // Check if the user is trying to check out after overtime
    const latestCheckOut = company?.latestCheckOut || "23:00";
    const [lateHour, lateMinute] = latestCheckOut.split(":").map(Number);
    const latestTimeAllowed = new Date(now);
    latestTimeAllowed.setHours(lateHour, lateMinute, 0, 0);

    if (now > latestTimeAllowed) {
      return NextResponse.json(
        {
          message:
            "You cannot check out after 11:00 PM without overtime approval.",
        },
        { status: 400 },
      );
    }

    const updatedCheckout = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: now },
    });

    return NextResponse.json(
      { message: "Check Out Successful", data: updatedCheckout },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CHECK_OUT_ATTENDANCE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
