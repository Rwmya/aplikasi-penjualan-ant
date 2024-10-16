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
        { status: 400 },
      );
    }

    // Create customers
    const customersToCreate = data.map(
      (customer: { name: string; field: string }) => ({
        name: customer.name,
        field: customer.field,
        debt: 0, // Default debt
      }),
    );

    // Insert customers into the database using Prisma
    const createdCustomers = await prisma.customer.createMany({
      data: customersToCreate,
      skipDuplicates: true, // Optional: skips records with the same unique fields if needed
    });

    // Respond with the added customers
    return NextResponse.json({ success: true, createdCustomers });
  } catch (error) {
    console.error("Error saving customers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save customers" },
      { status: 500 },
    );
  }
}
