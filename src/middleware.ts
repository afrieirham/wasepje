import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/tools/:slug",
    "/:slug",
    "/api/trpc/link.getLinkBySlug",
    "/api/trpc/link.updateNextPhone",
  ],
  ignoredRoutes: ["/api/cron"],
  afterAuth(auth, req) {
    if (req.nextUrl.pathname === "/user-banned") {
      return NextResponse.next();
    }

    const bannedUsers = new Map([
      // ["add dev userId here", true],
      ["user_2bOZasXHKUBBIzaZqg85bxiikN2", true],
    ]);

    if (bannedUsers.get(auth.userId ?? "")) {
      return NextResponse.redirect(new URL("/user-banned", req.url));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/dashboard", "/(api|trpc)(.*)"],
};
