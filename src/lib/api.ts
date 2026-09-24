import { supabase } from "./supabase";
import type { DbCreator, DbSponsor, DbCampaign, DbOffer, DbMessage } from "./supabase";

const BASE = `https://wgujjqyiwrsmlkhluadx.supabase.co/functions/v1/make-server-f063e57b`;

async function headers(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { headers: await headers() });
  if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
  return r.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { method: "POST", headers: await headers(), body: JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
  return r.json();
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { method: "PATCH", headers: await headers(), body: JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
  return r.json();
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
export async function bootstrapSchema() {
  return post<{ ok: boolean }>("/bootstrap", {});
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function sponsorSignUp(email: string, password: string, company_name: string, industry?: string) {
  return post<{ sponsor: DbSponsor; session: any }>("/auth/sponsor/signup", { email, password, company_name, industry });
}

export async function sponsorSignIn(email: string, password: string) {
  const result = await post<{ sponsor: DbSponsor; session: any }>("/auth/sponsor/signin", { email, password });
  if (result.session) {
    await supabase.auth.setSession(result.session);
  }
  return result;
}

export async function creatorUpsert(payload: {
  user_id: string; name: string; handle?: string;
  youtube_url?: string; avatar_url?: string; subscribers?: string;
}) {
  return post<{ creator: DbCreator }>("/auth/creator/upsert", payload);
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ── Me ────────────────────────────────────────────────────────────────────────
export async function getMyCreator(): Promise<DbCreator> {
  return get<{ creator: DbCreator }>("/me/creator").then(r => r.creator);
}

export async function updateMyCreator(body: Partial<DbCreator>): Promise<DbCreator> {
  return patch<{ creator: DbCreator }>("/me/creator", body).then(r => r.creator);
}

export async function getMySponsor(): Promise<DbSponsor> {
  return get<{ sponsor: DbSponsor }>("/me/sponsor").then(r => r.sponsor);
}

export async function updateMySponsor(body: Partial<DbSponsor>): Promise<DbSponsor> {
  return patch<{ sponsor: DbSponsor }>("/me/sponsor", body).then(r => r.sponsor);
}

// ── Creators ──────────────────────────────────────────────────────────────────
export async function listCreators(q?: string): Promise<DbCreator[]> {
  return get<{ creators: DbCreator[] }>(`/creators${q ? `?q=${encodeURIComponent(q)}` : ""}`).then(r => r.creators);
}

export async function getCreator(id: string): Promise<DbCreator> {
  return get<{ creator: DbCreator }>(`/creators/${id}`).then(r => r.creator);
}

// ── Campaigns ─────────────────────────────────────────────────────────────────
export async function listCampaigns(sponsorId?: string): Promise<DbCampaign[]> {
  const qs = sponsorId ? `?sponsor_id=${sponsorId}` : "";
  return get<{ campaigns: DbCampaign[] }>(`/campaigns${qs}`).then(r => r.campaigns);
}

export async function createCampaign(body: Partial<DbCampaign>): Promise<DbCampaign> {
  return post<{ campaign: DbCampaign }>("/campaigns", body).then(r => r.campaign);
}

export async function updateCampaign(id: string, body: Partial<DbCampaign>): Promise<DbCampaign> {
  return patch<{ campaign: DbCampaign }>(`/campaigns/${id}`, body).then(r => r.campaign);
}

// ── Offers ────────────────────────────────────────────────────────────────────
export async function listOffers(creatorId?: string): Promise<DbOffer[]> {
  const qs = creatorId ? `?creator_id=${creatorId}` : "";
  return get<{ offers: DbOffer[] }>(`/offers${qs}`).then(r => r.offers);
}

export async function createOffer(body: {
  campaign_id: string; creator_id: string; note?: string; proposed_rate?: number;
}): Promise<DbOffer> {
  return post<{ offer: DbOffer }>("/offers", body).then(r => r.offer);
}

export async function updateOffer(id: string, body: Partial<DbOffer>): Promise<DbOffer> {
  return patch<{ offer: DbOffer }>(`/offers/${id}`, body).then(r => r.offer);
}

// ── Messages ──────────────────────────────────────────────────────────────────
export async function listMessages(offerId: string): Promise<DbMessage[]> {
  return get<{ messages: DbMessage[] }>(`/messages/${offerId}`).then(r => r.messages);
}

export async function sendMessage(offerId: string, body: string): Promise<DbMessage> {
  return post<{ message: DbMessage }>("/messages", { offer_id: offerId, body }).then(r => r.message);
}

// ── Ratings ───────────────────────────────────────────────────────────────────
export async function submitRating(body: {
  campaign_id: string; sponsor_id: string; creator_id: string; stars: number; comment?: string;
}) {
  return post("/ratings", body);
}
