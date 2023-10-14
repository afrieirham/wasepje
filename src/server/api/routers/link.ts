import z from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const linkRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.db.link.findMany({
      take: 10,
      where: { authorId: ctx.currentUserId ?? "" },
      orderBy: [{ createdAt: "desc" }],
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string().trim(),
        slug: z.string().trim().toLowerCase(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;

      const link = await ctx.db.link.create({
        data: {
          authorId,
          name: input.name,
          slug: input.slug,
        },
      });

      return link;
    }),
});
