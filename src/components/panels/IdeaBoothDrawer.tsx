"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Sparkles,
  Sprout,
  Wrench,
  X,
  Lock,
  CheckCircle2,
} from "lucide-react";
import {
  AgiFuturesIdea,
  SECTOR_BOOTHS,
  SectorBoothId,
  getIdeasBySector,
  CommunityIdeaSeed,
} from "@/data/agifutures-catalog";
import { ResidentReplyPayload } from "@/lib/ai/deterministic-residents";

interface IdeaBoothDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeIdea: AgiFuturesIdea;
  onSelectIdea: (idea: AgiFuturesIdea) => void;
  savedIdeaSlugs: string[];
  onToggleSaveIdea: (slug: string) => void;
  communitySeeds: CommunityIdeaSeed[];
  onPlantSeed: (seed: Omit<CommunityIdeaSeed, "id" | "slug" | "createdAt" | "votes" | "isEditorialBlueprint">) => void;
  onSubmitContribution: (payload: {
    ideaSlug: string;
    kind: string;
    title: string;
    body: string;
  }) => void;
  contributionsByIdea: Record<
    string,
    { id: string; author: string; kind: string; title: string; body: string; createdAt: string }[]
  >;
  isSignedIn: boolean;
  userId: string;
  onRequestSignIn: (reason: string) => void;
}

