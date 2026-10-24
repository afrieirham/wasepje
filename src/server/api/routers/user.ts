import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  sync: privateProcedure
    .input(z.object({ email: z.email() }))
    .mutation(async ({ ctx, input }) => {
      // find or create user
      const user = await ctx.db.user.upsert({
        where: { id: ctx.clerkId },
        create: { id: ctx.clerkId, email: input.email },
        update: {},
      });

      // add internal userId to clerk user
      // clerkClient() is async in Clerk v7
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(ctx.clerkId, {
        publicMetadata: { plan: user.plan },
      });

      return user;
    }),

  getUserPlan: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({ where: { id: ctx.clerkId } });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "user not found" });
    }

    return user.plan;
  }),

  // Public: only exposes the plan, never the owner's email or Stripe ID
  getAuthorBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // A deleted user's links behave like unknown slugs
      const link = await ctx.db.link.findFirst({
        where: { slug: input.slug, user: { deletedAt: null } },
        select: { user: { select: { plan: true } } },
      });

      return link ? { plan: link.user.plan } : null;
    }),
});
