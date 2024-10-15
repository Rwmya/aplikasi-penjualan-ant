// app/api/ubah-stok/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, quantity, action } = body;

    if (!id || !quantity || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const item = await prisma.barang.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 },
      );
    }

    const newQuantity =
      action === "tambah"
        ? item.jumlah + quantity
        : Math.max(0, item.jumlah - quantity);

    // Update the barang quantity
    const updatedItem = await prisma.barang.update({
      where: { id: parseInt(id) },
      data: { jumlah: newQuantity },
    });

    // Create a history entry
    await prisma.historyBarang.create({
      data: {
        barangId: updatedItem.id,
        namaBarang: updatedItem.namaBarang,
        jumlah: quantity,
        action: action,
      },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Error updating item quantity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update item quantity" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
