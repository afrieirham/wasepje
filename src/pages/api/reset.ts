// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

const key = process.env.RESET_KEY;

type RequestBody = {
  key: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method not allowed" });
  }

  const body = req.body as RequestBody;

  if (body.key === key) {
    await db.link.updateMany({ data: { clicks: 0 } });
  }

  if (body.key === "test") {
    res.status(200).send("test");
  }

  res.status(204).send("");
}
