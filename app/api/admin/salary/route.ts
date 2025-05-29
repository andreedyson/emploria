import prisma from "@/lib/db";
import { salarySchema } from "@/validations/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    employeeId,
    month,
    year,
    baseSalary,
    bonus,
    deduction,
    attendanceBonus,
  } = await req.json();
  try {
    const validatedFields = salarySchema.safeParse({
      employeeId,
      month,
      year,
      baseSalary,
      bonus,
      deduction,
      attendanceBonus,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    // Check employee data
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // TODO: Get baseSalary from Employee model

    // Calculate total salary
    const total = baseSalary + bonus + attendanceBonus - deduction;

    const salary = await prisma.salary.create({
      data: {
        employeeId,
        month,
        year,
        baseSalary,
        bonus,
        deduction,
        attendanceBonus,
        total,
      },
    });

    return NextResponse.json(
      { message: "Salary created successfully", data: salary },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_SALARY_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
