import Stripe from "stripe";

// Lazy singleton — avoids throwing at build time when env vars are absent
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

export const STRIPE_PRICES = {
  // Space owner / advertiser: $4.99/mo, boost $2.99/week
  listing_monthly: process.env.STRIPE_PRICE_LISTING_MONTHLY ?? "",
  listing_boost: process.env.STRIPE_PRICE_LISTING_BOOST ?? "",
  // Agency: $9.99/mo, boost $4.99/week
  agency_monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY ?? "",
  agency_boost: process.env.STRIPE_PRICE_AGENCY_BOOST ?? "",
} as const;

export const LISTING_PRICE_USD = 4.99;
export const BOOST_PRICE_USD = 2.99;
export const AGENCY_PRICE_USD = 9.99;
export const AGENCY_BOOST_PRICE_USD = 4.99;

export const PIONEER_THRESHOLD = 100;

/** Returns the correct monthly price ID based on listing type */
export function getMonthlyPriceId(listingType: string): string {
  return listingType === "offer_service"
    ? STRIPE_PRICES.agency_monthly
    : STRIPE_PRICES.listing_monthly;
}

/** Returns the correct boost price ID based on listing type */
export function getBoostPriceId(listingType: string): string {
  return listingType === "offer_service"
    ? STRIPE_PRICES.agency_boost
    : STRIPE_PRICES.listing_boost;
}

/** Returns the monthly price in USD for display */
export function getMonthlyPriceDisplay(listingType: string): string {
  return listingType === "offer_service" ? "$9.99/mes" : "$4.99/mes";
}

/** Returns the boost price in USD for display */
export function getBoostPriceDisplay(listingType: string): string {
  return listingType === "offer_service" ? "$4.99/sem" : "$2.99/sem";
}
