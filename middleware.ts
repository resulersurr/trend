import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminSessionValue } from "@/lib/security/admin-auth";

function unauthorizedApi() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedApi = pathname.startsWith("/api/admin") || pathname.startsWith("/api/ai");
  const isLoginRoute = pathname === "/admin/login" || pathname.startsWith("/api/admin/auth/login");
  const isAuthed = verifyAdminSessionValue(request.cookies.get("admin_session")?.value);

  if (isLoginRoute && pathname === "/admin/login") {
    // Redirect authenticated users away from login page.
    return isAuthed.then((authed) => {
      if (!authed) return NextResponse.next();
      return NextResponse.redirect(new URL("/admin", request.url));
    });
  }

  if (isLoginRoute) return NextResponse.next();

  if (isAdminPage) {
    return isAuthed.then((authed) => {
      if (authed) return NextResponse.next();
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    });
  }

  if (isProtectedApi) {
    return isAuthed.then((authed) => {
      if (authed) return NextResponse.next();
      return unauthorizedApi();
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/ai/:path*"],
};
