import prisma from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { superAdminUserSchema } from "@/validations/super-admin";
import { ActivityAction, ActivityTarget } from "@prisma/client";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password, companyId } = await req.json();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const validatedFields = superAdminUserSchema.safeParse({
      name,
      email,
      password,
      companyId,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    // Check existing user
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
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

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the SUPER_ADMIN_COMPANY user
    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        role: "SUPER_ADMIN_COMPANY",
        companyId: companyId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
      },
    });

    await logActivity({
      userId: token.sub,
      action: ActivityAction.CREATE,
      targetType: ActivityTarget.USER,
      targetId: newUser.id,
      companyId: newUser.companyId ?? undefined,
      description: `Admin ${token.name} registered a new Company Admin Account for ${company.name}`,
      metadata: {
        company: company.name,
        newUser: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
    });

    return NextResponse.json(
      { message: "Super Admin Company successfully created", data: newUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_SUPER_ADMIN_USER_ERROR]", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 },
    );
  }
}
