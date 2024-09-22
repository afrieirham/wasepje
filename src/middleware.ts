import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkReserved } from "./server/api/routers/link";

const isPublicRoute = createRouteMatcher([
  "/",
  "/tools/:slug",
  "/api/trpc/link.getLinkBySlug",
  "/api/trpc/link.updateNextPhone",
  "/api/cron",
  "/api/clerk/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const clerkId = auth().userId;

  if (!isPublicRoute(request)) {
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

  // start check link plan
  const isOneSlash = pathname.split("/").length === 2;
  const cleanPathname = pathname.replace("/", "");
  const isReserved = checkReserved(cleanPathname);

  if (isOneSlash && !isReserved) {
    const res = await fetch(new URL("/api/plan-check", request.url), {
      method: "post",
      body: cleanPathname,
    });

    const { plan } = (await res.json()) as { plan: "free" | "pro" };

    if (plan === "free") {
      return NextResponse.rewrite(
        new URL(`/free/${cleanPathname}`, request.url),
      );
    }

    if (plan) {
      return NextResponse.rewrite(
        new URL(`/skip/${cleanPathname}`, request.url),
      );
    }

    // TODO: add link not found page
    return NextResponse.next();
  }
  // end check link plan

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/dashboard", "/(api|trpc)(.*)"],
};
