import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateFile, uploadFile } from "@/lib/supabase";
import { ActivityAction, ActivityTarget, Gender } from "@prisma/client";
import { logActivity } from "@/lib/log-activity";
import { getToken } from "next-auth/jwt";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
  const userId = params.userId;
  let newFilename;

  if (!userId) {
    return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const gender = formData.get("gender") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;

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
            image: !prevFile ? fileName : "",
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
        image: newFilename,
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined,
        gender: (gender as Gender) || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
    });

    await logActivity({
      userId: token.sub,
      action: ActivityAction.UPDATE,
      targetType: ActivityTarget.USER,
      targetId: updatedUser.id,
      companyId: updatedUser.companyId ?? undefined,
      description: `${updatedUser.name} updated their user profile`,
      metadata: {
        companyId: updatedUser.companyId,
        updatedUser: {
          id: updatedUser.id,
          email: updatedUser.email,
        },
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/user/[userId]", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 },
    );
  }
}
