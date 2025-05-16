import prisma from "@/lib/db";
import { registerSchema } from "@/validations";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password, address, dateOfBirth, gender, phone } =
    await req.json();

  try {
    const userExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return NextResponse.json(
        { message: "Email is already taken" },
        { status: 409 },
      );
    }

    const response = registerSchema.safeParse({
      name,
      email,
      password,
      address,
      dateOfBirth,
      gender,
      phone,
    });

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        address: address,
        gender: gender,
        dateOfBirth: new Date(dateOfBirth),
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User successfully Registered" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
