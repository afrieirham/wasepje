import z from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const linkRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.db.link.findMany({
      take: 10,
      where: { authorId: ctx.currentUserId ?? "" },
      orderBy: [{ createdAt: "desc" }],
    });
  }),

  getOne: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.link.findFirst({
        where: { slug: input.slug },
        include: { phones: true },
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
          nextPhone: 0,
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

  updateNextPhone: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.db.link.findFirstOrThrow({
        where: { id: input.id },
        include: { phones: true },
      });

      const { nextPhone, phones } = link;

      let newNextPhone = Number(nextPhone + 1);

      if (newNextPhone > phones.length - 1) {
        newNextPhone = 0;
      }

      return await ctx.db.link.update({
        data: { nextPhone: newNextPhone },
        where: { id: input.id },
      });
    }),
});
