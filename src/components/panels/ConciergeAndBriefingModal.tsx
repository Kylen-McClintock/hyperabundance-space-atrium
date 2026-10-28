"use client";

import React, { useState } from "react";
import {
  Compass,
  Newspaper,
  Search,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Lock,
} from "lucide-react";
import { AccessibleModalDialog } from "@/components/ui/AccessibleModalDialog";
import {
  STATION_BRIEFING_ITEMS,
  StationBriefingItem,
} from "@/data/station-briefing";
import {
  AGI_FUTURES_IDEAS,
  AgiFuturesIdea,
} from "@/data/agifutures-catalog";
import { LEVL_MODALITIES } from "@/data/levl-catalog";
import { SPATIAL_WAYPOINTS } from "@/lib/spatial/waypoint-registry";
import { ResidentReplyPayload } from "@/lib/ai/deterministic-residents";

interface ConciergeAndBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "briefing" | "concierge" | "directory";
  onSelectWaypoint: (waypointId: string) => void;
  onOpenIdea: (idea: AgiFuturesIdea) => void;
  onOpenLevlModality: (slug: string) => void;
  isSignedIn: boolean;
  userId: string;
  onRequestSignIn: (reason: string) => void;
}

export function ConciergeAndBriefingModal({
  isOpen,
  onClose,
  initialTab = "briefing",
  onSelectWaypoint,
  onOpenIdea,
  onOpenLevlModality,
  isSignedIn,
  userId,
  onRequestSignIn,
}: ConciergeAndBriefingModalProps) {
  const [tab, setTab] = useState<"briefing" | "concierge" | "directory">(
    initialTab
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [conciergeInput, setConciergeInput] = useState("");
  const [conciergeLoading, setConciergeLoading] = useState(false);
  const [conciergeReply, setConciergeReply] =
    useState<ResidentReplyPayload | null>(null);

  const askConcierge = async (promptText?: string) => {
    const q =
      promptText ||
      conciergeInput.trim() ||
      "Give me an overview of the Atrium and recommend where to start.";
    setConciergeLoading(true);
    try {
      const res = await fetch("/api/ai/resident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "concierge",
          message: q,
          isSignedIn,
          userId,
        }),
      });
      const data = (await res.json()) as ResidentReplyPayload;
      setConciergeReply(data);
    } finally {
      setConciergeLoading(false);
    }
  };

  const handleBriefingAction = (item: StationBriefingItem) => {
    if (item.actionType === "open_idea_booth" && item.targetIdeaSlug) {
      const found = AGI_FUTURES_IDEAS.find(
        (i) => i.slug === item.targetIdeaSlug
      );
      if (item.targetWaypointId) onSelectWaypoint(item.targetWaypointId);
      if (found) onOpenIdea(found);
      onClose();
    } else if (
      item.actionType === "open_levl_modality" &&
      item.targetModalitySlug
    ) {
      if (item.targetWaypointId) onSelectWaypoint(item.targetWaypointId);
      onOpenLevlModality(item.targetModalitySlug);
      onClose();
    } else if (item.actionType === "visit_waypoint" && item.targetWaypointId) {
      onSelectWaypoint(item.targetWaypointId);
      onClose();
    }
  };

  const q = searchQuery.toLowerCase().trim();
  const matchedIdeas = AGI_FUTURES_IDEAS.filter(
    (i) =>
      !q ||
      i.title.toLowerCase().includes(q) ||
      i.scoreTitle.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.sectorLabel.toLowerCase().includes(q)
  );
  const matchedModalities = LEVL_MODALITIES.filter(
    (m) =>
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.headline.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
  );

  return (
    <AccessibleModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Orbital Station Briefing, AI Concierge & Full 2D Directory"
      subtitle="Every destination has a direct action • Browse all 33 AGI Futures ideas and LEVL protocols without 3D corridor navigation"
      maxWidthClass="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Top Mode Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setTab("briefing")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              tab === "briefing"
                ? "bg-sky-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            Station Briefing ({STATION_BRIEFING_ITEMS.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("concierge");
              if (!conciergeReply) askConcierge();
            }}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              tab === "concierge"
                ? "bg-sky-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Resident Concierge (Aethel)
          </button>

          <button
            type="button"
            onClick={() => setTab("directory")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              tab === "directory"
                ? "bg-sky-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Accessible 2D Directory & Search (33 Ideas + LEVL)
          </button>
        </div>

        {/* TAB 1: STATION BRIEFING */}
        {tab === "briefing" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {STATION_BRIEFING_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-slate-900/75 p-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="rounded bg-white/10 px-2 py-0.5 font-bold text-sky-300 uppercase">
                      {item.sourceBrand} • {item.category}
                    </span>
                    <span className="text-slate-400">{item.publishedDate}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleBriefingAction(item)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-sky-400/20 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:bg-sky-400/30"
                  >
                    {item.actionLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                    >
                      Canonical Source
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: AI RESIDENT CONCIERGE */}
        {tab === "concierge" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-sky-400/35 bg-sky-950/25 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-sky-300 uppercase">
                  AI RESIDENT • AETHEL (ORBITAL CONCIERGE)
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">
                  {isSignedIn ? "Live Gemini AI" : "Guest Grounded Mode"}
                </span>
              </div>

              {!isSignedIn && (
                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-amber-400/30 bg-amber-950/40 px-3 py-1.5 text-xs text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Guest Mode uses instant grounded catalog routing. Sign in for live Gemini AI chat.
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onRequestSignIn("Unlock live Gemini AI Concierge")
                    }
                    className="cursor-pointer rounded bg-amber-400 px-2.5 py-0.5 text-[11px] font-semibold text-slate-950"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Quick Intention Prompts */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "I want a quiet Earthview Pod to focus for 50 minutes",
                  "Show me longevity protocols for VO2 max, sauna, and sleep",
                  "Help me explore AGI Futures startup blueprints to build",
                  "How do I find collaborators asynchronously?",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => askConcierge(preset)}
                    className="cursor-pointer rounded-lg border border-white/15 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 hover:border-sky-400/50 hover:text-white"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {conciergeLoading ? (
                <p className="mt-4 text-xs text-sky-200">
                  Aethel is consulting the station map...
                </p>
              ) : (
                conciergeReply && (
                  <div className="mt-4 space-y-3 rounded-xl bg-slate-950/85 p-4 text-xs leading-relaxed text-slate-200">
                    <div className="whitespace-pre-wrap">
                      {conciergeReply.replyMarkdown}
                    </div>
                    {conciergeReply.suggestedWaypointId && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectWaypoint(conciergeReply.suggestedWaypointId!);
                          onClose();
                        }}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-300"
                      >
                        Drift to Recommended Destination Now
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  askConcierge();
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  type="text"
                  value={conciergeInput}
                  onChange={(e) => setConciergeInput(e.target.value)}
                  placeholder="Tell Aethel what you want to accomplish today..."
                  className="flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300"
                >
                  Ask Aethel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: ACCESSIBLE 2D DIRECTORY & SEARCH */}
        {tab === "directory" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className=" absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all 33 AGI Futures startup ideas, LEVL longevity modalities, or Earthview pods..."
                aria-label="Search all ideas, modalities, and destinations"
                className="w-full rounded-xl border border-white/15 bg-slate-900 py-2 pr-4 pl-9 text-xs text-white placeholder:text-slate-400"
              />
            </div>

            {/* Direct Waypoint Jump Grid */}
            <div>
              <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Orbital Destinations & Earthview Focus Pods ({SPATIAL_WAYPOINTS.length})
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SPATIAL_WAYPOINTS.filter((w) => w.wing !== "arrival").map(
                  (wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => {
                        onSelectWaypoint(wp.id);
                        onClose();
                      }}
                      className="cursor-pointer rounded-lg border border-white/10 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-200 hover:border-sky-400/50 hover:text-white"
                    >
                      {wp.shortLabel}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* All 33 AGI Futures Ideas */}
            <div>
              <h3 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                AGI Futures Canonical Startup Blueprints ({matchedIdeas.length} / 33)
              </h3>
              <div className="mt-2 grid max-h-60 gap-2 overflow-y-auto sm:grid-cols-2">
                {matchedIdeas.map((idea) => (
                  <button
                    key={idea.slug}
                    type="button"
                    onClick={() => {
                      onSelectWaypoint("agi-holo-table");
                      onOpenIdea(idea);
                      onClose();
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-slate-900/80 p-3 text-left transition hover:border-emerald-400/50"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">
                        {idea.title}
                      </div>
                      <div className="text-[11px] text-emerald-300">
                        {idea.scoreTitle}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {idea.sectorLabel} • 2035 Est: {idea.forecasts.y2035}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* LEVL Longevity Modalities */}
            <div>
              <h3 className="text-xs font-bold tracking-wider text-teal-300 uppercase">
                LEVL Public Evidence Modalities & Spa Stations ({matchedModalities.length})
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {matchedModalities.map((mod) => (
                  <button
                    key={mod.slug}
                    type="button"
                    onClick={() => {
                      onSelectWaypoint("levl-protocol-bar");
                      onOpenLevlModality(mod.slug);
                      onClose();
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-slate-900/80 p-3 text-left transition hover:border-teal-400/50"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">
                        {mod.name}
                      </div>
                      <div className="text-[10px] text-teal-300">
                        {mod.evidenceGrade}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-teal-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AccessibleModalDialog>
  );
}
