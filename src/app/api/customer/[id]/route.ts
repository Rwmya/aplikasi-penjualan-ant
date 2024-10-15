import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const updatedCustomer = await prisma.customer.update({
      where: { id: Number(params.id) },
      data: body,
    });
    return NextResponse.json({ success: true, data: updatedCustomer });
  } catch (error) {
    console.error("Error updating Customer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update Customer" },
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
    await prisma.customer.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting Customer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete Customer" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
