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
  if (req.method === "POST") {
    const caller = appRouter.createCaller({ db, clerkId: "" });
    const link = await caller.user.getAuthorBySlug({ slug: req.body });

    if (!link) {
      res.status(200).json({ plan: "free" });
    } else {
      res.status(200).json({ plan: link.user.plan });
    }
  }

  res.status(405);
}
