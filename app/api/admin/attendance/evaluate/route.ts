import prisma from "@/lib/db";
import { startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { companyId } = await req.json();
  try {
    const today = startOfDay(new Date());

    const employees = await prisma.employee.findMany({
      where: {
        companyId: companyId,
        isActive: true,
      },
    });

    for (const emp of employees) {
      const existing = await prisma.attendance.findFirst({
        where: { employeeId: emp.id, date: today },
      });

      if (existing) continue; // Already has attendance, skip

      const leave = await prisma.leave.findFirst({
        where: {
          employeeId: emp.id,
          status: "APPROVED",
          startDate: { lte: today },
          endDate: { gte: today },
        },
      });

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          date: new Date(),
          status: leave ? "ON_LEAVE" : "ABSENT",
        },
      });
    }

    return NextResponse.json(
      { message: "Day successfully evaluated" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
