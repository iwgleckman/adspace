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

async function stripeGet(path: string, apiVersion = "2023-10-16") {
  const res = await fetch(`https://api.stripe.com${path}`, {
    headers: {
      "Authorization": `Bearer ${STRIPE_KEY}`,
      "Stripe-Version": apiVersion,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `Stripe GET ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// v2 endpoints accept JSON bodies.
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

// v1 endpoints require form-urlencoded bodies, not JSON.
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

// An account is considered fully onboarded when there are no currently_due
// requirements AND the transfers capability is active.
function isOnboardingComplete(account: any): boolean {
  const currentlyDue: string[] = account?.requirements?.currently_due ?? [];
  const transfersCap = account?.capabilities?.transfers;
  // "active" means payouts/transfers are enabled; anything else (inactive,
  // pending, unrequested) means the creator still needs to complete something.
  return currentlyDue.length === 0 && transfersCap === "active";
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
    // ── Check DB for existing Stripe account ────────────────────────────────
    const { data: creatorRow } = await supabase
      .from("creators")
      .select("stripe_account_id")
      .eq("id", creatorId)
      .maybeSingle();

    let stripeAccountId: string | null = (creatorRow as any)?.stripe_account_id ?? null;

    if (stripeAccountId) {
      // ── Existing account: check type + completion status ──────────────────
      // A stripe_account_id in the DB means onboarding was started, not finished.
      // Also check controller type: Express accounts cannot use embedded Account
      // Sessions — they require hosted account_links. If we find one (left over
      // from the old dashboard:"express" flow), wipe it and create a fresh
      // Recipient account so the embedded component works.
      console.log("[create-creator-connect-account] existing account:", stripeAccountId, "— checking status");
      let account: any;
      try {
        account = await stripeGet(`/v1/accounts/${stripeAccountId}?expand[]=capabilities`);
      } catch (retrieveErr: unknown) {
        const msg = retrieveErr instanceof Error ? retrieveErr.message : String(retrieveErr);
        console.error("[create-creator-connect-account] account retrieve failed:", msg, "— will create fresh account");
        stripeAccountId = null; // fall through to new-account creation below
      }

      if (account) {
        const dashboardType: string = account?.controller?.dashboard?.type ?? account?.controller?.type ?? "unknown";
        const currentlyDue: string[] = account?.requirements?.currently_due ?? [];
        const transfersCap: string = account?.capabilities?.transfers ?? "unknown";

        console.log(
          "[create-creator-connect-account] account status —",
          "id:", stripeAccountId,
          "dashboard/controller type:", dashboardType,
          "currently_due:", currentlyDue,
          "transfers capability:", transfersCap,
        );

        // Express accounts cannot use embedded Account Sessions — they always
        // return an auth error. Replace with a fresh Recipient account.
        const isExpress = dashboardType === "express" || account?.controller?.type === "application";
        if (isExpress) {
          console.warn(
            "[create-creator-connect-account] account is Express-type — incompatible with embedded components.",
            "Creating new Recipient account and updating DB.",
          );
          stripeAccountId = null; // clear so we fall through to creation below
        } else if (isOnboardingComplete(account)) {
          console.log("[create-creator-connect-account] account fully onboarded — no session needed");
          return new Response(
            JSON.stringify({ onboardingComplete: true, stripeAccountId }),
            { status: 200, headers: { ...CORS, "Content-Type": "application/json" } },
          );
        } else {
          console.log("[create-creator-connect-account] account incomplete — will create fresh session");
        }
      }
    }

    if (!stripeAccountId) {
      // ── No account (new creator, or Express account replaced above) ────────
      // dashboard: "none" — recipient accounts never log into Stripe directly.
      // "express" caused a capability mismatch, leaving accounts Restricted.
      const account = await stripePost(
        "/v2/core/accounts",
        {
          contact_email: creatorEmail,
          display_name: creatorEmail,
          dashboard: "none",
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

      stripeAccountId = account.id;
      console.log("[create-creator-connect-account] v2 account created:", stripeAccountId);

      // Persist immediately so concurrent calls don't create a duplicate account.
      const { error: dbError } = await supabase
        .from("creators")
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", creatorId);

      if (dbError) {
        console.error("[create-creator-connect-account] db update failed:", dbError.message);
      } else {
        console.log("[create-creator-connect-account] stripe_account_id saved");
      }
    }

    // ── Create Account Session for embedded onboarding ─────────────────────
    // Works for both new accounts and existing incomplete accounts.
    // external_account_collection must be enabled so the creator can add their
    // bank account inside the embedded component.
    const accountSession = await stripePostForm("/v1/account_sessions", {
      account: stripeAccountId!,
      "components[account_onboarding][enabled]": "true",
      "components[account_onboarding][features][external_account_collection]": "true",
    });

    console.log("[create-creator-connect-account] account session created, expires_at:", accountSession.expires_at);

    return new Response(
      JSON.stringify({ clientSecret: accountSession.client_secret, stripeAccountId }),
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
