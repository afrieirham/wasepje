import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Next.js 16 renamed middleware to proxy. protect() returns a Promise in
// Clerk v7, so it must be awaited or the redirect never happens.
export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/dashboard", "/(api|trpc)(.*)"],
};
