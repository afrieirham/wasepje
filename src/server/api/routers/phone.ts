import z from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const phoneRouter = createTRPCRouter({
  updateOne: privateProcedure
    .input(
      z.object({
        id: z.string(),
        number: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.phone.update({
        where: { id: input.id },
        data: { number: input.number },
      });
    }),

  addOne: privateProcedure
    .input(
      z.object({
        linkId: z.string(),
        number: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const phone = await ctx.db.phone.create({
        data: { number: input.number, linkId: input.linkId },
      });

      return phone;
    }),

  deleteOne: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const phone = await ctx.db.phone.delete({ where: { id: input.id } });
      return phone;
    }),
});
