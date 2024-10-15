// app/api/barang/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { name, harga, satuan } = await request.json();

  try {
    const updatedBarang = await prisma.barang.update({
      where: { id: Number(params.id) },
      data: {
        namaBarang: name,
        harga: Number(harga),
        satuan: satuan,
      },
    });

    return NextResponse.json({ success: true, data: updatedBarang });
  } catch (error) {
    console.error("Error updating Barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update Barang" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.barang.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting Barang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete Barang" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
