import type { NextApiRequest, NextApiResponse } from "next";

import { timingSafeEqual } from "crypto";

import { env } from "@/env.mjs";
import { db } from "@/server/db";

const RETENTION_DAYS = 60;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const BATCH_SIZE = 10_000;

const expected = Buffer.from(`Bearer ${env.CRON_SECRET}`);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const received = Buffer.from(req.headers.authorization ?? "");
  if (
    received.length !== expected.length ||
    !timingSafeEqual(received, expected)
  ) {
    return res.status(401).end();
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * DAY_IN_MS);

  // Delete in small batches so a large backlog doesn't hold one long lock
  let deleted = 0;
  let count: number;
  do {
    count = await db.$executeRaw`
      DELETE FROM "Click"
      WHERE id IN (
        SELECT id FROM "Click" WHERE "createdAt" < ${cutoff} LIMIT ${BATCH_SIZE}
      )
    `;
    deleted += count;
  } while (count === BATCH_SIZE);

  return res.status(200).json({ deleted });
}
