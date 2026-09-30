import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Find all submissions that have been pending_review for > 72 hours.
  const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
  const { data: stale, error: queryErr } = await supabase
    .from("submissions")
    .select("id, submitted_at")
    .eq("approval_status", "pending_review")
    .lt("submitted_at", cutoff);

  if (queryErr) {
    console.error("[auto-approve] query failed:", queryErr.message);
    return new Response(JSON.stringify({ error: queryErr.message }), { status: 500 });
  }

  if (!stale || stale.length === 0) {
    console.log("[auto-approve] no stale submissions found");
    return new Response(JSON.stringify({ approved: 0 }), { status: 200 });
  }

  const ids = (stale as any[]).map((s) => s.id);
  console.log("[auto-approve] approving", ids.length, "submission(s):", ids);

  // approved_at = submitted_at + 72h exactly, not "now".
  // Prevents payout window drift from whenever a page load happened to fire.
  const updates = (stale as any[]).map((s) =>
    supabase
      .from("submissions")
      .update({
        approval_status: "approved",
        approved_at: new Date(new Date(s.submitted_at).getTime() + 72 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", s.id)
      .eq("approval_status", "pending_review") // guard against racing updates
  );

  const results = await Promise.all(updates);
  const failures = results.filter((r) => r.error);
  failures.forEach((r) => console.error("[auto-approve] update failed:", r.error?.message));

  const approved = ids.length - failures.length;
  console.log("[auto-approve] done —", approved, "approved,", failures.length, "failed");
  return new Response(
    JSON.stringify({ approved, failed: failures.length, ids }),
    { status: 200 },
  );
});
