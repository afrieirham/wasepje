import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  syncUser: privateProcedure.mutation(async ({ ctx }) => {
    // find or create user
    const user = await ctx.db.user.upsert({
      where: { clerkId: ctx.clerkId },
      create: { clerkId: ctx.clerkId },
      update: {},
    });

    // add userId to links
    await ctx.db.link.updateMany({
      where: { authorId: ctx.clerkId },
      data: { userId: user.id },
    });

    // update clerk public metadata
    await clerkClient.users.updateUserMetadata(ctx.clerkId, {
      publicMetadata: { userId: user.id },
    });

    return;
  }),
});
