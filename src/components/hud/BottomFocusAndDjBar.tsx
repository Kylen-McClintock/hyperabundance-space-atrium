"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  CheckCircle2,
  Plus,
  Volume2,
  VolumeX,
  Music,
  Sliders,
  CornerUpLeft,
  ExternalLink,
  Info,
} from "lucide-react";
import { FocusSessionState } from "@/hooks/useFocusSession";
import {
  DJ_TRACK_CATALOG,
  DjMood,
  soundscapeEngine,
} from "@/lib/audio/soundscapeEngine";

interface BottomFocusAndDjBarProps {
  focusSession: FocusSessionState;
  onStartFocus: (opts: {
    mode: "timed" | "untimed";
    durationMinutes: number;
    intention: string;
    shareIntentionPublicly: boolean;
  }) => void;
  onTogglePauseFocus: () => void;
  onExtendFocus: (minutes: number) => void;
  onEndFocus: (markCompleted: boolean) => void;
  onUpdateFocusPrefs: (
    patch: Partial<
      Pick<
        FocusSessionState,
        | "intention"
        | "shareIntentionPublicly"
        | "durationMinutes"
        | "mode"
        | "workspaceWaypointId"
      >
    >
  ) => void;
  onReturnToMyWorkspace: () => void;
  activeWaypointId: string;
}

function formatDurationMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function BottomFocusAndDjBar({
  focusSession,
  onStartFocus,
  onTogglePauseFocus,
  onExtendFocus,
  onEndFocus,
  onUpdateFocusPrefs,
  onReturnToMyWorkspace,
  activeWaypointId,
}: BottomFocusAndDjBarProps) {
  // Audio state
  const [audioStarted, setAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [djMood, setDjMood] = useState<DjMood>("deep-focus");
  const [musicVol, setMusicVol] = useState(0.5);
  const [ambientVol, setAmbientVol] = useState(0.35);
  const [uiVol, setUiVol] = useState(0.5);
  const [showMixer, setShowMixer] = useState(false);
  const [showFocusSetup, setShowFocusSetup] = useState(false);

  const handleToggleAudio = () => {
    if (!audioStarted) {
      soundscapeEngine.start(djMood);
      soundscapeEngine.setVolumes({
        music: musicVol,
        ambient: ambientVol,
        ui: uiVol,
        muted: false,
      });
      setAudioStarted(true);
      setIsMuted(false);
    } else {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      soundscapeEngine.setVolumes({ muted: nextMute });
    }
  };

  const handleChangeMood = (nextMood: DjMood) => {
    setDjMood(nextMood);
    if (!audioStarted) {
      soundscapeEngine.start(nextMood);
      setAudioStarted(true);
      setIsMuted(false);
    } else {
      soundscapeEngine.setMood(nextMood);
    }
  };

  const currentTrack = DJ_TRACK_CATALOG[djMood];
  const isAtSavedWorkspace =
    activeWaypointId === focusSession.workspaceWaypointId;

  return (
    <footer className="pointer-events-auto fixed right-0 bottom-0 left-0 z-20 border-t border-white/10 bg-slate-950/88 px-4 py-2.5 text-xs text-slate-100 backdrop-blur-xl">
      {/* Expandable Focus Session Configuration Popover */}
      {showFocusSetup && (
        <div className="mb-2.5 rounded-2xl border border-sky-400/35 bg-slate-900/95 p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-200">
              Configure Orbital Focus Session (Private by Default)
            </span>
            <button
              type="button"
              onClick={() => setShowFocusSetup(false)}
              className="cursor-pointer text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {/* Intention Input */}
            <div className="sm:col-span-2">
              <label
                htmlFor="focus-intention-input"
                className="block text-[11px] font-medium text-slate-300"
              >
                Work Intention (Stored Privately unless Explicitly Shared)
              </label>
              <input
                id="focus-intention-input"
                type="text"
                maxLength={140}
                value={focusSession.intention}
                onChange={(e) =>
                  onUpdateFocusPrefs({ intention: e.target.value })
                }
                placeholder="e.g., Draft system architecture spec in Cursor / VS Code..."
                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-white"
              />
              <label className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  checked={focusSession.shareIntentionPublicly}
                  onChange={(e) =>
                    onUpdateFocusPrefs({
                      shareIntentionPublicly: e.target.checked,
                    })
                  }
                />
                Deliberately share this intention on my public Member Banner
              </label>
            </div>

            {/* Duration Presets */}
            <div>
              <span className="block text-[11px] font-medium text-slate-300">
                Session Mode & Duration
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    aria-pressed={
                      focusSession.mode === "timed" &&
                      focusSession.durationMinutes === mins
                    }
                    onClick={() =>
                      onUpdateFocusPrefs({
                        mode: "timed",
                        durationMinutes: mins,
                      })
                    }
                    className={`cursor-pointer rounded-lg px-2.5 py-1.5 font-semibold ${
                      focusSession.mode === "timed" &&
                      focusSession.durationMinutes === mins
                        ? "bg-sky-400 text-slate-950"
                        : "border border-white/15 bg-white/5 text-slate-300"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
                <button
                  type="button"
                  aria-pressed={focusSession.mode === "untimed"}
                  onClick={() => onUpdateFocusPrefs({ mode: "untimed" })}
                  className={`cursor-pointer rounded-lg px-2.5 py-1.5 font-semibold ${
                    focusSession.mode === "untimed"
                      ? "bg-sky-400 text-slate-950"
                      : "border border-white/15 bg-white/5 text-slate-300"
                  }`}
                >
                  Untimed Flow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expandable 3-Channel Audio Mixer & Rights Attribution Popover */}
      {showMixer && (
        <div className="mb-2.5 rounded-2xl border border-amber-300/35 bg-slate-900/95 p-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                AI RESIDENT DJ • PERSONAL SOUNDSCAPE MIXER
              </span>
              <div className="text-xs font-bold text-white">
                {currentTrack.title} ({currentTrack.bpm} BPM)
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Info className="h-3 w-3" />
                License: {currentTrack.license}
              </div>
            </div>

            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
            >
              Personal Spotify Link
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="vol-music"
                className="flex justify-between text-[11px] text-slate-300"
              >
                <span>DJ Music Synth Layer</span>
                <span>{Math.round(musicVol * 100)}%</span>
              </label>
              <input
                id="vol-music"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={musicVol}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setMusicVol(v);
                  soundscapeEngine.setVolumes({ music: v });
                }}
                className="mt-1 w-full accent-amber-300"
              />
            </div>

            <div>
              <label
                htmlFor="vol-ambient"
                className="flex justify-between text-[11px] text-slate-300"
              >
                <span>Orbital Room Ambience</span>
                <span>{Math.round(ambientVol * 100)}%</span>
              </label>
              <input
                id="vol-ambient"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={ambientVol}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setAmbientVol(v);
                  soundscapeEngine.setVolumes({ ambient: v });
                }}
                className="mt-1 w-full accent-sky-300"
              />
            </div>

            <div>
              <label
                htmlFor="vol-ui"
                className="flex justify-between text-[11px] text-slate-300"
              >
                <span>Arrival & Timer Chimes</span>
                <span>{Math.round(uiVol * 100)}%</span>
              </label>
              <input
                id="vol-ui"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={uiVol}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setUiVol(v);
                  soundscapeEngine.setVolumes({ ui: v });
                }}
                className="mt-1 w-full accent-emerald-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* LEFT: Focus Timer & "Return to My Workspace" */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-sky-400/35 bg-slate-900/90 px-3 py-1.5">
            <span className="font-mono text-sm font-bold text-sky-300">
              {focusSession.mode === "timed"
                ? formatDurationMs(focusSession.remainingMs)
                : formatDurationMs(focusSession.elapsedMs)}
            </span>

            {!focusSession.isActive ? (
              <button
                type="button"
                onClick={() =>
                  onStartFocus({
                    mode: focusSession.mode,
                    durationMinutes: focusSession.durationMinutes,
                    intention: focusSession.intention,
                    shareIntentionPublicly: focusSession.shareIntentionPublicly,
                  })
                }
                className="flex cursor-pointer items-center gap-1 rounded-lg bg-sky-400 px-2.5 py-1 font-semibold text-slate-950 hover:bg-sky-300"
              >
                <Play className="h-3 w-3 fill-current" />
                Start Focus
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onTogglePauseFocus}
                  className="cursor-pointer rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-white hover:bg-white/20"
                  title={focusSession.isPaused ? "Resume" : "Pause"}
                >
                  {focusSession.isPaused ? (
                    <Play className="h-3 w-3" />
                  ) : (
                    <Pause className="h-3 w-3" />
                  )}
                </button>
                {focusSession.mode === "timed" && (
                  <button
                    type="button"
                    onClick={() => onExtendFocus(15)}
                    className="flex cursor-pointer items-center rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-200 hover:bg-white/15"
                    title="Extend Focus Session by 15 minutes"
                  >
                    <Plus className="h-3 w-3" />
                    15m
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEndFocus(true)}
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Complete
                </button>
              </div>
            )}

            <button
              type="button"
              aria-expanded={showFocusSetup}
              onClick={() => setShowFocusSetup((v) => !v)}
              className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
            >
              {focusSession.intention
                ? `Intention: ${focusSession.intention.slice(0, 22)}...`
                : "Set Intention / Timer"}
            </button>
          </div>

          {/* 1-Click "Return to My Workspace" Button (Spec Section 5B) */}
          <button
            type="button"
            onClick={onReturnToMyWorkspace}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 font-medium transition ${
              isAtSavedWorkspace
                ? "border-sky-400/30 bg-sky-950/40 text-sky-200"
                : "border-amber-300/50 bg-amber-950/60 text-amber-100 hover:bg-amber-900/70"
            }`}
          >
            <CornerUpLeft className="h-3.5 w-3.5" />
            {isAtSavedWorkspace
              ? "In Saved Workspace"
              : "Return to My Workspace"}
          </button>

          {focusSession.completedSessionsCount > 0 && (
            <span className="hidden text-[11px] text-emerald-300 lg:inline">
              ✓ {focusSession.completedSessionsCount} session
              {focusSession.completedSessionsCount > 1 ? "s" : ""} completed
            </span>
          )}
        </div>

        {/* RIGHT: AI Resident DJ Moods & Independent Audio Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            aria-pressed={audioStarted && !isMuted}
            onClick={handleToggleAudio}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
              audioStarted && !isMuted
                ? "bg-amber-300 text-slate-950"
                : "border border-amber-300/40 bg-amber-950/50 text-amber-200 hover:bg-amber-900/70"
            }`}
          >
            {audioStarted && !isMuted ? (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                Sound On
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                {audioStarted ? "Muted" : "Enable DJ Sound"}
              </>
            )}
          </button>

          {/* 4 AI DJ Mood Buttons */}
          <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1 sm:flex">
            <Music className="ml-1.5 h-3 w-3 text-amber-300" />
            {(
              [
                { id: "deep-focus", label: "Deep Focus" },
                { id: "calm", label: "Calm" },
                { id: "energetic", label: "Builder Flow" },
                { id: "night-horizon", label: "Night Horizon" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={djMood === m.id}
                onClick={() => handleChangeMood(m.id)}
                className={`cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                  djMood === m.id
                    ? "bg-amber-300/25 font-semibold text-amber-200"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-expanded={showMixer}
            onClick={() => setShowMixer((v) => !v)}
            aria-label="Open 3-Channel Soundscape Volume Mixer and License Attribution"
            className="flex cursor-pointer items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-slate-200 hover:bg-white/10"
          >
            <Sliders className="h-3.5 w-3.5 text-amber-300" />
            <span className="hidden md:inline">Mixer</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
