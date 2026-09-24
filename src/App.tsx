import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import type { DbCreator, DbSponsor } from "./lib/supabase";
import adspaceLogo from "./imports/adspace-logo.png";

/* ---- Wordmark ---- */
function AdSpaceLogo({ height = 22, className = "" }: { height?: number; className?: string }) {
  return (
    <img
      src={adspaceLogo}
      alt="AdSpace"
      height={height}
      style={{ height, width: "auto", display: "block" }}
      className={className}
    />
  );
}

/* ---- Icons ---- */
function BriefcaseIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#0E7490" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
function SearchIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#0E7490" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}
function BuildingIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#0E7490" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}
function ChatIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#0E7490" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function BookmarkIcon({ size = 16, filled = false }: { size?: number; filled?: boolean }) { // save toggle
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#0E7490" : "none"} stroke={filled ? "#0E7490" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "browse", label: "Browse Creators", icon: SearchIcon },
  { id: "manage", label: "Manage Campaigns", icon: BriefcaseIcon },
  { id: "messages", label: "Messages", icon: ChatIcon },
];

/* ---- Types & data ---- */
type Creator = {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  tags: string[];
  topLocation: string;
  language: string;
  topAge: string;
  topGender: string;
  platform: string;
  bio: string;
  avgViews: string;
  retention: string;
  rating: number;
  reviewCount: number;
  ageBreakdown: Record<string, number> | null;
  genderBreakdown: Record<string, number> | null;
  geoBreakdown: Record<string, number> | null;
  languageBreakdown: Record<string, number> | null;
};

const CREATORS: Creator[] = [
  {
    id: 1,
    name: "Marcus Chen",
    handle: "@marcusproductivity",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&auto=format",
    subscribers: "482K",
    tags: ["Productivity", "Notion", "Study"],
    topLocation: "United States",
    language: "English",
    topAge: "25–34",
    topGender: "Male",
    platform: "YouTube",
    bio: "Helping 480K+ people build better systems for work and learning. Specializes in long-form tutorials, workflow breakdowns, and sponsored integrations that feel native to the content.",
    avgViews: "124,800",
    retention: "58.3%",
    rating: 4.8,
    reviewCount: 214,
    ageBreakdown: { "25–34": 42, "18–24": 28, "35–44": 18, "45+": 12 },
    genderBreakdown: { "Male": 68, "Female": 29, "Other": 3 },
    geoBreakdown: { "United States": 54, "Canada": 12, "United Kingdom": 10, "Australia": 8, "Other": 16 },
    languageBreakdown: { "English": 94, "Spanish": 4, "Other": 2 },
  },
  {
    id: 2,
    name: "Priya Nair",
    handle: "@priyacreates",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&auto=format",
    subscribers: "218K",
    tags: ["Finance", "Investing", "Career"],
    topLocation: "United Kingdom",
    language: "English",
    topAge: "25–34",
    topGender: "Female",
    platform: "YouTube",
    bio: "Breaking down personal finance and investing for everyday people. Known for clear, jargon-free explanations and high audience trust — ideal for fintech and investment platform partnerships.",
    avgViews: "61,200",
    retention: "54.7%",
    rating: 4.6,
    reviewCount: 87,
    ageBreakdown: { "25–34": 38, "35–44": 26, "18–24": 22, "45+": 14 },
    genderBreakdown: { "Female": 61, "Male": 37, "Other": 2 },
    geoBreakdown: { "United Kingdom": 41, "India": 22, "United States": 18, "Other": 19 },
    languageBreakdown: { "English": 89, "Hindi": 8, "Other": 3 },
  },
  {
    id: 3,
    name: "Lukas Bauer",
    handle: "@lukasmindset",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format",
    subscribers: "94K",
    tags: ["Fitness", "Wellness", "Habits"],
    topLocation: "Germany",
    language: "German",
    topAge: "18–24",
    topGender: "Male",
    platform: "YouTube",
    bio: "Documenting a year-round fitness and habit-building journey with a young German-speaking audience. Strong engagement with supplement, apparel, and wellness app categories.",
    avgViews: "28,400",
    retention: "61.1%",
    rating: 4.3,
    reviewCount: 41,
    ageBreakdown: { "18–24": 49, "25–34": 33, "13–17": 11, "35–44": 7 },
    genderBreakdown: { "Male": 78, "Female": 20, "Other": 2 },
    geoBreakdown: { "Germany": 58, "Austria": 16, "Switzerland": 14, "Other": 12 },
    languageBreakdown: { "German": 86, "English": 10, "Other": 4 },
  },
  {
    id: 4,
    name: "Aisha Okonkwo",
    handle: "@aisha.designs",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format",
    subscribers: "331K",
    tags: ["Design", "Figma", "UX"],
    topLocation: "United States",
    language: "English",
    topAge: "25–34",
    topGender: "Female",
    platform: "YouTube",
    bio: "Teaching product design and Figma workflows to the next generation of designers. Deep credibility in the design tools space — trusted voice for software, course, and SaaS sponsors.",
    avgViews: "89,600",
    retention: "62.4%",
    rating: 4.9,
    reviewCount: 163,
    ageBreakdown: { "25–34": 51, "18–24": 31, "35–44": 13, "45+": 5 },
    genderBreakdown: { "Female": 54, "Male": 43, "Other": 3 },
    geoBreakdown: { "United States": 48, "United Kingdom": 14, "India": 11, "Canada": 9, "Other": 18 },
    languageBreakdown: { "English": 97, "Other": 3 },
  },
  {
    id: 5,
    name: "Tom Eriksson",
    handle: "@tomcodes",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&auto=format",
    subscribers: "157K",
    tags: ["Coding", "Tech", "Career"],
    topLocation: "Sweden",
    language: "English",
    topAge: "18–24",
    topGender: "Male",
    platform: "YouTube",
    bio: "Self-taught developer sharing career journeys, coding tutorials, and tech job advice. Audience skews early-career engineers — well suited for bootcamps, dev tools, and cloud platforms.",
    avgViews: "44,300",
    retention: "56.8%",
    rating: 4.5,
    reviewCount: 72,
    ageBreakdown: { "18–24": 44, "25–34": 36, "13–17": 12, "35–44": 8 },
    genderBreakdown: { "Male": 74, "Female": 23, "Other": 3 },
    geoBreakdown: { "Sweden": 34, "United States": 22, "United Kingdom": 14, "Germany": 10, "Other": 20 },
    languageBreakdown: { "English": 82, "Swedish": 12, "Other": 6 },
  },
  {
    id: 6,
    name: "Sophie Laurent",
    handle: "@sophiestudies",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&auto=format",
    subscribers: "73K",
    tags: ["Study", "Aesthetic", "Notion"],
    topLocation: "France",
    language: "French",
    topAge: "13–24",
    topGender: "Female",
    platform: "YouTube",
    bio: "Aesthetic study vlogs and Notion templates for students across France and francophone Europe. Highly engaged younger audience with strong affinity for stationery, apps, and online learning.",
    avgViews: "19,100",
    retention: "67.2%",
    rating: 4.7,
    reviewCount: 38,
    ageBreakdown: { "13–17": 38, "18–24": 44, "25–34": 14, "35+": 4 },
    genderBreakdown: { "Female": 82, "Male": 15, "Other": 3 },
    geoBreakdown: { "France": 52, "Belgium": 14, "Canada": 12, "Switzerland": 10, "Other": 12 },
    languageBreakdown: { "French": 91, "English": 7, "Other": 2 },
  },
  {
    id: 7,
    name: "James Whitfield",
    handle: "@jwhitfield",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format",
    subscribers: "609K",
    tags: ["Entrepreneurship", "Business", "Finance"],
    topLocation: "United States",
    language: "English",
    topAge: "25–34",
    topGender: "Male",
    platform: "YouTube",
    bio: "Interviewing founders and breaking down business models for aspiring entrepreneurs. Large, high-intent US audience — proven fit for B2B SaaS, financial services, and business education brands.",
    avgViews: "178,500",
    retention: "52.9%",
    rating: 4.4,
    reviewCount: 119,
    ageBreakdown: { "25–34": 46, "35–44": 28, "18–24": 16, "45+": 10 },
    genderBreakdown: { "Male": 71, "Female": 27, "Other": 2 },
    geoBreakdown: { "United States": 62, "Canada": 11, "United Kingdom": 9, "Australia": 7, "Other": 11 },
    languageBreakdown: { "English": 96, "Other": 4 },
  },
  {
    id: 8,
    name: "Yuki Tanaka",
    handle: "@yukitech",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format",
    subscribers: "142K",
    tags: ["Tech", "AI", "Productivity"],
    topLocation: "Japan",
    language: "Japanese",
    topAge: "18–24",
    topGender: "Female",
    platform: "YouTube",
    bio: "Covering AI tools, gadget reviews, and productivity systems for Japan's tech-savvy youth. Rapidly growing channel with high-trust recommendations — ideal for consumer tech and software sponsors.",
    avgViews: "38,700",
    retention: "59.6%",
    rating: 4.2,
    reviewCount: 54,
    ageBreakdown: { "18–24": 52, "25–34": 30, "13–17": 11, "35–44": 7 },
    genderBreakdown: { "Female": 58, "Male": 39, "Other": 3 },
    geoBreakdown: { "Japan": 71, "United States": 10, "South Korea": 8, "Other": 11 },
    languageBreakdown: { "Japanese": 78, "English": 18, "Other": 4 },
  },
];


