import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./utils/jwt";

const publicPath = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath = publicPath.includes(path);
  const isLoggedIn = await getSession();

  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
