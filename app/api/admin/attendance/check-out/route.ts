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

    // Check if there's already a check-in or the user already check-out
    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: today,
      },
    });

    if (!attendance) {
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

    // Update check-out attendance status
    const updatedCheckout = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: new Date() },
    });

    return NextResponse.json(
      { message: "Check Out Successful", data: updatedCheckout },
      { status: 200 },
    );
  } catch (error) {
    console.error("Check-out error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
