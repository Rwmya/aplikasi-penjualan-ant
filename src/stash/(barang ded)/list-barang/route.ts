// app/api/list-barang/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const barangData = await prisma.barang.findMany({
      select: {
        id: true,
        namaBarang: true,
        jumlah: true,
        satuan: true,
        harga: true, // Add this line to fetch the harga
      },
    });

    const formattedData = barangData.map((item) => ({
      key: item.id.toString(),
      name: item.namaBarang,
      satuan: item.satuan,
      quantity: item.jumlah,
      harga: item.harga, // Include harga in the formatted data
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching Barang data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Barang data" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
