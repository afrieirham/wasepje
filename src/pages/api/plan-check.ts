// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { getClientIp } from "@/server/client-ip";
import { db } from "@/server/db";
import { createRateLimiter } from "@/server/rate-limit";

// Public and does a DB lookup per request, so cap it per IP
const allowPlanCheck = createRateLimiter({ limit: 60, windowMs: 60_000 });

interface ExtendedNextApiRequest extends NextApiRequest {
  body: string;
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const ip = getClientIp(req);
  // null means the proxy didn't identify the client (see getClientIp)
  if (!ip) {
    return res.status(400).json({ error: "client address unavailable" });
  }

  if (!allowPlanCheck(ip)) {
    return res.status(429).json({ error: "too many requests" });
  }

  if (typeof req.body !== "string") {
    return res.status(400).json({ error: "slug must be a plain-text body" });
  }

  const caller = appRouter.createCaller({ db, clerkId: "", ip });
  const author = await caller.user.getAuthorBySlug({ slug: req.body });

  return res.status(200).json({ plan: author?.plan ?? "free" });
}
