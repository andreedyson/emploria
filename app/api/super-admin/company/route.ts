import prisma from "@/lib/db";
import { companySchema } from "@/validations/super-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, image } = await req.json();

  try {
    const validatedFields = companySchema.safeParse({ name, image });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    const nameExist = await prisma.company.findFirst({
      where: {
        name: name,
      },
    });

    if (nameExist) {
      return NextResponse.json(
        { message: "Company Name already exist" },
        { status: 409 },
      );
    }

    // TODO: Add Supabase Image Storage Logic

    const company = await prisma.company.create({
      data: {
        name: name,
      },
    });

    return NextResponse.json(
      { message: "Company created successfully", data: company },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error creating company" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { companyId, name, image } = await req.json();

  try {
    const validatedFields = companySchema.safeParse({ name, image });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

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

    const nameExist = await prisma.company.findFirst({
      where: {
        name: name,
      },
    });

    if (validatedFields.data.name === company.name || nameExist) {
      return NextResponse.json(
        { message: "Company Name already exist" },
        { status: 409 },
      );
    }

    // TODO: Add Supabase Image Storage Logic

    const editedCompany = await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        name: name,
        image: image,
      },
    });

    return NextResponse.json(
      { message: "Company edited successfully", data: editedCompany },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error creating company" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { companyId } = await req.json();

  try {
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

    const deletedCompany = await prisma.company.delete({
      where: {
        id: companyId,
      },
    });

    // TODO: Add Supabase Image Storage Logic

    return NextResponse.json(
      { message: "Company deleted successfully", data: deletedCompany },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error creating company" },
      { status: 500 },
    );
  }
}
