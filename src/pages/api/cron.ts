// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  await db.link.findFirst();
  res.status(204).send("");
}
