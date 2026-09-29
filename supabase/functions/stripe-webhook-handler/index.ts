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
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, WEBHOOK_SECRET);
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

    // flat_fee_cents is embedded in metadata by create-sponsor-payment-session.
    const flatFeeCents = session.metadata?.flat_fee_cents
      ? Number(session.metadata.flat_fee_cents)
      : null;

    console.log(
      "[stripe-webhook] checkout.session.completed — session:", checkoutSessionId,
      "payment_intent:", paymentIntentId,
      "flat_fee_cents:", flatFeeCents,
    );

    // ── Look up the submission row ────────────────────────────────────────
    const { data: submission, error: lookupErr } = await supabase
      .from("submissions")
      .select("id, payment_status, approved_at, offer_id")
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

    // ── Idempotency: skip entirely if already marked paid ─────────────────
    // payment_status stays 'pending' until the transfer succeeds, so a retry
    // that lands here will always attempt the transfer rather than being skipped.
    if (submission.payment_status === "paid") {
      console.log("[stripe-webhook] submission", submission.id, "already paid — skipping");
      return new Response("ok", { status: 200 });
    }

    // ── Look up creator stripe_account_id and campaign details ─────────────
    const { data: offerRow, error: offerErr } = await supabase
      .from("offers")
      .select(`
        id,
        campaign_id,
        creator_id,
        creators ( id, stripe_account_id ),
        campaigns ( id, flat_fee, payout_window_days )
      `)
      .eq("id", submission.offer_id)
      .maybeSingle();

    if (offerErr || !offerRow) {
      console.error("[stripe-webhook] offer lookup failed:", offerErr?.message, "— cannot proceed, manual follow-up needed");
      return new Response("ok", { status: 200 });
    }

    const creator = (offerRow as any).creators;
    const campaign = (offerRow as any).campaigns;
    const stripeAccountId: string | null = creator?.stripe_account_id ?? null;

    // Prefer metadata value; fall back to campaign.flat_fee if missing.
    const transferAmountCents = flatFeeCents ?? Math.round(Number(campaign?.flat_fee ?? 0) * 100);

    const payoutWindowDays = Number(campaign?.payout_window_days ?? 30);
    const approvedAt = submission.approved_at;
    const payoutWindowEndsAt = approvedAt
      ? new Date(new Date(approvedAt).getTime() + payoutWindowDays * 86_400_000).toISOString()
      : null;

    // ── Attempt transfer before marking paid ───────────────────────────────
    // If the creator has no Stripe account yet, we mark paid anyway (can't retry
    // usefully — manual intervention is required regardless).
    // If the transfer API call fails, we do NOT mark paid so the next webhook
    // retry will reach this point and try again (the idempotency key on the
    // transfer call itself prevents double-pays on retries that do reach Stripe).
    let transferId: string | null = null;

    if (!stripeAccountId) {
      console.warn(
        "[stripe-webhook] creator has no stripe_account_id — marking paid with amount_paid_to_creator=0 for manual follow-up. submissionId:", submission.id,
      );
    } else if (transferAmountCents <= 0) {
      console.warn("[stripe-webhook] transferAmountCents is 0, skipping transfer for submission:", submission.id);
    } else {
      // Stripe caches idempotency keys for 24 h. A fixed per-submission key means
      // a cached failure (e.g. insufficient funds) blocks all retries for a full day.
      // Appending a UTC hour bucket lets retries after ~1 h get a fresh Stripe attempt
      // while still deduplicating rapid webhook replays within the same hour window.
      // Double-pay safety: the payment_status !== 'paid' check above already gates
      // entry to this block, so a successful transfer always marks paid before any
      // retry could re-enter.
      const hourBucket = Math.floor(Date.now() / 3_600_000);
      const idempotencyKey = `flat-fee-transfer-${submission.id}-${hourBucket}`;
      console.log(
        "[stripe-webhook] transferring", transferAmountCents, "cents to", stripeAccountId,
        "idempotency:", idempotencyKey,
      );
      try {
        const transfer = await stripe.transfers.create(
          {
            amount: transferAmountCents,
            currency: "usd",
            destination: stripeAccountId,
            metadata: { submission_id: submission.id, offer_id: submission.offer_id },
          },
          { idempotencyKey },
        );
        transferId = transfer.id;
        console.log("[stripe-webhook] transfer created:", transferId);
      } catch (transferErr: unknown) {
        const msg = transferErr instanceof Error ? transferErr.message : String(transferErr);
        console.error(
          "[stripe-webhook] transfer FAILED — NOT marking paid so retries can try again. submissionId:", submission.id, "error:", msg,
        );
        // Return 200 so Stripe doesn't treat this as a server error, but leave
        // payment_status as 'pending' so the idempotency check won't block retries.
        return new Response("ok", { status: 200 });
      }
    }

    // ── Transfer succeeded (or was skipped for no-account reason) ─────────
    // Only now mark payment_status = 'paid'.
    const { error: paymentUpdateErr } = await supabase
      .from("submissions")
      .update({
        payment_status: "paid",
        stripe_payment_intent_id: paymentIntentId,
        amount_paid_to_creator: transferId ? transferAmountCents / 100 : 0,
        payout_window_ends_at: payoutWindowEndsAt,
        stripe_transfer_id: transferId,
      })
      .eq("id", submission.id);

    if (paymentUpdateErr) {
      console.error("[stripe-webhook] failed to write final submission update:", paymentUpdateErr.message);
      // Transfer already went through — return 200 so Stripe doesn't retry, but
      // log clearly for manual reconciliation of the DB row.
    } else {
      console.log(
        "[stripe-webhook] submission", submission.id, "marked paid — amount_paid_to_creator:", transferId ? transferAmountCents / 100 : 0,
        "payout_window_ends_at:", payoutWindowEndsAt, "stripe_transfer_id:", transferId,
      );
    }
  } else {
    console.log("[stripe-webhook] unhandled event type:", event.type, "— acknowledging");
  }

  return new Response("ok", { status: 200 });
});
