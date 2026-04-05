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
    .select("stripe_customer_id, display_name, user_number")
    .eq("id", user.id)
    .single();

  // ── PIONEER CHECK ──────────────────────────────────────────────────────────
  // First PIONEER_THRESHOLD users get 1 year free from their registration date
  const userNumber = profile?.user_number ?? 9999;
  if (userNumber <= PIONEER_THRESHOLD) {
    // Calculate pioneer expiry: 1 year from profile creation
    const { data: profileFull } = await supabase
      .from("profiles")
      .select("created_at")
      .eq("id", user.id)
      .single();

    const pioneerExpiresAt = profileFull?.created_at
      ? new Date(new Date(profileFull.created_at).getTime() + 365 * 24 * 60 * 60 * 1000)
      : null;

    const pioneerActive = pioneerExpiresAt ? pioneerExpiresAt.getTime() > Date.now() : false;

    if (pioneerActive) {
      // Pioneer year still active — no payment needed
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
  // Count how many subscriptions (active/trial/paid) this user has ever had,
  // excluding the current listing. If 0, this is their first — grant 30-day trial.
  const { count: prevSubCount } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("id", listingId)
    .not("billing_status", "in", '("trial","cancelled","pioneer")');

  // Days since listing was created — used to compute remaining trial days
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const trialDaysRemaining = Math.max(0, 30 - daysSinceCreation);

  const isFirstListing = (prevSubCount ?? 0) === 0;
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