/* ================================================================
   Shared primitives
================================================================ */
function StarRating({ rating, reviewCount, size = "sm" }: { rating: number; reviewCount: number; size?: "sm" | "md" }) {
  const starSize = size === "md" ? 16 : 13;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.min(Math.max(rating - (i - 1), 0), 1);
          return (
            <svg key={i} width={starSize} height={starSize} viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`star-${rating}-${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${fill * 100}%`} stopColor="#F59E0B" />
                  <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={`url(#star-${rating}-${i})`}
                stroke="none"
              />
            </svg>
          );
        })}
      </div>
      <span className="text-xs font-semibold text-gray-700" style={{ fontFamily: "'DM Mono', monospace" }}>{rating.toFixed(1)}</span>
      <span className="text-xs text-gray-400">({reviewCount})</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
        {children}
      </p>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function BarChart({ data, color = "#0E7490" }: { data: { label: string; pct: number }[]; color?: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      {data.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 shrink-0" style={{ width: 80, fontFamily: "'DM Mono', monospace" }}>
            {row.label}
          </span>
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${row.pct}%`, backgroundColor: color }} />
          </div>
          <span className="text-xs font-medium shrink-0" style={{ width: 32, textAlign: "right", fontFamily: "'DM Mono', monospace", color }}>
            {row.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

type BreakdownMap = Record<string, number> | null;

function AudienceBreakdownCard({ title, data, color }: { title: string; data: BreakdownMap; color: string }) {
  const hasData = data && Object.keys(data).length > 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>{title}</p>
      {hasData ? (
        <BarChart data={Object.entries(data!).map(([label, pct]) => ({ label, pct: Number(pct) }))} color={color} />
      ) : (
        <p className="text-xs text-gray-400 italic">Audience data not yet available</p>
      )}
    </div>
  );
}

function AudienceSection({
  ageBreakdown, genderBreakdown, geoBreakdown, languageBreakdown, accentColor, onLoad,
}: {
  ageBreakdown: BreakdownMap;
  genderBreakdown: BreakdownMap;
  geoBreakdown: BreakdownMap;
  languageBreakdown: BreakdownMap;
  accentColor?: string;
  onLoad?: (data: { age: BreakdownMap; gender: BreakdownMap; geo: BreakdownMap; language: BreakdownMap }) => void;
}) {
  const color = accentColor ?? "#0E7490";
  useEffect(() => {
    onLoad?.({ age: ageBreakdown, gender: genderBreakdown, geo: geoBreakdown, language: languageBreakdown });
  }, []);
  return (
    <div>
      <SectionLabel>Audience</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <AudienceBreakdownCard title="Age Range" data={ageBreakdown} color={color} />
        <AudienceBreakdownCard title="Gender" data={genderBreakdown} color={color} />
        <AudienceBreakdownCard title="Top Locations" data={geoBreakdown} color={color} />
        <AudienceBreakdownCard title="Languages" data={languageBreakdown} color={color} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, trend, trendUp }: { label: string; value: string; sub: string; trend?: string; trendUp?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-xs font-medium text-gray-400 mb-3">{label}</p>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">{sub}</p>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: trendUp ? "#F0FDF4" : "#FFF1F2", color: trendUp ? "#16A34A" : "#E11D48", fontFamily: "'DM Mono', monospace" }}>
          {trend}
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   Report modal (bug / user report / content report)
================================================================ */
function CancelOfferModal({
  side,
  onConfirm,
  onClose,
  confirming,
}: {
  side: "sponsor" | "creator";
  onConfirm: () => void;
  onClose: () => void;
  confirming: boolean;
}) {
  const body =
    side === "sponsor"
      ? "Cancelling now means this creator won't be paid, and it will be recorded on your sponsor profile. Are you sure?"
      : "Cancelling now means you won't be paid for this campaign, and it will be recorded on your creator profile. Are you sure?";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Cancel offer?</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors">Keep offer</button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="text-sm font-semibold px-5 py-2 rounded-lg text-white disabled:opacity-60 transition-opacity"
            style={{ backgroundColor: "#EF4444" }}
          >
            {confirming ? "Cancelling…" : "Yes, cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelCampaignModal({
  campaignName,
  onConfirm,
  onClose,
  confirming,
}: {
  campaignName: string;
  onConfirm: () => void;
  onClose: () => void;
  confirming: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Close campaign?</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            This will close <span className="font-semibold text-gray-900">{campaignName}</span> and decline any pending applications. Since no offers have been accepted yet, there is no reputation impact.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors">Keep open</button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="text-sm font-semibold px-5 py-2 rounded-lg text-white disabled:opacity-60 transition-opacity"
            style={{ backgroundColor: "#EF4444" }}
          >
            {confirming ? "Closing…" : "Close campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportModal({
  reportType,
  relatedId,
  contextLabel,
  onClose,
}: {
  reportType: "bug" | "user_report" | "content_report";
  relatedId?: string;
  contextLabel?: string;
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const title = reportType === "bug" ? "Report a bug" : reportType === "user_report" ? "Report this creator" : "Report this campaign";
  const placeholder = reportType === "bug"
    ? "Describe what happened and what you expected…"
    : "Describe why you are reporting this…";

  async function handleSubmit() {
    const desc = description.trim();
    if (!desc) return;
    setSubmitting(true);

    // Use getSession() to read the locally-stored session (no network round-trip).
    // getUser() validates the token server-side but does not guarantee the JWT
    // is attached to subsequent client calls if the session is stale.
    const { data: { session } } = await supabase.auth.getSession();
    console.log("[report] session uid:", session?.user?.id ?? "null", "token present:", !!session?.access_token);
    if (!session?.user) { setSubmitting(false); console.error("[report] no session — cannot insert"); return; }

    const fullDescription = reportType === "bug"
      ? `${desc}\n\nPage: ${window.location.href}`
      : desc;

    const reporterId = session.user.id;
    console.log("[report] reporter_id exact value:", JSON.stringify(reporterId), "typeof:", typeof reporterId);
    const payload = {
      reporter_id: reporterId,
      report_type: reportType,
      description: fullDescription,
      related_id: relatedId ?? null,
    };
    console.log("[report] full payload:", JSON.stringify(payload));
    // Do NOT chain .select() — we have no SELECT policy on reports, only INSERT.
    // Chaining .select().single() would trigger a second SELECT that RLS blocks,
    // surfacing as a misleading INSERT policy violation.
    const { error } = await supabase.from("reports").insert(payload);
    setSubmitting(false);
    if (error) {
      console.error("[report] failed — message:", error.message, "| code:", (error as any).code, "| details:", error.details, "| hint:", error.hint);
      return;
    }
    console.log("[report] submitted for reporter:", reporterId);
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {done ? (
          <div className="px-6 py-8 text-center">
            <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <p className="text-sm font-semibold text-gray-900">Report submitted</p>
            <p className="text-xs text-gray-400 mt-1">Thank you — we will review it shortly.</p>
            <button onClick={onClose} className="mt-5 text-xs font-semibold px-5 py-2 rounded-lg text-white" style={{ backgroundColor: "#0E7490" }}>Close</button>
          </div>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-4">
            {contextLabel && (
              <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Mono', monospace" }}>Re: <span className="font-semibold text-gray-700">{contextLabel}</span></p>
            )}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !description.trim()}
                className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "#EF4444" }}
              >
                {submitting ? "Submitting…" : "Submit report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   Sidebar
================================================================ */
function Sidebar({ activeNav, setActiveNav, onHome, sponsor }: { activeNav: string; setActiveNav: (id: string) => void; onHome: () => void; sponsor?: DbSponsor | null }) {
  const [showReport, setShowReport] = useState(false);
  return (
    <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-gray-100 h-full">
      {showReport && <ReportModal reportType="bug" onClose={() => setShowReport(false)} />}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <button onClick={onHome} className="hover:opacity-75 transition-opacity text-left flex items-center">
          <AdSpaceLogo height={20} />
        </button>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: "#F1F5F9", color: "#64748B", fontFamily: "'DM Mono', monospace", letterSpacing: "0.03em" }}>
          Advertiser
        </span>
      </div>
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-colors"
              style={{ backgroundColor: active ? "#ECFEFF" : "transparent", color: active ? "#0E7490" : "#6B7280", fontWeight: active ? 600 : 400 }}
            >
              <Icon size={18} active={active} />
              {label}
            </button>
          );
        })}
      </nav>
      <button
        onClick={() => setActiveNav("myprofile")}
        className="border-t border-gray-100 px-4 py-4 flex items-center gap-3 w-full text-left transition-colors hover:bg-gray-50"
        style={{ backgroundColor: activeNav === "myprofile" ? "#ECFEFF" : "transparent" }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center" style={{ outline: activeNav === "myprofile" ? "2px solid #0E7490" : "2px solid transparent" }}>
          {sponsor?.avatar_url
            ? <img src={sponsor.avatar_url} alt={sponsor.company_name} className="w-full h-full object-cover" />
            : <span className="text-xs font-bold text-gray-400">{sponsor?.company_name?.[0] ?? "?"}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: activeNav === "myprofile" ? "#0E7490" : "#1F2937" }}>{sponsor?.company_name ?? "My Profile"}</p>
          <p className="text-xs text-gray-400 truncate">View my profile</p>
        </div>
      </button>
      <button
        onClick={() => setShowReport(true)}
        className="px-6 py-2.5 text-left border-t border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span className="text-xs text-gray-400 hover:text-gray-600">Report a bug</span>
      </button>
    </aside>
  );
}

/* ================================================================
   Browse Creators view
================================================================ */
function BrowseCreatorsView({ onViewProfile, onMakeOffer, savedIds, onToggleSave }: {
  onViewProfile: (c: Creator) => void;
  onMakeOffer: (c: Creator) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [dbCreators, setDbCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("creators").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setDbCreators((data ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
        handle: c.handle ? `@${c.handle}` : "",
        avatar: c.avatar_url ?? "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=120&h=120&fit=crop&auto=format",
        subscribers: c.subscribers ?? "—",
        tags: c.niche_tags ?? [],
        topLocation: c.geo_breakdown ? Object.keys(c.geo_breakdown)[0] ?? "" : "",
        language: c.language_breakdown ? Object.keys(c.language_breakdown)[0] ?? "English" : "English",
        topAge: c.age_breakdown ? Object.keys(c.age_breakdown)[0] ?? "" : "",
        topGender: c.gender_breakdown ? Object.keys(c.gender_breakdown)[0] ?? "" : "",
        platform: "YouTube",
        bio: c.bio ?? "",
        avgViews: c.avg_views ? c.avg_views.toLocaleString() : "—",
        retention: c.retention_pct ? `${c.retention_pct}%` : "—",
        rating: Number(c.star_rating) || 0,
        reviewCount: c.rating_count ?? 0,
        ageBreakdown: c.age_breakdown ?? null,
        genderBreakdown: c.gender_breakdown ?? null,
        geoBreakdown: c.geo_breakdown ?? null,
        languageBreakdown: c.language_breakdown ?? null,
      })));
      setLoading(false);
    });
  }, []);

  const filtered = dbCreators.filter((c) => {
    const q = query.toLowerCase();
    const matchesQuery = q === "" || c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q));
    const matchesSaved = !showSaved || savedIds.has(c.id);
    return matchesQuery && matchesSaved;
  });

  return (
    <>
      <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <p className="text-xs text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Browse Creators</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSaved((v) => !v)}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
            style={{
              backgroundColor: showSaved ? "#ECFEFF" : "white",
              borderColor: showSaved ? "#0E7490" : "#E5E7EB",
              color: showSaved ? "#0E7490" : "#6B7280",
            }}
          >
            <BookmarkIcon filled={showSaved} size={13} />
            Saved{savedIds.size > 0 && <span className="ml-0.5">({savedIds.size})</span>}
          </button>
          <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col gap-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={'Search by name or tag — e.g. "Priya" or "Notion"'}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-shadow"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px #CFFAFE")}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          />
        </div>
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>Loading creators…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
            {query ? "No creators match your search." : "No creators have joined yet."}
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {filtered.map((c) => (
              <CreatorCard key={c.id} creator={c} onViewProfile={onViewProfile} onMakeOffer={onMakeOffer} saved={savedIds.has(c.id)} onToggleSave={onToggleSave} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function CreatorCard({ creator: c, onViewProfile, onMakeOffer, saved, onToggleSave }: { creator: Creator; onViewProfile: (c: Creator) => void; onMakeOffer: (c: Creator) => void; saved: boolean; onToggleSave: (id: number) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
          <p className="text-xs text-gray-400 truncate">{c.handle} · {c.platform}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => onToggleSave(c.id)} className="transition-colors" title={saved ? "Unsave" : "Save"}>
              <BookmarkIcon filled={saved} size={16} />
            </button>
          </div>
          <p className="text-base font-bold text-gray-900" style={{ fontFamily: "'DM Mono', monospace" }}>{c.subscribers}</p>
          <p className="text-xs text-gray-400">subscribers</p>
        </div>
      </div>
      <StarRating rating={c.rating} reviewCount={c.reviewCount} />
      <div className="flex flex-wrap gap-1.5">
        {c.tags.map((tag) => (
          <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#ECFEFF", color: "#0C4A6E", fontFamily: "'DM Mono', monospace" }}>
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <StatPill icon="📍" label="Location" value={c.topLocation} />
        <StatPill icon="🌐" label="Language" value={c.language} />
        <StatPill icon="👥" label="Top age" value={c.topAge} />
        <StatPill icon="⚧" label="Top gender" value={c.topGender} />
      </div>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onViewProfile(c)}
          className="flex-1 text-sm font-semibold py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={() => onMakeOffer(c)}
          className="flex-1 text-sm font-semibold py-2 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0E7490" }}
        >
          Make Offer
        </button>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs">{icon}</span>
      <span className="text-xs text-gray-400">{label}:</span>
      <span className="text-xs font-medium text-gray-700 truncate">{value}</span>
    </div>
  );
}

/* ================================================================
   Creator Profile view
================================================================ */
function CreatorProfileView({ creator, onBack, onMakeOffer }: { creator: Creator; onBack: () => void; onMakeOffer: (c: Creator) => void }) {
  const [showReport, setShowReport] = useState(false);
  return (
    <>
      {showReport && <ReportModal reportType="user_report" relatedId={String(creator.id)} contextLabel={creator.name} onClose={() => setShowReport(false)} />}
      <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ChevronLeftIcon />
          Back to Browse
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowReport(true)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-2">
            Report
          </button>
          <button onClick={() => onMakeOffer(creator)} className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#0E7490" }}>
            Make Offer
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-24 w-full" style={{ backgroundImage: "linear-gradient(135deg, #CFFAFE 0%, #E0F7FA 50%, #F0FDF4 100%)" }} />
          <div className="px-8 pb-8">
            <div className="-mt-10 mb-5">
              <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-sm bg-gray-100">
                <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{creator.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{creator.handle} · {creator.platform}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {creator.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#ECFEFF", color: "#0C4A6E", fontFamily: "'DM Mono', monospace" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  <span className="text-xs text-gray-500">Open to campaigns</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <StarRating rating={creator.rating} reviewCount={creator.reviewCount} size="md" />
            </div>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-xl">{creator.bio}</p>
          </div>
        </div>

        {/* Reach & Retention */}
        <div>
          <SectionLabel>Reach &amp; Retention</SectionLabel>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <StatCard label="Avg. Views / Video" value={creator.avgViews} sub="Last 10 uploads" />
            <StatCard label="Audience Retention" value={creator.retention} sub="Avg. watch-through" />
            <StatCard label="Subscribers" value={creator.subscribers} sub={creator.platform} />
          </div>
        </div>

        {/* Audience */}
        <AudienceSection
          ageBreakdown={creator.ageBreakdown}
          genderBreakdown={creator.genderBreakdown}
          geoBreakdown={creator.geoBreakdown}
          languageBreakdown={creator.languageBreakdown}
          accentColor="#0E7490"
        />

        <div className="h-4" />
      </div>
    </>
  );
}

/* ================================================================
   My Profile (advertiser/brand)
================================================================ */
type BrandProfile = {
  name: string;
  website: string;
  industry: string;
  bio: string;
  tags: string[];
  preferredNiches: string[];
  avatarUrl: string | null;
};

const EMPTY_PROFILE: BrandProfile = { name: "", website: "", industry: "", bio: "", tags: [], preferredNiches: [], avatarUrl: null };

function MyProfileView({ dbSponsor, onSponsorUpdate }: { dbSponsor?: DbSponsor | null; onSponsorUpdate?: (s: DbSponsor) => void }) {
  function sponsorToProfile(s: DbSponsor): BrandProfile {
    return {
      name: s.company_name,
      website: (s as any).website ?? "",
      industry: s.industry ?? "",
      bio: s.bio ?? "",
      tags: s.niche_tags ?? [],
      preferredNiches: s.niche_tags ?? [],
      avatarUrl: s.avatar_url ?? null,
    };
  }

  const initialProfile = dbSponsor ? sponsorToProfile(dbSponsor) : EMPTY_PROFILE;
  const [profile, setProfile] = useState<BrandProfile>(initialProfile);
  const [hasSponsor, setHasSponsor] = useState(!!dbSponsor);
  const [loading, setLoading] = useState(!dbSponsor);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<BrandProfile>(initialProfile);
  const [nicheInput, setNicheInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const ext = file.name.split(".").pop();
      const path = `sponsors/${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const avatarUrl = urlData.publicUrl;
      await supabase.from("sponsors").update({ avatar_url: avatarUrl }).eq("user_id", user.id);
      setProfile((p) => ({ ...p, avatarUrl }));
      setDraft((d) => ({ ...d, avatarUrl }));
      if (dbSponsor) onSponsorUpdate?.({ ...dbSponsor, avatar_url: avatarUrl });
    } catch {}
    setAvatarUploading(false);
  }

  useEffect(() => {
    if (dbSponsor) {
      const p = sponsorToProfile(dbSponsor);
      setProfile(p);
      setDraft(p);
      setHasSponsor(true);
      setLoading(false);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase.from("sponsors").select("*").eq("user_id", user.id).maybeSingle().then(({ data: s }) => {
        if (s) {
          const p = sponsorToProfile(s);
          setProfile(p);
          setDraft(p);
          setHasSponsor(true);
        }
        setLoading(false);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openEdit() { setDraft(profile); setEditing(true); setNicheInput(""); setTagInput(""); }
  async function saveEdit() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("sponsors").upsert({
          user_id: user.id,
          company_name: draft.name,
          website: draft.website || null,
          industry: draft.industry || null,
          bio: draft.bio || null,
          niche_tags: draft.preferredNiches,
        }, { onConflict: "user_id" });
        if (dbSponsor) onSponsorUpdate?.({ ...dbSponsor, company_name: draft.name, industry: draft.industry || null, bio: draft.bio || null, niche_tags: draft.preferredNiches });
      }
      setProfile(draft);
      setEditing(false);
    } catch {}
    setSaving(false);
  }

  function addItem(key: "preferredNiches" | "tags", input: string, setInput: (v: string) => void) {
    const val = input.trim();
    if (val && !draft[key].includes(val)) setDraft((d) => ({ ...d, [key]: [...d[key], val] }));
    setInput("");
  }
  function removeItem(key: "preferredNiches" | "tags", val: string) {
    setDraft((d) => ({ ...d, [key]: d[key].filter((x) => x !== val) }));
  }

  return (
    <>
      <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <p className="text-xs text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>My Profile</p>
        {!loading && <button onClick={openEdit} className="text-sm font-semibold px-5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Edit Profile</button>}
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64 text-sm text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Loading profile…</div>
      )}

      {!loading && <div className="max-w-3xl mx-auto px-8 py-8 flex flex-col gap-6">
        {/* Brand header card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-20 w-full" style={{ backgroundImage: "linear-gradient(135deg, #F0F9FF 0%, #CFFAFE 60%, #F0FDF4 100%)" }} />
          <div className="px-8 pb-8">
            {/* Avatar — clickable to upload */}
            <div className="-mt-10 mb-5 flex items-end gap-4">
              <label className="relative cursor-pointer group" title="Upload profile photo">
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} disabled={avatarUploading} />
                <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                    : <span className="text-2xl font-bold text-gray-300">{profile.name[0]?.toUpperCase()}</span>}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {avatarUploading
                    ? <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    : <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                </div>
              </label>
              <div className="mb-1">
                <p className="text-[11px] text-gray-400 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>Click photo to update</p>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{profile.name || <span className="text-gray-300 italic font-normal text-lg">No company name — click Edit Profile</span>}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {profile.industry && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#F0F9FF", color: "#0E7490", fontFamily: "'DM Mono', monospace" }}>
                      {profile.industry}
                    </span>
                  )}
                  {profile.website && (
                    <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{profile.website}</span>
                  )}
                </div>
                {profile.bio && <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-xl">{profile.bio}</p>}
              </div>
            </div>

            {profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#475569", fontFamily: "'DM Mono', monospace" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>}

      {/* Edit slide-over */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={(e) => { if (e.target === e.currentTarget) setEditing(false); }}>
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <h2 className="text-base font-semibold text-gray-900">Edit Profile</h2>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors">&times;</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>Brand info</p>
                <div className="flex flex-col gap-3">
                  <Field label="Company name" required>
                    <input type="text" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className={fieldClass(false)} />
                  </Field>
                  <Field label="Website">
                    <input type="text" value={draft.website} onChange={(e) => setDraft((d) => ({ ...d, website: e.target.value }))} placeholder="yourcompany.com" className={fieldClass(false)} />
                  </Field>
                  <Field label="Industry">
                    <input type="text" value={draft.industry} onChange={(e) => setDraft((d) => ({ ...d, industry: e.target.value }))} placeholder="e.g. B2B Software" className={fieldClass(false)} />
                  </Field>
                  <Field label="Bio">
                    <textarea rows={4} value={draft.bio} onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))} className={fieldClass(false) + " resize-none"} />
                  </Field>
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>Brand tags</p>
                <div className="flex gap-2">
                  <input
                    type="text" value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem("tags", tagInput, setTagInput); } }}
                    placeholder="e.g. SaaS"
                    className={fieldClass(false) + " flex-1"}
                  />
                  <button type="button" onClick={() => addItem("tags", tagInput, setTagInput)} className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shrink-0">Add</button>
                </div>
                {draft.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {draft.tags.map((t) => (
                      <span key={t} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#475569", fontFamily: "'DM Mono', monospace" }}>
                        {t}
                        <button type="button" onClick={() => removeItem("tags", t)} className="opacity-50 hover:opacity-100 transition-opacity">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Preferred niches */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>Preferred niches</p>
                <div className="flex gap-2">
                  <input
                    type="text" value={nicheInput}
                    onChange={(e) => setNicheInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem("preferredNiches", nicheInput, setNicheInput); } }}
                    placeholder="e.g. Productivity"
                    className={fieldClass(false) + " flex-1"}
                  />
                  <button type="button" onClick={() => addItem("preferredNiches", nicheInput, setNicheInput)} className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shrink-0">Add</button>
                </div>
                {draft.preferredNiches.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {draft.preferredNiches.map((n) => (
                      <span key={n} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#ECFEFF", color: "#0C4A6E", fontFamily: "'DM Mono', monospace" }}>
                        {n}
                        <button type="button" onClick={() => removeItem("preferredNiches", n)} className="opacity-50 hover:opacity-100 transition-opacity">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
              <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="text-sm font-semibold px-6 py-2 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: "#0E7490" }}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


/* ================================================================
   Manage Campaigns view
================================================================ */
type Campaign = {
  id: number;
  name: string;
  brand?: string;
  description: string;
  flatFee: number;
  cpm: number;
  payoutCap: number | null;
  status: "Draft" | "Live" | "Paused" | "Completed";
  startDate: string;
  endDate: string;
  payoutWindowDays: number;
  submissionDeadlineDays: number;
  niches: string[];
  contentDeadlineDays?: number | null;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  flatFee: "",
  cpm: "",
  payoutCap: "",
  hasCap: true,
  payoutWindowDays: "",
  submissionDeadlineDays: "",
  contentDeadlineDays: "",
  niches: [] as string[],
  nicheInput: "",
};

function ManageCampaignsView({ dbSponsor }: { dbSponsor?: DbSponsor | null }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [rosterCampaign, setRosterCampaign] = useState<Campaign | null>(null);
  const [cancelCampaignTarget, setCancelCampaignTarget] = useState<Campaign | null>(null);
  const [cancellingCampaign, setCancellingCampaign] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    if (!dbSponsor) { setDbLoading(false); return; }
    supabase.from("campaigns").select("*").eq("sponsor_id", dbSponsor.id).order("created_at", { ascending: false }).then(({ data: dbCampaigns, error }) => {
      if (error) console.error("Failed to load campaigns:", error);
      if (dbCampaigns && dbCampaigns.length > 0) {
        setCampaigns(dbCampaigns.map((c: any) => ({
          id: c.id,
          _dbId: c.id,
          name: c.name,
          brand: dbSponsor.company_name,
          description: c.description ?? "",
          flatFee: Number(c.flat_fee),
          cpm: Number(c.cpm),
          payoutCap: c.payout_cap ? Number(c.payout_cap) : null,
          status: c.status === "open" ? "Live" : c.status === "in_progress" ? "Live" : "Completed" as any,
          startDate: "",
          endDate: "",
          payoutWindowDays: c.payout_window_days,
          submissionDeadlineDays: c.submission_deadline_days,
          niches: c.niche_tags ?? [],
        } as Campaign & { _dbId: string })));
      }
      setDbLoading(false);
    });
  }, [dbSponsor?.id]);

  function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function addNiche() {
    const tag = form.nicheInput.trim();
    if (tag && !form.niches.includes(tag)) {
      setForm((f) => ({ ...f, niches: [...f.niches, tag], nicheInput: "" }));
    } else {
      setForm((f) => ({ ...f, nicheInput: "" }));
    }
  }

  function removeNiche(n: string) {
    setForm((f) => ({ ...f, niches: f.niches.filter((x) => x !== n) }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Campaign name is required.";
    if (!form.flatFee || isNaN(Number(form.flatFee)) || Number(form.flatFee) < 0) e.flatFee = "Enter a valid flat fee.";
    if (!form.cpm || isNaN(Number(form.cpm)) || Number(form.cpm) < 0) e.cpm = "Enter a valid CPM.";
    if (form.hasCap && (!form.payoutCap || isNaN(Number(form.payoutCap)) || Number(form.payoutCap) <= 0)) e.payoutCap = "Enter a valid payout cap.";
    if (form.hasCap && Number(form.payoutCap) < Number(form.flatFee)) e.payoutCap = "Payout cap must be at least the flat fee.";
    if (!form.payoutWindowDays || isNaN(Number(form.payoutWindowDays)) || Number(form.payoutWindowDays) < 1) e.payoutWindowDays = "Enter a number of days (minimum 1).";
    if (!form.submissionDeadlineDays || isNaN(Number(form.submissionDeadlineDays)) || Number(form.submissionDeadlineDays) < 1) e.submissionDeadlineDays = "Enter a number of days (minimum 1).";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    // Flush any text still typed in the niche input that wasn't added via Enter/Add
    const pendingNiche = form.nicheInput.trim();
    const finalNiches = pendingNiche && !form.niches.includes(pendingNiche)
      ? [...form.niches, pendingNiche]
      : form.niches;
    const next: Campaign = {
      id: crypto.randomUUID() as any,
      name: form.name.trim(),
      description: form.description.trim(),
      flatFee: Number(form.flatFee),
      cpm: Number(form.cpm),
      payoutCap: form.hasCap ? Number(form.payoutCap) : null,
      status: "Live",
      startDate: "",
      endDate: "",
      payoutWindowDays: Number(form.payoutWindowDays),
      submissionDeadlineDays: Number(form.submissionDeadlineDays),
      contentDeadlineDays: form.contentDeadlineDays ? Number(form.contentDeadlineDays) : null,
      niches: finalNiches,
    };
    setCampaigns((prev) => [next, ...prev]);
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
    // Persist to Supabase — resolve sponsor_id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { console.error("Campaign insert failed: no auth user"); return; }

    // Try prop first, then DB lookup, then fall back to user.id (works when sponsors.id = auth.uid())
    let sponsorId: string | null = dbSponsor?.id ?? null;
    if (!sponsorId) {
      const { data: sp, error: spErr } = await supabase.from("sponsors").select("id").eq("user_id", user.id).maybeSingle();
      console.log("Sponsor lookup:", { sp, spErr });
      sponsorId = sp?.id ?? null;
    }
    if (!sponsorId) {
      // Last resort: sponsors table may use auth.uid() as primary key
      sponsorId = user.id;
      console.log("Falling back to user.id as sponsor_id:", sponsorId);
    }

    const payload = {
      sponsor_id: sponsorId,
      name: next.name,
      description: next.description,
      flat_fee: next.flatFee,
      cpm: next.cpm,
      payout_cap: next.payoutCap ?? null,
      payout_window_days: next.payoutWindowDays,
      submission_deadline_days: next.submissionDeadlineDays,
      content_deadline_days: next.contentDeadlineDays ?? null,
      niche_tags: finalNiches,
      status: "open",
    };
    console.log("[create-campaign] inserting:", payload);
    const { data: inserted, error: insertError } = await supabase.from("campaigns").insert(payload).select().single();
    if (insertError) {
      console.error("[create-campaign] insert failed:", JSON.stringify(insertError));
    } else if (inserted) {
      console.log("[create-campaign] saved:", inserted.id, "niche_tags:", inserted.niche_tags);
      setCampaigns((prev) => prev.map((c) => c.id === next.id ? { ...c, id: inserted.id, _dbId: inserted.id } as any : c));
    }
  }

  const statusColor: Record<Campaign["status"], { bg: string; text: string }> = {
    Live:      { bg: "#F0FDF4", text: "#16A34A" },
    Draft:     { bg: "#F8FAFC", text: "#64748B" },
    Paused:    { bg: "#FFF1F2", text: "#E11D48" },
    Completed: { bg: "#F1F5F9", text: "#475569" },
  };

  async function handleCancelCampaign() {
    if (!cancelCampaignTarget) return;
    setCancellingCampaign(true);
    const dbId = (cancelCampaignTarget as any)._dbId;
    console.log("[cancel-open-campaign] campaignId:", dbId, "name:", cancelCampaignTarget.name);
    if (dbId) {
      await supabase.from("offers").update({ status: "closed" }).eq("campaign_id", dbId).eq("status", "pending");
      await supabase.from("campaigns").update({ status: "closed" }).eq("id", dbId);
      console.log("[cancel-open-campaign] done");
    }
    setCampaigns((prev) => prev.map((p) => p.id === cancelCampaignTarget.id ? { ...p, status: "Paused" } : p));
    setCancellingCampaign(false);
    setCancelCampaignTarget(null);
  }

  return (
    <>
      {cancelCampaignTarget && (
        <CancelCampaignModal
          campaignName={cancelCampaignTarget.name}
          confirming={cancellingCampaign}
          onConfirm={handleCancelCampaign}
          onClose={() => setCancelCampaignTarget(null)}
        />
      )}
      {/* Top bar */}
      <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <p className="text-xs text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Manage Campaigns</p>
        <button
          onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setErrors({}); }}
          className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-opacity hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: "#0E7490" }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Campaign
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 flex flex-col gap-4">
        {campaigns.length === 0 && (
          <div className="text-center py-24 text-gray-300 text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
            No campaigns yet. Add one to get started.
          </div>
        )}
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-base font-semibold text-gray-900">{c.name}</h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: statusColor[c.status].bg, color: statusColor[c.status].text, fontFamily: "'DM Mono', monospace" }}>
                    {c.status}
                  </span>
                </div>
                {c.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{c.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setRosterCampaign(c)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  View Creators
                </button>
                {c.status !== "Completed" && c.status !== "Paused" && (
                  <button
                    onClick={() => setCancelCampaignTarget(c)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Close campaign
                  </button>
                )}
                {c.status === "Paused" && (
                  <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Cancelled</span>
                )}
              </div>
            </div>

            {/* Pricing strip */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Flat fee</p>
                <p className="text-lg font-bold text-gray-900">{fmt(c.flatFee)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Minimum payout</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>CPM rate</p>
                <p className="text-lg font-bold text-gray-900">{fmt(c.cpm)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Per 1,000 views</p>
              </div>
              <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#ECFEFF", border: "1px solid #A5F3FC" }}>
                <p className="text-xs mb-1" style={{ fontFamily: "'DM Mono', monospace", color: "#0C4A6E" }}>Payout cap</p>
                <p className="text-lg font-bold" style={{ color: "#0E7490" }}>{c.payoutCap ? fmt(c.payoutCap) : "Uncapped"}</p>
                <p className="text-xs mt-0.5" style={{ color: "#0891B2" }}>Maximum total payout</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Payout window</p>
                <p className="text-lg font-bold text-gray-900">{c.payoutWindowDays} days</p>
                <p className="text-xs text-gray-400 mt-0.5">After content publishes</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Submit within</p>
                <p className="text-lg font-bold text-gray-900">{c.submissionDeadlineDays} days</p>
                <p className="text-xs text-gray-400 mt-0.5">After offer accepted</p>
              </div>
            </div>

            {/* Niches */}
            {c.niches.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {c.niches.map((n) => (
                  <span key={n} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontFamily: "'DM Mono', monospace" }}>{n}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">New Campaign</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">&times;</button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Name */}
              <Field label="Campaign name" error={errors.name} required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Q4 Brand Awareness Push"
                  className={fieldClass(!!errors.name)}
                />
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What should creators know about this campaign?"
                  rows={3}
                  className={fieldClass(false) + " resize-none"}
                />
              </Field>

              {/* Pricing */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>Pricing</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Flat fee (min. payout)" error={errors.flatFee} required prefix="$">
                    <input
                      type="number"
                      min="0"
                      value={form.flatFee}
                      onChange={(e) => setForm((f) => ({ ...f, flatFee: e.target.value }))}
                      placeholder="300"
                      className={fieldClass(!!errors.flatFee) + " pl-7"}
                    />
                  </Field>
                  <Field label="CPM rate (per 1K views)" error={errors.cpm} required prefix="$">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.cpm}
                      onChange={(e) => setForm((f) => ({ ...f, cpm: e.target.value }))}
                      placeholder="3.50"
                      className={fieldClass(!!errors.cpm) + " pl-7"}
                    />
                  </Field>
                </div>
              </div>

              {/* Payout cap */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    id="hasCap"
                    type="checkbox"
                    checked={form.hasCap}
                    onChange={(e) => setForm((f) => ({ ...f, hasCap: e.target.checked, payoutCap: "" }))}
                    className="w-4 h-4 rounded accent-teal-600"
                  />
                  <label htmlFor="hasCap" className="text-sm text-gray-700 select-none">Set a payout cap (maximum total payout)</label>
                </div>
                {form.hasCap && (
                  <Field label="Payout cap" error={errors.payoutCap} required prefix="$">
                    <input
                      type="number"
                      min="0"
                      value={form.payoutCap}
                      onChange={(e) => setForm((f) => ({ ...f, payoutCap: e.target.value }))}
                      placeholder="1000000"
                      className={fieldClass(!!errors.payoutCap) + " pl-7"}
                    />
                  </Field>
                )}
              </div>

              {/* Payout window */}
              <Field label="Payout window (days after publishing)" error={errors.payoutWindowDays} required>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={form.payoutWindowDays}
                    onChange={(e) => setForm((f) => ({ ...f, payoutWindowDays: e.target.value }))}
                    placeholder="30"
                    className={fieldClass(!!errors.payoutWindowDays) + " pr-14"}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none" style={{ fontFamily: "'DM Mono', monospace" }}>days</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Views within this window after a creator publishes their content will count toward the CPM payout.</p>
              </Field>

              {/* Submission deadline */}
              <Field label="Submission deadline (days after offer accepted)" error={errors.submissionDeadlineDays} required>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={form.submissionDeadlineDays}
                    onChange={(e) => setForm((f) => ({ ...f, submissionDeadlineDays: e.target.value }))}
                    placeholder="14"
                    className={fieldClass(!!errors.submissionDeadlineDays) + " pr-14"}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none" style={{ fontFamily: "'DM Mono', monospace" }}>days</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">How many days the creator has to submit their video after the deal is accepted.</p>
              </Field>

              {/* Content deadline */}
              <Field label="Days to submit content after acceptance" error={errors.contentDeadlineDays}>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={form.contentDeadlineDays}
                    onChange={(e) => setForm((f) => ({ ...f, contentDeadlineDays: e.target.value }))}
                    placeholder="14"
                    className={fieldClass(!!errors.contentDeadlineDays) + " pr-14"}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none" style={{ fontFamily: "'DM Mono', monospace" }}>days</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">The content deadline shown to creators is calculated from when their offer is accepted.</p>
              </Field>

              {/* Niche tags */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>Target niches</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.nicheInput}
                    onChange={(e) => setForm((f) => ({ ...f, nicheInput: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNiche(); } }}
                    placeholder="Type a niche and press Enter"
                    className={fieldClass(false) + " flex-1"}
                  />
                  <button
                    type="button"
                    onClick={addNiche}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
                {form.niches.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {form.niches.map((n) => (
                      <span key={n} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#ECFEFF", color: "#0C4A6E", fontFamily: "'DM Mono', monospace" }}>
                        {n}
                        <button type="button" onClick={() => removeNiche(n)} className="opacity-50 hover:opacity-100 transition-opacity leading-none">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="text-sm font-semibold px-6 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#0E7490" }}
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Roster slide-over */}
      {rosterCampaign && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={(e) => { if (e.target === e.currentTarget) setRosterCampaign(null); }}>
          <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Signed Creators</h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs" style={{ fontFamily: "'DM Mono', monospace" }}>{rosterCampaign.name}</p>
              </div>
              <button onClick={() => setRosterCampaign(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors">&times;</button>
            </div>

            {/* Creator list */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
              <p className="text-sm text-gray-300 text-center py-20" style={{ fontFamily: "'DM Mono', monospace" }}>No creators signed yet.</p>
              {([] as any[]).map((sc) => {
                const creator: any = null;
                if (!creator) return null;

                const daysToSubmit = rosterCampaign.submissionDeadlineDays - sc.acceptedDaysAgo;
                const submitDue = sc.submittedDaysAgo !== null ? null : Math.max(0, daysToSubmit);
                const payoutDaysLeft = sc.publishedDaysAgo !== null
                  ? Math.max(0, rosterCampaign.payoutWindowDays - sc.publishedDaysAgo)
                  : null;

                const submitColor = submitDue === null ? "#16A34A" : submitDue <= 2 ? "#E11D48" : submitDue <= 5 ? "#D97706" : "#0E7490";
                const submitBg   = submitDue === null ? "#F0FDF4" : submitDue <= 2 ? "#FFF1F2" : submitDue <= 5 ? "#FFFBEB" : "#ECFEFF";

                const spentFmt = sc.amountSpent.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
                const capFmt = rosterCampaign.payoutCap
                  ? rosterCampaign.payoutCap.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 })
                  : null;
                const spentPct = rosterCampaign.payoutCap ? Math.min(100, (sc.amountSpent / rosterCampaign.payoutCap) * 100) : null;
                const submitted = sc.submittedDaysAgo !== null;

                return (
                  <div key={sc.creatorId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                    {/* Creator header — name + spend side by side */}
                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{creator.name}</p>
                          {submitted && (
                            <>
                              <span className="text-sm font-bold" style={{ color: "#0E7490", fontFamily: "'DM Mono', monospace" }}>{spentFmt}</span>
                              {capFmt && <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>/ {capFmt} cap</span>}
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{creator.subscribers} · {creator.tags[0]}</p>
                        {submitted && spentPct !== null && (
                          <div className="w-full h-1 rounded-full bg-gray-100 overflow-hidden mt-2">
                            <div className="h-full rounded-full" style={{ width: `${spentPct}%`, backgroundColor: spentPct > 85 ? "#E11D48" : "#0E7490" }} />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: submitBg, color: submitColor, fontFamily: "'DM Mono', monospace" }}>
                        {submitted ? "Submitted" : submitDue === 0 ? "Due today" : `${submitDue}d to submit`}
                      </span>
                    </div>

                    {/* Stat strip */}
                    <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
                      {submitted ? (
                        <>
                          {/* Payment days left — prominent for submitted creators */}
                          <div className="px-5 py-3">
                            <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Payment days left</p>
                            {payoutDaysLeft !== null ? (
                              <p className="text-xl font-bold" style={{ color: payoutDaysLeft <= 5 ? "#D97706" : "#16A34A" }}>
                                {payoutDaysLeft === 0 ? "Closed" : `${payoutDaysLeft}`}
                                <span className="text-sm font-normal text-gray-400 ml-1">/ {rosterCampaign.payoutWindowDays}d</span>
                              </p>
                            ) : (
                              <p className="text-xl font-bold text-gray-400">—</p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">
                              {sc.publishedDaysAgo !== null ? `Published ${sc.publishedDaysAgo}d ago` : "Awaiting publish"}
                            </p>
                          </div>
                          <div className="px-5 py-3">
                            <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Submitted</p>
                            <p className="text-xl font-bold text-gray-900">{sc.submittedDaysAgo}d ago</p>
                            <p className="text-xs text-gray-400 mt-0.5">Accepted {sc.acceptedDaysAgo}d ago</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-5 py-3">
                            <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Days to submit</p>
                            <p className="text-xl font-bold" style={{ color: submitColor }}>
                              {submitDue === 0 ? "Today" : submitDue! < 0 ? "Overdue" : `${submitDue}`}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">Accepted {sc.acceptedDaysAgo}d ago</p>
                          </div>
                          <div className="px-5 py-3">
                            <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Payout window</p>
                            <p className="text-xl font-bold text-gray-300">—</p>
                            <p className="text-xs text-gray-400 mt-0.5">Starts on publish</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children, error, required, prefix }: { label: string; children: React.ReactNode; error?: string; required?: boolean; prefix?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">{prefix}</span>}
        {children}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return `w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-shadow ${hasError ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"} focus:shadow-[0_0_0_3px_#CFFAFE]`;
}

/* ================================================================
   Messages view
================================================================ */
type MsgType = "text" | "campaign-offer";

type Submission = {
  id: string;
  videoUrl: string;
  submittedAt: string; // ISO string
  approvalStatus: "pending_review" | "approved" | "rejected";
  approvedAt?: string;
  rejectionReason?: string;
  paymentStatus?: "unpaid" | "pending" | "paid" | "refunded";
  stripeCheckoutSessionId?: string;
};

type Message = {
  id: number | string;
  from: "brand" | "creator";
  type: MsgType;
  text?: string;
  offer?: {
    campaignName: string;
    flatFee: number;
    cpm: number;
    payoutWindowDays: number;
    payoutCap: number | null;
    status: "pending" | "accepted" | "declined";
    offerId?: string;
    note?: string;
    contentDeadlineDays?: number | null;
    acceptedAt?: string | null;
    submissions?: Submission[];
  };
  timestamp: string;
};

type Conversation = {
  id: number | string;
  creator: Creator;
  messages: Message[];
  unread: number;
  offerId?: string; // DB offer id for persisting messages
};

// Runs on load: if a submission has been pending_review for >72h, auto-approve it.
async function maybeAutoApprove(sub: { id: string; approvalStatus: string; submittedAt: string }): Promise<Submission | null> {
  if (sub.approvalStatus !== "pending_review") return null;
  const ageMs = Date.now() - new Date(sub.submittedAt).getTime();
  if (ageMs < 72 * 60 * 60 * 1000) return null;
  const approvedAt = new Date().toISOString();
  console.log("[auto-approve] triggering for submission", sub.id, "age hours:", Math.floor(ageMs / 3600000));
  const { error } = await supabase.from("submissions").update({ approval_status: "approved", approved_at: approvedAt }).eq("id", sub.id);
  if (error) console.error("[auto-approve] update failed:", error.message);
  return { id: sub.id, videoUrl: "", submittedAt: sub.submittedAt, approvalStatus: "approved", approvedAt };
}

function CreatorSubmissionSection({
  offerId, submissions, contentDeadlineDays, acceptedAt, onSubmitted,
}: {
  offerId: string;
  submissions: Submission[];
  contentDeadlineDays?: number | null;
  acceptedAt?: string | null;
  onSubmitted: (sub: Submission) => void;
}) {
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const latestSub = submissions[submissions.length - 1] ?? null;
  const hasApproved = submissions.some((s) => s.approvalStatus === "approved");
  // Show input when: no submissions, latest is rejected, or user clicked "submit another"
  const showInput = !latestSub || latestSub.approvalStatus === "rejected" || showNewForm;

  const deadlineLabel = (() => {
    if (contentDeadlineDays && acceptedAt) {
      const d = new Date(acceptedAt);
      d.setDate(d.getDate() + contentDeadlineDays);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    if (contentDeadlineDays) return `${contentDeadlineDays} days after acceptance`;
    return null;
  })();

  async function handleSubmit() {
    const url = videoUrl.trim();
    if (!url) return;
    setSubmitting(true);
    const isAnother = submissions.length > 0;
    console.log(isAnother ? "[submit-another-video]" : "[submit-video]", "offerId:", offerId, "url:", url, "submission #", submissions.length + 1);
    const { data, error } = await supabase
      .from("submissions")
      .insert({ offer_id: offerId, video_url: url, approval_status: "pending_review" })
      .select().single();
    setSubmitting(false);
    if (error) { console.error("[submit-video] failed:", error.message); return; }
    console.log("[submit-video] submitted:", data.id);
    const newSub: Submission = { id: data.id, videoUrl: url, submittedAt: data.submitted_at, approvalStatus: "pending_review" };
    onSubmitted(newSub);
    setVideoUrl("");
    setShowNewForm(false);
  }

  return (
    <div className="border-t border-gray-100">
      {/* Deadline row */}
      {deadlineLabel && (
        <div className="px-4 py-2 bg-amber-50 flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <p className="text-xs text-amber-700" style={{ fontFamily: "'DM Mono', monospace" }}>Content due {deadlineLabel}</p>
        </div>
      )}

      {/* Each prior submission (oldest first, newest last) */}
      {submissions.map((sub, i) => (
        <div key={sub.id} className="border-t border-gray-100 first:border-t-0">
          {sub.approvalStatus === "pending_review" && (
            <div className="px-4 py-2.5 bg-blue-50 flex items-center gap-2">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-xs text-blue-700" style={{ fontFamily: "'DM Mono', monospace" }}>
                Video {i + 1} under review · auto-approves {(() => {
                  const h = 72 - Math.floor((Date.now() - new Date(sub.submittedAt).getTime()) / 3600000);
                  return h > 0 ? `in ~${h}h` : "shortly";
                })()}
              </p>
            </div>
          )}
          {sub.approvalStatus === "approved" && (
            <div className="px-4 py-2.5 bg-green-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <p className="text-xs text-green-700" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Video {i + 1} approved{sub.approvedAt ? ` · ${new Date(sub.approvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                </p>
              </div>
              {/* "Submit another" only on the last approved sub, if not already showing a new form */}
              {i === submissions.length - 1 && !showNewForm && (
                <button
                  onClick={() => { setVideoUrl(""); setShowNewForm(true); }}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors shrink-0"
                >
                  + Submit another
                </button>
              )}
            </div>
          )}
          {sub.approvalStatus === "rejected" && (
            <div className="px-4 py-2.5 bg-red-50">
              <p className="text-xs font-semibold text-red-700" style={{ fontFamily: "'DM Mono', monospace" }}>Video {i + 1} rejected</p>
              {sub.rejectionReason && <p className="text-xs text-red-600 mt-0.5">{sub.rejectionReason}</p>}
            </div>
          )}
        </div>
      ))}

      {/* URL input */}
      {showInput && (
        <div className="px-4 py-3 flex flex-col gap-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
            {hasApproved ? "Submit another video" : submissions.length > 0 && submissions[submissions.length - 1]?.approvalStatus === "rejected" ? "Resubmit video" : "Submit your video"}
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !videoUrl.trim()}
              className="shrink-0 px-3 py-2 text-xs font-semibold rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "#EF4444" }}
            >
              {submitting ? "…" : "Submit"}
            </button>
          </div>
          {showNewForm && (
            <button onClick={() => { setShowNewForm(false); setVideoUrl(""); }} className="text-xs text-gray-400 hover:text-gray-600 text-left transition-colors">
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SponsorSubmissionCard({
  sub, index, onApprove, onReject, onPay,
}: {
  sub: Submission;
  index: number;
  onApprove: (subId: string, approvedAt: string) => void;
  onReject: (subId: string, reason: string) => void;
  onPay?: (subId: string) => void;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");
  const [working, setWorking] = useState(false);
  const [paying, setPaying] = useState(false);
  const hoursLeft = Math.max(0, 72 - Math.floor((Date.now() - new Date(sub.submittedAt).getTime()) / 3600000));

  async function handlePay() {
    setPaying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { console.error("[sponsor-payment] no active session"); return; }

      console.log("[sponsor-payment] calling create-sponsor-payment-session for submissionId:", sub.id);
      const res = await fetch(
        "https://wgujjqyiwrsmlkhluadx.supabase.co/functions/v1/create-sponsor-payment-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ submissionId: sub.id }),
        }
      );
      console.log("[sponsor-payment] HTTP status:", res.status, res.statusText);
      const payload = await res.json();
      console.log("[sponsor-payment] response payload:", payload);

      if (payload.checkoutUrl) {
        console.log("[sponsor-payment] redirecting to Stripe Checkout:", payload.checkoutUrl);
        onPay?.(sub.id);
        window.location.href = payload.checkoutUrl;
      } else {
        console.error("[sponsor-payment] no checkoutUrl in response:", payload);
      }
    } catch (err: any) {
      console.error("[sponsor-payment] fetch threw:", err?.message, err);
    } finally {
      setPaying(false);
    }
  }

  async function approve() {
    setWorking(true);
    const approvedAt = new Date().toISOString();
    console.log("[approve-submission] submissionId:", sub.id, "index:", index);
    const { error, count } = await supabase.from("submissions").update({ approval_status: "approved", approved_at: approvedAt }, { count: "exact" }).eq("id", sub.id);
    setWorking(false);
    console.log("[approve-submission] result:", error?.message ?? "ok", "rows updated:", count);
    if (error) { console.error("[approve-submission] failed:", error.message); return; }
    onApprove(sub.id, approvedAt);
  }

  async function reject() {
    if (!reason.trim()) return;
    setWorking(true);
    console.log("[reject-submission] submissionId:", sub.id, "reason:", reason);
    const { error, count } = await supabase.from("submissions").update({ approval_status: "rejected", rejection_reason: reason.trim() }, { count: "exact" }).eq("id", sub.id);
    setWorking(false);
    console.log("[reject-submission] result:", error?.message ?? "ok", "rows updated:", count);
    if (error) { console.error("[reject-submission] failed:", error.message); return; }
    onReject(sub.id, reason.trim());
    setRejectMode(false);
    setReason("");
  }

  return (
    <div className="border-t border-gray-100">
      {/* Header row */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Video {index + 1}</p>
        {sub.approvalStatus === "approved" && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F0FDF4", color: "#16A34A", fontFamily: "'DM Mono', monospace" }}>Approved</span>
        )}
        {sub.approvalStatus === "rejected" && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFF1F2", color: "#E11D48", fontFamily: "'DM Mono', monospace" }}>Rejected</span>
        )}
        {sub.approvalStatus === "pending_review" && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: "#2563EB", fontFamily: "'DM Mono', monospace" }}>Pending</span>
        )}
      </div>
      {/* Video link */}
      <div className="px-4 pb-2 flex items-center gap-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>
        <a href={sub.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:underline truncate flex-1" style={{ fontFamily: "'DM Mono', monospace" }}>
          {sub.videoUrl}
        </a>
      </div>
      {/* Status-specific detail */}
      {sub.approvalStatus === "approved" && (
        <div className="px-4 pb-3 flex flex-col gap-2">
          <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>
            {sub.approvedAt ? `Approved ${new Date(sub.approvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Approved"}
          </p>
          {/* Payment CTA — only show when payment hasn't been initiated */}
          {(!sub.paymentStatus || sub.paymentStatus === "unpaid") && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full text-xs font-semibold py-2 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "#0E7490" }}
            >
              {paying ? "Opening checkout…" : "Review & Pay"}
            </button>
          )}
          {sub.paymentStatus === "pending" && (
            <span className="text-xs font-semibold px-2 py-1 rounded-lg text-center" style={{ backgroundColor: "#FFF7ED", color: "#EA580C", fontFamily: "'DM Mono', monospace" }}>
              Payment pending
            </span>
          )}
          {sub.paymentStatus === "paid" && (
            <span className="text-xs font-semibold px-2 py-1 rounded-lg text-center" style={{ backgroundColor: "#F0FDF4", color: "#16A34A", fontFamily: "'DM Mono', monospace" }}>
              Paid ✓
            </span>
          )}
        </div>
      )}
      {sub.approvalStatus === "rejected" && (
        <div className="px-4 pb-3">
          {sub.rejectionReason && <p className="text-xs text-red-500" style={{ fontFamily: "'DM Mono', monospace" }}>{sub.rejectionReason}</p>}
          <p className="text-xs text-gray-400 mt-0.5">Awaiting resubmission</p>
        </div>
      )}
      {sub.approvalStatus === "pending_review" && (
        <>
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>
              {hoursLeft > 0 ? `Auto-approves in ~${hoursLeft}h` : "Auto-approving shortly…"}
            </p>
          </div>
          {!rejectMode ? (
            <div className="px-4 pb-3 flex gap-2">
              <button onClick={approve} disabled={working}
                className="flex-1 text-xs font-semibold py-2 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "#16A34A" }}>Approve</button>
              <button onClick={() => setRejectMode(true)} disabled={working}
                className="flex-1 text-xs font-semibold py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40">Reject</button>
            </div>
          ) : (
            <div className="px-4 pb-3 flex flex-col gap-2">
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection…" rows={2}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none resize-none focus:border-red-300" />
              <div className="flex gap-2">
                <button onClick={reject} disabled={working || !reason.trim()}
                  className="flex-1 text-xs font-semibold py-2 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: "#EF4444" }}>{working ? "…" : "Send rejection"}</button>
                <button onClick={() => { setRejectMode(false); setReason(""); }}
                  className="flex-1 text-xs font-semibold py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SponsorSubmissionReview({
  submissions, onApprove, onReject, onPay,
}: {
  submissions: Submission[];
  onApprove: (subId: string, approvedAt: string) => void;
  onReject: (subId: string, reason: string) => void;
  onPay?: (subId: string) => void;
}) {
  if (submissions.length === 0) return null;
  return (
    <div className="border-t border-gray-100">
      {submissions.map((sub, i) => (
        <SponsorSubmissionCard key={sub.id} sub={sub} index={i} onApprove={onApprove} onReject={onReject} onPay={onPay} />
      ))}
    </div>
  );
}

function MessagesView({ conversations = [], setConversations, initialCreatorId }: {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  initialCreatorId?: number;
}) {
  const firstId = conversations[0]?.id ?? 1;
  const [activeId, setActiveId] = useState<number | string>(initialCreatorId ?? firstId);
  const [input, setInput] = useState("");
  const [showOfferPicker, setShowOfferPicker] = useState(false);
  const [sponsorCampaigns, setSponsorCampaigns] = useState<Campaign[]>([]);
  const [cancelOfferTarget, setCancelOfferTarget] = useState<{ offerId: string; convoId: string | number; pinnedId: string | number } | null>(null);
  const [cancellingOffer, setCancellingOffer] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: sp } = await supabase.from("sponsors").select("id, company_name").eq("user_id", user.id).maybeSingle();
      if (!sp) return;

      // Load open campaigns for the offer-picker modal
      const { data: campRows } = await supabase.from("campaigns").select("*").eq("sponsor_id", sp.id).eq("status", "open");
      setSponsorCampaigns((campRows ?? []).map((c: any) => ({
        id: c.id, _dbId: c.id, name: c.name, brand: "", description: c.description ?? "",
        flatFee: Number(c.flat_fee), cpm: Number(c.cpm), payoutCap: c.payout_cap ? Number(c.payout_cap) : null,
        status: "Live" as const, startDate: "", endDate: "",
        payoutWindowDays: c.payout_window_days, submissionDeadlineDays: c.submission_deadline_days, niches: c.niche_tags ?? [],
      })));

      // Load creator applications (offers) from DB for all campaigns this sponsor owns
      if (!campRows || campRows.length === 0) return;
      const campIds = campRows.map((c: any) => c.id);
      const { data: offers, error: offersErr } = await supabase
        .from("offers")
        .select("*, creator:creators(*), campaign:campaigns(name, flat_fee, cpm, payout_cap, payout_window_days, content_deadline_days)")
        .in("campaign_id", campIds)
        .order("created_at", { ascending: true });

      console.log("[sponsor-messages] offers from DB:", offers?.length ?? 0, offersErr?.message);
      console.log("[sponsor-messages] offer ids:", offers?.map((o: any) => o.id));
      if (!offers || offers.length === 0) return;

      // Fetch all submissions per offer (oldest first)
      const allOfferIds = offers.map((o: any) => o.id as string);
      const { data: allSubs } = await supabase
        .from("submissions")
        .select("*")
        .in("offer_id", allOfferIds)
        .order("submitted_at", { ascending: true });
      const subsByOffer = new Map<string, any[]>();
      for (const s of allSubs ?? []) {
        if (!subsByOffer.has(s.offer_id)) subsByOffer.set(s.offer_id, []);
        subsByOffer.get(s.offer_id)!.push(s);
      }

      // One conversation thread per offer (not per creator)
      const dbConvos: Conversation[] = (await Promise.all(
        offers.map(async (o: any) => {
          const cr = o.creator;
          if (!cr) return null;
          const creatorObj: Creator = {
            id: cr.id, name: cr.name, handle: cr.handle ?? "",
            avatar: cr.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(cr.name)}&background=EF4444&color=fff`,
            tags: cr.niche_tags ?? [],
            subscribers: cr.subscribers ?? "—", avgViews: cr.avg_views ? String(cr.avg_views) : "—",
            retention: cr.retention_pct ? `${cr.retention_pct}%` : "—",
            rating: cr.star_rating ?? 0, reviewCount: cr.rating_count ?? 0,
            bio: cr.bio ?? "",
            topLocation: "", language: "", topAge: "", topGender: "", platform: "",
            ageBreakdown: null, genderBreakdown: null, geoBreakdown: null, languageBreakdown: null,
          };

          // Build all submissions for this offer, auto-approving any stale pending ones
          const rawSubs = subsByOffer.get(o.id) ?? [];
          const submissions: Submission[] = await Promise.all(rawSubs.map(async (rawSub: any) => {
            let approved_at = rawSub.approved_at;
            let approval_status = rawSub.approval_status;
            if (approval_status === "pending_review") {
              const auto = await maybeAutoApprove({ id: rawSub.id, approvalStatus: approval_status, submittedAt: rawSub.submitted_at });
              if (auto) { approval_status = "approved"; approved_at = auto.approvedAt; }
            }
            return {
              id: rawSub.id,
              videoUrl: rawSub.video_url,
              submittedAt: rawSub.submitted_at,
              approvalStatus: approval_status as Submission["approvalStatus"],
              approvedAt: approved_at ?? undefined,
              rejectionReason: rawSub.rejection_reason ?? undefined,
              paymentStatus: (rawSub.payment_status ?? "unpaid") as Submission["paymentStatus"],
              stripeCheckoutSessionId: rawSub.stripe_checkout_session_id ?? undefined,
            };
          }));

          const offerMsg: Message & { _sortTs: number } = {
            id: o.id as any,
            _sortTs: new Date(o.created_at).getTime(),
            from: (o.initiated_by === "sponsor" ? "brand" : "creator") as "brand" | "creator",
            type: "campaign-offer" as const,
            offer: {
              campaignName: o.campaign?.name ?? "Campaign",
              flatFee: Number(o.campaign?.flat_fee ?? 0),
              cpm: Number(o.campaign?.cpm ?? 0),
              payoutCap: o.campaign?.payout_cap ? Number(o.campaign.payout_cap) : null,
              payoutWindowDays: o.campaign?.payout_window_days ?? 30,
              status: o.status as "pending" | "accepted" | "declined",
              offerId: o.id,
              note: o.note,
              contentDeadlineDays: o.campaign?.content_deadline_days ?? null,
              acceptedAt: o.accepted_at ?? null,
              submissions,
            },
            timestamp: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          };

          // Fetch text messages for this offer
          console.log("[sponsor-messages] fetching messages for offer:", o.id);
          const { data: dbMsgs, error: msgsErr } = await supabase
            .from("messages")
            .select("*")
            .eq("offer_id", o.id)
            .order("created_at", { ascending: true });
          console.log("[sponsor-messages] messages for offer", o.id, ":", dbMsgs?.length ?? 0, msgsErr?.message ?? "ok");

          const textMsgs: (Message & { _sortTs: number })[] = (dbMsgs ?? []).map((m: any) => ({
            id: m.id as any,
            _sortTs: new Date(m.created_at).getTime(),
            from: m.sender_id === user.id ? "brand" as const : "creator" as const,
            type: "text" as const,
            text: m.body,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }));

          const allMsgs = [offerMsg, ...textMsgs].sort((a, b) => a._sortTs - b._sortTs);

          return {
            id: o.id as string,
            creator: { ...creatorObj, name: `${cr.name} · ${o.campaign?.name ?? "Campaign"}` },
            messages: allMsgs,
            unread: 0,
            offerId: o.id as string,
          };
        })
      )).filter(Boolean) as Conversation[];

      console.log("[sponsor-messages] threads built:", dbConvos.length, dbConvos.map(c => ({ id: c.id, offerId: c.offerId })));

      if (dbConvos.length > 0) {
        setConversations(dbConvos);
        setActiveId(dbConvos[0].id);
      }
    })();
  }, []);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  if (!active) return (
    <div className="flex items-center justify-center h-full text-gray-300 text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
      No messages yet
    </div>
  );

  function selectConversation(id: number | string) {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  }

  async function sendText() {
    const text = input.trim();
    if (!text) return;
    const msg: Message = { id: crypto.randomUUID(), from: "brand", type: "text", text, timestamp: "Just now" };
    setConversations((prev) => prev.map((c) => c.id === active?.id ? { ...c, messages: [...c.messages, msg] } : c));
    setInput("");

    const offerId = active?.offerId;
    console.log("[send-message] text:", text, "offerId:", offerId);
    if (!offerId) { console.warn("[send-message] no offerId on conversation — message not persisted"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from("messages").insert({ offer_id: offerId, sender_id: user.id, body: text }).select().single();
    console.log("[send-message] result:", data?.id ?? null, error?.message ?? "ok");
  }

  function sendOffer(camp: Campaign) {
    const msg: Message = {
      id: crypto.randomUUID(),
      from: "brand",
      type: "campaign-offer",
      offer: { campaignName: camp.name, flatFee: camp.flatFee, cpm: camp.cpm, payoutWindowDays: camp.payoutWindowDays, payoutCap: camp.payoutCap, status: "pending" },
      timestamp: "Just now",
    };
    setConversations((prev) => prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c));
    setShowOfferPicker(false);
  }

  function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  const lastMsg = (c: Conversation) => {
    const last = c.messages[c.messages.length - 1];
    if (!last) return "";
    return last.type === "campaign-offer" ? `Campaign offer: ${last.offer!.campaignName}` : last.text ?? "";
  };

  async function handleSponsorCancelOffer() {
    if (!cancelOfferTarget) return;
    setCancellingOffer(true);
    const { offerId, convoId, pinnedId } = cancelOfferTarget;
    console.log("[cancel-sponsor] offerId:", offerId);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: sp } = await supabase.from("sponsors").select("id, cancellation_count").eq("user_id", user.id).maybeSingle();
      const { error: offerErr } = await supabase.from("offers").update({ status: "cancelled_by_sponsor" }).eq("id", offerId);
      console.log("[cancel-sponsor] offer update:", offerErr?.message ?? "ok");
      if (sp) {
        const newCount = (sp.cancellation_count ?? 0) + 1;
        await supabase.from("sponsors").update({ cancellation_count: newCount }).eq("id", sp.id);
        console.log("[cancel-sponsor] cancellation_count now:", newCount);
      }
      // System message to creator thread
      const { error: msgErr } = await supabase.from("messages").insert({ offer_id: offerId, sender_id: user.id, body: "⚠️ The sponsor has cancelled this offer. No payment will be made." });
      console.log("[cancel-sponsor] system message:", msgErr?.message ?? "ok");
    }
    setConversations((prev) => prev.map((c) => c.id === convoId ? {
      ...c,
      messages: c.messages.map((m) => m.id === pinnedId ? { ...m, offer: { ...m.offer!, status: "cancelled_by_sponsor" as any } } : m),
    } : c));
    setCancellingOffer(false);
    setCancelOfferTarget(null);
  }

  return (
    <>
    {cancelOfferTarget && (
      <CancelOfferModal
        side="sponsor"
        confirming={cancellingOffer}
        onConfirm={handleSponsorCancelOffer}
        onClose={() => setCancelOfferTarget(null)}
      />
    )}
    <div className="flex h-full overflow-hidden">
      {/* Conversation list */}
      <div className="w-72 shrink-0 border-r border-gray-100 bg-white flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Messages</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => {
            const active = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 text-left transition-colors"
                style={{ backgroundColor: active ? "#ECFEFF" : "transparent" }}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={c.creator.avatar} alt={c.creator.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.creator.name}</p>
                    {c.unread > 0 && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white shrink-0" style={{ backgroundColor: "#0E7490", fontFamily: "'DM Mono', monospace" }}>
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg(c)}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Thread header */}
        <div className="h-16 flex items-center gap-3 px-6 bg-white border-b border-gray-100 shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img src={active.creator.avatar} alt={active.creator.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{active.creator.name}</p>
            <p className="text-xs text-gray-400">{active.creator.handle} · {active.creator.platform}</p>
          </div>
        </div>

        {/* Pinned offer card */}
        {(() => {
          const pinned = active.messages.find((m) => m.type === "campaign-offer");
          if (!pinned) return null;
          const o = pinned.offer!;
          const isBrand = pinned.from === "brand";
          const statusStyle = ({
            pending:              { bg: "#FFF7ED", text: "#EA580C", label: "Awaiting response" },
            accepted:             { bg: "#F0FDF4", text: "#16A34A", label: "Accepted" },
            declined:             { bg: "#FFF1F2", text: "#E11D48", label: "Declined" },
            cancelled_by_sponsor: { bg: "#F3F4F6", text: "#6B7280", label: "Cancelled by you" },
            cancelled_by_creator: { bg: "#F3F4F6", text: "#6B7280", label: "Cancelled by creator" },
          } as Record<string, { bg: string; text: string; label: string }>)[o.status]
            ?? { bg: "#F3F4F6", text: "#6B7280", label: o.status ?? "Unknown" };
          const submitByLabel = (() => {
            if (o.contentDeadlineDays && o.acceptedAt) {
              const d = new Date(o.acceptedAt);
              d.setDate(d.getDate() + o.contentDeadlineDays);
              return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }
            if (o.contentDeadlineDays) return `${o.contentDeadlineDays}d after acceptance`;
            return "No deadline set";
          })();
          return (
            <div className="shrink-0 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="px-4 pt-3 pb-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Campaign offer · {o.campaignName}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, fontFamily: "'DM Mono', monospace" }}>{statusStyle.label}</span>
                </div>
                <div className="grid grid-cols-4 divide-x divide-gray-100">
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Flat fee</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{fmt(o.flatFee)}</p>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>CPM</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{fmt(o.cpm)}</p>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Cap</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{o.payoutCap ? fmt(o.payoutCap) : "—"}</p>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Submit by</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{submitByLabel}</p>
                  </div>
                </div>
                {o.status === "accepted" && (o.submissions ?? []).length > 0 && (
                  <SponsorSubmissionReview
                    submissions={o.submissions ?? []}
                    onApprove={(subId, approvedAt) => {
                      setConversations((prev) => prev.map((c) => c.id === active.id ? {
                        ...c,
                        messages: c.messages.map((m) => m.id === pinned.id ? { ...m, offer: { ...m.offer!, submissions: m.offer!.submissions!.map((s) => s.id === subId ? { ...s, approvalStatus: "approved" as const, approvedAt } : s) } } : m),
                      } : c));
                    }}
                    onReject={(subId, reason) => {
                      setConversations((prev) => prev.map((c) => c.id === active.id ? {
                        ...c,
                        messages: c.messages.map((m) => m.id === pinned.id ? { ...m, offer: { ...m.offer!, submissions: m.offer!.submissions!.map((s) => s.id === subId ? { ...s, approvalStatus: "rejected" as const, rejectionReason: reason } : s) } } : m),
                      } : c));
                    }}
                    onPay={(subId) => {
                      setConversations((prev) => prev.map((c) => c.id === active.id ? {
                        ...c,
                        messages: c.messages.map((m) => m.id === pinned.id ? { ...m, offer: { ...m.offer!, submissions: m.offer!.submissions!.map((s) => s.id === subId ? { ...s, paymentStatus: "pending" as const } : s) } } : m),
                      } : c));
                    }}
                  />
                )}
                {o.status === "accepted" && (o.submissions ?? []).length === 0 && !((o.status as string) === "cancelled_by_sponsor" || (o.status as string) === "cancelled_by_creator") && (
                  <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Waiting for creator to submit video</p>
                    <button
                      className="text-xs font-semibold px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      onClick={() => {
                        const offerId = (o as any).offerId ?? active.offerId;
                        if (offerId) setCancelOfferTarget({ offerId, convoId: active.id, pinnedId: pinned.id });
                      }}
                    >
                      Cancel offer
                    </button>
                  </div>
                )}
                {((o.status as string) === "cancelled_by_sponsor" || (o.status as string) === "cancelled_by_creator") && (
                  <div className="px-4 py-2.5 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>This offer was cancelled. No payment will be made.</p>
                  </div>
                )}
                {o.status === "pending" && !isBrand && (
                  <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
                    <button className="flex-1 text-xs font-semibold py-2 rounded-lg text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#0E7490" }}
                      onClick={async () => {
                        const offerId = (o as any).offerId ?? active.offerId;
                        const acceptedAt = new Date().toISOString();
                        console.log("[accept] payload:", { offerId, accepted_at: acceptedAt });
                        if (offerId) {
                          const { error } = await supabase.from("offers").update({ status: "accepted", accepted_at: acceptedAt }).eq("id", offerId);
                          console.log("[accept] update result:", error?.message ?? "success");
                        } else {
                          console.error("[accept] no offerId — DB update skipped");
                        }
                        setConversations((prev) => prev.map((c) => c.id === active.id ? { ...c, messages: c.messages.map((m) => m.id === pinned.id ? { ...m, offer: { ...m.offer!, status: "accepted", acceptedAt } } : m) } : c));
                      }}>Accept</button>
                    <button className="flex-1 text-xs font-semibold py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={async () => {
                        const offerId = (o as any).offerId;
                        if (offerId) {
                          const { error } = await supabase.from("offers").update({ status: "declined" }).eq("id", offerId);
                          console.log("[decline] update result:", error?.message ?? "success");
                        }
                        setConversations((prev) => prev.map((c) => c.id === active.id ? { ...c, messages: c.messages.map((m) => m.id === pinned.id ? { ...m, offer: { ...m.offer!, status: "declined" } } : m) } : c));
                      }}>Decline</button>
                  </div>
                )}
                {o.status === "pending" && isBrand && (
                  <div className="px-4 py-2.5 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>Awaiting creator response</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
          {active.messages.map((msg, msgIdx) => {
            const isBrand = msg.from === "brand";

            // Skip the offer card — it's rendered pinned above
            if (msg.type === "campaign-offer") return null;

            return (
              <div key={`${msg.id}-${msgIdx}`} className={`flex ${isBrand ? "justify-end" : "justify-start"}`}>
                <div className="max-w-sm">
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      backgroundColor: isBrand ? "#0E7490" : "white",
                      color: isBrand ? "white" : "#111827",
                      border: isBrand ? "none" : "1px solid #F3F4F6",
                      borderRadius: isBrand ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    }}
                  >
                    {msg.text}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-1" style={{ textAlign: isBrand ? "right" : "left", fontFamily: "'DM Mono', monospace" }}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Offer picker */}
        {showOfferPicker && (
          <div className="border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-2 max-h-56 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Select a campaign to send</p>
            {sponsorCampaigns.length === 0 && <p className="text-xs text-gray-400 py-2" style={{ fontFamily: "'DM Mono', monospace" }}>No active campaigns.</p>}
            {sponsorCampaigns.map((camp) => (
              <button
                key={camp.id}
                onClick={() => sendOffer(camp)}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-[#ECFEFF] border border-gray-100 hover:border-[#A5F3FC] rounded-xl transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{camp.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>${camp.flatFee} flat · ${camp.cpm} CPM · {camp.payoutWindowDays}d window</p>
                </div>
                <span className="text-xs font-semibold ml-4 shrink-0" style={{ color: "#0E7490" }}>Send →</span>
              </button>
            ))}
          </div>
        )}

        {/* Compose bar */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setShowOfferPicker((v) => !v)}
            title="Send campaign offer"
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-[#0E7490] hover:text-[#0E7490] transition-colors"
          >
            <BriefcaseIcon size={16} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendText(); }}
            placeholder="Write a message…"
            className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none transition-shadow focus:shadow-[0_0_0_3px_#CFFAFE]"
          />
          <button
            onClick={sendText}
            className="shrink-0 px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0E7490" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

/* ================================================================
   Make Offer modal (shared between card + profile)
================================================================ */
function MakeOfferModal({ creator, onClose, onSend }: {
  creator: Creator;
  onClose: () => void;
  onSend: (camp: Campaign) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("sponsors").select("id").eq("user_id", user.id).maybeSingle().then(({ data: sp }) => {
        if (!sp) return;
        supabase.from("campaigns").select("*").eq("sponsor_id", sp.id).eq("status", "open").then(({ data }) => {
          setMyCampaigns((data ?? []).map((c: any) => ({
            id: c.id, _dbId: c.id, name: c.name, brand: "", description: c.description ?? "",
            flatFee: Number(c.flat_fee), cpm: Number(c.cpm), payoutCap: c.payout_cap ? Number(c.payout_cap) : null,
            status: "Live" as const, startDate: "", endDate: "",
            payoutWindowDays: c.payout_window_days, submissionDeadlineDays: c.submission_deadline_days, niches: c.niche_tags ?? [],
          })));
        });
      });
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Make an offer to {creator.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Select a campaign to send as a message</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-4 flex flex-col gap-2">
          {myCampaigns.length === 0 && <p className="text-sm text-gray-400 py-4 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>No active campaigns to send.</p>}
          {myCampaigns.map((camp) => {
            const active = selected === camp.id;
            return (
              <button
                key={camp.id}
                onClick={() => setSelected(camp.id)}
                className="flex items-start justify-between gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors"
                style={{ backgroundColor: active ? "#ECFEFF" : "#FAFAFA", borderColor: active ? "#0E7490" : "#E5E7EB" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{camp.name}</p>
                  <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                    ${camp.flatFee} flat · ${camp.cpm} CPM · {camp.payoutWindowDays}d window
                    {camp.payoutCap ? ` · cap $${camp.payoutCap.toLocaleString()}` : " · uncapped"}
                  </p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center" style={{ borderColor: active ? "#0E7490" : "#D1D5DB" }}>
                  {active && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#0E7490" }} />}
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors">Cancel</button>
          <button
            disabled={selected === null}
            onClick={() => { const camp = myCampaigns.find((c) => c.id === selected)!; if (camp) onSend(camp); }}
            className="text-sm font-semibold px-6 py-2 rounded-lg text-white transition-opacity"
            style={{ backgroundColor: "#0E7490", opacity: selected === null ? 0.4 : 1 }}
          >
            Send offer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Creator app — icons
================================================================ */
function InboxIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#EF4444" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-6l-2 3H10l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
function ChecklistIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#EF4444" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function CreatorChatIcon({ size = 18, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#EF4444" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const CREATOR_NAV = [
  { id: "browse", label: "Browse Campaigns", icon: InboxIcon },
  { id: "applications", label: "My Applications", icon: ChecklistIcon },
  { id: "messages", label: "Messages", icon: CreatorChatIcon },
];

/* ================================================================
   Creator app — types
================================================================ */
type Application = {
  id: string | number; // string = real DB uuid, number = optimistic fallback
  campaign: Campaign;
  appliedAt: string;
  status: "Pending" | "Accepted" | "Declined";
  note: string;
};

/* ================================================================
   Creator app — sidebar
================================================================ */
function CreatorSidebar({ activeNav, setActiveNav, onHome, creator }: { activeNav: string; setActiveNav: (id: string) => void; onHome: () => void; creator?: DbCreator | null }) {
  const [showReport, setShowReport] = useState(false);
  return (
    <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-gray-100 h-full">
      {showReport && <ReportModal reportType="bug" onClose={() => setShowReport(false)} />}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <button onClick={onHome} className="hover:opacity-75 transition-opacity flex items-center">
          <AdSpaceLogo height={20} />
        </button>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: "#FEF2F2", color: "#EF4444", fontFamily: "'DM Mono', monospace" }}>
          Creator
        </span>
      </div>
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {CREATOR_NAV.map(({ id, label, icon: Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-colors"
              style={{ backgroundColor: active ? "#FEF2F2" : "transparent", color: active ? "#EF4444" : "#6B7280", fontWeight: active ? 600 : 400 }}
            >
              <Icon size={18} active={active} />
              {label}
            </button>
          );
        })}
      </nav>
      {/* Channel footer */}
      <button
        onClick={() => setActiveNav("profile")}
        className="border-t border-gray-100 px-4 py-4 flex items-center gap-3 w-full text-left hover:bg-gray-50 transition-colors"
        style={{ backgroundColor: activeNav === "profile" ? "#FEF2F2" : "transparent" }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
          {creator?.avatar_url
            ? <img src={creator.avatar_url} alt={creator.name} className="w-full h-full object-cover" />
            : <span className="text-xs font-bold text-gray-400">{creator?.name?.[0] ?? "?"}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: activeNav === "profile" ? "#EF4444" : "#1F2937" }}>{creator?.name ?? "My Channel"}</p>
          <p className="text-xs text-gray-400 truncate">View my channel</p>
        </div>
      </button>
      <button
        onClick={() => setShowReport(true)}
        className="px-6 py-2.5 text-left border-t border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span className="text-xs text-gray-400 hover:text-gray-600">Report a bug</span>
      </button>
    </aside>
  );
}

/* ================================================================
   Creator app — Browse Campaigns
================================================================ */
function CreatorBrowseCampaigns({ onApply, applications, onViewBrand }: { onApply: (camp: Campaign, note: string, offerId: string | null) => void; applications: Application[]; onViewBrand: (name: string) => void }) {
  const [query, setQuery] = useState("");
  const [applyTarget, setApplyTarget] = useState<Campaign | null>(null);
  const [reportTarget, setReportTarget] = useState<Campaign | null>(null);
  const [note, setNote] = useState("");
  const [liveCampaigns, setLiveCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  useEffect(() => {
    Promise.resolve({ supabase }).then(({ supabase }) =>
      supabase.from("campaigns").select("*, sponsor:sponsors(*)").eq("status", "open").order("created_at", { ascending: false })
        .then(({ data }) => {
          const dbList = data ?? [];
          setLiveCampaigns(dbList.map((c: any) => ({
            id: c.id || crypto.randomUUID(),
            _dbId: c.id,
            name: c.name,
            brand: (c.sponsor as any)?.company_name ?? "",
            description: c.description ?? "",
            flatFee: Number(c.flat_fee),
            cpm: Number(c.cpm),
            payoutCap: c.payout_cap ? Number(c.payout_cap) : null,
            status: "Live" as const,
            startDate: "",
            endDate: "",
            payoutWindowDays: c.payout_window_days,
            submissionDeadlineDays: c.submission_deadline_days,
            niches: c.niche_tags ?? [],
          } as Campaign & { _dbId: string })));
          setLoadingCampaigns(false);
        })
    );
  }, []);

  const appliedIds = new Set(applications.map((a) => a.campaign.id));

  const filtered = liveCampaigns.filter((c) => {
    if (c.status === "Paused") return false;
    const q = query.toLowerCase();
    return q === "" || c.name.toLowerCase().includes(q) || c.niches.some((n) => n.toLowerCase().includes(q));
  });

  function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  async function submitApplication() {
    if (!applyTarget) return;
    const capturedNote = note;
    const capturedTarget = applyTarget;
    setApplyTarget(null);
    setNote("");

    const dbId = (capturedTarget as any)._dbId;
    if (!dbId) {
      console.error("[apply] campaign has no _dbId — cannot insert offer");
      onApply(capturedTarget, capturedNote, null);
      return;
    }

    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      console.log("[apply] got user:", user?.id, userErr?.message);
      if (!user) { onApply(capturedTarget, capturedNote, null); return; }

      const { data: creator, error: creatorErr } = await supabase.from("creators").select("id").eq("user_id", user.id).maybeSingle();
      console.log("[apply] creator lookup:", { creator, error: creatorErr?.message });
      if (!creator) { onApply(capturedTarget, capturedNote, null); return; }

      const payload = { campaign_id: dbId, creator_id: creator.id, note: capturedNote || null, status: "pending" };
      console.log("[apply] inserting offer:", payload);

      const { data: offer, error: insertErr } = await supabase
        .from("offers")
        .insert(payload)
        .select()
        .single();

      if (insertErr) {
        console.error("[apply] offer insert failed:", insertErr.message, insertErr.details, insertErr.hint);
        onApply(capturedTarget, capturedNote, null);
      } else {
        console.log("[apply] offer inserted:", offer);
        onApply(capturedTarget, capturedNote, offer.id);
      }
    } catch (e) {
      console.error("[apply] unexpected error:", e);
      onApply(capturedTarget, capturedNote, null);
    }
  }

  return (
    <>
      <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <p className="text-xs text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Browse Campaigns</p>
        <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{filtered.length} available</span>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 flex flex-col gap-6">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={'Search by campaign name or niche — e.g. "Productivity"'}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-shadow focus:shadow-[0_0_0_3px_#FEE2E2]"
          />
        </div>

        {/* Campaign cards */}
        <div className="flex flex-col gap-4">
          {loadingCampaigns && (
            <div className="text-center py-16 text-sm text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Loading campaigns…</div>
          )}
          {!loadingCampaigns && filtered.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>
              {query ? "No campaigns match your search." : "No open campaigns right now. Check back soon."}
            </div>
          )}
          {filtered.map((camp) => {
            const applied = appliedIds.has(camp.id);
            const app = applications.find((a) => a.campaign.id === camp.id);
            return (
              <div key={camp.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-base font-semibold text-gray-900">{camp.name}</h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#F0FDF4", color: "#16A34A", fontFamily: "'DM Mono', monospace" }}>
                        Live
                      </span>
                    </div>
                    {camp.brand && (
                      <button
                        onClick={() => onViewBrand(camp.brand!)}
                        className="text-xs font-medium mt-1 hover:underline text-left transition-opacity hover:opacity-75"
                        style={{ color: "#EF4444", fontFamily: "'DM Mono', monospace" }}
                      >
                        {camp.brand} &rarr;
                      </button>
                    )}
                    {camp.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{camp.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="text-xs text-gray-400 whitespace-nowrap" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {camp.payoutWindowDays}d payout window
                    </p>
                    <p className="text-xs font-semibold whitespace-nowrap" style={{ fontFamily: "'DM Mono', monospace", color: "#D97706" }}>
                      Submit within {camp.submissionDeadlineDays}d of offer
                    </p>
                  </div>
                </div>

                {/* Pricing strip */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Flat fee</p>
                    <p className="text-lg font-bold text-gray-900">{fmt(camp.flatFee)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Guaranteed min.</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>CPM rate</p>
                    <p className="text-lg font-bold text-gray-900">{fmt(camp.cpm)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Per 1,000 views</p>
                  </div>
                  <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <p className="text-xs mb-1" style={{ fontFamily: "'DM Mono', monospace", color: "#991B1B" }}>Max payout</p>
                    <p className="text-lg font-bold" style={{ color: "#EF4444" }}>{camp.payoutCap ? fmt(camp.payoutCap) : "Uncapped"}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#F87171" }}>Total cap</p>
                  </div>
                </div>

                {/* Niches + CTA */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex flex-wrap gap-1.5">
                    {camp.niches.map((n) => (
                      <span key={n} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontFamily: "'DM Mono', monospace" }}>{n}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => setReportTarget(camp)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Report</button>
                  {applied ? (
                    <span className="text-xs font-semibold px-4 py-2 rounded-lg shrink-0" style={{
                      backgroundColor: app?.status === "Accepted" ? "#F0FDF4" : app?.status === "Declined" ? "#FFF1F2" : "#F8FAFC",
                      color: app?.status === "Accepted" ? "#16A34A" : app?.status === "Declined" ? "#E11D48" : "#64748B",
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {app?.status === "Accepted" ? "✓ Accepted" : app?.status === "Declined" ? "✕ Declined" : "Applied"}
                    </span>
                  ) : (
                    <button
                      onClick={() => setApplyTarget(camp)}
                      className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-opacity hover:opacity-90 shrink-0"
                      style={{ backgroundColor: "#EF4444" }}
                    >
                      Apply
                    </button>
                  )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {reportTarget && (
        <ReportModal
          reportType="content_report"
          relatedId={String((reportTarget as any)._dbId ?? reportTarget.id)}
          contextLabel={reportTarget.name}
          onClose={() => setReportTarget(null)}
        />
      )}

      {/* Apply modal */}
      {applyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) setApplyTarget(null); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Apply to campaign</h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{applyTarget.name}</p>
              </div>
              <button onClick={() => setApplyTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Note to brand <span className="text-gray-400">(optional)</span></label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Introduce yourself and explain why you're a good fit for this campaign…"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:shadow-[0_0_0_3px_#FEE2E2] resize-none transition-shadow"
                />
              </div>
              {/* Pricing reminder */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[["Flat fee", `$${applyTarget.flatFee}`], ["CPM", `$${applyTarget.cpm}`], ["Window", `${applyTarget.payoutWindowDays}d`]].map(([l, v]) => (
                  <div key={l} className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{l}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setApplyTarget(null)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors">Cancel</button>
              <button onClick={submitApplication} className="text-sm font-semibold px-6 py-2 rounded-lg text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#EF4444" }}>
                Submit application
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================================================================
   Creator app — My Applications
================================================================ */
function CreatorApplicationsView({ applications: localApps, onViewBrand }: { applications: Application[]; onViewBrand: (name: string) => void }) {
  const [applications, setApplications] = useState<Application[]>(localApps);

  useEffect(() => {
    (async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      console.log("[applications] user:", user?.id, userErr?.message);
      if (!user) return;

      const { data: creator, error: creatorErr } = await supabase.from("creators").select("id").eq("user_id", user.id).maybeSingle();
      console.log("[applications] creator:", creator?.id, creatorErr?.message);
      if (!creator) return;

      const { data: offers, error: offersErr } = await supabase
        .from("offers")
        .select("*, campaign:campaigns(*, sponsor:sponsors(company_name))")
        .eq("creator_id", creator.id)
        .order("created_at", { ascending: false });
      console.log("[applications] offers from DB:", offers?.length ?? 0, offersErr?.message);

      if (offers) {
        setApplications(offers.map((o: any) => {
          const camp = o.campaign as any;
          return {
            id: o.id,
            campaign: {
              id: camp?.id ?? 0,
              _dbId: camp?.id,
              name: camp?.name ?? "Campaign",
              brand: camp?.sponsor?.company_name ?? "",
              description: camp?.description ?? "",
              flatFee: Number(camp?.flat_fee ?? 0),
              cpm: Number(camp?.cpm ?? 0),
              payoutCap: camp?.payout_cap ? Number(camp.payout_cap) : null,
              status: "Live" as const,
              startDate: "",
              endDate: "",
              payoutWindowDays: camp?.payout_window_days ?? 30,
              submissionDeadlineDays: camp?.submission_deadline_days ?? 14,
              niches: camp?.niche_tags ?? [],
            } as Campaign,
            appliedAt: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: o.status === "accepted" ? "Accepted" : o.status === "declined" ? "Declined" : "Pending",
            note: o.note ?? "",
          } as Application;
        }));
      }
    })();
  }, []);

  function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  const statusStyle = {
    Pending:  { bg: "#F8FAFC", text: "#64748B" },
    Accepted: { bg: "#F0FDF4", text: "#16A34A" },
    Declined: { bg: "#FFF1F2", text: "#E11D48" },
  };

  return (
    <>
      <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <p className="text-xs text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>My Applications</p>
        <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{applications.length} total</span>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 flex flex-col gap-4">
        {applications.length === 0 && (
          <div className="text-center py-24 text-gray-300 text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
            No applications yet — browse campaigns to get started.
          </div>
        )}
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-base font-semibold text-gray-900">{app.campaign.name}</h2>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: statusStyle[app.status].bg, color: statusStyle[app.status].text, fontFamily: "'DM Mono', monospace" }}>
                    {app.status === "Pending" ? "Awaiting review" : app.status}
                  </span>
                </div>
                {app.campaign.brand && (
                  <button
                    onClick={() => onViewBrand(app.campaign.brand!)}
                    className="text-xs font-medium mt-0.5 hover:underline text-left transition-opacity hover:opacity-75"
                    style={{ color: "#EF4444", fontFamily: "'DM Mono', monospace" }}
                  >
                    {app.campaign.brand} &rarr;
                  </button>
                )}
                <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>Applied {app.appliedAt}</p>
                {app.note && <p className="text-sm text-gray-500 mt-2 leading-relaxed italic">"{app.note}"</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Flat fee</p>
                <p className="text-base font-bold text-gray-900">{fmt(app.campaign.flatFee)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>CPM</p>
                <p className="text-base font-bold text-gray-900">{fmt(app.campaign.cpm)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Payout window</p>
                <p className="text-base font-bold text-gray-900">{app.campaign.payoutWindowDays}d</p>
              </div>
              <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <p className="text-xs mb-1" style={{ fontFamily: "'DM Mono', monospace", color: "#92400E" }}>Submit within</p>
                <p className="text-base font-bold" style={{ color: "#D97706" }}>{app.campaign.submissionDeadlineDays}d</p>
                <p className="text-xs mt-0.5" style={{ color: "#B45309" }}>Of offer accepted</p>
              </div>
            </div>
            {app.campaign.niches.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {app.campaign.niches.map((n) => (
                  <span key={n} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontFamily: "'DM Mono', monospace" }}>{n}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ================================================================
   Creator app — Channel profile view
================================================================ */
function CreatorChannelProfile({ creator }: { creator?: DbCreator | null }) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(creator?.bio ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(creator?.niche_tags ?? []);
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const normalizedTags = tags.map((t) => t.toLowerCase());
      console.log("[creator-tags] saving:", normalizedTags);
      if (user) await supabase.from("creators").update({ bio, niche_tags: normalizedTags }).eq("user_id", user.id);
      setTags(normalizedTags);
      setEditing(false);
    } catch {}
    setSaving(false);
  }

  function addTag() {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.length >= 6) return;
    if (!tags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  }

  return (
    <>
      <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <p className="text-xs text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>My Channel</p>
        <button onClick={() => setEditing(true)} className="text-sm font-semibold px-5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Edit Profile</button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Edit Profile</h2>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell brands about your channel…" className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:shadow-[0_0_0_3px_#FEE2E2] resize-none transition-shadow" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Niche Tags <span className="text-gray-400 font-normal">({tags.length}/6)</span></label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((t, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FEF2F2", color: "#991B1B" }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)} <button onClick={() => setTags(tags.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100 leading-none">&times;</button>
                    </span>
                  ))}
                </div>
                {tags.length < 6 && (
                  <div className="flex gap-2">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { addTag(); e.preventDefault(); }}} placeholder="Add tag, press Enter" className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:shadow-[0_0_0_3px_#FEE2E2]" />
                    <button onClick={addTag} className="px-3 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Add</button>
                  </div>
                )}
                {tags.length >= 6 && <p className="text-xs text-gray-400 mt-1">Maximum 6 tags reached</p>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancel</button>
              <button onClick={saveProfile} disabled={saving} className="text-sm font-semibold px-6 py-2 rounded-lg text-white disabled:opacity-60" style={{ backgroundColor: "#EF4444" }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-8 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-24 w-full" style={{ backgroundImage: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%, #FFF7ED 100%)" }} />
          <div className="px-8 pb-8">
            <div className="-mt-10 mb-5">
              <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                {creator?.avatar_url
                  ? <img src={creator.avatar_url} alt={creator.name} className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-gray-300">{creator?.name?.[0] ?? "?"}</span>
                }
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{creator?.name ?? "My Channel"}</h1>
                {creator?.handle && <p className="text-sm text-gray-500 mt-0.5">@{creator.handle} · YouTube</p>}
                {(creator?.niche_tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(creator!.niche_tags).map((tag) => (
                      <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#FEF2F2", color: "#991B1B", fontFamily: "'DM Mono', monospace" }}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  <span className="text-xs text-gray-500">Open to campaigns</span>
                </div>
              </div>
            </div>
            {creator?.bio && (
              <p className="text-sm text-gray-600 mt-4 leading-relaxed max-w-xl">{creator.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div>
          <SectionLabel>Channel Stats</SectionLabel>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <StatCard label="Avg. Views / Video" value={creator?.avg_views ? creator.avg_views.toLocaleString() : "—"} sub="Last 10 uploads" />
            <StatCard label="Audience Retention" value={creator?.retention_pct ? `${creator.retention_pct}%` : "—"} sub="Avg. watch-through" />
            <StatCard label="Subscribers" value={creator?.subscribers ?? "—"} sub="YouTube channel" />
          </div>
        </div>

        {/* Audience */}
        <AudienceSection
          ageBreakdown={creator?.age_breakdown ?? null}
          genderBreakdown={creator?.gender_breakdown ?? null}
          geoBreakdown={creator?.geo_breakdown ?? null}
          languageBreakdown={creator?.language_breakdown ?? null}
          accentColor="#EF4444"
          onLoad={(data) => console.log("[creator-profile] audience data:", data)}
        />
        <div className="h-4" />
      </div>
    </>
  );
}

/* ================================================================
   Creator app — Messages (creator perspective)
================================================================ */
type CreatorMsg =
  | { id: number | string; from: "creator" | "brand"; type: "text"; text: string; timestamp: string }
  | { id: number | string; from: "creator"; type: "application"; campaign: Campaign; note: string; status: "pending" | "accepted" | "declined"; timestamp: string; offerId?: string; acceptedAt?: string | null; submissions?: Submission[]; initiatedBy?: "creator" | "sponsor" };

type CreatorConvo = { id: number | string; brandName: string; brandId: string; avatar: string; messages: CreatorMsg[]; offerId?: string };


function CreatorMessagesView({
  convos = [],
  setConvos,
  initialBrandId,
}: {
  convos: CreatorConvo[];
  setConvos: React.Dispatch<React.SetStateAction<CreatorConvo[]>>;
  initialBrandId?: string;
}) {
  const firstId = convos[0]?.id ?? 0;
  const startId = initialBrandId ? (convos.find((c) => c.brandId === initialBrandId)?.id ?? firstId) : firstId;
  const [activeId, setActiveId] = useState<number | string>(startId);
  const [input, setInput] = useState("");
  const [cancelOfferTarget, setCancelOfferTarget] = useState<{ offerId: string; convoId: string | number; pinnedId: string | number } | null>(null);
  const [cancellingOffer, setCancellingOffer] = useState(false);

  useEffect(() => {
    (async () => {
      console.log("[creator-messages] loading from DB...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { console.log("[creator-messages] no auth user"); return; }

      const { data: creator, error: creatorErr } = await supabase
        .from("creators").select("id").eq("user_id", user.id).maybeSingle();
      if (!creator) { console.log("[creator-messages] no creator row", creatorErr?.message); return; }

      console.log("[creator-messages] creator id:", creator.id);
      const { data: offers, error: offersErr } = await supabase
        .from("offers")
        .select("*, campaign:campaigns(id, name, description, flat_fee, cpm, payout_cap, payout_window_days, submission_deadline_days, content_deadline_days, niche_tags, status, sponsor:sponsors(company_name, avatar_url))")
        .eq("creator_id", creator.id)
        .order("created_at", { ascending: true });
      console.log("[creator-messages] offers from DB:", offers?.length ?? 0, offersErr?.message ?? "ok");
      if (!offers || offers.length === 0) return;

      // Fetch all submissions per offer (oldest first)
      const allOfferIds = offers.map((o: any) => o.id as string);
      const { data: allSubs } = await supabase
        .from("submissions").select("*").in("offer_id", allOfferIds).order("submitted_at", { ascending: true });
      const subsByOffer = new Map<string, any[]>();
      for (const s of allSubs ?? []) {
        if (!subsByOffer.has(s.offer_id)) subsByOffer.set(s.offer_id, []);
        subsByOffer.get(s.offer_id)!.push(s);
      }

      const dbConvos: CreatorConvo[] = await Promise.all(
        offers.map(async (offer: any) => {
          const camp = offer.campaign;
          const sponsor = camp?.sponsor;
          const brandName = sponsor?.company_name ?? camp?.name ?? "Brand";
          const brandId = offer.campaign_id;
          const avatar = sponsor?.avatar_url ?? "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop&auto=format";

          console.log("[creator-messages] fetching for offer:", offer.id);
          const { data: dbMsgs, error: msgsErr } = await supabase
            .from("messages")
            .select("*")
            .eq("offer_id", offer.id)
            .order("created_at", { ascending: true });
          console.log("[creator-messages] messages from DB:", dbMsgs?.length ?? 0, msgsErr?.message ?? "ok");

          // Resolve all submissions + auto-approve stale pending ones
          const rawSubs = subsByOffer.get(offer.id) ?? [];
          const submissions: Submission[] = await Promise.all(rawSubs.map(async (rawSub: any) => {
            let approved_at = rawSub.approved_at;
            let approval_status = rawSub.approval_status;
            if (approval_status === "pending_review") {
              const auto = await maybeAutoApprove({ id: rawSub.id, approvalStatus: approval_status, submittedAt: rawSub.submitted_at });
              if (auto) { approval_status = "approved"; approved_at = auto.approvedAt; }
            }
            return {
              id: rawSub.id,
              videoUrl: rawSub.video_url,
              submittedAt: rawSub.submitted_at,
              approvalStatus: approval_status as Submission["approvalStatus"],
              approvedAt: approved_at ?? undefined,
              rejectionReason: rawSub.rejection_reason ?? undefined,
            };
          }));

          const appMsg: CreatorMsg = {
            id: offer.id,
            from: "creator",
            type: "application",
            campaign: {
              id: camp?.id ?? offer.campaign_id,
              name: camp?.name ?? "Campaign",
              brand: brandName,
              description: camp?.description ?? "",
              flatFee: camp?.flat_fee ?? 0,
              cpm: camp?.cpm ?? 0,
              payoutCap: camp?.payout_cap ?? null,
              payoutWindowDays: camp?.payout_window_days ?? 30,
              submissionDeadlineDays: camp?.submission_deadline_days ?? 14,
              niches: camp?.niche_tags ?? [],
              contentDeadlineDays: camp?.content_deadline_days ?? null,
              status: (camp?.status ?? "open") as any,
              startDate: "",
              endDate: "",
            },
            note: offer.note ?? "",
            status: offer.status as "pending" | "accepted" | "declined",
            timestamp: new Date(offer.created_at).toLocaleDateString(),
            offerId: offer.id,
            acceptedAt: offer.accepted_at ?? null,
            submissions,
            initiatedBy: (offer.initiated_by ?? "creator") as "creator" | "sponsor",
          };

          const textMsgs: CreatorMsg[] = (dbMsgs ?? []).map((m: any) => ({
            id: m.id,
            from: m.sender_id === user.id ? "creator" as const : "brand" as const,
            type: "text" as const,
            text: m.body,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }));

          return {
            id: offer.id,
            brandName,
            brandId,
            avatar,
            messages: [appMsg, ...textMsgs],
            offerId: offer.id,
          };
        })
      );

      setConvos(dbConvos);
      setActiveId(dbConvos[0].id);
    })();
  }, []);

  const active = convos.find((c) => c.id === activeId) ?? convos[0];
  if (!active) return (
    <div className="flex-1 flex items-center justify-center text-sm text-gray-300" style={{ fontFamily: "'DM Mono', monospace" }}>
      No messages yet
    </div>
  );

  async function sendText() {
    const text = input.trim();
    if (!text) return;
    const msg: CreatorMsg = { id: crypto.randomUUID() as any, from: "creator", type: "text", text, timestamp: "Just now" };
    setConvos((prev) => prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c));
    setInput("");

    const activeConvo = convos.find((c) => c.id === activeId);
    const offerId = activeConvo?.offerId;
    console.log("[send-message] creator text:", text, "offerId:", offerId);
    if (!offerId) { console.warn("[send-message] no offerId on convo — message not persisted"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from("messages").insert({ offer_id: offerId, sender_id: user.id, body: text }).select().single();
    console.log("[send-message] result:", data?.id ?? null, error?.message ?? "ok");
  }

  function lastPreview(msgs: CreatorMsg[]) {
    const last = msgs[msgs.length - 1];
    if (!last) return "";
    if (last.type === "application") return `${(last as any).initiatedBy === "sponsor" ? "Offer" : "Application"}: ${last.campaign.name}`;
    return last.text;
  }

  async function handleCreatorCancelOffer() {
    if (!cancelOfferTarget) return;
    setCancellingOffer(true);
    const { offerId, convoId, pinnedId } = cancelOfferTarget;
    console.log("[cancel-creator] offerId:", offerId);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: cr } = await supabase.from("creators").select("id, cancellation_count").eq("user_id", user.id).maybeSingle();
      const { error: offerErr } = await supabase.from("offers").update({ status: "cancelled_by_creator" }).eq("id", offerId);
      console.log("[cancel-creator] offer update:", offerErr?.message ?? "ok");
      if (cr) {
        const newCount = (cr.cancellation_count ?? 0) + 1;
        await supabase.from("creators").update({ cancellation_count: newCount }).eq("id", cr.id);
        console.log("[cancel-creator] cancellation_count now:", newCount);
      }
      const { error: msgErr } = await supabase.from("messages").insert({ offer_id: offerId, sender_id: user.id, body: "⚠️ The creator has cancelled this offer. No payment will be made." });
      console.log("[cancel-creator] system message:", msgErr?.message ?? "ok");
    }
    setConvos((prev) => prev.map((c) => c.id === convoId ? {
      ...c,
      messages: c.messages.map((m) => m.id === pinnedId && m.type === "application" ? { ...m, status: "cancelled_by_creator" as any } : m),
    } : c));
    setCancellingOffer(false);
    setCancelOfferTarget(null);
  }

  return (
    <>
    {cancelOfferTarget && (
      <CancelOfferModal
        side="creator"
        confirming={cancellingOffer}
        onConfirm={handleCreatorCancelOffer}
        onClose={() => setCancelOfferTarget(null)}
      />
    )}
    <div className="flex h-full overflow-hidden">
      {/* Convo list */}
      <div className="w-72 shrink-0 border-r border-gray-100 bg-white flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Messages</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convos.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 text-left transition-colors"
              style={{ backgroundColor: c.id === activeId ? "#FEF2F2" : "transparent" }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <img src={c.avatar} alt={c.brandName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{c.brandName}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{lastPreview(c.messages)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 flex items-center gap-3 px-6 bg-white border-b border-gray-100 shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img src={active.avatar} alt={active.brandName} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{active.brandName}</p>
            <p className="text-xs text-gray-400">Brand partner</p>
          </div>
        </div>

        {/* Pinned application card */}
        {(() => {
          const pinned = active.messages.find((m) => m.type === "application");
          if (!pinned || pinned.type !== "application") return null;
          const camp = pinned.campaign;
          const submitByLabel = (() => {
            const days = camp.contentDeadlineDays;
            const acceptedAt = (pinned as any).acceptedAt as string | null | undefined;
            if (days && acceptedAt) {
              const d = new Date(acceptedAt);
              d.setDate(d.getDate() + days);
              return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }
            if (days) return `${days}d after acceptance`;
            return "No deadline set";
          })();
          const isCancelled = (pinned.status as string) === "cancelled_by_sponsor" || (pinned.status as string) === "cancelled_by_creator";
          const statusColor = pinned.status === "accepted" ? "#16A34A" : pinned.status === "declined" ? "#E11D48" : isCancelled ? "#6B7280" : "#EA580C";
          const statusBg = pinned.status === "accepted" ? "#F0FDF4" : pinned.status === "declined" ? "#FFF1F2" : isCancelled ? "#F3F4F6" : "#FFF7ED";
          const statusLabel = pinned.status === "accepted" ? "Accepted" : pinned.status === "declined" ? "Declined" : (pinned.status as string) === "cancelled_by_sponsor" ? "Cancelled by sponsor" : (pinned.status as string) === "cancelled_by_creator" ? "Cancelled by you" : "Pending review";
          return (
            <div className="shrink-0 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 pt-3 pb-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {(pinned as any).initiatedBy === "sponsor" ? `Campaign offer · ${camp.name}` : `Your application · ${camp.name}`}
                  </p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: statusBg, color: statusColor, fontFamily: "'DM Mono', monospace" }}>{statusLabel}</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                  {([["Flat fee", `$${camp.flatFee}`], ["CPM", `$${camp.cpm}`], ["Submit by", submitByLabel]] as [string, string][]).map(([l, v]) => (
                    <div key={l} className="px-3 py-2 text-center">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{l}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                {pinned.note && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500 italic">"{pinned.note}"</p>
                  </div>
                )}
                {/* Accept/Decline — only for sponsor-initiated offers the creator hasn't responded to yet */}
                {pinned.status === "pending" && (pinned as any).initiatedBy === "sponsor" && (
                  <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
                    <button
                      className="flex-1 text-xs font-semibold py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#EF4444" }}
                      onClick={async () => {
                        const offerId = (pinned as any).offerId ?? active.offerId;
                        const acceptedAt = new Date().toISOString();
                        console.log("[creator-accept-offer] offerId:", offerId);
                        if (offerId) {
                          const { error } = await supabase.from("offers").update({ status: "accepted", accepted_at: acceptedAt }).eq("id", offerId);
                          console.log("[creator-accept-offer] result:", error?.message ?? "ok");
                        }
                        setConvos((prev) => prev.map((c) => c.id === activeId ? {
                          ...c,
                          messages: c.messages.map((m) => m.id === pinned.id ? { ...m, status: "accepted", acceptedAt } as CreatorMsg : m),
                        } : c));
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="flex-1 text-xs font-semibold py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={async () => {
                        const offerId = (pinned as any).offerId ?? active.offerId;
                        console.log("[creator-decline-offer] offerId:", offerId);
                        if (offerId) {
                          const { error } = await supabase.from("offers").update({ status: "declined" }).eq("id", offerId);
                          console.log("[creator-decline-offer] result:", error?.message ?? "ok");
                        }
                        setConvos((prev) => prev.map((c) => c.id === activeId ? {
                          ...c,
                          messages: c.messages.map((m) => m.id === pinned.id ? { ...m, status: "declined" } as CreatorMsg : m),
                        } : c));
                      }}
                    >
                      Decline
                    </button>
                  </div>
                )}
                {/* Creator-initiated application awaiting sponsor review */}
                {pinned.status === "pending" && (pinned as any).initiatedBy !== "sponsor" && (
                  <div className="px-4 py-2.5 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>Awaiting sponsor review</p>
                  </div>
                )}
                {pinned.status === "accepted" && ((pinned as any).submissions ?? []).length === 0 && !isCancelled && (
                  <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      className="text-xs font-semibold px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      onClick={() => {
                        const offerId = (pinned as any).offerId ?? active.offerId;
                        if (offerId) setCancelOfferTarget({ offerId, convoId: active.id, pinnedId: pinned.id });
                      }}
                    >
                      Cancel offer
                    </button>
                  </div>
                )}
                {isCancelled && (
                  <div className="px-4 py-2.5 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>This offer was cancelled. No payment will be made.</p>
                  </div>
                )}
                {pinned.status === "accepted" && (
                  <CreatorSubmissionSection
                    offerId={(pinned as any).offerId ?? active.offerId ?? ""}
                    submissions={(pinned as any).submissions ?? []}
                    contentDeadlineDays={camp.contentDeadlineDays}
                    acceptedAt={(pinned as any).acceptedAt}
                    onSubmitted={(sub) => {
                      setConvos((prev) => prev.map((c) => c.id === activeId ? {
                        ...c,
                        messages: c.messages.map((m) => m.id === pinned.id
                          ? { ...m, submissions: [...((m as any).submissions ?? []), sub] } as CreatorMsg
                          : m),
                      } : c));
                    }}
                  />
                )}
              </div>
            </div>
          );
        })()}

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
          {active.messages.map((msg, msgIdx) => {
            // Skip the application card — rendered pinned above
            if (msg.type === "application") return null;

            const isCreator = msg.from === "creator";
            return (
              <div key={`${msg.id}-${msgIdx}`} className={`flex ${isCreator ? "justify-end" : "justify-start"}`}>
                <div className="max-w-sm">
                  <div
                    className="px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      backgroundColor: isCreator ? "#EF4444" : "white",
                      color: isCreator ? "white" : "#111827",
                      border: isCreator ? "none" : "1px solid #F3F4F6",
                      borderRadius: isCreator ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    }}
                  >
                    {msg.text}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-1" style={{ textAlign: isCreator ? "right" : "left", fontFamily: "'DM Mono', monospace" }}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendText(); }}
            placeholder="Write a message…"
            className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none transition-shadow focus:shadow-[0_0_0_3px_#FEE2E2]"
          />
          <button
            onClick={sendText}
            className="shrink-0 px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#EF4444" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

/* ================================================================
   Creator app — Brand profile view
================================================================ */
function BrandProfileView({ brandName, onBack }: { brandName: string; onBack: () => void }) {
  const [sponsorData, setSponsorData] = useState<{ logo: string | null; website: string | null; industry: string | null; bio: string | null; tags: string[] } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    supabase.from("sponsors").select("*").eq("company_name", brandName).maybeSingle().then(({ data: sp }) => {
      if (sp) setSponsorData({ logo: sp.avatar_url, website: sp.website, industry: sp.industry, bio: sp.bio, tags: sp.niche_tags ?? [] });
    });
  }, [brandName]);
  useEffect(() => {
    supabase.from("campaigns").select("*, sponsor:sponsors(*)").eq("status", "open")
      .then(({ data }) => {
        const filtered = (data ?? []).filter((c: any) => c.sponsor?.company_name === brandName);
        setCampaigns(filtered.map((c: any) => ({
          id: c.id, _dbId: c.id, name: c.name, brand: brandName,
          description: c.description ?? "", flatFee: Number(c.flat_fee), cpm: Number(c.cpm),
          payoutCap: c.payout_cap ? Number(c.payout_cap) : null, status: "Live" as const,
          startDate: "", endDate: "", payoutWindowDays: c.payout_window_days,
          submissionDeadlineDays: c.submission_deadline_days, niches: c.niche_tags ?? [],
        })));
      });
  }, [brandName]);

  function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  return (
    <>
      <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ChevronLeftIcon /> Browse Campaigns
        </button>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "#F0FDF4", color: "#16A34A", fontFamily: "'DM Mono', monospace" }}>
          Verified Brand
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 flex flex-col gap-8">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-24 w-full" style={{ backgroundImage: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%, #FFF7ED 100%)" }} />
          <div className="px-8 pb-8">
            <div className="-mt-10 mb-5">
              <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                {sponsorData?.logo
                  ? <img src={sponsorData.logo} alt={brandName} className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-gray-300">{brandName[0]}</span>
                }
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{brandName}</h1>
                {(sponsorData?.website || sponsorData?.industry) && (
                  <p className="text-sm text-gray-500 mt-0.5">{[sponsorData.website, sponsorData.industry].filter(Boolean).join(" · ")}</p>
                )}
                {(sponsorData?.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {sponsorData!.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#FEF2F2", color: "#991B1B", fontFamily: "'DM Mono', monospace" }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {sponsorData?.bio && <p className="text-sm text-gray-600 mt-4 leading-relaxed max-w-xl">{sponsorData.bio}</p>}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Active Campaigns", String(campaigns.length)],
            ["Industry", sponsorData?.industry ?? "—"],
          ].map(([label, val]) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col gap-1">
              <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>{label}</p>
              <p className="text-xl font-bold text-gray-900">{val}</p>
            </div>
          ))}
        </div>

        {/* Active campaigns */}
        {campaigns.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>Active Campaigns</p>
            <div className="flex flex-col gap-4">
              {campaigns.map((camp) => (
                <div key={camp.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">{camp.name}</h3>
                  {camp.description && <p className="text-sm text-gray-500 leading-relaxed">{camp.description}</p>}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Flat fee</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{fmt(camp.flatFee)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>CPM</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{fmt(camp.cpm)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Window</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{camp.payoutWindowDays}d</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {camp.niches.map((n) => (
                      <span key={n} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontFamily: "'DM Mono', monospace" }}>{n}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="h-4" />
      </div>
    </>
  );
}

/* ================================================================
   Creator app — root
================================================================ */
function CreatorApp({ onHome, creator }: { onHome: () => void; creator?: DbCreator | null }) {
  const [activeNav, setActiveNav] = useState("browse");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [messageBrandId, setMessageBrandId] = useState<string | undefined>(undefined);
  const [convos, setConvos] = useState<CreatorConvo[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  function handleApply(camp: Campaign, note: string, offerId: string | null) {
    // Add to applications list — use real DB id when available
    setApplications((prev) => [
      { id: offerId ?? crypto.randomUUID(), campaign: camp, appliedAt: "Just now", status: "Pending", note },
      ...prev,
    ]);

    // Send application card into the brand's conversation
    const brandName = camp.brand ?? "Brand";
    const brandId = brandName.toLowerCase().replace(/\s+/g, "-");
    const appMsg: CreatorMsg = {
      id: crypto.randomUUID() as any,
      from: "creator",
      type: "application",
      campaign: camp,
      note,
      status: "pending",
      timestamp: "Just now",
    };
    setConvos((prev) => {
      const existing = prev.find((c) => c.brandId === brandId);
      if (existing) {
        return prev.map((c) => c.brandId === brandId ? { ...c, offerId: offerId ?? c.offerId, messages: [...c.messages, appMsg] } : c);
      }
      return [
        {
          id: crypto.randomUUID(),
          brandName,
          brandId,
          avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop&auto=format",
          messages: [appMsg],
          offerId: offerId ?? undefined,
        },
        ...prev,
      ];
    });

    setMessageBrandId(brandId);
    setActiveNav("messages");
  }

  function handleNavChange(id: string) {
    setActiveNav(id);
    setSelectedBrand(null);
    if (id !== "messages") setMessageBrandId(undefined);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FB]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <CreatorSidebar activeNav={activeNav} setActiveNav={handleNavChange} onHome={onHome} creator={creator} />
      <main className="flex-1 overflow-y-auto">
        {selectedBrand ? (
          <BrandProfileView brandName={selectedBrand} onBack={() => setSelectedBrand(null)} />
        ) : (
          <>
            {activeNav === "browse" && <CreatorBrowseCampaigns onApply={handleApply} applications={applications} onViewBrand={setSelectedBrand} />}
            {activeNav === "applications" && <CreatorApplicationsView applications={applications} onViewBrand={setSelectedBrand} />}
            {activeNav === "messages" && <CreatorMessagesView convos={convos} setConvos={setConvos} initialBrandId={messageBrandId} />}
            {activeNav === "profile" && <CreatorChannelProfile creator={creator} />}
          </>
        )}
      </main>
    </div>
  );
}

/* ================================================================
   Creator sign-up / log-in page
================================================================ */
function CreatorAuthPage({ onBack, onSwitchToSponsor, onSuccess }: { onBack: () => void; onSwitchToSponsor: () => void; onSuccess: () => void }) {
  const [state, setState] = useState<"idle" | "connecting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleConnect() {
    setState("connecting");
    try {
      // Sign out any existing session first so a logged-in sponsor/other account
      // doesn't get reused — Supabase would otherwise keep the old user.id.
      await supabase.auth.signOut();

      // Persist intended role so resolveSession knows what to do after the OAuth
      // redirect reloads the page and all React state is gone.
      sessionStorage.setItem("adspace_pending_role", "creator");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/youtube.readonly",
          redirectTo: window.location.href,
          queryParams: { access_type: "offline", prompt: "select_account" },
        },
      });
      if (error) throw error;
      // OAuth redirect — the page will reload; session handled in App root useEffect
    } catch (e: any) {
      sessionStorage.removeItem("adspace_pending_role");
      setErrorMsg(e.message ?? "OAuth failed");
      setState("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="h-16 flex items-center justify-between px-10 bg-white border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="hover:opacity-75 transition-opacity flex items-center">
          <AdSpaceLogo height={22} />
        </button>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ChevronLeftIcon /> Back
        </button>
      </nav>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm flex flex-col items-center gap-8">

          {state === "idle" && (
            <>
              {/* Headline */}
              <div className="text-center flex flex-col gap-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Join as a Creator</h1>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Sign in with YouTube to verify your channel and automatically pull your stats — no separate account needed.
                </p>
              </div>

              {/* Main card */}
              <div className="w-full bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-6 shadow-sm">
                {/* YouTube icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#FEF2F2" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#EF4444">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>

                {/* CTA button */}
                <button
                  onClick={handleConnect}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Continue with YouTube
                </button>

                {/* Reassurance */}
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  We only access your public channel info and analytics — read-only.
                  <br />We'll never post or change anything on your behalf.
                </p>
              </div>

              {/* Switch CTA */}
              <p className="text-sm text-gray-400">
                Not a creator?{" "}
                <button onClick={onSwitchToSponsor} className="font-semibold hover:underline transition-colors" style={{ color: "#0E7490" }}>
                  Sign up as a Sponsor instead
                </button>
              </p>
            </>
          )}

          {state === "error" && (
            <div className="w-full bg-white rounded-2xl border border-red-100 p-8 flex flex-col items-center gap-4 shadow-sm text-center">
              <p className="text-base font-semibold text-gray-900">Connection failed</p>
              <p className="text-sm text-gray-500">{errorMsg}</p>
              <button onClick={() => setState("idle")} className="text-sm font-semibold px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Try again</button>
            </div>
          )}

          {state === "connecting" && (
            <div className="w-full bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center gap-6 shadow-sm">
              {/* Spinner */}
              <div className="relative w-16 h-16">
                <svg className="absolute inset-0 animate-spin" width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="5" />
                  <path d="M32 4a28 28 0 0 1 28 28" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#EF4444">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-gray-800">Connecting to YouTube…</p>
                <p className="text-sm text-gray-400 mt-1">Verifying your channel</p>
              </div>
              {/* Progress steps */}
              <div className="w-full flex flex-col gap-2.5 mt-2">
                {["Authenticating with Google", "Reading channel data", "Pulling analytics"].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: i === 0 ? "#EF4444" : "#F3F4F6" }}>
                      {i === 0 && (
                        <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: i === 0 ? "#111827" : "#9CA3AF", fontFamily: i === 1 ? "'DM Mono', monospace" : undefined }}>
                      {step}{i === 1 ? "…" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state === "success" && (
            <div className="w-full bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center gap-6 shadow-sm">
              {/* Checkmark */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F0FDF4", border: "3px solid #86EFAC" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">Channel connected!</p>
                <p className="text-sm text-gray-400 mt-1">Setting up your profile…</p>
              </div>
              {/* Channel preview */}
              <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">YouTube Channel</p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Connected via Google</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "#F0FDF4", color: "#16A34A", fontFamily: "'DM Mono', monospace" }}>
                  Connected
                </span>
              </div>
              {/* Pulse dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#EF4444", opacity: 0.3 + i * 0.35, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
              <button
                onClick={onSuccess}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#EF4444" }}
              >
                Enter AdSpace &rarr;
              </button>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ================================================================
   Sponsor auth page (email + password)
================================================================ */
function SponsorAuthPage({ onBack, onSuccess, onSwitchToCreator, initialMode = "signup" }: {
  onBack: () => void;
  onSuccess: (info?: { companyName: string; industry: string }) => void;
  onSwitchToCreator: () => void;
  initialMode?: "signin" | "signup";
}) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error("Sign up failed");
        // Sign in first so RLS allows the insert
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        // Now upsert sponsor record with an active session
        const { error: insertError } = await supabase.from("sponsors").upsert({
          user_id: data.user.id,
          company_name: companyName,
          industry: industry || null,
        }, { onConflict: "user_id" });
        if (insertError) throw insertError;
        onSuccess({ companyName, industry });
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSuccess();
    } catch (e: any) {
      setError(e.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <nav className="h-16 flex items-center justify-between px-10 bg-white border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="text-xl tracking-tight hover:opacity-75 transition-opacity" style={{ fontWeight: 700 }}>
          <span style={{ color: "#0E7490" }}>Ad</span><span className="text-gray-900">Space</span>
        </button>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ChevronLeftIcon /> Back
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {mode === "signup" ? "Create your sponsor account" : "Welcome back"}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              {mode === "signup"
                ? "Set up your brand profile and start connecting with creators."
                : "Sign in to manage your campaigns and creator relationships."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col gap-4 shadow-sm">
            {mode === "signup" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Company name</label>
                  <input required value={companyName} onChange={e => setCompanyName(e.target.value)}
                    placeholder="Acme Corp"
                    className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:shadow-[0_0_0_3px_#CFFAFE] transition-shadow" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Industry <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input value={industry} onChange={e => setIndustry(e.target.value)}
                    placeholder="e.g. B2B Software"
                    className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:shadow-[0_0_0_3px_#CFFAFE] transition-shadow" />
                </div>
              </>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:shadow-[0_0_0_3px_#CFFAFE] transition-shadow" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:shadow-[0_0_0_3px_#CFFAFE] transition-shadow" />
            </div>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
              style={{ backgroundColor: "#0E7490" }}
            >
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
            <button type="button" onClick={() => { setMode(m => m === "signin" ? "signup" : "signin"); setError(""); }}
              className="text-xs text-gray-400 hover:text-gray-600 text-center transition-colors">
              {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center">
            Are you a creator?{" "}
            <button onClick={onSwitchToCreator} className="font-semibold hover:underline" style={{ color: "#EF4444" }}>
              Connect your YouTube instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Landing page
================================================================ */
function LandingPage({ onSelect }: { onSelect: (role: "advertiser" | "creator") => void }) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="h-16 flex items-center justify-between px-10 bg-white border-b border-gray-100">
        <AdSpaceLogo height={24} />
        <div className="flex items-center gap-6">
          <button onClick={() => onSelect("creator")} className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Log in</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-12">
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <span className="text-xs text-gray-500" style={{ fontFamily: "'DM Mono', monospace" }}>Now in beta</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            The sponsorship<br />marketplace built for<br />
            <span style={{ color: "#0E7490" }}>serious partnerships.</span>
          </h1>
          <p className="text-lg text-gray-500 mt-5 leading-relaxed">
            AdSpace connects brands with creators whose audiences actually convert. Transparent pricing, structured deals, real analytics.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
          {/* Creator card */}
          <button
            onClick={() => onSelect("creator")}
            className="group relative rounded-3xl overflow-hidden text-left bg-gray-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ minHeight: 340 }}
          >
            <img
              src="https://images.unsplash.com/photo-1664277497095-424e085175e8?w=800&h=700&fit=crop&auto=format"
              alt="Creator"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-between p-8" style={{ minHeight: 340 }}>
              <div className="self-start px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white", fontFamily: "'DM Mono', monospace", backdropFilter: "blur(8px)" }}>
                For creators
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Monetise your audience</h2>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">Set your rates, get discovered by relevant brands, and manage deals in one place.</p>
                <div className="flex items-center gap-2 mt-5">
                  <span className="text-sm font-semibold text-white">Join as a creator</span>
                  <span className="text-white opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">→</span>
                </div>
              </div>
            </div>
          </button>

          {/* Advertiser card */}
          <button
            onClick={() => onSelect("advertiser")}
            className="group relative rounded-3xl overflow-hidden text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ minHeight: 340, backgroundColor: "#0E7490" }}
          >
            <img
              src="https://images.unsplash.com/photo-1582005450386-52b25f82d9bb?w=800&h=700&fit=crop&auto=format"
              alt="Advertiser"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-15 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A6E] via-transparent to-transparent" />
            <div className="relative h-full flex flex-col justify-between p-8" style={{ minHeight: 340 }}>
              <div className="self-start px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", fontFamily: "'DM Mono', monospace", backdropFilter: "blur(8px)" }}>
                For brands
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Find your next partner</h2>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>Browse vetted creators by niche, audience, and performance. Send structured campaign offers in minutes.</p>
                <div className="flex items-center gap-2 mt-5">
                  <span className="text-sm font-semibold text-white">Join as an advertiser</span>
                  <span className="text-white opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">→</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Social proof removed — will populate from real data */}
      </div>

      {/* Footer */}
      <div className="h-14 flex items-center justify-center border-t border-gray-100 bg-white">
        <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>© 2026 AdSpace · Terms · Privacy</p>
      </div>
    </div>
  );
}

/* ================================================================
   App root
================================================================ */
export default function App() {
  // ── Auth state ──────────────────────────────────────────────────────────────
  type AppScreen = "loading" | "landing" | "creator-auth" | "sponsor-auth" | "creator-app" | "sponsor-app";
  const [screen, setScreen] = useState<AppScreen>("loading");
  const [dbSponsor, setDbSponsor] = useState<DbSponsor | null>(null);
  const [dbCreator, setDbCreator] = useState<DbCreator | null>(null);

  // ── Legacy advertiser state (preserved for sponsor-app) ────────────────────
  const [activeNav, setActiveNav] = useState("browse");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [offerTarget, setOfferTarget] = useState<Creator | null>(null);
  const [messageCreatorId, setMessageCreatorId] = useState<number | undefined>(undefined);

  // ── Favicon ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = adspaceLogo;
    document.title = "AdSpace";
  }, []);

  // ── Bootstrap + session restore ─────────────────────────────────────────────
  // useRef so the value persists across renders without triggering re-renders
  const manualAuthInProgress = useState(() => ({ current: false }))[0];

  useEffect(() => {
    let mounted = true;

    async function resolveSession(session: any) {
      if (manualAuthInProgress.current) {
        console.log("[auth] resolveSession skipped — manual auth in progress");
        return;
      }
      if (!session) {
        console.log("[auth] no session → landing");
        if (mounted) setScreen("landing");
        return;
      }

      const user = session.user;
      const pendingRole = sessionStorage.getItem("adspace_pending_role");
      console.log("[auth] resolveSession user:", user.id, "provider:", user.app_metadata?.provider, "pendingRole:", pendingRole);

      // 1. Existing creator?
      const { data: creator, error: creatorErr } = await supabase
        .from("creators").select("*").eq("user_id", user.id).maybeSingle();
      console.log("[auth] creator lookup:", { creator, error: creatorErr?.message });
      if (creator) {
        sessionStorage.removeItem("adspace_pending_role");
        // Resume Stripe onboarding if the creator never completed it.
        console.log("[stripe-connect] existing creator gate check:", {
          userEmail: user.email ?? null,
          stripe_account_id: (creator as any)?.stripe_account_id ?? "(not present)",
          willCall: !!user.email && !(creator as any)?.stripe_account_id,
        });
        if (user.email && !(creator as any).stripe_account_id) {
          console.log("[stripe-connect] existing creator — condition passed, calling edge function");
          try {
            const edgeUrl = "https://wgujjqyiwrsmlkhluadx.supabase.co/functions/v1/create-creator-connect-account";
            console.log("[stripe-connect] fetching:", edgeUrl, "creatorId:", creator.id);
            const res = await fetch(edgeUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ creatorEmail: user.email, creatorId: creator.id }),
            });
            console.log("[stripe-connect] HTTP status:", res.status, res.statusText);
            const payload = await res.json();
            console.log("[stripe-connect] resume response payload:", payload);
            if (payload.onboardingUrl) {
              console.log("[stripe-connect] redirecting to:", payload.onboardingUrl);
              window.location.href = payload.onboardingUrl;
              return;
            } else {
              console.warn("[stripe-connect] no onboardingUrl — falling through to creator-app");
            }
          } catch (stripeErr: any) {
            console.error("[stripe-connect] fetch threw:", stripeErr?.message, stripeErr);
          }
        } else {
          console.log("[stripe-connect] existing creator — condition NOT met, going straight to creator-app");
        }
        if (mounted) { setDbCreator(creator); setScreen("creator-app"); }
        return;
      }

      // 2. Existing sponsor — only route here if the user did NOT just come from
      //    the creator auth flow. If pendingRole is "creator" they clicked
      //    "Join as Creator" and must not land on the sponsor view.
      const { data: sponsor, error: sponsorErr } = await supabase
        .from("sponsors").select("*").eq("user_id", user.id).maybeSingle();
      console.log("[auth] sponsor lookup:", { sponsor, error: sponsorErr?.message });
      if (sponsor && pendingRole !== "creator") {
        sessionStorage.removeItem("adspace_pending_role");
        if (mounted) { setDbSponsor(sponsor); setScreen("sponsor-app"); }
        return;
      }

      // 3. New Google/YouTube OAuth user → create creator record
      const isGoogle = user?.app_metadata?.provider === "google"
        || user?.identities?.some((i: any) => i.provider === "google");
      console.log("[auth] isGoogle:", isGoogle);

      if (isGoogle) {
        const creatorPayload = {
          user_id: user.id,
          name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Creator",
          handle: user.user_metadata?.preferred_username ?? user.user_metadata?.user_name ?? "",
          avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
        };
        console.log("[auth] upserting creator:", creatorPayload);

        const { data: newCreator, error: upsertErr } = await supabase
          .from("creators")
          .upsert(creatorPayload, { onConflict: "user_id" })
          .select()
          .single();
        console.log("[auth] creator upsert result:", { newCreator, error: upsertErr?.message });
        sessionStorage.removeItem("adspace_pending_role");

        // ── Stripe Connect gate — verbose logging ──────────────────────────────
        console.log("[stripe-connect] gate check:", {
          upsertErr: upsertErr?.message ?? null,
          newCreator: newCreator?.id ?? null,
          userEmail: user.email ?? null,
          stripe_account_id: (newCreator as any)?.stripe_account_id ?? "(not present)",
          willCall: !upsertErr && !!newCreator && !!user.email && !(newCreator as any)?.stripe_account_id,
        });

        if (!upsertErr && newCreator && user.email && !(newCreator as any).stripe_account_id) {
          console.log("[stripe-connect] condition passed — calling edge function");
          try {
            const edgeUrl = "https://wgujjqyiwrsmlkhluadx.supabase.co/functions/v1/create-creator-connect-account";
            console.log("[stripe-connect] fetching:", edgeUrl, "with creatorId:", newCreator.id, "email:", user.email);
            const res = await fetch(edgeUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ creatorEmail: user.email, creatorId: newCreator.id }),
            });
            console.log("[stripe-connect] HTTP status:", res.status, res.statusText);
            const payload = await res.json();
            console.log("[stripe-connect] response payload:", payload);
            if (payload.onboardingUrl) {
              console.log("[stripe-connect] redirecting to:", payload.onboardingUrl);
              window.location.href = payload.onboardingUrl;
              return;
            } else {
              console.warn("[stripe-connect] no onboardingUrl in response — falling through to creator-app");
            }
          } catch (stripeErr: any) {
            console.error("[stripe-connect] fetch threw an exception:", stripeErr?.message, stripeErr);
          }
        } else {
          console.log("[stripe-connect] condition NOT met — skipping edge function call");
        }

        // Use DB record if insert succeeded, otherwise fall back to in-memory
        const creatorRecord: DbCreator = newCreator ?? {
          id: user.id,
          user_id: user.id,
          name: creatorPayload.name,
          handle: creatorPayload.handle,
          youtube_url: null,
          avatar_url: creatorPayload.avatar_url,
          niche_tags: [],
          avg_views: null,
          retention_pct: null,
          age_breakdown: null,
          gender_breakdown: null,
          geo_breakdown: null,
          subscribers: null,
          bio: null,
          star_rating: 0,
          rating_count: 0,
          created_at: new Date().toISOString(),
        };

        if (mounted) { setDbCreator(creatorRecord); setScreen("creator-app"); }
        return;
      }

      // 4. Unknown user with no record — send to landing, not sponsor dashboard
      console.log("[auth] no record found, not Google → landing");
      if (mounted) setScreen("landing");
    }

    async function boot() {
      

      // onAuthStateChange fires for login, page-load session restore, token
      // refresh, and sign-out. Only SIGNED_IN and INITIAL_SESSION should
      // trigger role resolution and routing — TOKEN_REFRESHED is a background
      // operation (Supabase auto-refreshes on tab focus) and must not re-run
      // routing logic or the Stripe Connect redirect gate.
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          // Clean up OAuth params from URL so a refresh doesn't loop
          if (window.location.hash.includes("access_token") || window.location.search.includes("code=")) {
            window.history.replaceState(null, "", window.location.pathname);
          }
          await resolveSession(session);
        } else if (event === "SIGNED_OUT") {
          if (mounted) { setDbCreator(null); setDbSponsor(null); setScreen("landing"); }
        }
        // TOKEN_REFRESHED: session stays valid automatically — no action needed.
      });

      return () => { mounted = false; subscription.unsubscribe(); };
    }

    let cleanup = () => { mounted = false; };
    boot().then((fn) => { if (fn) cleanup = fn; });
    return () => cleanup();
  }, []);

  function handleSignOut() {
    supabase.auth.signOut();
    setDbCreator(null);
    setDbSponsor(null);
    setScreen("landing");
  }

  function handleNavChange(id: string) {
    setActiveNav(id);
    setSelectedCreator(null);
  }

  function handleViewProfile(creator: Creator) {
    setSelectedCreator(creator);
    setActiveNav("browse");
  }

  async function handleSendOffer(creator: Creator, camp: Campaign) {
    const tempId = crypto.randomUUID();
    const msg: Message = {
      id: crypto.randomUUID(),
      from: "brand",
      type: "campaign-offer",
      offer: { campaignName: camp.name, flatFee: camp.flatFee, cpm: camp.cpm, payoutWindowDays: camp.payoutWindowDays, payoutCap: camp.payoutCap, status: "pending" },
      timestamp: "Just now",
    };
    setConversations((prev) => {
      const existing = prev.find((c) => c.creator.id === creator.id);
      if (existing) return prev.map((c) => c.creator.id === creator.id ? { ...c, messages: [...c.messages, msg] } : c);
      return [{ id: tempId, creator, messages: [msg], unread: 0 }, ...prev];
    });
    setMessageCreatorId(creator.id);
    setOfferTarget(null);
    setSelectedCreator(null);
    setActiveNav("messages");

    // Persist to DB
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      console.log("[send-offer] user:", user?.id, userErr?.message);
      if (!user) return;

      const dbCampId = (camp as any)._dbId ?? camp.id;
      console.log("[send-offer] campaign dbId:", dbCampId, "creator id:", creator.id);

      const payload = { campaign_id: dbCampId, creator_id: creator.id, status: "pending", note: null, initiated_by: "sponsor" };
      console.log("[send-offer] inserting offer:", payload);

      const { data: offer, error: insertErr } = await supabase
        .from("offers")
        .insert(payload)
        .select()
        .single();

      if (insertErr) {
        console.error("[send-offer] insert failed:", insertErr.message, insertErr.details, insertErr.hint);
      } else {
        console.log("[send-offer] offer inserted:", offer);
        // Store offerId on the conversation so messages can be persisted
        setConversations((prev) => prev.map((c) => c.creator.id === creator.id ? { ...c, offerId: offer.id } : c));
      }
    } catch (e) {
      console.error("[send-offer] unexpected error:", e);
    }
  }

  // ── Screens ──────────────────────────────────────────────────────────────────
  if (screen === "loading") {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin" width="32" height="32" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="6" />
            <path d="M32 4a28 28 0 0 1 28 28" stroke="#0E7490" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-gray-400" style={{ fontFamily: "'DM Mono', monospace" }}>Loading AdSpace…</p>
        </div>
      </div>
    );
  }

  if (screen === "landing") {
    return <LandingPage onSelect={(r) => setScreen(r === "creator" ? "creator-auth" : "sponsor-auth")} />;
  }

  if (screen === "creator-auth") {
    return (
      <CreatorAuthPage
        onBack={() => setScreen("landing")}
        onSwitchToSponsor={() => setScreen("sponsor-auth")}
        onSuccess={() => setScreen("creator-app")}
      />
    );
  }

  if (screen === "sponsor-auth") {
    return (
      <SponsorAuthPage
        onBack={() => setScreen("landing")}
        onSuccess={async (info) => {
          manualAuthInProgress.current = true;
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data } = await supabase.from("sponsors").select("*").eq("user_id", user.id).maybeSingle();
              if (data) {
                setDbSponsor(data);
              } else if (info) {
                setDbSponsor({
                  id: user.id,
                  user_id: user.id,
                  company_name: info.companyName,
                  industry: info.industry || null,
                  niche_tags: [],
                  bio: null,
                  website: null,
                  avatar_url: null,
                  completion_rate: 0,
                  created_at: new Date().toISOString(),
                });
              }
            }
            setScreen("sponsor-app");
          } finally {
            manualAuthInProgress.current = false;
          }
        }}
        onSwitchToCreator={() => setScreen("creator-auth")}
      />
    );
  }

  if (screen === "creator-app") {
    return <CreatorApp onHome={handleSignOut} creator={dbCreator} />;
  }


  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FB]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar activeNav={activeNav} setActiveNav={handleNavChange} onHome={() => setScreen("landing")} sponsor={dbSponsor} />
      <main className="flex-1 overflow-y-auto">
        {activeNav === "browse" && !selectedCreator && (
          <BrowseCreatorsView onViewProfile={handleViewProfile} onMakeOffer={setOfferTarget} savedIds={savedIds} onToggleSave={(id) => setSavedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; })} />
        )}
        {activeNav === "browse" && selectedCreator && (
          <CreatorProfileView creator={selectedCreator} onBack={() => setSelectedCreator(null)} onMakeOffer={setOfferTarget} />
        )}
        {activeNav === "myprofile" && <MyProfileView dbSponsor={dbSponsor} onSponsorUpdate={setDbSponsor} />}
        {activeNav === "manage" && <ManageCampaignsView dbSponsor={dbSponsor} />}
        {activeNav === "messages" && (
          <MessagesView
            conversations={conversations}
            setConversations={setConversations}
            initialCreatorId={messageCreatorId}
          />
        )}
      </main>
      {offerTarget && (
        <MakeOfferModal
          creator={offerTarget}
          onClose={() => setOfferTarget(null)}
          onSend={(camp) => handleSendOffer(offerTarget, camp)}
        />
      )}
    </div>
  );
}
