import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Special case for UploadThing endpoint
  if (pathname.startsWith("/api/uploadthing")) {
    return NextResponse.next();
  }

  const roleRoutes: Record<string, string> = {
    SUPER_ADMIN: "/dashboard/super-admin",
    SUPER_ADMIN_COMPANY: "/dashboard/admin",
    USER: "/dashboard/user",
  };

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token found, user is unauthorized
    if (!token) {
      // For API routes, return JSON response
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 401 },
        );
      }

      // For page routes, redirect to login form
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }

    const userRole = token.role as keyof typeof roleRoutes;

    // Redirect '/' to the correct dashboard
    if (pathname === "/") {
      const target = roleRoutes[userRole];
      return NextResponse.redirect(new URL(target, req.url));
    }

    if (pathname.startsWith("/dashboard")) {
      if (
        (pathname.startsWith("/dashboard/super-admin") &&
          userRole !== "SUPER_ADMIN") ||
        (pathname.startsWith("/dashboard/admin") &&
          userRole !== "SUPER_ADMIN_COMPANY") ||
        (pathname.startsWith("/dashboard/user") && userRole !== "USER")
      ) {
        return NextResponse.redirect(new URL(roleRoutes[userRole], req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 403 },
      );
    }

    // Redirect to error page for non-API routes
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    // Protected pages
    "/dashboard/:path*",

    // Protected API routes
  ],
};
