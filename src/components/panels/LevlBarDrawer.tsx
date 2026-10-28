"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  FileText,
  Lock,
  X,
  Film,
} from "lucide-react";
import {
  LEVL_MODALITIES,
  LevlCategory,
  LevlModality,
  buildLevlDraftHandoffUrl,
} from "@/data/levl-catalog";
import {
  ProtocolDraftPreview,
  ResidentReplyPayload,
} from "@/lib/ai/deterministic-residents";

interface LevlBarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialModalitySlug?: string;
  savedDrafts: ProtocolDraftPreview[];
  onSaveDraftExplicitly: (draft: ProtocolDraftPreview) => void;
  onOpenScreeningModal: () => void;
  isSignedIn: boolean;
  userId: string;
  onRequestSignIn: (reason: string) => void;
}

const CATEGORIES: LevlCategory[] = [
  "Movement",
  "Nutrition",
  "Cognitive Focus",
  "Recovery",
];

export function LevlBarDrawer({
  isOpen,
  onClose,
  initialModalitySlug,
  savedDrafts,
  onSaveDraftExplicitly,
  onOpenScreeningModal,
  isSignedIn,
  userId,
  onRequestSignIn,
}: LevlBarDrawerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialModalitySlug || "finnish-sauna"
  );
  const [activeCategory, setActiveCategory] = useState<LevlCategory | "All">(
    "All"
  );
  const [bartenderPrompt, setBartenderPrompt] = useState("");
  const [bartenderLoading, setBartenderLoading] = useState(false);
  const [bartenderReply, setBartenderReply] =
    useState<ResidentReplyPayload | null>(null);
  const [draftSavedId, setDraftSavedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeModality: LevlModality =
    LEVL_MODALITIES.find((m) => m.slug === selectedSlug) || LEVL_MODALITIES[0];

  const filteredModalities =
    activeCategory === "All"
      ? LEVL_MODALITIES
      : LEVL_MODALITIES.filter((m) => m.category === activeCategory);

  const askBartender = async (customQuestion?: string, modSlug?: string) => {
    const slugToUse = modSlug || activeModality.slug;
    const question =
      customQuestion ||
      bartenderPrompt.trim() ||
      `What is the clinical evidence, dosing protocol, and safety profile for ${activeModality.name}?`;
    setBartenderLoading(true);
    try {
      const res = await fetch("/api/ai/resident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "levl_bartender",
          message: question,
          contextModalitySlug: slugToUse,
          isSignedIn,
          userId,
          idempotencyKey: `levl-${slugToUse}-${question.slice(0, 32)}-${isSignedIn}`,
        }),
      });
      const data = (await res.json()) as ResidentReplyPayload;
      setBartenderReply(data);
    } finally {
      setBartenderLoading(false);
    }
  };

  const currentDraft: ProtocolDraftPreview = bartenderReply?.protocolDraft || {
    draftId: `atrium-draft-${activeModality.slug}`,
    title: `${activeModality.name} — Atrium Protocol Draft`,
    goal: `${activeModality.category} & Healthspan Optimization`,
    evidenceSummary: activeModality.evidenceGrade,
    caveat:
      "Draft preview only. Saving this draft stages it for review on your LEVL Bench and never silently activates live reminders.",
    steps: [
      {
        modalitySlug: activeModality.slug,
        modalityName: activeModality.name,
        slot: activeModality.standardProtocol.timingSlot,
        dose: `${activeModality.standardProtocol.doseOrIntensity} (${activeModality.standardProtocol.duration})`,
        rationale: activeModality.headline,
      },
    ],
  };

  const isDraftSaved =
    draftSavedId === currentDraft.draftId ||
    savedDrafts.some((d) => d.draftId === currentDraft.draftId);

  const handoffUrl = buildLevlDraftHandoffUrl(currentDraft);

  return (
    <aside
      aria-label="LEVL Longevity Lounge Protocol Bar and Spa Station Inspector"
      className="fixed top-16 left-4 bottom-20 z-30 flex w-[92vw] max-w-xl flex-col overflow-hidden rounded-2xl border border-teal-400/35 bg-slate-950/92 text-slate-100 shadow-2xl backdrop-blur-xl"
    >
      {/* 1. Header with Actual Supplied LEVL Logo */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/brands/levl-logo-long.png"
            alt="LEVL Longevity Lounge"
            className="h-5 w-auto object-contain"
          />
          <span className="rounded-full border border-teal-400/40 bg-teal-950/80 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-teal-200 uppercase">
            Protocol Bar & Spa Evidence
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenScreeningModal}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-teal-400/35 bg-teal-950/60 px-2.5 py-1 text-[11px] font-medium text-teal-200 hover:bg-teal-900/80"
          >
            <Film className="h-3.5 w-3.5" />
            Screening Wall
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close LEVL Protocol Bar Panel"
            className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Category Filter Bar ("Today for You: Movement, Nutrition, Cognitive Focus, Recovery") */}
      <div className="border-b border-white/10 bg-slate-900/60 px-4 py-2">
        <ul
          role="list"
          aria-label="Filter LEVL longevity modalities by category"
          className="flex flex-wrap gap-1.5"
        >
          {(["All", ...CATEGORIES] as const).map((cat) => {
            const active = activeCategory === cat;
            return (
              <li key={cat}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-teal-400 text-slate-950 font-semibold"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Modality Station Selector Pills */}
        <ul
          role="list"
          aria-label="Select a LEVL modality or spa station"
          className="mt-2 flex gap-1.5 overflow-x-auto pb-1"
        >
          {filteredModalities.map((mod) => {
            const selected = mod.slug === activeModality.slug;
            return (
              <li key={mod.slug} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedSlug(mod.slug);
                    askBartender(
                      `Summarize the clinical evidence and standard protocol for ${mod.name}.`,
                      mod.slug
                    );
                  }}
                  className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                    selected
                      ? "border-teal-300 bg-teal-950/90 text-teal-100 shadow-sm"
                      : "border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/25"
                  }`}
                >
                  {mod.isSpaStation ? "♨ " : "• "}
                  {mod.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. Scrollable Evidence, Contraindications, Bartender Chat & Explicit Draft Card */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
        {/* Modality Evidence Card */}
        <div className="rounded-xl border border-teal-400/25 bg-slate-900/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-md bg-teal-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-teal-300">
              {activeModality.evidenceGrade}
            </span>
            {activeModality.isSpaStation && (
              <span className="text-[11px] text-amber-300">
                Virtual Spa Station (Does not log a real exposure)
              </span>
            )}
          </div>

          <h2 className="mt-2 text-base font-bold text-white">
            {activeModality.name}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-200">
            {activeModality.headline}
          </p>

          {/* Standard Protocol Parameters */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-950/80 p-3 text-xs">
            <div>
              <span className="text-slate-400">Intensity / Dose:</span>
              <div className="font-semibold text-teal-200">
                {activeModality.standardProtocol.doseOrIntensity}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Duration & Cadence:</span>
              <div className="font-semibold text-white">
                {activeModality.standardProtocol.duration} •{" "}
                {activeModality.standardProtocol.frequency}
              </div>
            </div>
          </div>

          {/* Evidence Boundaries & Contraindications */}
          <div className="mt-3 space-y-2 rounded-lg border border-amber-400/25 bg-amber-950/20 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              Evidence Boundaries, Uncertainty & Contraindications
            </div>
            <p className="text-slate-200">
              <strong>Limitations:</strong>{" "}
              {activeModality.uncertaintyAndLimits}
            </p>
            <ul className="list-disc space-y-1 pl-4 text-amber-100/90">
              {activeModality.contraindications.map((ci, idx) => (
                <li key={idx}>{ci}</li>
              ))}
            </ul>
          </div>

          {/* PubMed Citations */}
          <div className="mt-3 space-y-1.5">
            <div className="text-[11px] font-bold tracking-wider text-teal-300 uppercase">
              Verified PubMed Clinical Sources
            </div>
            {activeModality.citations.map((cit) => (
              <a
                key={cit.pmid}
                href={cit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-white/10 bg-slate-950/75 p-2.5 text-xs transition hover:border-teal-400/50"
              >
                <div className="flex items-center justify-between font-semibold text-teal-200">
                  <span>
                    PMID {cit.pmid} • {cit.journalYear}
                  </span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </div>
                <div className="mt-0.5 text-white">{cit.title}</div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {cit.findingSummary}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* AI Resident Protocol Bartender (Sora) */}
        <div className="rounded-xl border border-teal-400/35 bg-teal-950/25 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-teal-300 uppercase">
              AI RESIDENT • SORA (LEVL PROTOCOL BARTENDER)
            </span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">
              {isSignedIn ? "Private Session • Gemini AI" : "Public Catalog Mode"}
            </span>
          </div>

          {!isSignedIn && (
            <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-amber-400/30 bg-amber-950/40 px-2.5 py-1.5 text-xs text-amber-200">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 shrink-0" />
                Sign in to ask custom conversational Gemini AI questions.
              </span>
              <button
                type="button"
                onClick={() =>
                  onRequestSignIn("Unlock live Gemini AI Protocol Bartender")
                }
                className="cursor-pointer rounded bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-slate-950 hover:bg-amber-300"
              >
                Sign In
              </button>
            </div>
          )}

          {bartenderLoading && (
            <p className="mt-2.5 text-xs text-teal-200">
              Retrieving clinical evidence & protocol synergy from LEVL catalog...
            </p>
          )}

          {bartenderReply && !bartenderLoading && (
            <div className="mt-2.5 rounded-lg bg-slate-950/80 p-3 text-xs leading-relaxed whitespace-pre-wrap text-slate-200">
              {bartenderReply.replyMarkdown}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isSignedIn) {
                onRequestSignIn(
                  "Ask the LEVL Protocol Bartender a personalized Gemini AI question"
                );
                return;
              }
              askBartender();
            }}
            className="mt-3 space-y-1.5"
          >
            <label
              htmlFor="levl-bartender-input"
              className="block text-xs font-medium text-slate-300"
            >
              Ask Sora about timing, stack synergy, or clinical evidence:
            </label>
            <div className="flex gap-2">
              <input
                id="levl-bartender-input"
                type="text"
                value={bartenderPrompt}
                onChange={(e) => setBartenderPrompt(e.target.value)}
                placeholder={
                  isSignedIn
                    ? "e.g., How should I space Cold Plunge and Sauna on lifting days?"
                    : "Sign in for custom Gemini questions, or click a station pill above..."
                }
                className="flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-1 rounded-xl bg-teal-400 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask
              </button>
            </div>
          </form>
        </div>

        {/* Non-Activating Protocol Draft Preview & Explicit Save/Handoff Card */}
        <div className="rounded-xl border border-white/15 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
              <FileText className="h-4 w-4" />
              STAGEABLE LEVL PROTOCOL DRAFT (DRAFT ONLY)
            </div>
            <span className="text-[10px] text-slate-400">
              ID: {currentDraft.draftId}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-300">
            {currentDraft.caveat}
          </p>

          <div className="mt-2.5 space-y-1.5">
            {currentDraft.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/75 px-3 py-2 text-xs"
              >
                <div>
                  <span className="font-semibold text-white">
                    {step.modalityName}
                  </span>
                  <div className="text-[11px] text-slate-400">{step.dose}</div>
                </div>
                <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-medium text-teal-300">
                  {step.slot}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSaveDraftExplicitly(currentDraft);
                setDraftSavedId(currentDraft.draftId);
              }}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                isDraftSaved
                  ? "border-teal-400 bg-teal-500/20 text-teal-200"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isDraftSaved
                ? "Draft Explicitly Saved (Recoverable)"
                : "1. Explicitly Save Draft"}
            </button>

            <a
              href={handoffUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!isDraftSaved) {
                  onSaveDraftExplicitly(currentDraft);
                  setDraftSavedId(currentDraft.draftId);
                }
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-teal-300"
            >
              2. Open Draft in LEVL Bench
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
