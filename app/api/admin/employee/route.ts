import prisma from "@/lib/db";
import { uploadFile } from "@/lib/supabase";
import { editEmployeeSchema, employeeSchema } from "@/validations/admin";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

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
    departmentId,
    employeeRole,
    isActive,
    baseSalary,
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
      departmentId,
      employeeRole,
      isActive,
      baseSalary,
    });

    let fileName;

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

    // Check if the email is already associated with an inactive user
    const existingInactiveUser = await prisma.user.findFirst({
      where: {
        email: validatedFields.data.email,
        companyId: validatedFields.data.companyId,
        isActive: false, // Check if the user exists but is inactive
      },
    });

    if (existingInactiveUser) {
      await prisma.user.update({
        where: { id: existingInactiveUser.id },
        data: { isActive: true },
      });

      await prisma.employee.update({
        where: { userId: existingInactiveUser.id },
        data: { isActive: true },
      });

      return NextResponse.json(
        {
          message:
            "Account reactivated successfully, user and employee data are now active!",
        },
        { status: 200 },
      );
    }

    // Check if user email is already registered in the system
    const userExistInSystem = await prisma.user.findUnique({
      where: {
        email: validatedFields.data.email,
      },
    });

    if (userExistInSystem) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 409 },
      );
    }

    // Check if user already exist in the company
    const userExistInCompany = await prisma.user.findUnique({
      where: {
        email: validatedFields.data.email,
        companyId: company.id,
      },
    });

    if (userExistInCompany) {
      return NextResponse.json(
        {
          message: `${userExistInCompany.email} is already part of ${company.name}`,
        },
        { status: 409 },
      );
    }

    // Upload image to Supabase Storage
    if (image) {
      fileName = await uploadFile(image, "users");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new employee data
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        address: address,
        gender: gender,
        dateOfBirth: new Date(dateOfBirth),
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

    const newEmployee = await prisma.employee.create({
      data: {
        userId: newUser.id,
        companyId: validatedFields.data.companyId ?? "",
        departmentId: validatedFields.data.departmentId || null,
        role: validatedFields.data.employeeRole,
        baseSalary: validatedFields.data.baseSalary,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
        joinDate: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            dateOfBirth: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Employee successfully created", data: newEmployee },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_EMPLOYEE_ERROR]", error);
    return NextResponse.json(
      { message: "An error occured creating employee" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const {
      userId,
      name,
      email,
      phone,
      address,
      gender,
      dateOfBirth,
      image,
      companyId,
      departmentId,
      employeeRole,
      isActive,
      baseSalary,
    } = await req.json();

    const validatedFields = editEmployeeSchema.safeParse({
      name,
      email,
      phone,
      address,
      gender,
      dateOfBirth,
      image,
      companyId,
      departmentId,
      employeeRole,
      isActive,
      baseSalary,
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

    // Check if user exists
    const userExist = await prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true },
    });
    if (!userExist) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if company matches (super admin can only edit employees in their company)
    if (userExist.companyId !== companyId) {
      return NextResponse.json(
        { message: "User does not belong to this company" },
        { status: 403 },
      );
    }

    // Handle email update restrictions:
    if (email && email !== userExist.email) {
      // Check if new email already exists
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return NextResponse.json(
          { message: "Email is already registered by another user" },
          { status: 409 },
        );
      }
    }

    // Handle image upload if image is provided
    let fileName = userExist.image;
    if (image && image !== userExist.image) {
      fileName = await uploadFile(image, "users");
    }

    // Update User data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedFields.data.name,
        email: userExist.email,
        phone: validatedFields.data.phone,
        address: validatedFields.data.address,
        gender: validatedFields.data.gender,
        dateOfBirth: new Date(dateOfBirth),
        isActive: validatedFields.data.isActive,
        image: fileName,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
      },
    });

    // Update Employee data
    const updatedEmployee = await prisma.employee.update({
      where: { userId: updatedUser.id },
      data: {
        departmentId: departmentId || null,
        role: employeeRole,
        isActive: validatedFields.data.isActive,
        baseSalary: validatedFields.data.baseSalary,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
        joinDate: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            dateOfBirth: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Employee successfully updated", data: updatedEmployee },
      { status: 200 },
    );
  } catch (error) {
    console.error("[UPDATE_EMPLOYEE_ERROR]", error);
    return NextResponse.json(
      { message: "An error occurred updating employee" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Soft delete
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    await prisma.employee.update({
      where: { userId },
      data: { isActive: false },
    });

    return NextResponse.json(
      { message: "Employee and user data deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE_EMPLOYEE_ERROR]", error);
    return NextResponse.json(
      { message: "Error deleting employee/user data" },
      { status: 500 },
    );
  }
}
