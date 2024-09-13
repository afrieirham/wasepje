import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const proPriceId = process.env.STRIPE_PRO_PRICE_ID!;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const { email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: proPriceId, quantity: 1 }],
      success_url: `${req.headers.origin}/dashboard`,
      cancel_url: `${req.headers.origin}/dashboard`,
      customer_email: email,
    });
    res.status(200).json({ redirect: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
}
