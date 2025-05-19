import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id;

    const { name, email, companyId, isActive } = await req.json();

    if (!name || !email || !companyId) {
      return NextResponse.json(
        { message: "Name, email, and company are required." },
        { status: 400 },
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    const updateData = {
      name,
      email,
      companyId,
      isActive,
    };

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(
      { message: "User updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Edit user error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
