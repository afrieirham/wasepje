import z from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

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
});
