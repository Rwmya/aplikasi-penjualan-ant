import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const isLoggedIn = await getSession();
  if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
  const { userId } = isLoggedIn as { userId: number };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return NextResponse.json({ code: 0, data: user });
  } catch (err) {
    console.error("Error");
  } finally {
    await prisma.$disconnect();
  }
}
