import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const { status } = await req.json();

  try {
    const statusSchema = z.enum(["PAID", "UNPAID"]);
    const parse = statusSchema.safeParse(status);
    if (!parse.success) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const updatedSalary = await prisma.salary.update({
      where: { id: params.id },
      data: { status: status, paidAt: new Date() },
    });

    return NextResponse.json(
      { message: "Salary status updated successfully", data: updatedSalary },
      { status: 200 },
    );
  } catch (error) {
    console.error("[UPDATE_SALARY_STATUS_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
