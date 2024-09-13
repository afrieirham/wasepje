import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
  syncUser: privateProcedure.mutation(async ({ ctx }) => {
    await syncClerkUser(ctx.clerkId);
  }),
});

export const syncClerkUser = async (clerkId: string) => {
  // find or create user
  const user = await db.user.upsert({
    where: { clerkId: clerkId },
    create: { clerkId: clerkId },
    update: {},
  });

  // add userId to links
  await db.link.updateMany({
    where: { authorId: clerkId },
    data: { userId: user.id },
  });

  // update clerk public metadata
  await clerkClient.users.updateUserMetadata(clerkId, {
    publicMetadata: { userId: user.id },
  });
  return;
};
