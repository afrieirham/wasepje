import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/tools/:slug",
  "/:slug",
  "/api/trpc/link.getLinkBySlug",
  "/api/trpc/link.updateNextPhone",
  "/api/cron",
  "/api/stripe/webhook",
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  if (request.nextUrl.pathname === "/user-banned") {
    return NextResponse.next();
  }

  const bannedUsers = new Map([
    // ["add dev userId here to debug", true],
    ["user_2bOZasXHKUBBIzaZqg85bxiikN2", true],
    ["user_2eDhcO4gZ4Z58UFTwWnhP7oswpr", true],
  ]);

  if (bannedUsers.get(auth().userId ?? "")) {
    return NextResponse.redirect(new URL("/user-banned", request.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/dashboard", "/(api|trpc)(.*)"],
};
