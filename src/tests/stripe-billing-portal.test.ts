import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { stripeRouter } from "@/server/api/routers/stripe";

const { findFirst, portalCreate } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  portalCreate: vi.fn(),
}));

vi.mock("@/env.mjs", () => ({
  env: {
    STRIPE_SECRET_KEY: "sk_test_placeholder",
    APP_URL: "https://app.test",
  },
}));

vi.mock("@/server/db", () => ({
  db: { user: { findFirst } },
}));

vi.mock("stripe", () => ({
  default: class {
    billingPortal = { sessions: { create: portalCreate } };
  },
}));

const caller = stripeRouter.createCaller({
  db: { user: { findFirst } },
  clerkId: "user_1",
} as unknown as Parameters<typeof stripeRouter.createCaller>[0]);

describe("createBillingPortalSession", () => {
  beforeEach(() => {
    findFirst.mockReset();
    portalCreate.mockReset();
  });

  it("creates a portal session for the signed-in user's Stripe customer", async () => {
    findFirst.mockResolvedValue({ id: "user_1", stripeId: "cus_1" });
    portalCreate.mockResolvedValue({
      url: "https://billing.stripe.com/p/session/abc",
    });

    const result = await caller.createBillingPortalSession();

    expect(portalCreate).toHaveBeenCalledWith({
      customer: "cus_1",
      return_url: "https://app.test/dashboard/links",
    });
    expect(result).toEqual({
      redirectUrl: "https://billing.stripe.com/p/session/abc",
    });
  });

  it("rejects a user without a Stripe customer", async () => {
    findFirst.mockResolvedValue({ id: "user_1", stripeId: null });

    await expect(caller.createBillingPortalSession()).rejects.toBeInstanceOf(
      TRPCError,
    );
    expect(portalCreate).not.toHaveBeenCalled();
  });
});
