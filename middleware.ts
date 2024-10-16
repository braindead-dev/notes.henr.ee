// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Load allowed users from the environment variables
const allowedUsers = process.env.ALLOWED_USERS?.split(",") || [];

export default withAuth(
  function middleware(req) {
    const { pathname, origin } = req.nextUrl;

    if (pathname.startsWith("/admin")) {
      const token = req.nextauth.token;

      // Check if the user ID is allowed to access
      if (!token || typeof token.id !== "number" || !allowedUsers.includes(token.id.toString())) {
        const signInUrl = new URL("/auth/signin", origin);
        signInUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(signInUrl);
      }
    }
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
