import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const action = searchParams.get("action");

    if (!startDate || !endDate || !action) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 },
      );
    }

    const start = new Date(startDate);
    // Adjust start date to UTC-7
    start.setHours(start.getHours() - 7);

    const end = new Date(endDate);
    // Set end date to the start of the next day in UTC
    end.setUTCHours(0, 0, 0, 0); // Start of the day in UTC
    end.setDate(end.getDate() + 1); // Move to the next day
    end.setHours(end.getHours() - 7); // Adjust to UTC-7

    const historyData = await prisma.historyBarang.findMany({
      where: {
        changedAt: {
          gte: start,
          lte: end,
        },
        action: action,
      },
      select: {
        namaBarang: true,
        jumlah: true,
        action: true,
        changedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: historyData });
  } catch (error) {
    console.error("Error fetching HistoryBarang data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch HistoryBarang data" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
