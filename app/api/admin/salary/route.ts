import prisma from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { salarySchema } from "@/validations/admin";
import { ActivityAction, ActivityTarget, Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { employeeId, month, year, bonus, deduction } = await req.json();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    const presentAttendaceThisMonth = attendanceThisMonth.filter(
      (att) => att.status === "PRESENT",
    );
    const attendanceBonus =
      presentAttendaceThisMonth.length * (company?.attendanceBonusRate ?? 0);

    const lateAttendanceThisMonth = attendanceThisMonth.filter(
      (att) => att.status === "LATE",
    );
    const lateDeduction =
      lateAttendanceThisMonth.length *
      (company?.lateAttendancePenaltyRate ?? 0);

    // Calculate total salary
    const total = Math.max(
      0,
      baseSalary + bonus + attendanceBonus - (deduction + lateDeduction),
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
        latePenalty: lateDeduction,
        total: total,
      },
      include: {
        employee: {
          select: {
            companyId: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    await logActivity({
      userId: token.sub,
      action: ActivityAction.CREATE,
      targetType: ActivityTarget.SALARY,
      targetId: salary.id,
      companyId: salary.employee.companyId ?? undefined,
      description: `${token.name} (Company Admin) generated a new payslip for ${salary.employee.user.name} for ${salary.month} ${salary.year}`,
      metadata: {
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        newSalary: {
          id: salary.id,
          employee: salary.employee.user.name,
          month: salary.month,
          year: salary.year,
          total: salary.total,
        },
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

export async function PUT(req: NextRequest) {
  const { salaryId, employeeId, month, year, bonus, deduction } =
    await req.json();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    // Check salary data
    const salary = await prisma.salary.findUnique({
      where: {
        id: salaryId,
      },
    });

    if (!salary) {
      return NextResponse.json(
        { message: "Salary not found" },
        { status: 404 },
      );
    }

    // Check for salary status, don't allow edit on 'PAID' salary
    if (salary.status === "PAID") {
      return NextResponse.json(
        { message: "Cannot edit a payslip that has been marked as PAID" },
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

    const updatedSalary = await prisma.salary.update({
      where: {
        id: salaryId,
      },
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
      include: {
        employee: {
          select: {
            companyId: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    await logActivity({
      userId: token.sub,
      action: ActivityAction.UPDATE,
      targetType: ActivityTarget.SALARY,
      targetId: updatedSalary.id,
      companyId: updatedSalary.employee.companyId ?? undefined,
      description: `${token.name} (Company Admin) updated a salary data of ${updatedSalary.employee.user.name} for ${updatedSalary.month} ${updatedSalary.year}`,
      metadata: {
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        updatedSalary: {
          id: updatedSalary.id,
          employee: updatedSalary.employee.user.name,
          month: updatedSalary.month,
          year: updatedSalary.year,
        },
      },
    });

    return NextResponse.json(
      { message: "Salary edited successfully", data: updatedSalary },
      { status: 201 },
    );
  } catch (error) {
    console.error("[UPDATE_SALARY_ERROR]", error);
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
