import type { NextApiRequest, NextApiResponse } from "next";

import { Prisma } from "@prisma/client";
import { buffer } from "micro";
import { Webhook } from "svix";
import { z } from "zod";

import { env } from "@/env.mjs";
import {
  purge,
  resumeRenewal,
  retentionCutoff,
  stopRenewal,
} from "@/server/deleted-users";
import { db } from "@/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const eventSchema = z.object({
  type: z.string(),
  data: z.unknown(),
});

const userSchema = z.object({
  id: z.string(),
  primary_email_address_id: z.string().nullable(),
  email_addresses: z.array(
    z.object({
      id: z.string(),
      email_address: z.string(),
      verification: z.object({ status: z.string() }).nullish(),
    }),
  ),
});

const deletedUserSchema = z.object({ id: z.string() });

// Prisma reports a unique violation as P2002; the target names the column
function isEmailConflict(err: unknown) {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002" &&
    String(err.meta?.target).includes("email")
  );
}

// A sign-up with the email of an existing account takes over that row. Clerk allows
// one account per email, so a live row here belongs to an account already deleted
// whose user.deleted event never arrived. Returns false when there is no row for the
// email, so the caller creates a new user.
async function restoreByEmail(clerkId: string, email: string) {
  const existing = await db.user.findUnique({
    where: { email },
    select: { id: true, stripeId: true, deletedAt: true },
  });
  if (!existing) return false;

  if (!existing.deletedAt) {
    // Subscription and data carry over unchanged, as in a restore
    await db.user.update({
      where: { id: existing.id },
      data: { id: clerkId },
    });
    return true;
  }

  if (existing.deletedAt.getTime() < retentionCutoff().getTime()) {
    // Past the window but not purged yet: purge now so the email is free
    await purge(existing);
    return false;
  }

  // Stripe first: if it fails, the row is unchanged and the retry runs again
  const subscribed = existing.stripeId
    ? await resumeRenewal(existing.stripeId)
    : false;

  // Clerk id changes on restore; Link rows follow through the foreign key
  await db.user.update({
    where: { id: existing.id },
    data: {
      id: clerkId,
      deletedAt: null,
      // A subscription that ended in the window leaves the user on free
      ...(subscribed ? {} : { plan: "free" as const, stripeId: null }),
    },
  });
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const svixId = req.headers["svix-id"];
  const svixTimestamp = req.headers["svix-timestamp"];
  const svixSignature = req.headers["svix-signature"];

  if (
    typeof svixId !== "string" ||
    typeof svixTimestamp !== "string" ||
    typeof svixSignature !== "string"
  ) {
    return res.status(400).send("Missing svix headers");
  }

  let event: z.infer<typeof eventSchema>;

  try {
    // Verify against the raw body; a re-serialized body would never match
    event = eventSchema.parse(
      new Webhook(env.CLERK_WEBHOOK_SECRET).verify(buf.toString(), {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }),
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // Detail stays in the log; the caller is unauthenticated, so it gets no internals
    console.log(`❌ Clerk webhook rejected: ${errorMessage}`);
    return res.status(400).send("Invalid webhook request");
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const user = userSchema.parse(event.data);

        const primaryEmail = user.email_addresses.find(
          (address) => address.id === user.primary_email_address_id,
        );
        if (!primaryEmail) {
          console.error(`clerk user ${user.id}: no primary email, skipped`);
          break;
        }

        const existing = await db.user.findUnique({
          where: { id: user.id },
          select: { deletedAt: true },
        });
        // A deleted account is left alone until it is restored or purged
        if (existing?.deletedAt) {
          console.log(`clerk user ${user.id}: deleted, ${event.type} ignored`);
          break;
        }

        // Only a verified address may move an existing row to a new Clerk id
        const verified = primaryEmail.verification?.status === "verified";
        if (
          event.type === "user.created" &&
          !existing &&
          verified &&
          (await restoreByEmail(user.id, primaryEmail.email_address))
        ) {
          break;
        }

        try {
          // Upsert keyed on the Clerk id, so a replayed event updates the same row
          await db.user.upsert({
            where: { id: user.id },
            create: { id: user.id, email: primaryEmail.email_address },
            update: { email: primaryEmail.email_address },
          });
        } catch (err) {
          // Another row holds this email and nothing here may move it. Acknowledge
          // so Svix does not retry forever; the row is left unchanged.
          if (!isEmailConflict(err)) throw err;
          console.error(
            `clerk user ${user.id}: email held by another row, ${event.type} skipped`,
          );
        }
        break;
      }

      case "user.deleted": {
        const { id } = deletedUserSchema.parse(event.data);

        const user = await db.user.findUnique({
          where: { id },
          select: { stripeId: true },
        });
        // Stripe first: the row is marked only after renewal is stopped, so a
        // failed call leaves the row unchanged for the retry
        if (user?.stripeId) {
          await stopRenewal(user.stripeId);
        }

        // Only unmarked rows: a replay keeps the original deletion time, and an
        // unknown user is acknowledged instead of retried
        await db.user.updateMany({
          where: { id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
        break;
      }

      default:
        console.log(`Unhandled Clerk event type ${event.type}`);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      // A signed payload that doesn't fit the schema won't fit on retry either
      console.error(`Clerk ${event.type} payload mismatch: ${err.message}`);
      return res.status(400).send("Unexpected payload");
    }

    // Log the message only: a raw Prisma error can carry connection details
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(
      `Clerk ${event.type} failed, Svix will retry: ${errorMessage}`,
    );
    // Returning 500 makes Svix retry the event once the database recovers
    return res.status(500).send("Failed to sync user");
  }

  res.json({ received: true });
}
