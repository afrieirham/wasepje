import type { NextApiRequest, NextApiResponse } from "next";

import { buffer } from "micro";
import Stripe from "stripe";

import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405);
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    res.status(500);
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
    return;
  }

  const caller = appRouter.createCaller({ db, clerkId: "" });

  switch (event.type) {
    case "checkout.session.completed": {
      const email = event.data.object.customer_email;
      if (!email) {
        console.log("user email not found");
        break;
      }

      const customer = event.data.object.customer;
      if (!customer) {
        console.log("customer not created");
        break;
      }

      const stripeId = typeof customer === "string" ? customer : customer.id;
      await caller.user.upgradePlan({ email, stripeId });
      res.json({ received: true });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
        { expand: ["customer"] },
      );

      const stripeId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      await caller.user.downgradePlan({ stripeId });
      res.json({ received: true });
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
