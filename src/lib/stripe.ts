import Stripe from "stripe";

// Lazy singleton — avoids throwing at build time when env vars are absent
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil",
    });
  }
  return _stripe;
}

export const STRIPE_PRICES = {
  listing_monthly: process.env.STRIPE_PRICE_LISTING_MONTHLY ?? "",
  listing_boost: process.env.STRIPE_PRICE_LISTING_BOOST ?? "",
} as const;

export const LISTING_PRICE_USD = 4.99;
export const BOOST_PRICE_USD = 2.99;
