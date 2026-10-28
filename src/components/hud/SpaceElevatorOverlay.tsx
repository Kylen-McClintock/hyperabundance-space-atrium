"use client";

import React, { useEffect, useState } from "react";
import {
  Rocket,
  FastForward,
  Compass,
  Focus,
  Sparkles,
  Layers,
} from "lucide-react";

interface SpaceElevatorOverlayProps {
  phase: "welcome" | "ascending" | "in_station";
  onStartAscent: () => void;
  onSkipToDestination: (waypointId?: string) => void;
  onOpen2DDirectory: () => void;
  savedWorkspaceId: string;
  hasVisitedBefore: boolean;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export function SpaceElevatorOverlay({
  phase,
  onStartAscent,
  onSkipToDestination,
  onOpen2DDirectory,
  savedWorkspaceId,
  hasVisitedBefore,
  reducedMotion,
  onToggleReducedMotion,
}: SpaceElevatorOverlayProps) {
  const [altitudeKm, setAltitudeKm] = useState(42);

  useEffect(() => {
    if (phase !== "ascending") return;
    if (reducedMotion) {
      onSkipToDestination("atrium-commons");
      return;
    }

    const start = Date.now();
    const duration = 3600;
    const timer = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setAltitudeKm(Math.round(42 + p * 366));
      if (p >= 1) {
        clearInterval(timer);
        onSkipToDestination("atrium-commons");
      }
    }, 60);

    return () => clearInterval(timer);
  }, [phase, reducedMotion, onSkipToDestination]);

  if (phase === "in_station") return null;

  return (
    <div
      role="region"
      aria-label="HyperAbundance Orbital Atrium Arrival"
      className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/85 p-4 backdrop-blur-xs"
    >
      {phase === "welcome" ? (
        <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-slate-950/90 p-7 text-slate-100 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-amber-300/40 bg-amber-500/15 px-3 py-1 text-[11px] font-semibold tracking-widest text-amber-200 uppercase">
              HyperAbundance • Orbital Habitat (408 km LEO)
            </span>
            <div className="flex items-center gap-3">
              <img
                src="/brands/levl-logo-long.png"
                alt="LEVL"
                className="h-4 w-auto object-contain"
              />
              <span className="text-slate-600">•</span>
              <img
                src="/brands/agi-futures-logo.png"
                alt="AGI Futures"
                className="h-4 w-auto object-contain"
              />
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            HyperAbundance Community Space Atrium
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            An orbital sanctuary where ambitious builders come to do deep focused work above Earth, explore RCT-backed longevity science in the{" "}
            <strong className="text-teal-300">LEVL Lounge</strong>, and inspect 33 holographic startup blueprints in the{" "}
            <strong className="text-emerald-300">AGI Futures Inventor&apos;s Club</strong>.
          </p>

          {/* Primary Actions: Immediate Guest Exploration, Ascent, or Saved Workspace */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onStartAscent}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-amber-200 to-sky-300 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg transition hover:brightness-105"
            >
              <Rocket className="h-4 w-4" />
              Enter via Space-Elevator Ascent
            </button>

            <button
              type="button"
              onClick={() => onSkipToDestination("atrium-commons")}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <FastForward className="h-4 w-4 text-sky-300" />
              Skip Ascent → Enter Atrium Directly
            </button>
          </div>

          {/* Direct Intention Shortcuts */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 pt-2 text-xs">
            <button
              type="button"
              onClick={() => onSkipToDestination(savedWorkspaceId || "pod-earthview-1")}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-950/35 px-3 py-2.5 font-medium text-sky-200 hover:bg-sky-900/50"
            >
              <Focus className="h-3.5 w-3.5" />
              {hasVisitedBefore ? "Return to My Pod" : "Focus in Earthview Pod"}
            </button>

            <button
              type="button"
              onClick={() => onSkipToDestination("levl-protocol-bar")}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-teal-400/30 bg-teal-950/35 px-3 py-2.5 font-medium text-teal-200 hover:bg-teal-900/50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              LEVL Protocol Bar
            </button>

            <button
              type="button"
              onClick={() => onSkipToDestination("agi-holo-table")}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-950/35 px-3 py-2.5 font-medium text-emerald-200 hover:bg-emerald-900/50"
            >
              <Compass className="h-3.5 w-3.5" />
              AGI Futures Booths
            </button>
          </div>

          {/* Lightweight 2D Option & Reduced Motion Toggle */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => {
                onSkipToDestination("atrium-commons");
                onOpen2DDirectory();
              }}
              className="flex cursor-pointer items-center gap-1.5 font-medium text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              <Layers className="h-3.5 w-3.5 text-sky-300" />
              Open Lightweight 2D Directory Mode (Mobile / Low-Power Friendly)
            </button>

            <button
              type="button"
              aria-pressed={reducedMotion}
              onClick={onToggleReducedMotion}
              className="cursor-pointer rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
            >
              Reduced Motion / Instant Travel: {reducedMotion ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      ) : (
        /* Space-Elevator Ascent Progress HUD with Prominent Skip Control */
        <div className="w-full max-w-md rounded-2xl border border-sky-400/40 bg-slate-950/90 p-6 text-center text-white shadow-2xl backdrop-blur-xl">
          <div className="text-[11px] font-bold tracking-widest text-sky-300 uppercase">
            Orbital Tether Ascent in Progress
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-amber-200">
            {altitudeKm} km
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Stratospheric clouds falling away • Approaching HyperAbundance Orbital Ring
          </p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-amber-300 transition-all duration-100"
              style={{ width: `${Math.min(100, ((altitudeKm - 42) / 366) * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => onSkipToDestination("atrium-commons")}
            className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/20"
          >
            <FastForward className="h-3.5 w-3.5" />
            Skip Ascent Now
          </button>
        </div>
      )}
    </div>
  );
}
