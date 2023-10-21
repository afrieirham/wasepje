import { linkRouter } from "~/server/api/routers/link";
import { createTRPCRouter } from "~/server/api/trpc";
import { phoneRouter } from "./routers/phone";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  link: linkRouter,
  phone: phoneRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
