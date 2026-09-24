import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;

// Service-role client for DB writes (bypasses RLS).
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Anon client used only to verify the caller's JWT.
const supabaseAuth = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function stripePostForm(path: string, body: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STRIPE_KEY}`,
      "Stripe-Version": "2023-10-16",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `Stripe ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // ── Auth: verify caller is a logged-in sponsor ──────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authErr } = await supabaseAuth.auth.getUser(token);
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let submissionId: string;
  try {
    ({ submissionId } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
  if (!submissionId) {
    return new Response(JSON.stringify({ error: "submissionId is required" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  console.log("[sponsor-payment] submissionId:", submissionId, "caller:", user.id);

  try {
    // ── Load submission + offer + campaign, and verify sponsor ownership ────
    const { data: submission, error: subErr } = await supabaseAdmin
      .from("submissions")
      .select(`
        id,
        offer_id,
        payment_status,
        offers (
          id,
          campaign_id,
          campaigns (
            id,
            name,
            flat_fee,
            sponsor_id,
            sponsors ( id, user_id )
          )
        )
      `)
      .eq("id", submissionId)
      .single();

    if (subErr || !submission) {
      console.error("[sponsor-payment] submission lookup failed:", subErr?.message);
      return new Response(JSON.stringify({ error: "Submission not found" }), {
        status: 404,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const offer = (submission as any).offers;
    const campaign = offer?.campaigns;
    const sponsor = campaign?.sponsors;

    console.log("[sponsor-payment] sponsor.user_id:", sponsor?.user_id, "caller:", user.id);

    if (!sponsor || sponsor.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden: you do not own this campaign" }), {
        status: 403,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Amount in cents (Stripe requires integer cents).
    const flatFeeDollars = Number(campaign.flat_fee ?? 0);
    if (flatFeeDollars <= 0) {
      return new Response(JSON.stringify({ error: "Campaign flat_fee must be > 0 to create a payment session" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
    const amountCents = Math.round(flatFeeDollars * 100);

    console.log("[sponsor-payment] amount:", flatFeeDollars, "USD →", amountCents, "cents");

    // ── Create Stripe Checkout Session ──────────────────────────────────────
    console.log("[sponsor-payment] creating Stripe Checkout Session");
    const session = await stripePostForm("/v1/checkout/sessions", {
      mode: "payment",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(amountCents),
      "line_items[0][price_data][product_data][name]": `AdSpace · ${campaign.name}`,
      "line_items[0][price_data][product_data][description]": `Sponsorship payout for submission ${submissionId}`,
      "line_items[0][quantity]": "1",
      success_url: "https://berry-beige-83476330.figma.site/payment/success",
      cancel_url: "https://berry-beige-83476330.figma.site/payment/cancelled",
      // Embed submission ID in metadata for webhook reconciliation later.
      "metadata[submission_id]": submissionId,
      "metadata[offer_id]": offer.id,
      "metadata[campaign_id]": campaign.id,
    });

    console.log("[sponsor-payment] Checkout Session created:", session.id, "url:", session.url);

    // ── Persist session ID + payment_intent to submission row ───────────────
    const { error: updateErr } = await supabaseAdmin
      .from("submissions")
      .update({
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent ?? null,
        payment_status: "pending",
      })
      .eq("id", submissionId);

    if (updateErr) {
      console.error("[sponsor-payment] db update failed:", updateErr.message);
      // Non-fatal — return the URL so the sponsor can still pay even if we retry the DB write.
    } else {
      console.log("[sponsor-payment] submission updated with session id and payment_status=pending");
    }

    return new Response(
      JSON.stringify({ checkoutUrl: session.url, sessionId: session.id }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sponsor-payment] error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
