import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  cookies().delete("session");
  console.log("Logout sukses");
  return NextResponse.json({ code: 0, message: "Logout sukses" });
}
