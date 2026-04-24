import { NextRequest, NextResponse } from "next/server";

// 認証不要のパス
const publicPaths = ["/", "/auth/signin", "/auth/error", "/review"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // publicPaths は認証不要
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  if (isPublic) return NextResponse.next();

  // NextAuth v5 のセッションCookieを確認
  // HTTPSでは __Secure- プレフィックスが付く
  const sessionToken =
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("authjs.session-token")?.value;

  if (!sessionToken) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
