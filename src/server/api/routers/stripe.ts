import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: privateProcedure
    .input(z.object({ billing: z.enum(["monthly", "annually"]) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({ where: { id: ctx.clerkId } });

      if (!user) {
        throw new TRPCError({ code: "FORBIDDEN", message: "user not found" });
      }

      const stripe = new Stripe(env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: user?.email,
        success_url: "https://wasepje.com/dashboard/links",
        cancel_url: "https://wasepje.com/dashboard/links",
        line_items: [
          {
            price:
              input.billing === "monthly"
                ? env.STRIPE_PRO_MONTHLY_PRICE_ID
                : env.STRIPE_PRO_ANNUALLY_PRICE_ID,
            quantity: 1,
          },
        ],
        submit_type: "auto",
      });

      if (!session.url)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "cannot create checkout session",
        });

      return { redirectUrl: session.url };
    }),
});
