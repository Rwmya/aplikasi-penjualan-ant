import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const userData = await req.json();
    const user = await prisma.user.create({
      data: { username: userData.username, password: userData.password },
    });

    console.log("Akun berhasil dibuat\n", user);
    return NextResponse.json({ code: 0, message: "user berhasil dibuat!" });
  } catch (err) {
    console.log("Error, username telah digunakan");
    return NextResponse.json(
      {
        code: 1,
        message: "error, username telah digunakan. Harap gunakan username lain",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
