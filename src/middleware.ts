import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, request) => {
  const pathname = request.nextUrl.pathname;
  const clerkId = auth().userId;

  if (isProtectedRoute(request)) {
    auth().protect();
  }

  // start handle banned users
  if (pathname === "/user-banned") {
    return NextResponse.next();
  }

  const bannedUsers = new Map([
    // ["add dev userId here to debug", true],
    ["user_2bOZasXHKUBBIzaZqg85bxiikN2", true],
    ["user_2eDhcO4gZ4Z58UFTwWnhP7oswpr", true],
  ]);

  if (bannedUsers.get(clerkId ?? "")) {
    return NextResponse.redirect(new URL("/user-banned", request.url));
  }
  // end handle banned users
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/dashboard", "/(api|trpc)(.*)"],
};
