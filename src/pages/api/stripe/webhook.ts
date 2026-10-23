import type { NextApiRequest, NextApiResponse } from "next";

import { buffer } from "micro";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import { db } from "@/server/db";

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
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing stripe-signature header");
  }

  let event;

  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    event = await stripe.webhooks.constructEvent(
      buf.toString(),
      sig,
      webhookSecret,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
    return;
  }

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
      // updateMany so an unknown email is acknowledged instead of retried forever
      const { count } = await db.user.updateMany({
        where: { email },
        data: { plan: "pro", stripeId },
      });
      if (count === 0) console.log(`no user found for email ${email}`);
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

      const { count } = await db.user.updateMany({
        where: { stripeId },
        data: { plan: "free", stripeId: null },
      });
      if (count === 0) console.log(`no user found for stripeId ${stripeId}`);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
