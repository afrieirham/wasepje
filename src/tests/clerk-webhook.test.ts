import { Readable } from "node:stream";

import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import { beforeEach, describe, expect, it, vi } from "vitest";

import handler from "@/pages/api/clerk/webhook";

const { SECRET, users, fakeDb } = vi.hoisted(() => {
  const SECRET = `whsec_${Buffer.from("test-secret").toString("base64")}`;

  const users = new Map<string, { id: string; email: string; plan: string }>();

  // In-memory stand-in for Prisma's user.upsert, keyed by Clerk user id
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
    },
  };

  return { SECRET, users, fakeDb };
});

vi.mock("@/env.mjs", () => ({ env: { CLERK_WEBHOOK_SECRET: SECRET } }));
vi.mock("@/server/db", () => ({ db: fakeDb }));

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
    fakeDb.user.upsert.mockClear();
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
});