export function IdeaBoothDrawer({
  isOpen,
  onClose,
  activeIdea,
  onSelectIdea,
  savedIdeaSlugs,
  onToggleSaveIdea,
  communitySeeds,
  onPlantSeed,
  onSubmitContribution,
  contributionsByIdea,
  isSignedIn,
  userId,
  onRequestSignIn,
}: IdeaBoothDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    "blueprint" | "builder_guide" | "contribute" | "community_seeds"
  >("blueprint");

  // AI Builder Guide state
  const [guidePrompt, setGuidePrompt] = useState("");
  const [guideLoading, setGuideLoading] = useState(false);
  const [guideReply, setGuideReply] = useState<ResidentReplyPayload | null>(null);

  // Contribution form state
  const [contribKind, setContribKind] = useState("experiment_proposal");
  const [contribTitle, setContribTitle] = useState("");
  const [contribBody, setContribBody] = useState("");
  const [contribSuccess, setContribSuccess] = useState(false);

  // Plant a Community Seed form state
  const [seedDescriptor, setSeedDescriptor] = useState("");
  const [seedOneLiner, setSeedOneLiner] = useState("");
  const [seedProblem, setSeedProblem] = useState("");
  const [seedSolution, setSeedSolution] = useState("");
  const [seedPlantedNotice, setSeedPlantedNotice] = useState(false);

  if (!isOpen) return null;

  const sectorIdeas = getIdeasBySector(activeIdea.sectorId);
  const currentIndex = Math.max(
    0,
    sectorIdeas.findIndex((i) => i.slug === activeIdea.slug)
  );

  const handleSwipe = (dir: -1 | 1) => {
    const nextIdx =
      (currentIndex + dir + sectorIdeas.length) % sectorIdeas.length;
    onSelectIdea(sectorIdeas[nextIdx]);
    setGuideReply(null);
  };

  const handleSwitchSector = (sectorId: SectorBoothId) => {
    const ideasInNewSector = getIdeasBySector(sectorId);
    if (ideasInNewSector.length > 0) {
      onSelectIdea(ideasInNewSector[0]);
      setGuideReply(null);
    }
  };

  const askBuilderGuide = async (customQuestion?: string) => {
    const question =
      customQuestion ||
      guidePrompt.trim() ||
      `Break down ${activeIdea.title}, key assumptions to falsify, and a 14-day wedge experiment.`;
    setGuideLoading(true);
    try {
      const res = await fetch("/api/ai/resident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "agi_builder_guide",
          message: question,
          contextIdeaSlug: activeIdea.slug,
          isSignedIn,
          userId,
          idempotencyKey: `guide-${activeIdea.slug}-${question.slice(0, 32)}-${isSignedIn}`,
        }),
      });
      const data = (await res.json()) as ResidentReplyPayload;
      setGuideReply(data);
    } finally {
      setGuideLoading(false);
    }
  };

  const isSaved = savedIdeaSlugs.includes(activeIdea.slug);
  const ideaContribs = contributionsByIdea[activeIdea.slug] || [];

  return (
    <aside
      aria-label="AGI Futures Holographic Idea Booth & Builder Panel"
      className="fixed top-16 right-4 bottom-20 z-30 flex w-[92vw] max-w-xl flex-col overflow-hidden rounded-2xl border border-emerald-400/35 bg-slate-950/92 text-slate-100 shadow-2xl backdrop-blur-xl"
    >
      {/* 1. In-Place Sector Switcher Bar (Switch Category Without Moving!) */}
      <div className="border-b border-white/10 bg-slate-900/90 px-4 py-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/brands/agi-futures-logo.png"
              alt="AGI Futures"
              className="h-4 w-auto object-contain"
            />
            <span className="rounded-full border border-emerald-400/40 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-300 uppercase">
              Curated Editorial Blueprint ({currentIndex + 1}/{sectorIdeas.length} in Sector)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Idea Booth Panel"
            className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sector Category Pills */}
        <ul
          role="list"
          aria-label="Switch holographic startup sector in place"
          className="flex flex-wrap gap-1.5"
        >
          {SECTOR_BOOTHS.map((sector) => {
            const active = sector.id === activeIdea.sectorId;
            return (
              <li key={sector.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleSwitchSector(sector.id)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                    active
                      ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {sector.title.split("&")[0].trim()}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. Hologram Swipe Header (Swipe Through Ideas in Sector in Place) */}
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-slate-950 px-4 py-3">
        <button
          type="button"
          onClick={() => handleSwipe(-1)}
          aria-label="Previous startup hologram in sector"
          className="flex cursor-pointer items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-950/50 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-900/70"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev Holo
        </button>

        <div className="px-2 text-center">
          <h2 className="text-base font-bold text-white">{activeIdea.title}</h2>
          <p className="text-xs text-emerald-300">{activeIdea.scoreTitle}</p>
        </div>

        <button
          type="button"
          onClick={() => handleSwipe(1)}
          aria-label="Next startup hologram in sector"
          className="flex cursor-pointer items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-950/50 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-900/70"
        >
          Next Holo
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Idea Dots inside current sector */}
      <div className="flex items-center justify-center gap-1.5 border-b border-white/10 bg-slate-950/80 px-4 py-1.5">
        {sectorIdeas.map((idea) => (
          <button
            key={idea.slug}
            type="button"
            onClick={() => {
              onSelectIdea(idea);
              setGuideReply(null);
            }}
            className={`cursor-pointer rounded-full px-2 py-0.5 text-[10px] transition ${
              idea.slug === activeIdea.slug
                ? "bg-emerald-400/25 font-semibold text-emerald-200 ring-1 ring-emerald-400/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {idea.title}
          </button>
        ))}
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-white/10 bg-slate-900/60 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("blueprint")}
          className={`cursor-pointer py-2.5 font-medium transition ${
            activeTab === "blueprint"
              ? "border-b-2 border-emerald-400 text-emerald-300"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Blueprint
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("builder_guide");
            if (!guideReply) askBuilderGuide();
          }}
          className={`cursor-pointer py-2.5 font-medium transition ${
            activeTab === "builder_guide"
              ? "border-b-2 border-emerald-400 text-emerald-300"
              : "text-slate-400 hover:text-white"
          }`}
        >
          AI Guide
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contribute")}
          className={`cursor-pointer py-2.5 font-medium transition ${
            activeTab === "contribute"
              ? "border-b-2 border-emerald-400 text-emerald-300"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Contribute ({ideaContribs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("community_seeds")}
          className={`cursor-pointer py-2.5 font-medium transition ${
            activeTab === "community_seeds"
              ? "border-b-2 border-amber-400 text-amber-300"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Idea Seeds
        </button>
      </div>

      {/* 4. Scrollable Content Body */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
        {activeTab === "blueprint" && (
          <>
            <p className="leading-relaxed text-slate-200">
              {activeIdea.description}
            </p>

            {/* Composite Scores & Valuation Forecast */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-[10px] tracking-wider text-slate-400 uppercase">
                  Defensible Moat
                </div>
                <div className="mt-0.5 text-lg font-bold text-emerald-300">
                  {activeIdea.scores.moat}/100
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-[10px] tracking-wider text-slate-400 uppercase">
                  Build Difficulty
                </div>
                <div className="mt-0.5 text-lg font-bold text-amber-300">
                  {activeIdea.scores.difficulty}/100
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-[10px] tracking-wider text-slate-400 uppercase">
                  Civilizational Impact
                </div>
                <div className="mt-0.5 text-lg font-bold text-sky-300">
                  {activeIdea.scores.impact}/100
                </div>
              </div>
            </div>

            {/* Expected Valuation Curve */}
            <div className="rounded-xl border border-emerald-400/25 bg-emerald-950/25 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-200">
                  AGI Futures Expected Valuation Trajectory
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                  Unicorn Median: {activeIdea.forecasts.unicornEta}
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-900/80 p-2">
                  <div className="text-[10px] text-slate-400">2030 Est.</div>
                  <div className="font-bold text-white">
                    {activeIdea.forecasts.y2030}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-2">
                  <div className="text-[10px] text-slate-400">2035 Est.</div>
                  <div className="font-bold text-emerald-300">
                    {activeIdea.forecasts.y2035}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-2">
                  <div className="text-[10px] text-slate-400">2040 Est.</div>
                  <div className="font-bold text-sky-300">
                    {activeIdea.forecasts.y2040}
                  </div>
                </div>
              </div>
            </div>

            {/* Thesis & Why Now */}
            <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-3.5">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                  Core Blueprint Thesis
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">
                  {activeIdea.thesis}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wider text-sky-300 uppercase">
                  Why Now (Enabling Inflection)
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">
                  {activeIdea.whyNow}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                  First Falsifiable Experiment
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">
                  {activeIdea.firstExperiment}
                </p>
              </div>
            </div>

            {/* Needed Builder Skills */}
            <div>
              <div className="text-xs font-semibold text-slate-400">
                High-Fit Collaborator Skills:
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {activeIdea.neededSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "builder_guide" && (
          <div className="space-y-3">
            {/* Persistent AI Resident Identification + Auth Gate Notice */}
            <div className="rounded-xl border border-emerald-400/35 bg-emerald-950/35 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                  AI RESIDENT • KAELEN (BUILDER GUIDE)
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">
                  {isSignedIn ? "Live Gemini AI Active" : "Guest Grounded Mode"}
                </span>
              </div>
              {!isSignedIn && (
                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-amber-400/30 bg-amber-950/40 px-2.5 py-1.5 text-xs text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    Sign in to unlock custom conversational Gemini AI prompts.
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onRequestSignIn(
                        `Unlock live Gemini AI Builder Guide conversations on ${activeIdea.title}`
                      )
                    }
                    className="cursor-pointer rounded bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-slate-950 hover:bg-amber-300"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {guideLoading ? (
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-xs text-slate-300">
                Synthesizing blueprint analysis for {activeIdea.title}...
              </div>
            ) : (
              guideReply && (
                <div className="space-y-3">
                  {/* Explicit Separation: Published Blueprint vs AI Builder Suggestions */}
                  <div className="rounded-xl border border-emerald-400/30 bg-slate-900/80 p-3.5">
                    <div className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                      Published AGI Futures Blueprint Summary
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200">
                      {guideReply.blueprintSeparation?.publishedSummary ||
                        activeIdea.thesis}
                    </p>
                  </div>

                  <div className="rounded-xl border border-sky-400/30 bg-sky-950/25 p-3.5">
                    <div className="text-[10px] font-bold tracking-wider text-sky-300 uppercase">
                      AI Builder Guide Suggestions (Distinct from Published Blueprint)
                    </div>
                    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-slate-200">
                      {(
                        guideReply.blueprintSeparation?.aiSuggestions ||
                        activeIdea.keyAssumptions
                      ).map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                    <div className="mt-3 rounded-lg bg-slate-950/70 p-2.5 text-xs text-emerald-200">
                      <strong>Recommended 14-Day Wedge Experiment:</strong>{" "}
                      {guideReply.blueprintSeparation?.firstExperiment ||
                        activeIdea.firstExperiment}
                    </div>
                  </div>

                  {guideReply.mode === "authenticated-gemini" && (
                    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3.5 text-xs leading-relaxed whitespace-pre-wrap text-slate-200">
                      {guideReply.replyMarkdown}
                    </div>
                  )}
                </div>
              )
            )}

            {/* Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isSignedIn) {
                  onRequestSignIn(
                    `Ask Kaelen a custom Gemini AI question about ${activeIdea.title}`
                  );
                  return;
                }
                askBuilderGuide();
              }}
              className="space-y-2 pt-1"
            >
              <label
                htmlFor="builder-guide-input"
                className="block text-xs font-medium text-slate-300"
              >
                Ask Kaelen about {activeIdea.title} assumptions, GTM wedge, or unit economics:
              </label>
              <div className="flex gap-2">
                <input
                  id="builder-guide-input"
                  type="text"
                  value={guidePrompt}
                  onChange={(e) => setGuidePrompt(e.target.value)}
                  placeholder={
                    isSignedIn
                      ? "e.g., How do we test the regulatory bottleneck in 14 days?"
                      : "Sign in to ask custom freeform Gemini questions..."
                  }
                  className="flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="flex cursor-pointer items-center gap-1 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ask
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "contribute" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3.5">
              <h3 className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                Attach Proof-of-Work or Offer Specific Help to {activeIdea.title}
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Contributions remain available asynchronously for founders and collaborators exploring this blueprint.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isSignedIn) {
                    onRequestSignIn(`Publish a contribution to ${activeIdea.title}`);
                    return;
                  }
                  if (!contribTitle.trim() || !contribBody.trim()) return;
                  onSubmitContribution({
                    ideaSlug: activeIdea.slug,
                    kind: contribKind,
                    title: contribTitle.trim(),
                    body: contribBody.trim(),
                  });
                  setContribTitle("");
                  setContribBody("");
                  setContribSuccess(true);
                  setTimeout(() => setContribSuccess(false), 3500);
                }}
                className="mt-3 space-y-2.5"
              >
                <div>
                  <label
                    htmlFor="contrib-kind"
                    className="block text-[11px] font-medium text-slate-300"
                  >
                    Contribution Type
                  </label>
                  <select
                    id="contrib-kind"
                    value={contribKind}
                    onChange={(e) => setContribKind(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="experiment_proposal">
                      14-Day Falsification Experiment Proposal
                    </option>
                    <option value="prototype_link">
                      Prototype / Technical Spec / Repo
                    </option>
                    <option value="skill_offer">
                      Specific Skill or Domain Introduction Offer
                    </option>
                    <option value="assumption_critique">
                      Constructive Assumption Critique
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contrib-title"
                    className="block text-[11px] font-medium text-slate-300"
                  >
                    Headline (max 140 chars)
                  </label>
                  <input
                    id="contrib-title"
                    type="text"
                    required
                    maxLength={140}
                    value={contribTitle}
                    onChange={(e) => setContribTitle(e.target.value)}
                    placeholder="e.g., Mojave Pilot Site & Solar Racking BOM Calculation"
                    className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contrib-body"
                    className="block text-[11px] font-medium text-slate-300"
                  >
                    Details & Verifiable Evidence
                  </label>
                  <textarea
                    id="contrib-body"
                    required
                    rows={3}
                    maxLength={2000}
                    value={contribBody}
                    onChange={(e) => setContribBody(e.target.value)}
                    placeholder="Share specific data, links, or how you can help builders tackling this blueprint..."
                    className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                {contribSuccess && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Contribution attached to {activeIdea.title} (deduplicated).
                  </div>
                )}

                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  {isSignedIn
                    ? "Post Contribution to Blueprint"
                    : "Sign In to Post Contribution"}
                </button>
              </form>
            </div>

            {/* Existing Contributions List */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">
                Builder Contributions on {activeIdea.title} ({ideaContribs.length})
              </div>
              {ideaContribs.length === 0 ? (
                <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
                  No community artifacts logged on this blueprint yet. Be the first to propose a 14-day experiment or offer domain expertise.
                </p>
              ) : (
                ideaContribs.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-emerald-300">
                      <span className="uppercase">{c.kind.replace(/_/g, " ")}</span>
                      <span className="text-slate-400">
                        by {c.author} • {c.createdAt}
                      </span>
                    </div>
                    <div className="mt-1 font-semibold text-white">{c.title}</div>
                    <p className="mt-1 text-slate-300">{c.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "community_seeds" && (
          <div className="space-y-4">
            {/* Explicit Distinction Banner per Spec Section 6 & 9 */}
            <div className="rounded-xl border border-amber-400/40 bg-amber-950/30 p-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sprout className="h-4 w-4" />
                COMMUNITY IDEA SEEDS (DISTINCT FROM EDITORIAL BLUEPRINTS)
              </div>
              <p className="mt-1 text-amber-100/85">
                Community Idea Seeds are member-submitted concepts. They publish to the Idea Seeds registry and are visually separated from AGI Futures&apos; 33 curated editorial blueprints.
              </p>
            </div>

            {/* Existing Community Idea Seeds */}
            <div className="space-y-2.5">
              {communitySeeds.map((seed) => (
                <div
                  key={seed.id}
                  className="rounded-xl border border-amber-400/25 bg-slate-900/75 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      COMMUNITY IDEA SEED
                    </span>
                    <span className="text-[10px] text-slate-400">
                      @{seed.authorHandle} • {seed.createdAt}
                    </span>
                  </div>
                  <div className="mt-1.5 font-bold text-white">
                    {seed.descriptor}
                  </div>
                  <p className="mt-0.5 text-slate-300">{seed.oneLiner}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
                    <span>World Needs This: {seed.votes.world_needs_this}</span>
                    <span>•</span>
                    <span>I&apos;d Build This: {seed.votes.id_build_this}</span>
                    <span>•</span>
                    <span>I&apos;d Use This: {seed.votes.id_use_this}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Plant a New Canonical Idea Seed */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isSignedIn) {
                  onRequestSignIn("Plant a canonical Community Idea Seed");
                  return;
                }
                if (!seedDescriptor.trim() || !seedOneLiner.trim()) return;
                onPlantSeed({
                  descriptor: seedDescriptor.trim(),
                  oneLiner: seedOneLiner.trim(),
                  problem: seedProblem.trim(),
                  solutionHypothesis: seedSolution.trim(),
                  authorName: "Habitat Builder",
                  authorHandle: "orbital_builder",
                  sectorId: activeIdea.sectorId,
                });
                setSeedDescriptor("");
                setSeedOneLiner("");
                setSeedProblem("");
                setSeedSolution("");
                setSeedPlantedNotice(true);
                setTimeout(() => setSeedPlantedNotice(false), 3500);
              }}
              className="space-y-2.5 rounded-xl border border-white/10 bg-slate-900/60 p-3.5"
            >
              <div className="text-xs font-bold text-amber-200">
                Plant a New Community Idea Seed
              </div>
              <div>
                <label
                  htmlFor="seed-descriptor"
                  className="block text-[11px] text-slate-300"
                >
                  Short Descriptor (max 80 chars)
                </label>
                <input
                  id="seed-descriptor"
                  type="text"
                  required
                  maxLength={80}
                  value={seedDescriptor}
                  onChange={(e) => setSeedDescriptor(e.target.value)}
                  placeholder="e.g., Autonomous Rooftop Rainwater Mineralization Unit"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="seed-oneliner"
                  className="block text-[11px] text-slate-300"
                >
                  One-Liner Thesis (max 280 chars)
                </label>
                <input
                  id="seed-oneliner"
                  type="text"
                  required
                  maxLength={280}
                  value={seedOneLiner}
                  onChange={(e) => setSeedOneLiner(e.target.value)}
                  placeholder="One sentence explaining why this matters..."
                  className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="seed-problem"
                  className="block text-[11px] text-slate-300"
                >
                  Core Bottleneck & Solution Wedge
                </label>
                <textarea
                  id="seed-problem"
                  required
                  rows={2}
                  value={seedProblem}
                  onChange={(e) => setSeedProblem(e.target.value)}
                  placeholder="What bottleneck does this solve and what is the first wedge?"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              {seedPlantedNotice && (
                <div className="text-xs text-amber-300">
                  ✓ Canonical Idea Seed planted (badged as Community Seed).
                </div>
              )}
              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-amber-400 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300"
              >
                {isSignedIn ? "Plant Idea Seed" : "Sign In to Plant Idea Seed"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 5. Footer Action Bar: Save Idea + Open Canonical AGI Futures Blueprint */}
      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-slate-900/90 px-4 py-3">
        <button
          type="button"
          aria-pressed={isSaved}
          onClick={() => onToggleSaveIdea(activeIdea.slug)}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
            isSaved
              ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
              : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          {isSaved ? "Saved to Folio" : "Save Blueprint"}
        </button>

        <a
          href={activeIdea.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Open Full Blueprint on AGI Futures
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
