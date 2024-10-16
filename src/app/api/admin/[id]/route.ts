// /api/admin/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface User {
  username: string;
  password?: string;
  updatedAt: Date;
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const updateData: User = {
      username: body.username,
      updatedAt: new Date(), // Update the timestamp
    };

    // Check if the password meets the criteria before updating
    if (body.password && body.password.length >= 8) {
      updateData.password = body.password; // Only include if valid
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating User:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update User" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting User:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete User" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
