import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import handler from "@/pages/api/purge-deleted-users";

const { CRON_SECRET, users, fakeDb, stripeSubscriptions } = vi.hoisted(() => {
  const CRON_SECRET = "cron-test-secret";

  const users = new Map<
    string,
    { id: string; stripeId: string | null; deletedAt: Date | null }
  >();

  // In-memory stand-in for the Prisma calls the purge makes
  const fakeDb = {
    user: {
      findMany: vi.fn(
        ({
          where,
          take,
        }: {
          where: { deletedAt: { lt: Date } };
          take: number;
        }) => {
          const batch = [...users.values()]
            .filter(
              (user) =>
                user.deletedAt !== null &&
                user.deletedAt.getTime() < where.deletedAt.lt.getTime(),
            )
            .slice(0, take)
            .map(({ id, stripeId }) => ({ id, stripeId }));
          return Promise.resolve(batch);
        },
      ),
      deleteMany: vi.fn(({ where }: { where: { id: string } }) => {
        const existed = users.delete(where.id);
        return Promise.resolve({ count: existed ? 1 : 0 });
      }),
    },
  };

  const stripeSubscriptions = { list: vi.fn(), cancel: vi.fn() };

  return { CRON_SECRET, users, fakeDb, stripeSubscriptions };
});

vi.mock("@/env.mjs", () => ({
  env: { CRON_SECRET, STRIPE_SECRET_KEY: "sk_test_placeholder" },
}));
vi.mock("@/server/db", () => ({ db: fakeDb }));
vi.mock("stripe", async (importOriginal) => {
  const { default: Actual } = await importOriginal<{
    default: { errors: unknown };
  }>();

  class FakeStripe {
    subscriptions = stripeSubscriptions;
  }
  return { default: Object.assign(FakeStripe, { errors: Actual.errors }) };
});

function* listed(items: unknown[]) {
  yield* items;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_IN_MS);

type FakeResponse = {
  statusCode: number;
  body: unknown;
  status: (code: number) => FakeResponse;
  end: () => FakeResponse;
  json: (body: unknown) => FakeResponse;
};

function fakeResponse(): FakeResponse {
  const res: FakeResponse = {
    statusCode: 200,
    body: undefined,
    status(code) {
      res.statusCode = code;
      return res;
    },
    end() {
      return res;
    },
    json(body) {
      res.body = body;
      return res;
    },
  };
  return res;
}

function request(authorization?: string) {
  return {
    method: "POST",
    headers: authorization ? { authorization } : {},
  } as unknown as NextApiRequest;
}

async function run(authorization = `Bearer ${CRON_SECRET}`) {
  const res = fakeResponse();
  await handler(request(authorization), res as unknown as NextApiResponse);
  return res;
}

describe("purge deleted users", () => {
  beforeEach(() => {
    users.clear();
    fakeDb.user.findMany.mockClear();
    fakeDb.user.deleteMany.mockClear();
    stripeSubscriptions.list.mockReset();
    stripeSubscriptions.list.mockImplementation(() => listed([]));
    stripeSubscriptions.cancel.mockReset();
    stripeSubscriptions.cancel.mockResolvedValue({});
  });

  it("rejects a request without the cron secret and changes nothing", async () => {
    users.set("user_old", {
      id: "user_old",
      stripeId: null,
      deletedAt: daysAgo(15),
    });

    const res = await run("Bearer wrong");

    expect(res.statusCode).toBe(401);
    expect(users.has("user_old")).toBe(true);
  });

  it("purges accounts deleted more than 14 days ago and keeps the rest", async () => {
    users.set("user_old", {
      id: "user_old",
      stripeId: "cus_old",
      deletedAt: daysAgo(15),
    });
    users.set("user_recent", {
      id: "user_recent",
      stripeId: null,
      deletedAt: daysAgo(1),
    });
    users.set("user_live", {
      id: "user_live",
      stripeId: null,
      deletedAt: null,
    });
    stripeSubscriptions.list.mockImplementation(() =>
      listed([{ id: "sub_active", status: "active" }]),
    );

    const res = await run();

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ purged: 1 });
    expect(stripeSubscriptions.cancel).toHaveBeenCalledWith("sub_active");
    expect(users.has("user_old")).toBe(false);
    expect(users.has("user_recent")).toBe(true);
    expect(users.has("user_live")).toBe(true);
  });

  it("keeps the row and fails the run when the Stripe cancel fails, so the next run retries", async () => {
    users.set("user_old", {
      id: "user_old",
      stripeId: "cus_old",
      deletedAt: daysAgo(15),
    });
    stripeSubscriptions.list.mockImplementation(() =>
      listed([{ id: "sub_active", status: "active" }]),
    );
    stripeSubscriptions.cancel.mockRejectedValueOnce(
      new Error("Stripe unavailable"),
    );

    await expect(run()).rejects.toThrow("Stripe unavailable");
    expect(users.has("user_old")).toBe(true);
    expect(fakeDb.user.deleteMany).not.toHaveBeenCalled();
  });
});
