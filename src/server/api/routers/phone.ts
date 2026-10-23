import { TRPCError } from "@trpc/server";
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
    .mutation(async ({ ctx, input }) => {
      const owned = await ctx.db.phone.findFirst({
        where: { id: input.id, link: { userId: ctx.clerkId } },
      });

      if (!owned) {
        throw new TRPCError({ code: "NOT_FOUND", message: "phone not found" });
      }

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
      const link = await ctx.db.link.findFirst({
        where: { id: input.linkId, userId: ctx.clerkId },
      });

      if (!link) {
        throw new TRPCError({ code: "NOT_FOUND", message: "link not found" });
      }

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
      const owned = await ctx.db.phone.findFirst({
        where: { id: input.id, link: { userId: ctx.clerkId } },
      });

      if (!owned) {
        throw new TRPCError({ code: "NOT_FOUND", message: "phone not found" });
      }

      const phone = await ctx.db.phone.delete({ where: { id: input.id } });
      return phone;
    }),
});
