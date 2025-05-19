import prisma from "@/lib/db";
import { deleteFiles, updateFile, uploadFile } from "@/lib/supabase";
import { companySchema } from "@/validations/super-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const image = formData.get("image") as File;
  let fileName;

  try {
    const validatedFields = companySchema.safeParse({ name, image });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;
      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    const nameExist = await prisma.company.findFirst({
      where: { name },
    });

    if (nameExist) {
      return NextResponse.json(
        { message: "Company Name already exist" },
        { status: 409 },
      );
    }

    // Upload image to Supabase Storage
    if (image) {
      fileName = await uploadFile(image, "companies");
    }

    const company = await prisma.company.create({
      data: {
        name,
        image: image ? fileName : "",
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
  const formData = await req.formData();
  const companyId = formData.get("companyId") as string;
  const name = formData.get("name") as string;
  const image = formData.get("image") as File | null;
  let newFilename;

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
        name,
        NOT: {
          id: companyId, // allow renaming to same name if it's the same company
        },
      },
    });

    if (nameExist) {
      return NextResponse.json(
        { message: "Company Name already exist" },
        { status: 409 },
      );
    }

    if (image) {
      const fileUpload = image as File;

      const prevFile = new File([], company.image as string);
      newFilename = company.image;

      // Update image if a new one is uploaded
      if (fileUpload.size > 0) {
        newFilename = await updateFile(prevFile, fileUpload, "companies");
      }
    }

    const editedCompany = await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        name,
        image: newFilename,
      },
    });

    return NextResponse.json(
      { message: "Company edited successfully", data: editedCompany },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error updating company" },
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

    await deleteFiles([company.image as string], "companies");

    const deletedCompany = await prisma.company.delete({
      where: {
        id: companyId,
      },
    });

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
