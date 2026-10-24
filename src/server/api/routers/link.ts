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
import slugify from "slugify";

import { type db } from "@/server/db";

export const checkReserved = (path: string) =>
  reservedSlug.some((p) => p === path);

export const LINK_NAME_MAX_LENGTH = 100;

const linkName = z.string().trim().max(LINK_NAME_MAX_LENGTH);

// Plan comes from the DB, never from the client
const isProUser = async (database: typeof db, clerkId: string) => {
  const user = await database.user.findFirst({
    where: { id: clerkId },
    select: { plan: true },
  });
  return user?.plan === "pro";
};

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

  getHasCustomSlugLinks: privateProcedure.query(async ({ ctx }) => {
    const link = await ctx.db.link.findFirst({
      where: {
        userId: ctx.clerkId,
        customSlug: { not: null },
      },
      select: { id: true },
    });
    return { hasCustomSlugLinks: !!link };
  }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().trim(),
        customSlug: z.string().trim().toLowerCase(),
        message: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isPro = await isProUser(ctx.db, ctx.clerkId);
      // Free users can't touch customSlug; an empty value clears it
      const customSlug = isPro ? input.customSlug || null : undefined;

      if (checkReserved(customSlug ?? "")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reserved word for slug.",
        });
      }

      // Existing links may already be over the limit; only a changed name is capped
      const current = await ctx.db.link.findFirst({
        where: { id: input.id, userId: ctx.clerkId },
        select: { name: true },
      });
      if (
        input.name !== current?.name &&
        input.name.length > LINK_NAME_MAX_LENGTH
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Link name is too long.",
        });
      }

      // 2. Cross-Column Uniqueness Check
      // We check if the slug is taken in either column (slug OR customSlug)
      if (customSlug) {
        const conflict = await ctx.db.link.findFirst({
          where: {
            id: { not: input.id },
            OR: [{ slug: customSlug }, { customSlug: customSlug }],
          },
        });

        if (conflict) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Slug already taken.",
          });
        }
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
        name: linkName,
        customSlug: z.string().trim().toLowerCase(),
        message: z.string().optional(),
        phones: z.array(
          z.object({
            value: z.string().trim(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
      const random = customAlphabet(alphabet, 5)(5);

      // System slug is always generated here so free users can't pick one
      const base = slugify(input.name, { lower: true, strict: true });
      const systemSlug = base ? `${base}-${random}` : random;

      const isPro = await isProUser(ctx.db, ctx.clerkId);
      const customSlug = isPro ? input.customSlug || null : null;

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
        id: z.string().max(64),
        metadata: z.object({
          browser: z.string().max(100),
          country: z.string().max(100),
          continent: z.string().max(100),
          device: z.string().max(100),
          os: z.string().max(100),
          referrer: z.string().max(2048),
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
