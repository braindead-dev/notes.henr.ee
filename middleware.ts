// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { rateLimit } from './utils/rateLimit';

// Load allowed users from the environment variables
const allowedUsers = process.env.ALLOWED_USERS?.split(",") || [];

// Create rate limiters for different endpoints
const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

const adminLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 100
});

export default withAuth(
  async function middleware(req) {
    const { pathname, origin } = req.nextUrl;
    const ip = req.ip ?? '127.0.0.1';

    try {
      // Apply rate limiting based on path
      if (pathname.startsWith("/api/admin")) {
        await adminLimiter.check(ip, 100); // Stricter limit for admin routes
      } else if (pathname.startsWith("/api")) {
        await apiLimiter.check(ip, 30); // General API rate limit
      }

      // Existing admin authentication logic
      if (pathname.startsWith("/admin")) {
        const token = req.nextauth.token;
        if (!token || typeof token.id !== "number" || !allowedUsers.includes(token.id.toString())) {
          const signInUrl = new URL("/auth/signin", origin);
          signInUrl.searchParams.set("callbackUrl", req.url);
          return NextResponse.redirect(signInUrl);
        }
      }

      return NextResponse.next();
    } catch {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*"
  ],
};
