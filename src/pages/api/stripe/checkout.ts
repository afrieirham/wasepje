import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const monthlyPriceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID!;
const annuallyPriceId = process.env.STRIPE_PRO_ANNUALLY_PRICE_ID!;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string;
    billing: "monthly" | "annually";
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

  const { email, billing } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: billing === "annually" ? annuallyPriceId : monthlyPriceId,
          quantity: 1,
        },
      ],
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
