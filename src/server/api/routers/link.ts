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
        phones: z.array(
          z.object({
            value: z.string().trim(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;

      const link = await ctx.db.link.create({
        data: {
          authorId,
          name: input.name,
          slug: input.slug,
          phones: {
            createMany: {
              data: input.phones.map((p) => ({ number: p.value })),
            },
          },
        },
        include: {
          phones: true,
        },
      });

      return link;
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.db.link.delete({
        where: {
          id: input.id,
        },
      });

      return link;
    }),
});
