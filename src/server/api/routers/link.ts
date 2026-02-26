import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { reservedSlug } from "@/constants/reserved-slug";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { customAlphabet } from "nanoid";

export const checkReserved = (path: string) =>
  reservedSlug.some((p) => p === path);

export const linkRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    const today = new Date();
    const last30days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return ctx.db.link.findMany({
      // take: 10,
      where: { userId: ctx.clerkId },
      include: {
        _count: {
          select: {
            clicks: { where: { createdAt: { gte: last30days } } },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }),

  getOne: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.link.findFirst({
        where: { id: input.id, userId: ctx.clerkId },
        include: { phones: true },
      });
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().trim(),
        customSlug: z.string().trim().toLowerCase(),
        message: z.string().optional(),
        plan: z.enum(["free", "pro"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const customSlug = input.plan === "pro" ? input.customSlug : undefined;

      if (checkReserved(customSlug ?? "")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reserved word for slug.",
        });
      }

      // 2. Cross-Column Uniqueness Check
      // We check if the slug is taken in either column (slug OR customSlug)
      const conflict = await ctx.db.link.findFirst({
        where: {
          id: { not: input.id },
          OR: [
            { slug: customSlug ?? "" },
            { customSlug: customSlug },
            ...(customSlug
              ? [{ slug: customSlug }, { customSlug: customSlug }]
              : []),
          ],
        },
      });

      if (conflict) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Slug already taken.",
        });
      }

      try {
        const link = await ctx.db.link.update({
          where: { id: input.id, userId: ctx.clerkId },
          data: {
            name: input.name,
            customSlug,
            message: input.message,
          },
        });
        return link;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Slug has been used.",
            });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string().trim(),
        slug: z.string().trim().toLowerCase(),
        customSlug: z.string().trim().toLowerCase(),
        message: z.string().optional(),
        phones: z.array(
          z.object({
            value: z.string().trim(),
          }),
        ),
        plan: z.enum(["free", "pro"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
      const random = customAlphabet(alphabet, 5)(5);

      const systemSlug = input.slug.length === 0 ? random : input.slug;
      const customSlug = input.plan === "pro" ? input.customSlug : null;

      if (checkReserved(customSlug ?? "")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reserved word for slug.",
        });
      }

      // 2. Cross-Column Uniqueness Check
      // We check if the slug is taken in either column (slug OR customSlug)
      const conflict = await ctx.db.link.findFirst({
        where: {
          OR: [
            { slug: systemSlug },
            { customSlug: systemSlug },
            ...(customSlug
              ? [{ slug: customSlug }, { customSlug: customSlug }]
              : []),
          ],
        },
      });

      if (conflict) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Slug already taken.",
        });
      }

      try {
        const link = await ctx.db.link.create({
          data: {
            name: input.name,
            slug: systemSlug,
            customSlug,
            message: input.message,
            nextPhone: 0,
            userId: ctx.clerkId,
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
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Slug has been used.",
            });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
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
          userId: ctx.clerkId,
        },
      });

      return link;
    }),

  updateNextPhone: publicProcedure
    .input(
      z.object({
        id: z.string(),
        metadata: z.object({
          browser: z.string(),
          country: z.string(),
          continent: z.string(),
          device: z.string(),
          os: z.string(),
          referrer: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.db.link.findFirstOrThrow({
        where: { id: input.id },
        include: { phones: true },
      });

      // update next phone
      const { nextPhone, phones } = link;
      let newNextPhone = Number(nextPhone + 1);
      if (newNextPhone > phones.length - 1) {
        newNextPhone = 0;
      }
      await ctx.db.link.update({
        data: { nextPhone: newNextPhone },
        where: { id: input.id },
      });

      return await ctx.db.click.create({
        data: { ...input.metadata, linkId: input.id },
      });
    }),
});
