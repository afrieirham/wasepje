import { Readable } from "node:stream";

import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { Webhook } from "svix";
import { beforeEach, describe, expect, it, vi } from "vitest";

import handler from "@/pages/api/clerk/webhook";

const { SECRET, users, links, fakeDb, stripeSubscriptions } = vi.hoisted(() => {
  const SECRET = `whsec_${Buffer.from("test-secret").toString("base64")}`;

  const users = new Map<
    string,
    {
      id: string;
      email: string;
      plan: string;
      stripeId?: string | null;
      deletedAt?: Date | null;
    }
  >();

  // In-memory stand-in for the Link table, keyed by its owner's User id
  const links: { slug: string; userId: string }[] = [];

  // In-memory stand-in for Prisma's user queries, keyed by Clerk user id
  const fakeDb = {
    user: {
      upsert: vi.fn(
        ({
          where,
          create,
          update,
        }: {
          where: { id: string };
          create: { id: string; email: string };
          update: { email?: string };
        }) => {
          const existing = users.get(where.id);
          if (existing) {
            Object.assign(existing, update);
            return Promise.resolve(existing);
          }
          const user = { plan: "free", ...create };
          users.set(user.id, user);
          return Promise.resolve(user);
        },
      ),
      findUnique: vi.fn(
        ({ where }: { where: { id?: string; email?: string } }) => {
          const match = [...users.values()].find((user) =>
            where.id ? user.id === where.id : user.email === where.email,
          );
          return Promise.resolve(match ?? null);
        },
      ),
      updateMany: vi.fn(
        ({
          where,
          data,
        }: {
          where: { id: string; deletedAt: null };
          data: { deletedAt: Date };
        }) => {
          const user = users.get(where.id);
          if (!user || user.deletedAt) {
            return Promise.resolve({ count: 0 });
          }
          Object.assign(user, data);
          return Promise.resolve({ count: 1 });
        },
      ),
      update: vi.fn(
        ({
          where,
          data,
        }: {
          where: { id: string };
          data: { id: string; deletedAt: null };
        }) => {
          const user = users.get(where.id);
          if (!user) return Promise.reject(new Error("record not found"));
          users.delete(where.id);
          Object.assign(user, data);
          users.set(user.id, user);
          // Mirrors ON UPDATE CASCADE on Link.userId
          for (const link of links) {
            if (link.userId === where.id) link.userId = data.id;
          }
          return Promise.resolve(user);
        },
      ),
      deleteMany: vi.fn(({ where }: { where: { id: string } }) => {
        const existed = users.delete(where.id);
        return Promise.resolve({ count: existed ? 1 : 0 });
      }),
    },
  };

  // In-memory stand-in for the Stripe subscriptions API
  const stripeSubscriptions = {
    list: vi.fn(),
    cancel: vi.fn(),
    update: vi.fn(),
  };

  return { SECRET, users, links, fakeDb, stripeSubscriptions };
});

vi.mock("@/env.mjs", () => ({
  env: {
    CLERK_WEBHOOK_SECRET: SECRET,
    STRIPE_SECRET_KEY: "sk_test_placeholder",
  },
}));
vi.mock("@/server/db", () => ({ db: fakeDb }));
vi.mock("stripe", async (importOriginal) => {
  const { default: Actual } = await importOriginal<{
    default: { errors: unknown };
  }>();

  // Keeps the real error classes so instanceof checks in the handler still hold
  class FakeStripe {
    subscriptions = stripeSubscriptions;
  }
  return { default: Object.assign(FakeStripe, { errors: Actual.errors }) };
});

// Iterable that yields the given subscriptions, like Stripe's list
function* listed(items: unknown[]) {
  yield* items;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_IN_MS);

type FakeResponse = {
  statusCode: number;
  body: unknown;
  status: (code: number) => FakeResponse;
  send: (body: unknown) => FakeResponse;
  json: (body: unknown) => FakeResponse;
  end: () => FakeResponse;
};

function fakeResponse(): FakeResponse {
  const res: FakeResponse = {
    statusCode: 200,
    body: undefined,
    status(code) {
      res.statusCode = code;
      return res;
    },
    send(body) {
      res.body = body;
      return res;
    },
    json(body) {
      res.body = body;
      return res;
    },
    end() {
      return res;
    },
  };
  return res;
}

function postRequest(body: string, headers: Record<string, string> = {}) {
  const req = Readable.from([Buffer.from(body)]);
  return Object.assign(req, {
    method: "POST",
    headers,
  }) as unknown as NextApiRequest;
}

