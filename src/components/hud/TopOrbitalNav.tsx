"use client";

import React from "react";
import {
  Compass,
  Sparkles,
  Users,
  Layers,
  UserCheck,
  LogIn,
  Sliders,
  RotateCcw,
} from "lucide-react";
import {
  SPATIAL_WAYPOINTS,
  getWaypointById,
} from "@/lib/spatial/waypoint-registry";
import { QualityTier } from "@/components/spatial/OrbitalCanvas";

interface TopOrbitalNavProps {
  activeWaypointId: string;
  onSelectWaypoint: (waypointId: string) => void;
  onOpenIdeaDrawer: () => void;
  onOpenLevlDrawer: () => void;
  onOpenMatchingDrawer: () => void;
  onOpenBriefingAndDirectory: (tab: "briefing" | "concierge" | "directory") => void;
  onOpenAuthModal: () => void;
  onReplayArrival: () => void;
  isSignedIn: boolean;
  userEmail: string;
  isFocusMode: boolean;
  qualityTier: QualityTier;
  onChangeQualityTier: (tier: QualityTier) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export function TopOrbitalNav({
  activeWaypointId,
  onSelectWaypoint,
  onOpenIdeaDrawer,
  onOpenLevlDrawer,
  onOpenMatchingDrawer,
  onOpenBriefingAndDirectory,
  onOpenAuthModal,
  onReplayArrival,
  isSignedIn,
  userEmail,
  isFocusMode,
  qualityTier,
  onChangeQualityTier,
  reducedMotion,
  onToggleReducedMotion,
}: TopOrbitalNavProps) {
  const currentWp = getWaypointById(activeWaypointId);
  const focusPods = SPATIAL_WAYPOINTS.filter((w) => w.kind === "focus_pod");

  return (
    <header className="pointer-events-auto fixed top-0 right-0 left-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-slate-950/80 px-4 py-2.5 text-xs text-slate-100 backdrop-blur-xl">
      {/* Brand Title & Current Orbital Location Badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSelectWaypoint("atrium-commons")}
          className="flex cursor-pointer items-center gap-2 text-left"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fcd34d]" />
          <div>
            <span className="font-bold tracking-wider text-white uppercase">
              HyperAbundance
            </span>
            <span className="ml-2 hidden rounded bg-white/10 px-2 py-0.5 text-[10px] text-amber-200 sm:inline-block">
              {currentWp.shortLabel}
            </span>
          </div>
        </button>

        {isFocusMode && (
          <span
            role="status"
            className="rounded-full border border-sky-400/50 bg-sky-950/90 px-2.5 py-0.5 text-[10px] font-semibold text-sky-200"
          >
            ● FOCUS MODE (Interruptions Suppressed)
          </span>
        )}
      </div>

      {/* Direct Spatial Jump Navigation (Never Require Corridor Walking) */}
      <nav aria-label="Primary" className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          aria-pressed={activeWaypointId === "atrium-commons" || (currentWp.stageId === "atrium-grand" && currentWp.kind !== "focus_pod")}
          onClick={() => onSelectWaypoint("atrium-commons")}
          className={`cursor-pointer rounded-xl px-3 py-1.5 font-medium transition ${
            activeWaypointId === "atrium-commons" || (currentWp.stageId === "atrium-grand" && currentWp.kind !== "focus_pod")
              ? "bg-amber-300 text-slate-950 font-semibold shadow-[0_0_15px_rgba(252,211,77,0.35)]"
              : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          Atrium (Earth View)
        </button>

        <button
          type="button"
          aria-pressed={currentWp.stageId === "atrium-terrace"}
          onClick={() => onSelectWaypoint("atrium-rear-rotunda")}
          className={`cursor-pointer rounded-xl px-3 py-1.5 font-medium transition ${
            currentWp.stageId === "atrium-terrace"
              ? "bg-amber-300 text-slate-950 font-semibold shadow-[0_0_15px_rgba(252,211,77,0.35)]"
              : "border border-amber-300/30 bg-amber-950/40 text-amber-200 hover:bg-amber-900/50"
          }`}
          title="Flip 180° to Rear Atrium Rotunda (Space Elevator, TO BE HUMAN Portal, Alabaster Bar & DJ Terrace)"
        >
          ↻ 180° Rear Rotunda
        </button>

        {/* TO BE HUMAN Sanctuary Wing Direct Button */}
        <button
          type="button"
          aria-pressed={currentWp.wing === "tobehuman"}
          onClick={() => onSelectWaypoint("tobehuman-sanctuary")}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 font-semibold transition ${
            currentWp.wing === "tobehuman"
              ? "border-violet-300 bg-violet-300 text-slate-950 shadow-[0_0_15px_rgba(196,181,253,0.4)]"
              : "border-violet-400/35 bg-violet-950/50 text-violet-200 hover:bg-violet-900/70"
          }`}
          title="Enter the 5.5K TO BE HUMAN Consciousness & Purpose Sanctuary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>TO BE HUMAN</span>
        </button>

        {/* Earthview Bubble Pod Direct Selector */}
        <div className="relative flex items-center">
          <label htmlFor="pod-quick-jump" className="sr-only">
            Jump directly to an outward Earthview Bubble Pod
          </label>
          <select
            id="pod-quick-jump"
            value={currentWp.kind === "focus_pod" ? currentWp.id : ""}
            onChange={(e) => {
              if (e.target.value) onSelectWaypoint(e.target.value);
            }}
            className={`cursor-pointer rounded-xl border px-2.5 py-1.5 font-medium transition ${
              currentWp.kind === "focus_pod"
                ? "border-sky-300 bg-sky-400 text-slate-950 font-semibold"
                : "border-sky-400/35 bg-sky-950/50 text-sky-200 hover:bg-sky-900/60"
            }`}
          >
            <option value="" disabled>
              ◦ Earthview Pods (6)...
            </option>
            {focusPods.map((pod) => (
              <option key={pod.id} value={pod.id} className="bg-slate-950 text-white">
                {pod.shortLabel} ({pod.elevationLabel})
              </option>
            ))}
          </select>
        </div>

        {/* LEVL Longevity Wing Direct Button */}
        <button
          type="button"
          aria-pressed={currentWp.wing === "levl"}
          onClick={() => {
            if (currentWp.wing === "levl") {
              onOpenLevlDrawer();
            } else {
              onSelectWaypoint("levl-lounge-entry");
            }
          }}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 font-semibold transition ${
            currentWp.wing === "levl"
              ? "border-teal-300 bg-teal-400 text-slate-950"
              : "border-teal-400/35 bg-teal-950/50 text-teal-200 hover:bg-teal-900/70"
          }`}
          title={
            currentWp.wing === "levl"
              ? "Open LEVL Protocol Bar & Evidence Drawer"
              : "Enter the LEVL Longevity Lounge"
          }
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>LEVL Lounge</span>
          {currentWp.wing === "levl" && (
            <span className="rounded bg-slate-950/20 px-1.5 py-0.5 text-[10px]">
              Open Bar
            </span>
          )}
        </button>

        {/* AGI Futures Wing Direct Button */}
        <button
          type="button"
          aria-pressed={currentWp.wing === "agifutures"}
          onClick={() => {
            if (currentWp.wing === "agifutures") {
              onOpenIdeaDrawer();
            } else {
              onSelectWaypoint("agi-club-overview");
            }
          }}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 font-semibold transition ${
            currentWp.wing === "agifutures"
              ? "border-emerald-300 bg-emerald-400 text-slate-950"
              : "border-emerald-400/35 bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900/70"
          }`}
          title={
            currentWp.wing === "agifutures"
              ? "Open 33 Holo-Ideas & Builder Guide Drawer"
              : "Enter the AGI Futures Inventor's Club"
          }
        >
          <Compass className="h-3.5 w-3.5" />
          <span>AGI Futures Club</span>
          {currentWp.wing === "agifutures" && (
            <span className="rounded bg-slate-950/20 px-1.5 py-0.5 text-[10px]">
              33 Ideas
            </span>
          )}
        </button>

        {/* Connect / Matching Board */}
        <button
          type="button"
          onClick={() => {
            onOpenMatchingDrawer();
          }}
          className="flex cursor-pointer items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 font-medium text-slate-200 hover:bg-white/10"
        >
          <Users className="h-3.5 w-3.5 text-emerald-300" />
          <span className="hidden md:inline">Connect</span>
        </button>
      </nav>

      {/* Right Utility Controls: Briefing/2D Directory, Quality, Reduced Motion, Sign-In */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onOpenBriefingAndDirectory("directory")}
          className="flex cursor-pointer items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 font-medium text-slate-200 hover:bg-white/10"
          title="Open 2D Accessible Directory, Station Briefing & Orbital Concierge"
        >
          <Layers className="h-3.5 w-3.5 text-sky-300" />
          <span className="hidden lg:inline">Briefing & 2D Directory</span>
        </button>

        <button
          type="button"
          onClick={onReplayArrival}
          aria-label="Replay Space-Elevator Arrival Sequence"
          title="Replay Space-Elevator Ascent"
          className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Adaptive Quality Selector */}
        <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-1 xl:flex">
          <Sliders className="h-3 w-3 text-slate-400" />
          <label htmlFor="quality-tier-select" className="sr-only">
            Graphics Quality Tier
          </label>
          <select
            id="quality-tier-select"
            value={qualityTier}
            onChange={(e) => onChangeQualityTier(e.target.value as QualityTier)}
            className="cursor-pointer bg-transparent text-[11px] text-slate-200 focus:outline-none"
          >
            <option value="high" className="bg-slate-950">
              High Fidelity
            </option>
            <option value="balanced" className="bg-slate-950">
              Balanced (Default)
            </option>
            <option value="lightweight" className="bg-slate-950">
              Lightweight
            </option>
          </select>
        </div>

        <button
          type="button"
          aria-pressed={reducedMotion}
          onClick={onToggleReducedMotion}
          className={`hidden cursor-pointer rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition md:inline-block ${
            reducedMotion
              ? "border-amber-400/50 bg-amber-950/60 text-amber-200"
              : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          {reducedMotion ? "Instant Travel" : "Drift Motion"}
        </button>

        {/* Sign-In / Account Status Button */}
        <button
          type="button"
          onClick={onOpenAuthModal}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
            isSignedIn
              ? "border border-emerald-400/40 bg-emerald-950/70 text-emerald-200"
              : "bg-sky-400 text-slate-950 hover:bg-sky-300"
          }`}
        >
          {isSignedIn ? (
            <>
              <UserCheck className="h-3.5 w-3.5" />
              <span className="max-w-24 truncate">{userEmail.split("@")[0]}</span>
            </>
          ) : (
            <>
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
