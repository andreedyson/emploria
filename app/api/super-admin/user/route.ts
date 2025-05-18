import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { superAdminUserSchema } from "@/validations/super-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password, companyId } = await req.json();
  try {
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

    return NextResponse.json(
      { message: "Super Admin Company successfully created", data: newUser },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 },
    );
  }
}
