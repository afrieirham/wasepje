import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  sync: privateProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      // find or create user
      const user = await ctx.db.user.upsert({
        where: { id: ctx.clerkId },
        create: { id: ctx.clerkId, email: input.email },
        update: {},
      });

      // add internal userId to clerk user
      await clerkClient().users.updateUserMetadata(ctx.clerkId, {
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

  getAuthorBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.link.findFirst({
        where: {
          slug: input.slug,
        },
        include: {
          user: true,
        },
      });
    }),

  upgradePlan: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        stripeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { email: input.email },
        data: { plan: "pro", stripeId: input.stripeId },
      });
    }),

  downgradePlan: publicProcedure
    .input(
      z.object({
        stripeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { stripeId: input.stripeId },
        data: { plan: "free", stripeId: null },
      });
    }),
});
