import prisma from "@/lib/db";
import { departmentSchema } from "@/validations/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, companyId } = await req.json();
  try {
    const validatedFields = departmentSchema.safeParse({ name, companyId });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    // Check company data
    const company = await prisma.company.findUnique({
      where: {
        id: validatedFields.data.companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    // Check if department name already exist in the company
    const nameExist = await prisma.department.findFirst({
      where: {
        name: validatedFields.data.name,
        companyId: validatedFields.data.companyId,
      },
    });

    if (nameExist) {
      return NextResponse.json(
        {
          message: `Department with the name of ${validatedFields.data.name} already exist`,
        },
        { status: 409 },
      );
    }

    const newDepartment = await prisma.department.create({
      data: {
        name: validatedFields.data.name,
        companyId: validatedFields.data.companyId,
      },
    });

    return NextResponse.json(
      { message: "Department created successfully", data: newDepartment },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occured creating department" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { departmentId, name, companyId } = await req.json();

  try {
    const validatedFields = departmentSchema.safeParse({ name, companyId });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
    }

    // Check department data
    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return NextResponse.json(
        { message: "Department not found" },
        { status: 404 },
      );
    }

    // Check company data
    const company = await prisma.company.findUnique({
      where: {
        id: validatedFields.data.companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    // Check if the edited name is not the same with the current department name
    if (validatedFields.data.name !== department.name) {
      // Check if department name already exist in the company
      const nameExist = await prisma.department.findFirst({
        where: {
          name: validatedFields.data.name,
          companyId: validatedFields.data.companyId,
        },
      });

      if (nameExist) {
        return NextResponse.json(
          {
            message: `Department with the name of ${validatedFields.data.name} already exist`,
          },
          { status: 409 },
        );
      }
    }

    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        name: validatedFields.data.name,
      },
    });

    return NextResponse.json(
      { message: "Department edited successfully", data: updatedDepartment },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occured editing department" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { departmentId } = await req.json();
  try {
    // Check department data
    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return NextResponse.json(
        { message: "Department not found" },
        { status: 404 },
      );
    }

    const deletedDepartment = await prisma.department.delete({
      where: {
        id: departmentId,
      },
    });

    return NextResponse.json(
      { message: "Department deleted successfully", data: deletedDepartment },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occured deleting department" },
      { status: 500 },
    );
  }
}
