// /api/transaksi/history-transaksi
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 },
      );
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Start of the day

    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0); // Start of the next day
    end.setDate(end.getDate() + 1); // Move to the next day

    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: start,
          lt: end,
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            barang: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
