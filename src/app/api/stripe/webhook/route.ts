import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const listingId = session.metadata?.listing_id;
      const type = session.metadata?.type;
      if (!listingId) break;

      if (type === "subscription") {
        // Subscription started — mark listing active, set paid_until +1 month
        const paidUntil = new Date();
        paidUntil.setMonth(paidUntil.getMonth() + 1);
        await supabase
          .from("listings")
          .update({
            billing_status: "active",
            paid_until: paidUntil.toISOString(),
            status: "active",
          })
          .eq("id", listingId);
      } else if (type === "boost") {
        // Boost paid — set is_boosted, expires in 7 days
        const boostEnds = new Date();
        boostEnds.setDate(boostEnds.getDate() + 7);
        await supabase
          .from("listings")
          .update({ is_boosted: true, boost_ends_at: boostEnds.toISOString() })
          .eq("id", listingId);
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
      const sub = invoice.subscription as string | undefined;
      if (!sub) break;

      const subscription = await getStripe().subscriptions.retrieve(sub) as Stripe.Subscription;
      const listingId = subscription.metadata?.listing_id;
      if (!listingId) break;

      const paidUntil = new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000);
      await supabase
        .from("listings")
        .update({ billing_status: "active", status: "active", paid_until: paidUntil.toISOString() })
        .eq("id", listingId);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
      const sub = invoice.subscription as string | undefined;
      if (!sub) break;

      const subscription = await getStripe().subscriptions.retrieve(sub);
      const listingId = subscription.metadata?.listing_id;
      if (!listingId) break;

      await supabase
        .from("listings")
        .update({ billing_status: "past_due" })
        .eq("id", listingId);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const listingId = subscription.metadata?.listing_id;
      if (!listingId) break;

      await supabase
        .from("listings")
        .update({ billing_status: "cancelled", status: "paused" })
        .eq("id", listingId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
