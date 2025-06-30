import prisma from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { departmentSchema } from "@/validations/admin";
import { ActivityAction, ActivityTarget } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, companyId, color } = await req.json();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const validatedFields = departmentSchema.safeParse({
      name,
      color,
    });

    if (!validatedFields.success) {
      const { errors } = validatedFields.error;

      return NextResponse.json({ message: errors[0].message }, { status: 400 });
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

    // Check if department name already exist in the company
    const nameExist = await prisma.department.findFirst({
      where: {
        name: validatedFields.data.name,
        companyId: companyId,
        color: validatedFields.data.color,
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
        color: validatedFields.data.color,
        companyId: companyId,
      },
    });

    await logActivity({
      userId: token.sub,
      action: ActivityAction.CREATE,
      targetType: ActivityTarget.DEPARTMENT,
      targetId: newDepartment.id,
      companyId: companyId ?? undefined,
      description: `Company Admin: ${token.name} created a new department "${newDepartment.name}"`,
      metadata: {
        company: company.name,
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        newDepartment: {
          id: newDepartment.id,
          name: newDepartment.name,
        },
      },
    });

    return NextResponse.json(
      { message: "Department created successfully", data: newDepartment },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_DEPARTMENT_ERROR]", error);
    return NextResponse.json(
      { message: "An error occured creating department" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { departmentId, name, companyId, color } = await req.json();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const validatedFields = departmentSchema.safeParse({
      name,
      color,
    });

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
        id: companyId,
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
          companyId: companyId,
          color: validatedFields.data.color,
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
        color: validatedFields.data.color,
      },
    });

    await logActivity({
      userId: token.sub,
      action: ActivityAction.UPDATE,
      targetType: ActivityTarget.DEPARTMENT,
      targetId: updatedDepartment.id,
      companyId: companyId ?? undefined,
      description: `Company Admin: ${token.name} updated "${updatedDepartment.name}" department data`,
      metadata: {
        company: company.name,
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        updatedDepartment: {
          id: updatedDepartment.id,
          name: updatedDepartment.name,
        },
      },
    });

    return NextResponse.json(
      { message: "Department edited successfully", data: updatedDepartment },
      { status: 200 },
    );
  } catch (error) {
    console.error("[UPDATE_DEPARTMENT_ERROR]", error);
    return NextResponse.json(
      { message: "An error occured editing department" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { departmentId, companyId } = await req.json();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "SUPER_ADMIN_COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
        id: companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    const deletedDepartment = await prisma.department.delete({
      where: {
        id: departmentId,
        companyId: companyId,
      },
    });

    await logActivity({
      userId: token.sub,
      action: ActivityAction.DELETE,
      targetType: ActivityTarget.DEPARTMENT,
      targetId: deletedDepartment.id,
      companyId: companyId ?? undefined,
      description: `Company Admin: ${token.name} deleted "${deletedDepartment.name}" department`,
      metadata: {
        company: company.name,
        companyAdmin: {
          id: token.sub,
          name: token.name,
          email: token.email,
        },
        deletedDepartment: {
          id: deletedDepartment.id,
          name: deletedDepartment.name,
        },
      },
    });

    return NextResponse.json(
      { message: "Department deleted successfully", data: deletedDepartment },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE_DEPARTMENT_ERROR]", error);
    return NextResponse.json(
      { message: "An error occured deleting department" },
      { status: 500 },
    );
  }
}
