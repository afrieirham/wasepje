import Stripe from "stripe";

import { env } from "@/env.mjs";
import { db } from "@/server/db";

// How long a deleted account waits before purge; see docs/adr/0004
export const RETENTION_DAYS = 14;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function retentionCutoff() {
  return new Date(Date.now() - RETENTION_DAYS * DAY_IN_MS);
}

// Subscriptions that can still bill. Ended ones are skipped.
async function liveSubscriptions(stripe: Stripe, customerId: string) {
  const live: Stripe.Subscription[] = [];

  try {
    for await (const subscription of stripe.subscriptions.list({
      customer: customerId,
    })) {
      if (
        subscription.status === "canceled" ||
        subscription.status === "incomplete_expired"
      ) {
        continue;
      }
      live.push(subscription);
    }
  } catch (err) {
    // A customer Stripe no longer knows has no subscription left
    if (
      err instanceof Stripe.errors.StripeInvalidRequestError &&
      err.code === "resource_missing"
    ) {
      return [];
    }
    throw err;
  }

  return live;
}

// Stops renewal without ending access yet. The user keeps Pro until the period ends.
export async function stopRenewal(customerId: string) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  for (const subscription of await liveSubscriptions(stripe, customerId)) {
    if (!subscription.cancel_at_period_end) {
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      });
    }
  }
}

// Undoes stopRenewal when a deleted account is restored in time. Returns false when
// no subscription is still live, so the caller can drop the user to free.
export async function resumeRenewal(customerId: string) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const live = await liveSubscriptions(stripe, customerId);

  for (const subscription of live) {
    if (subscription.cancel_at_period_end) {
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: false,
      });
    }
  }

  return live.length > 0;
}

// Ends billing now, then removes the row. Cascade removes its links and clicks.
// The Stripe step runs first: if it fails, the row stays and the next run retries.
export async function purge(user: { id: string; stripeId: string | null }) {
  if (user.stripeId) {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    for (const subscription of await liveSubscriptions(stripe, user.stripeId)) {
      await stripe.subscriptions.cancel(subscription.id);
    }
  }

  await db.user.deleteMany({ where: { id: user.id } });
}
