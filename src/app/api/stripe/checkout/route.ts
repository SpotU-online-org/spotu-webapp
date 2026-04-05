import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getMonthlyPriceId, getBoostPriceId, PIONEER_THRESHOLD } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId, mode } = (await request.json()) as {
    listingId: string;
    mode: "subscription" | "boost";
  };

  if (!listingId || !mode) {
    return NextResponse.json({ error: "Missing listingId or mode" }, { status: 400 });
  }

  // Verify listing belongs to user
  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, type, status, billing_status, created_at, stripe_checkout_session_id")
    .eq("id", listingId)
    .eq("user_id", user.id)
    .single();

  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  // Get profile — includes user_number for pioneer check and stripe_customer_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, display_name, user_number, total_listings_created, created_at")
    .eq("id", user.id)
    .single();

  // ── PIONEER CHECK ──────────────────────────────────────────────────────────
  // First PIONEER_THRESHOLD users get 1 year free from their registration date
  const userNumber = profile?.user_number ?? 9999;
  if (userNumber <= PIONEER_THRESHOLD) {
    const pioneerExpiresAt = profile?.created_at
      ? new Date(new Date(profile.created_at).getTime() + 365 * 24 * 60 * 60 * 1000)
      : null;

    const pioneerActive = pioneerExpiresAt ? pioneerExpiresAt.getTime() > Date.now() : false;

    if (pioneerActive) {
      await supabase
        .from("listings")
        .update({ billing_status: "pioneer", status: "active" })
        .eq("id", listingId);
      return NextResponse.json({ pioneer: true, expiresAt: pioneerExpiresAt?.toISOString() });
    }
    // Pioneer year expired — fall through to normal billing below
  }

  // ── GET OR CREATE STRIPE CUSTOMER ─────────────────────────────────────────
  let customerId = profile?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      name: profile?.display_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const origin = request.headers.get("origin") ?? "https://spotu.online";

  // ── BOOST — one-time payment ───────────────────────────────────────────────
  if (mode === "boost") {
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{ price: getBoostPriceId(listing.type), quantity: 1 }],
      success_url: `${origin}/dashboard?billing=boost_success&listing=${listingId}`,
      cancel_url: `${origin}/dashboard?billing=cancelled`,
      metadata: { listing_id: listingId, user_id: user.id, type: "boost" },
    });
    return NextResponse.json({ url: session.url });
  }

  // ── SUBSCRIPTION ───────────────────────────────────────────────────────────
  // total_listings_created tracks ALL listings ever inserted (even deleted ones).
  // If this user has only ever created 1 listing (the current one), it's their first.
  // This prevents re-granting the trial if they deleted their first listing.
  const totalEver = profile?.total_listings_created ?? 1;
  const isFirstListing = totalEver <= 1;

  // Days since listing was created — used to compute remaining trial days
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const trialDaysRemaining = Math.max(0, 30 - daysSinceCreation);

  const hasTrialLeft = isFirstListing && trialDaysRemaining > 0;

  const priceId = getMonthlyPriceId(listing.type);

  let session;

  if (hasTrialLeft) {
    // First listing within 30-day window → collect card now, charge after trial ends
    session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: trialDaysRemaining,
        metadata: { listing_id: listingId, user_id: user.id },
        trial_settings: {
          end_behavior: { missing_payment_method: "cancel" },
        },
      },
      payment_method_collection: "always",
      success_url: `${origin}/dashboard?billing=success&listing=${listingId}`,
      cancel_url: `${origin}/dashboard?billing=cancelled`,
      metadata: { listing_id: listingId, user_id: user.id, type: "subscription" },
    });
  } else {
    // 2nd+ listing OR trial expired → immediate subscription (prorated if mid-cycle)
    session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { listing_id: listingId, user_id: user.id },
      },
      success_url: `${origin}/dashboard?billing=success&listing=${listingId}`,
      cancel_url: `${origin}/dashboard?billing=cancelled`,
      metadata: { listing_id: listingId, user_id: user.id, type: "subscription" },
    });
  }

  await supabase
    .from("listings")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", listingId);

  return NextResponse.json({ url: session.url });
}
