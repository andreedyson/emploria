import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateFile, uploadFile } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const userId = params.id;
  let newFilename;

  try {
    const body = await req.json();
    const { name, phone, address, gender, dateOfBirth, image } = body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
    });

    if (image) {
      const fileUpload = image as File;

      // Check if there's a previous file or not
      const prevFile = new File([], user?.image as string);
      if (!prevFile) {
        const fileName = await uploadFile(image, "users");

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            name,
            phone,
            address,
            gender,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            image: !prevFile ? fileName : "",
            updatedAt: new Date(),
          },
        });

        return NextResponse.json(updatedUser, { status: 200 });
      }
      newFilename = user?.image;

      // Update image if a new one is uploaded
      if (fileUpload.size > 0) {
        newFilename = await updateFile(prevFile, fileUpload, "users");
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        image: newFilename,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/user/[userId]]", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 },
    );
  }
}
