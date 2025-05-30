import prisma from "@/lib/db";
import { salarySchema } from "@/validations/admin";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { employeeId, month, year, bonus, deduction } = await req.json();
  try {
    const validatedFields = salarySchema.safeParse({
      employeeId,
      month,
      year,
      bonus,
      deduction,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    // Check for existing salary for same employee, month, and year
    const existing = await prisma.salary.findFirst({
      where: {
        employeeId: validatedFields.data.employeeId,
        month: validatedFields.data.month,
        year: validatedFields.data.year,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          message:
            "Salary record already exists for this employee in this period.",
        },
        { status: 400 },
      );
    }

    // Check employee data
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      include: {
        salary: true,
        attendance: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // Check company data
    const company = await prisma.company.findUnique({
      where: { id: employee.companyId },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    // Count employee salary
    const baseSalary = employee.baseSalary;
    const attendanceThisMonth = employee.attendance.filter((att) => {
      return (
        att.date.getFullYear() === Number(year) &&
        att.date.getMonth() + 1 === Number(month)
      );
    });

    const presentAttendace = attendanceThisMonth.filter(
      (att) => att.status === "PRESENT",
    );
    const attendanceBonus =
      presentAttendace.length * (company?.attendanceBonusRate ?? 0);

    const lateAttendanceThisMonth = attendanceThisMonth.filter(
      (att) => att.status === "LATE",
    );
    const lateDeduction =
      lateAttendanceThisMonth.length *
      (company?.lateAttendancePenaltyRate ?? 0);

    // Calculate total salary
    const total = Math.max(
      0,
      baseSalary + bonus + attendanceBonus - deduction - lateDeduction,
    );

    const salary = await prisma.salary.create({
      data: {
        employeeId: validatedFields.data.employeeId,
        month: validatedFields.data.month,
        year: validatedFields.data.year,
        baseSalary: baseSalary,
        bonus: validatedFields.data.bonus,
        deduction: validatedFields.data.deduction ?? 0,
        attendanceBonus: attendanceBonus,
        total: total,
      },
    });

    return NextResponse.json(
      { message: "Salary created successfully", data: salary },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_SALARY_ERROR]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            message:
              "A salary record for this employee and period already exists.",
          },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
