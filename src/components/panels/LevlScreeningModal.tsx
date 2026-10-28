"use client";

import React, { useEffect, useState } from "react";
import { Film, VolumeX, PlayCircle, ExternalLink } from "lucide-react";
import {
  LEVL_SCREENING_PLAYLIST,
  LevlScreeningVideo,
} from "@/data/levl-catalog";
import { AccessibleModalDialog } from "@/components/ui/AccessibleModalDialog";
import { soundscapeEngine } from "@/lib/audio/soundscapeEngine";

interface LevlScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectModality: (slug: string) => void;
}

export function LevlScreeningModal({
  isOpen,
  onClose,
  onInspectModality,
}: LevlScreeningModalProps) {
  const [selectedVideo, setSelectedVideo] = useState<LevlScreeningVideo>(
    LEVL_SCREENING_PLAYLIST[0]
  );
  const [playerActive, setPlayerActive] = useState(false);

  // Automatically duck/pause background DJ music when watching a screening
  useEffect(() => {
    soundscapeEngine.setVideoScreeningActive(isOpen && playerActive);
    return () => {
      soundscapeEngine.setVideoScreeningActive(false);
    };
  }, [isOpen, playerActive]);

  return (
    <AccessibleModalDialog
      isOpen={isOpen}
      onClose={() => {
        setPlayerActive(false);
        onClose();
      }}
      title="LEVL Longevity Research Screening Wall"
      subtitle="Prerecorded research screenings • Independent audio control (Background DJ auto-pauses during playback)"
      maxWidthClass="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Compliant Visible Screening Player Area */}
        <div className="overflow-hidden rounded-xl border border-teal-400/35 bg-slate-900">
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 py-2 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-teal-300">
              <Film className="h-3.5 w-3.5" />
              SCHEDULED PRERECORDED SCREENING (NOT A LIVE BROADCAST)
            </span>
            {playerActive && (
              <span className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
                <VolumeX className="h-3 w-3" />
                Ambient DJ Auto-Ducked
              </span>
            )}
          </div>

          {playerActive ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                title={selectedVideo.title}
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0`}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center bg-gradient-to-br from-teal-950/70 via-slate-900 to-slate-950 p-6 text-center">
              <span className="rounded-full border border-teal-400/40 bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-300">
                {selectedVideo.topicTag} • {selectedVideo.durationLabel}
              </span>
              <h3 className="mt-3 max-w-xl text-lg font-bold text-white">
                {selectedVideo.title}
              </h3>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-slate-300">
                {selectedVideo.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPlayerActive(true)}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-teal-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-teal-300"
                >
                  <PlayCircle className="h-4 w-4" />
                  Load Compliant YouTube Player & Duck Ambient Audio
                </button>
                {selectedVideo.relatedModalitySlugs.map((slug) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => {
                      onClose();
                      onInspectModality(slug);
                    }}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:bg-white/10"
                  >
                    Inspect Evidence at Protocol Bar
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Previously Featured Screening Playlist */}
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Featured Screening Archive ({LEVL_SCREENING_PLAYLIST.length} Prerecorded Briefings)
          </h3>
          <ul
            role="list"
            className="mt-2.5 grid gap-2.5 sm:grid-cols-3"
          >
            {LEVL_SCREENING_PLAYLIST.map((vid) => {
              const active = vid.id === selectedVideo.id;
              return (
                <li key={vid.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedVideo(vid);
                      setPlayerActive(false);
                    }}
                    className={`flex h-full w-full cursor-pointer flex-col justify-between rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-teal-400 bg-teal-950/40"
                        : "border-white/10 bg-slate-900/70 hover:border-white/25"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-teal-300">
                        {vid.topicTag}
                      </span>
                      <div className="mt-1 text-xs font-bold text-white">
                        {vid.title}
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400">
                      {vid.durationLabel}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AccessibleModalDialog>
  );
}
