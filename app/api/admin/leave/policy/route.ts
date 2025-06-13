import prisma from "@/lib/db";
import { leavePolicySchema } from "@/validations/admin";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { companyId, leaveType, frequency, allowedDays } = await req.json();

  try {
    const validatedFields = leavePolicySchema.safeParse({
      companyId,
      leaveType,
      frequency,
      allowedDays,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: validatedFields.error.errors[0].message },
        { status: 400 },
      );
    }

    // Check company data
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    // Check if there's an existing policy
    const existingPolicy = await prisma.leavePolicy.findFirst({
      where: {
        companyId: validatedFields.data.companyId,
        leaveType: validatedFields.data.leaveType,
      },
    });

    if (existingPolicy) {
      return NextResponse.json(
        {
          message: "Leave policy for this type already exists in this company",
        },
        { status: 400 },
      );
    }

    const leavePolicy = await prisma.leavePolicy.create({
      data: {
        companyId: validatedFields.data.companyId,
        leaveType: validatedFields.data.leaveType,
        frequency: validatedFields.data.frequency,
        allowedDays: validatedFields.data.allowedDays,
      },
    });

    return NextResponse.json(
      { message: "Leave policy successfully created", data: leavePolicy },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_LEAVE_POLICY_ERROR]", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message:
            "A leave policy with this company and leave type already exists.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
