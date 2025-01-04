import { NextResponse, NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/classes", request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: "/" };
