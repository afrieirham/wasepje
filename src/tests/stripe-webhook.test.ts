import { Readable } from "node:stream";
import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";

import handler from "@/pages/api/stripe/webhook";

const { updateMany, STRIPE_KEY, WEBHOOK_SECRET } = vi.hoisted(() => ({
  updateMany: vi.fn(),
  STRIPE_KEY: "sk_test_placeholder",
  WEBHOOK_SECRET: "whsec_test",
}));

vi.mock("@/env.mjs", () => ({
  env: {
    STRIPE_SECRET_KEY: STRIPE_KEY,
    STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
  },
}));

vi.mock("@/server/db", () => ({
  db: { user: { updateMany } },
}));

const stripe = new Stripe(STRIPE_KEY);

function checkoutCompletedEvent(
  session: Partial<Stripe.Checkout.Session>,
): string {
  return JSON.stringify({
    id: "evt_test",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test",
        object: "checkout.session",
        client_reference_id: "user_1",
        customer: "cus_1",
        payment_status: "paid",
        ...session,
      },
    },
  });
}

async function postWebhook(payload: string) {
  const header = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: WEBHOOK_SECRET,
  });

  const req = Object.assign(Readable.from([Buffer.from(payload)]), {
    method: "POST",
    headers: { "stripe-signature": header },
  }) as unknown as NextApiRequest;

  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
    send(body: unknown) {
      this.body = body;
      return this;
    },
    end() {
      return this;
    },
  };

  await handler(req, res as unknown as NextApiResponse);
  return res;
}

describe("stripe webhook: checkout.session.completed", () => {
  beforeEach(() => {
    vi.mocked(updateMany).mockReset();
    vi.mocked(updateMany).mockResolvedValue({ count: 1 });
  });

  it("does not change the plan when the session is not paid", async () => {
    const res = await postWebhook(
      checkoutCompletedEvent({ payment_status: "unpaid" }),
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ received: true });
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("upgrades the matching user to pro when the session is paid", async () => {
    const res = await postWebhook(
      checkoutCompletedEvent({ payment_status: "paid" }),
    );

    expect(res.statusCode).toBe(200);
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: "user_1" },
      data: { plan: "pro", stripeId: "cus_1" },
    });
  });
});
