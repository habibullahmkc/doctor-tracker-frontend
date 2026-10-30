import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "token";
const PUBLIC_PATHS = ["/login"];

const secret = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;

if (!secret) {
  console.warn("[proxy] JWT_SECRET is not set — every request will be treated as unauthenticated.");
}

async function hasValidSession(token: string | undefined) {
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

/**
 * Optimistic auth check before any page renders. This is a UX layer only —
 * the Express API re-verifies the cookie on every request (requireAuth).
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const authenticated = await hasValidSession(request.cookies.get(AUTH_COOKIE)?.value);

  if (!authenticated && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname + search);
    const response = NextResponse.redirect(loginUrl);
    // Drop an expired/invalid cookie so the browser doesn't keep sending it.
    if (request.cookies.has(AUTH_COOKIE)) response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  if (authenticated && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Everything except API proxying, Next internals and static files.
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
