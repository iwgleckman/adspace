import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

declare global { var __adspace_supabase__: SupabaseClient | undefined }

if (!globalThis.__adspace_supabase__) {
  globalThis.__adspace_supabase__ = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: `sb-${projectId}-auth`,
      },
    }
  );
}
export const supabase = globalThis.__adspace_supabase__;

export type DbCreator = {
  id: string;
  user_id: string;
  name: string;
  handle: string;
  youtube_url: string | null;
  avatar_url: string | null;
  niche_tags: string[];
  avg_views: number | null;
  retention_pct: number | null;
  age_breakdown: Record<string, number> | null;
  gender_breakdown: Record<string, number> | null;
  geo_breakdown: Record<string, number> | null;
  language_breakdown: Record<string, number> | null;
  subscribers: string | null;
  bio: string | null;
  star_rating: number;
  rating_count: number;
  created_at: string;
};

export type DbSponsor = {
  id: string;
  user_id: string;
  company_name: string;
  industry: string | null;
  niche_tags: string[];
  bio: string | null;
  website: string | null;
  avatar_url: string | null;
  completion_rate: number;
  created_at: string;
};

export type DbCampaign = {
  id: string;
  sponsor_id: string;
  name: string;
  description: string | null;
  campaign_type: "ad-read" | "dedicated-video" | "product-placement";
  pricing_model: "flat" | "cpm" | "hybrid";
  flat_fee: number;
  cpm: number;
  payout_cap: number | null;
  niche_tags: string[];
  content_deadline: string | null;
  payout_window_days: number;
  submission_deadline_days: number;
  status: "open" | "needs_response" | "accepted" | "in_progress" | "completed" | "disputed";
  created_at: string;
  sponsor?: DbSponsor;
};

export type DbOffer = {
  id: string;
  campaign_id: string;
  creator_id: string;
  proposed_rate: number | null;
  note: string | null;
  status: "pending" | "countered" | "accepted" | "declined";
  created_at: string;
  campaign?: DbCampaign;
  creator?: DbCreator;
};

export type DbSubmission = {
  id: string;
  offer_id: string;
  video_url: string;
  submitted_at: string;
  approval_status: "pending" | "approved" | "rejected";
};

export type DbRating = {
  id: string;
  campaign_id: string;
  sponsor_id: string;
  creator_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
};

export type DbMessage = {
  id: string;
  offer_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};
