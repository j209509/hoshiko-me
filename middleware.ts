import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// 認証不要のパス
const publicPaths = ["/", "/auth/signin", "/auth/error", "/review"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // publicPaths は認証不要
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  if (isPublic) return NextResponse.next();

  // 未認証なら signin へ
  if (!req.auth) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
