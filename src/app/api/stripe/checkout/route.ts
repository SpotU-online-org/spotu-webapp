import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";

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
    .select("id, title, stripe_checkout_session_id")
    .eq("id", listingId)
    .eq("user_id", user.id)
    .single();

  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, display_name")
    .eq("id", user.id)
    .single();

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

  if (mode === "subscription") {
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: STRIPE_PRICES.listing_monthly, quantity: 1 }],
      success_url: `${origin}/dashboard?billing=success&listing=${listingId}`,
      cancel_url: `${origin}/dashboard?billing=cancelled`,
      metadata: { listing_id: listingId, user_id: user.id, type: "subscription" },
      subscription_data: {
        metadata: { listing_id: listingId, user_id: user.id },
      },
    });

    await supabase
      .from("listings")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", listingId);

    return NextResponse.json({ url: session.url });
  }

  // Boost — one-time payment
  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [{ price: STRIPE_PRICES.listing_boost, quantity: 1 }],
    success_url: `${origin}/dashboard?billing=boost_success&listing=${listingId}`,
    cancel_url: `${origin}/dashboard?billing=cancelled`,
    metadata: { listing_id: listingId, user_id: user.id, type: "boost" },
  });

  return NextResponse.json({ url: session.url });
}
