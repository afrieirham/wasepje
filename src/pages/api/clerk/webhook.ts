import type { NextApiRequest, NextApiResponse } from "next";

import { buffer } from "micro";
import { Webhook } from "svix";
import { z } from "zod";

import { env } from "@/env.mjs";
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
    z.object({ id: z.string(), email_address: z.string() }),
  ),
});

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

        // Upsert keyed on the Clerk id, so a replayed event updates the same row
        await db.user.upsert({
          where: { id: user.id },
          create: { id: user.id, email: primaryEmail.email_address },
          update: { email: primaryEmail.email_address },
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
