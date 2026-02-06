import { NextResponse } from "next/server";

// Auth disabled — all routes are public
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