// Sends the event through the real handler, signed the way Clerk signs it
function signedRequest(event: unknown, secret = SECRET) {
  const body = JSON.stringify(event);
  const id = `msg_${crypto.randomUUID()}`;
  const timestamp = new Date();
  const signature = new Webhook(secret).sign(id, timestamp, body);

  return postRequest(body, {
    "svix-id": id,
    "svix-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
    "svix-signature": signature,
  });
}

async function deliver(req: NextApiRequest) {
  const res = fakeResponse();
  await handler(req, res as unknown as NextApiResponse);
  return res;
}

function userEvent(type: string, id: string, email: string) {
  return {
    object: "event",
    type,
    data: {
      id,
      primary_email_address_id: "idn_primary",
      email_addresses: [{ id: "idn_primary", email_address: email }],
    },
  };
}

describe("Clerk user webhook", () => {
  beforeEach(() => {
    users.clear();
    links.length = 0;
    fakeDb.user.upsert.mockClear();
    fakeDb.user.updateMany.mockClear();
    fakeDb.user.update.mockClear();
    fakeDb.user.deleteMany.mockClear();
    stripeSubscriptions.list.mockReset();
    stripeSubscriptions.list.mockImplementation(() => listed([]));
    stripeSubscriptions.cancel.mockReset();
    stripeSubscriptions.cancel.mockResolvedValue({});
    stripeSubscriptions.update.mockReset();
    stripeSubscriptions.update.mockResolvedValue({});
  });

  it("creates a user for a signed user.created event", async () => {
    const res = await deliver(
      signedRequest(userEvent("user.created", "user_123", "ada@example.com")),
    );

    expect(res.statusCode).toBe(200);
    expect(users.get("user_123")).toEqual({
      id: "user_123",
      email: "ada@example.com",
      plan: "free",
    });
  });

  it("updates the email of an existing user for a signed user.updated event and keeps its plan", async () => {
    users.set("user_123", {
      id: "user_123",
      email: "ada@example.com",
      plan: "pro",
    });

    const res = await deliver(
      signedRequest(userEvent("user.updated", "user_123", "ada@new.example")),
    );

    expect(res.statusCode).toBe(200);
    expect(users.get("user_123")).toEqual({
      id: "user_123",
      email: "ada@new.example",
      plan: "pro",
    });
  });

  it("does not create a duplicate when the same signed event is replayed", async () => {
    const event = userEvent("user.created", "user_123", "ada@example.com");

    await deliver(signedRequest(event));
    const res = await deliver(signedRequest(event));

    expect(res.statusCode).toBe(200);
    expect(users.size).toBe(1);
    expect(users.get("user_123")?.email).toBe("ada@example.com");
  });

  it("returns 400 for a signed payload that does not match the user schema", async () => {
    const res = await deliver(
      signedRequest({
        object: "event",
        type: "user.created",
        data: { id: "user_123" },
      }),
    );

    expect(res.statusCode).toBe(400);
    expect(users.size).toBe(0);
  });

  it("returns 500 when the database write fails so Svix retries", async () => {
    fakeDb.user.upsert.mockRejectedValueOnce(new Error("connection refused"));

    const res = await deliver(
      signedRequest(userEvent("user.created", "user_123", "ada@example.com")),
    );

    expect(res.statusCode).toBe(500);
    expect(users.size).toBe(0);
  });

  it("does not echo verification details back to the caller", async () => {
    const res = await deliver(
      signedRequest(
        userEvent("user.created", "user_123", "ada@example.com"),
        `whsec_${Buffer.from("not-clerk").toString("base64")}`,
      ),
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe("Invalid webhook request");
  });

  it("acknowledges an event type it does not handle without changing anything", async () => {
    const res = await deliver(
      signedRequest({ object: "event", type: "session.created", data: {} }),
    );

    expect(res.statusCode).toBe(200);
    expect(users.size).toBe(0);
    expect(fakeDb.user.upsert).not.toHaveBeenCalled();
  });

  it("rejects an event signed with the wrong secret and changes nothing", async () => {
    const wrongSecret = `whsec_${Buffer.from("not-clerk").toString("base64")}`;
    const res = await deliver(
      signedRequest(
        userEvent("user.created", "user_123", "ada@example.com"),
        wrongSecret,
      ),
    );

    expect(res.statusCode).toBe(400);
    expect(users.size).toBe(0);
    expect(fakeDb.user.upsert).not.toHaveBeenCalled();
  });

  it("rejects a request without svix headers and changes nothing", async () => {
    const body = JSON.stringify(
      userEvent("user.created", "user_123", "ada@example.com"),
    );
    const res = await deliver(postRequest(body));

    expect(res.statusCode).toBe(400);
    expect(users.size).toBe(0);
    expect(fakeDb.user.upsert).not.toHaveBeenCalled();
  });

  it("rejects a request with a tampered body and changes nothing", async () => {
    const signed = userEvent("user.created", "user_123", "ada@example.com");
    const req = signedRequest(signed);
    const tampered = JSON.stringify(
      userEvent("user.created", "user_123", "mallory@example.com"),
    );
    const res = await deliver(
      Object.assign(Readable.from([Buffer.from(tampered)]), {
        method: "POST",
        headers: req.headers,
      }) as unknown as NextApiRequest,
    );

    expect(res.statusCode).toBe(400);
    expect(users.size).toBe(0);
  });

  describe("user.deleted", () => {
    const deletedEvent = {
      object: "event",
      type: "user.deleted",
      data: { id: "user_123", deleted: true, object: "user" },
    };

    it("marks the user deleted and stops renewal, keeping the row", async () => {
      users.set("user_123", {
        id: "user_123",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: null,
      });
      stripeSubscriptions.list.mockImplementation(() =>
        listed([
          { id: "sub_active", status: "active", cancel_at_period_end: false },
          { id: "sub_done", status: "canceled", cancel_at_period_end: false },
        ]),
      );

      const res = await deliver(signedRequest(deletedEvent));

      expect(res.statusCode).toBe(200);
      expect(stripeSubscriptions.list).toHaveBeenCalledWith({
        customer: "cus_123",
      });
      expect(stripeSubscriptions.update).toHaveBeenCalledTimes(1);
      expect(stripeSubscriptions.update).toHaveBeenCalledWith("sub_active", {
        cancel_at_period_end: true,
      });
      expect(stripeSubscriptions.cancel).not.toHaveBeenCalled();
      expect(users.get("user_123")?.deletedAt).toBeInstanceOf(Date);
      expect(fakeDb.user.deleteMany).not.toHaveBeenCalled();
    });

    it("leaves the row unchanged and returns 500 when the Stripe update fails", async () => {
      users.set("user_123", {
        id: "user_123",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: null,
      });
      stripeSubscriptions.list.mockImplementation(() =>
        listed([{ id: "sub_active", status: "active" }]),
      );
      stripeSubscriptions.update.mockRejectedValueOnce(
        new Error("Stripe unavailable"),
      );

      const res = await deliver(signedRequest(deletedEvent));

      expect(res.statusCode).toBe(500);
      expect(users.get("user_123")?.deletedAt).toBeNull();
    });

    it("skips a subscription that already stops at period end", async () => {
      users.set("user_123", {
        id: "user_123",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: null,
      });
      stripeSubscriptions.list.mockImplementation(() =>
        listed([
          { id: "sub_active", status: "active", cancel_at_period_end: true },
        ]),
      );

      const res = await deliver(signedRequest(deletedEvent));

      expect(res.statusCode).toBe(200);
      expect(stripeSubscriptions.update).not.toHaveBeenCalled();
    });

    it("marks the user deleted when Stripe no longer knows the customer", async () => {
      users.set("user_123", {
        id: "user_123",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_gone",
        deletedAt: null,
      });
      stripeSubscriptions.list.mockImplementation(() => {
        throw new Stripe.errors.StripeInvalidRequestError({
          type: "invalid_request_error",
          code: "resource_missing",
          message: "No such customer: 'cus_gone'",
        });
      });

      const res = await deliver(signedRequest(deletedEvent));

      expect(res.statusCode).toBe(200);
      expect(users.get("user_123")?.deletedAt).toBeInstanceOf(Date);
    });

    it("marks a free user deleted without calling Stripe", async () => {
      users.set("user_123", {
        id: "user_123",
        email: "ada@example.com",
        plan: "free",
        stripeId: null,
        deletedAt: null,
      });

      const res = await deliver(signedRequest(deletedEvent));

      expect(res.statusCode).toBe(200);
      expect(stripeSubscriptions.list).not.toHaveBeenCalled();
      expect(users.get("user_123")?.deletedAt).toBeInstanceOf(Date);
    });

    it("keeps the original deletion time when the event is replayed", async () => {
      users.set("user_123", {
        id: "user_123",
        email: "ada@example.com",
        plan: "free",
        stripeId: null,
        deletedAt: null,
      });

      await deliver(signedRequest(deletedEvent));
      const firstDeletedAt = users.get("user_123")?.deletedAt;
      const replay = await deliver(signedRequest(deletedEvent));

      expect(replay.statusCode).toBe(200);
      expect(users.get("user_123")?.deletedAt).toBe(firstDeletedAt);
    });

    it("acknowledges a user that does not exist, including on replay", async () => {
      const first = await deliver(signedRequest(deletedEvent));
      const replay = await deliver(signedRequest(deletedEvent));

      expect(first.statusCode).toBe(200);
      expect(replay.statusCode).toBe(200);
      expect(stripeSubscriptions.list).not.toHaveBeenCalled();
      expect(users.size).toBe(0);
    });
  });

  describe("user.updated for a deleted account", () => {
    it("ignores the update and leaves the deleted row unchanged", async () => {
      const deletedAt = daysAgo(1);
      users.set("user_123", {
        id: "user_123",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt,
      });

      const res = await deliver(
        signedRequest(userEvent("user.updated", "user_123", "ada@new.example")),
      );

      expect(res.statusCode).toBe(200);
      expect(users.get("user_123")).toEqual({
        id: "user_123",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt,
      });
      expect(fakeDb.user.upsert).not.toHaveBeenCalled();
    });
  });

  describe("user.created with the email of a deleted account", () => {
    it("restores the account to the new Clerk id within 14 days and resumes renewal", async () => {
      users.set("user_old", {
        id: "user_old",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: daysAgo(1),
      });
      stripeSubscriptions.list.mockImplementation(() =>
        listed([
          { id: "sub_active", status: "active", cancel_at_period_end: true },
        ]),
      );

      const res = await deliver(
        signedRequest(userEvent("user.created", "user_new", "ada@example.com")),
      );

      expect(res.statusCode).toBe(200);
      expect(stripeSubscriptions.update).toHaveBeenCalledWith("sub_active", {
        cancel_at_period_end: false,
      });
      expect(users.has("user_old")).toBe(false);
      expect(users.get("user_new")).toEqual({
        id: "user_new",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: null,
      });
      expect(fakeDb.user.upsert).not.toHaveBeenCalled();
    });

    it("restores to free when the subscription ended during the window", async () => {
      users.set("user_old", {
        id: "user_old",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: daysAgo(3),
      });
      stripeSubscriptions.list.mockImplementation(() =>
        listed([{ id: "sub_done", status: "canceled" }]),
      );

      const res = await deliver(
        signedRequest(userEvent("user.created", "user_new", "ada@example.com")),
      );

      expect(res.statusCode).toBe(200);
      expect(stripeSubscriptions.update).not.toHaveBeenCalled();
      expect(users.get("user_new")).toEqual({
        id: "user_new",
        email: "ada@example.com",
        plan: "free",
        stripeId: null,
        deletedAt: null,
      });
    });

    it("purges an account past 14 days before the email is reused", async () => {
      users.set("user_old", {
        id: "user_old",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: daysAgo(15),
      });
      stripeSubscriptions.list.mockImplementation(() =>
        listed([{ id: "sub_active", status: "active" }]),
      );

      const res = await deliver(
        signedRequest(userEvent("user.created", "user_new", "ada@example.com")),
      );

      expect(res.statusCode).toBe(200);
      expect(stripeSubscriptions.cancel).toHaveBeenCalledWith("sub_active");
      expect(users.has("user_old")).toBe(false);
      expect(users.get("user_new")).toEqual({
        id: "user_new",
        email: "ada@example.com",
        plan: "free",
      });
    });

    it("keeps the Links of a restored account under the new Clerk id", async () => {
      users.set("user_old", {
        id: "user_old",
        email: "ada@example.com",
        plan: "free",
        stripeId: null,
        deletedAt: daysAgo(1),
      });
      links.push({ slug: "ada", userId: "user_old" });

      const res = await deliver(
        signedRequest(userEvent("user.created", "user_new", "ada@example.com")),
      );

      expect(res.statusCode).toBe(200);
      expect(links).toEqual([{ slug: "ada", userId: "user_new" }]);
    });

    it("moves a live account with the email to the new Clerk id when its deletion event was missed", async () => {
      users.set("user_old", {
        id: "user_old",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: null,
      });
      links.push({ slug: "ada", userId: "user_old" });

      const res = await deliver(
        signedRequest(userEvent("user.created", "user_new", "ada@example.com")),
      );

      expect(res.statusCode).toBe(200);
      expect(stripeSubscriptions.list).not.toHaveBeenCalled();
      expect(stripeSubscriptions.update).not.toHaveBeenCalled();
      expect(users.has("user_old")).toBe(false);
      expect(users.get("user_new")).toEqual({
        id: "user_new",
        email: "ada@example.com",
        plan: "pro",
        stripeId: "cus_123",
        deletedAt: null,
      });
      expect(links).toEqual([{ slug: "ada", userId: "user_new" }]);
      expect(fakeDb.user.upsert).not.toHaveBeenCalled();
    });

    it("creates a new user when no deleted account has the email", async () => {
      const res = await deliver(
        signedRequest(userEvent("user.created", "user_new", "ada@example.com")),
      );

      expect(res.statusCode).toBe(200);
      expect(stripeSubscriptions.list).not.toHaveBeenCalled();
      expect(users.get("user_new")).toEqual({
        id: "user_new",
        email: "ada@example.com",
        plan: "free",
      });
    });
  });
});
