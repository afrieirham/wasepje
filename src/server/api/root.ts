import { createTRPCRouter } from "@/server/api/trpc";

import { linkRouter } from "@/server/api/routers/link";
import { phoneRouter } from "@/server/api/routers/phone";
import { stripeRouter } from "@/server/api/routers/stripe";
import { userRouter } from "@/server/api/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  link: linkRouter,
  phone: phoneRouter,
  stripe: stripeRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
