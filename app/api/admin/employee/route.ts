import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { employeeSchema } from "@/validations/admin";
import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const {
    name,
    email,
    password,
    phone,
    address,
    gender,
    dateOfBirth,
    image,
    companyId,
  } = await req.json();

  try {
    // Check user inputs
    const validatedFields = employeeSchema.safeParse({
      name,
      email,
      password,
      phone,
      address,
      gender,
      dateOfBirth,
      image,
      companyId,
    });

    let fileName;

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    // Check if user already exist in the company
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 400 },
      );
    }

    const userExistInCompany = await prisma.user.findUnique({
      where: {
        email: validatedFields.data.email,
        companyId: company.id,
      },
    });

    if (userExistInCompany) {
      return NextResponse.json(
        { message: `That user is already part of ${company.name}` },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Upload image to Supabase Storage
    if (image) {
      fileName = await uploadFile(image, "users");
    }

    // Create a new employee data
    const newEmployee = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        address: address,
        gender: gender,
        dateOfBirth: dateOfBirth,
        image: image ? fileName : "",
        password: hashedPassword,
        role: "USER",
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
      { message: "Employee successfully created", data: newEmployee },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occured creating employee" },
      { status: 500 },
    );
  }
}
