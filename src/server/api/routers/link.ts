import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const linkRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.link.findMany({ take: 10 });
  }),
});
