import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.data;

    // Check if data is defined and is an array
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: "Invalid data format. Expected an array." },
        { status: 400 }
      );
    }

    // Capitalize the name and unit of each item
    const capitalizedItems = data.map((item: { name: string; satuan: string; harga: string }) => ({
      namaBarang: capitalize(item.name), // Capitalize item name
      satuan: capitalize(item.satuan),    // Capitalize item satuan
      harga: parseInt(item.harga, 10) || 0, // Convert harga to integer, default to 0 if NaN
      jumlah: 0,                           // Default jumlah
    }));

    // Insert capitalized items into the database using Prisma
    const addItem = await prisma.barang.createMany({
      data: capitalizedItems,
      skipDuplicates: true, // Optional: skips records with the same unique fields if needed
    });

    // Respond with the added items
    return NextResponse.json({ success: true, addItem });
  } catch (error) {
    console.error("Error saving items:", error);
    return NextResponse.json({ success: false, error: "Failed to save items" }, { status: 500 });
  }
}

// Helper function to capitalize the first letter of each word
function capitalize(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
