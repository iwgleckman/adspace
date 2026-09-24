import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function stripePost(path: string, body: Record<string, unknown>, apiVersion: string) {
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STRIPE_KEY}`,
      "Stripe-Version": apiVersion,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `Stripe ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// v1 endpoints require form-urlencoded, not JSON.
async function stripePostForm(path: string, body: Record<string, string>, apiVersion: string) {
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STRIPE_KEY}`,
      "Stripe-Version": apiVersion,
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

  let creatorEmail: string;
  let creatorId: string;

  try {
    ({ creatorEmail, creatorId } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  if (!creatorEmail || !creatorId) {
    return new Response(JSON.stringify({ error: "creatorEmail and creatorId are required" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  console.log("[create-creator-connect-account] creatorId:", creatorId, "email:", creatorEmail);

  try {
    // 1. Create a v2 Connect account (recipient, individual, express dashboard).
    //    Uses POST /v2/core/accounts — required for platforms that have migrated
    //    away from the deprecated v1 accounts.create() Express flow.
    const account = await stripePost(
      "/v2/core/accounts",
      {
        contact_email: creatorEmail,
        display_name: creatorEmail,
        dashboard: "express",
        identity: {
          country: "us",
          entity_type: "individual",
        },
        configuration: {
          recipient: {
            capabilities: {
              stripe_balance: {
                stripe_transfers: { requested: true },
              },
            },
          },
        },
        defaults: {
          responsibilities: {
            fees_collector: "application",
            losses_collector: "application",
          },
        },
      },
      "2026-08-26.preview",
    );

    console.log("[create-creator-connect-account] v2 account created:", account.id);

    // 2. Generate an onboarding link via the v1 Account Links API.
    //    v1 endpoints require form-urlencoded bodies, not JSON.
    const accountLink = await stripePostForm(
      "/v1/account_links",
      {
        account: account.id,
        refresh_url: "https://berry-beige-83476330.figma.site/stripe/refresh",
        return_url: "https://berry-beige-83476330.figma.site/stripe/return",
        type: "account_onboarding",
      },
      "2023-10-16",
    );

    console.log("[create-creator-connect-account] onboarding link created:", accountLink.url);

    // 3. Persist the Stripe account ID to the creators table (service role bypasses RLS).
    const { error: dbError } = await supabase
      .from("creators")
      .update({ stripe_account_id: account.id })
      .eq("id", creatorId);

    if (dbError) {
      console.error("[create-creator-connect-account] db update failed:", dbError.message);
    } else {
      console.log("[create-creator-connect-account] stripe_account_id saved");
    }

    return new Response(
      JSON.stringify({ onboardingUrl: accountLink.url, stripeAccountId: account.id }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[create-creator-connect-account] error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
