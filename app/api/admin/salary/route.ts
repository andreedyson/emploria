import prisma from "@/lib/db";
import { salarySchema } from "@/validations/admin";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { employeeId, month, year, bonus, deduction, attendanceBonus } =
    await req.json();
  try {
    const validatedFields = salarySchema.safeParse({
      employeeId,
      month,
      year,
      bonus,
      deduction,
      attendanceBonus,
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
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    const baseSalary = employee.baseSalary;

    // Calculate total salary
    const total = baseSalary + bonus + attendanceBonus - deduction;

    const salary = await prisma.salary.create({
      data: {
        employeeId: validatedFields.data.employeeId,
        month: validatedFields.data.month,
        year: validatedFields.data.year,
        baseSalary: baseSalary,
        bonus: validatedFields.data.bonus,
        deduction: validatedFields.data.deduction,
        attendanceBonus: validatedFields.data.attendanceBonus,
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
