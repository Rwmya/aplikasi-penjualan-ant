import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { Sign } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const userData = await req.json();
    const user = await prisma.user.findUnique({
      where: {
        username: userData.username,
      },
    });

    if (user?.password !== userData.password) {
      throw new Error("username atau password anda salah");
    }

    const jwt = await Sign(user?.id);

    cookies().set("session", jwt, { httpOnly: true, secure: true, path: "/" });
    console.log("Berhasil login dengan user:\n", user);

    return NextResponse.json({ code: 0, message: "Login sukses" });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json(
        { code: 1, message: err.message },
        { status: 401 },
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}
