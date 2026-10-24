import type { NextApiRequest, NextApiResponse } from "next";

import { timingSafeEqual } from "crypto";

import { env } from "@/env.mjs";
import { purge, retentionCutoff } from "@/server/deleted-users";
import { db } from "@/server/db";

const BATCH_SIZE = 100;

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

  const cutoff = retentionCutoff();

  // A purge that fails throws, so the run stops and the next run retries the rest
  let purged = 0;
  let batch: { id: string; stripeId: string | null }[];
  do {
    batch = await db.user.findMany({
      where: { deletedAt: { lt: cutoff } },
      select: { id: true, stripeId: true },
      take: BATCH_SIZE,
    });
    for (const user of batch) {
      await purge(user);
      purged++;
    }
  } while (batch.length === BATCH_SIZE);

  return res.status(200).json({ purged });
}
