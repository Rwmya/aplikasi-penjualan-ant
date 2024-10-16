// /api/admin/list-user/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userData = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const formattedData = userData.map((item) => ({
      key: item.id.toString(),
      username: item.username,
      password: item.password,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching User data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch User data" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
