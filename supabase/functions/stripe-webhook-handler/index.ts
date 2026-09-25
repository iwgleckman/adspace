import Stripe from "https://esm.sh/stripe@13?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  // @ts-ignore — Deno-compatible httpClient required
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2023-10-16",
});

const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!;

// Service-role client so we can read and write without RLS restrictions.
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// No JWT verification — Stripe authenticates via the stripe-signature header.
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Read raw body BEFORE any JSON parsing — required for signature verification.
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("[stripe-webhook] missing stripe-signature header");
    return new Response("Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] signature verification failed:", message);
    return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
  }

  console.log("[stripe-webhook] event type:", event.type, "id:", event.id);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const checkoutSessionId = session.id;
    const paymentIntentId = typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent as any)?.id ?? null;

    console.log("[stripe-webhook] checkout.session.completed — session:", checkoutSessionId, "payment_intent:", paymentIntentId);

    const { data: submission, error: lookupErr } = await supabase
      .from("submissions")
      .select("id, payment_status")
      .eq("stripe_checkout_session_id", checkoutSessionId)
      .maybeSingle();

    if (lookupErr) {
      console.error("[stripe-webhook] submission lookup failed:", lookupErr.message);
      return new Response("DB lookup error", { status: 500 });
    }

    if (!submission) {
      console.warn("[stripe-webhook] no submission found for session:", checkoutSessionId, "— skipping");
      return new Response("ok", { status: 200 });
    }

    // Idempotency: skip if already marked paid.
    if (submission.payment_status === "paid") {
      console.log("[stripe-webhook] submission", submission.id, "already paid — skipping");
      return new Response("ok", { status: 200 });
    }

    const { error: updateErr } = await supabase
      .from("submissions")
      .update({ payment_status: "paid", stripe_payment_intent_id: paymentIntentId })
      .eq("id", submission.id);

    if (updateErr) {
      console.error("[stripe-webhook] failed to update submission:", updateErr.message);
      return new Response("DB update error", { status: 500 });
    }

    console.log("[stripe-webhook] submission", submission.id, "marked as paid");
  } else {
    console.log("[stripe-webhook] unhandled event type:", event.type, "— acknowledging");
  }

  return new Response("ok", { status: 200 });
});
