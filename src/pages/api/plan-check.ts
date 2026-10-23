// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";

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

  if (typeof req.body !== "string") {
    return res.status(400).json({ error: "slug must be a plain-text body" });
  }

  const caller = appRouter.createCaller({ db, clerkId: "", ip: null });
  const author = await caller.user.getAuthorBySlug({ slug: req.body });

  return res.status(200).json({ plan: author?.plan ?? "free" });
}
