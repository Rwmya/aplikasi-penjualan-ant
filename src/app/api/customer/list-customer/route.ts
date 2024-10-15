import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const customerData = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        field: true,
        debt: true,
      },
    });

    const formattedData = customerData.map((item) => ({
      key: item.id.toString(),
      name: item.name,
      field: item.field,
      debt: item.debt,
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching Customer data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Customer data" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
