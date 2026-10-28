"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Sparkles,
  Compass,
  Film,
  Users,
  Layers,
  ExternalLink,
  Volume2,
  Eye,
} from "lucide-react";
import type { QualityTier } from "@/components/spatial/OrbitalCanvas";
import {
  SPATIAL_WAYPOINTS,
  getWaypointById,
} from "@/lib/spatial/waypoint-registry";
import {
  AGI_FUTURES_IDEAS,
  AgiFuturesIdea,
  INITIAL_COMMUNITY_SEEDS,
  CommunityIdeaSeed,
  SECTOR_BOOTHS,
  SectorBoothId,
  getIdeasBySector,
} from "@/data/agifutures-catalog";
import { INITIAL_MEMBER_BANNERS, MemberBannerRecord } from "@/data/station-briefing";
import { ProtocolDraftPreview } from "@/lib/ai/deterministic-residents";
import { useFocusSession } from "@/hooks/useFocusSession";
import { soundscapeEngine } from "@/lib/audio/soundscapeEngine";
import { SpaceElevatorOverlay } from "@/components/hud/SpaceElevatorOverlay";
import { TopOrbitalNav } from "@/components/hud/TopOrbitalNav";
import { BottomFocusAndDjBar } from "@/components/hud/BottomFocusAndDjBar";
import {
  AuthAndLinksModal,
  ConnectedAccountsState,
} from "@/components/hud/AuthAndLinksModal";
import { IdeaBoothDrawer } from "@/components/panels/IdeaBoothDrawer";
import { LevlBarDrawer } from "@/components/panels/LevlBarDrawer";
import { LevlScreeningModal } from "@/components/panels/LevlScreeningModal";
import { MemberMatchingDrawer } from "@/components/panels/MemberMatchingDrawer";
import { ConciergeAndBriefingModal } from "@/components/panels/ConciergeAndBriefingModal";

const OrbitalCanvas = dynamic(
  () =>
    import("@/components/spatial/OrbitalCanvas").then((mod) => mod.OrbitalCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#030712] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          <span className="text-xs font-medium tracking-widest uppercase text-sky-300">
            Initializing Orbital Habitat Viewport...
          </span>
        </div>
      </div>
    ),
  }
);

export function AtriumExperienceClient() {
  // 1. Arrival & Navigation State
  const [arrivalPhase, setArrivalPhase] = useState<
    "welcome" | "ascending" | "in_station"
  >("in_station");
  const [hasVisitedBefore, setHasVisitedBefore] = useState(true);
  const [activeWaypointId, setActiveWaypointId] = useState<string>("atrium-commons");
  const [isRoomCardExpanded, setIsRoomCardExpanded] = useState(false);
  const [qualityTier, setQualityTier] = useState<QualityTier>("high");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  // 2. Auth & Sister Platform Links State
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("builder@hyperabundance.org");
  const [userId, setUserId] = useState("guest-visitor");
  const [connectedAccounts, setConnectedAccounts] =
    useState<ConnectedAccountsState>({
      levlConnected: false,
      agiFuturesConnected: false,
      discordShareEnabled: false,
    });

  // 3. AGI Futures State (Active Idea, Sector Booth Map, Saved Ideas, Community Seeds, Contributions)
  const [activeIdea, setActiveIdea] = useState<AgiFuturesIdea>(
    AGI_FUTURES_IDEAS[0]
  );
  const [sectorIdeaMap, setSectorIdeaMap] = useState<
    Record<SectorBoothId, AgiFuturesIdea>
  >(() => {
    const initial = {} as Record<SectorBoothId, AgiFuturesIdea>;
    for (const booth of SECTOR_BOOTHS) {
      const ideas = getIdeasBySector(booth.id);
      initial[booth.id] = ideas[0] || AGI_FUTURES_IDEAS[0];
    }
    return initial;
  });
  const [savedIdeaSlugs, setSavedIdeaSlugs] = useState<string[]>([
    "autonomous-clinical-trial-orchestrator",
    "epigenetic-clock-therapeutics-foundry",
  ]);
  const [communitySeeds, setCommunitySeeds] = useState<CommunityIdeaSeed[]>(
    INITIAL_COMMUNITY_SEEDS
  );
  const [contributionsByIdea, setContributionsByIdea] = useState<
    Record<
      string,
      {
        id: string;
        author: string;
        kind: string;
        title: string;
        body: string;
        createdAt: string;
      }[]
    >
  >({
    "autonomous-clinical-trial-orchestrator": [
      {
        id: "contrib-1",
        author: "Maya Lin (Orbital Fellow)",
        kind: "Milestone Critique",
        title: "Use federated EHR adapters at site onboarding",
        body: "Connecting directly to Epic FHIR sandboxes cuts site activation latency from 14 weeks to 11 days.",
        createdAt: "2h ago",
      },
    ],
  });

  // 4. LEVL Longevity State
  const [initialLevlModalitySlug, setInitialLevlModalitySlug] = useState<
    string | undefined
  >(undefined);
  const [savedDrafts, setSavedDrafts] = useState<ProtocolDraftPreview[]>([]);

  // 5. Member Matching Banners State
  const [memberBanners, setMemberBanners] = useState<MemberBannerRecord[]>(
    INITIAL_MEMBER_BANNERS
  );
  const [sentIntros, setSentIntros] = useState<Record<string, string[]>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);

  // 6. Drawers & Modals Open State
  const [isIdeaDrawerOpen, setIsIdeaDrawerOpen] = useState(false);
  const [isLevlDrawerOpen, setIsLevlDrawerOpen] = useState(false);
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  const [isMatchingDrawerOpen, setIsMatchingDrawerOpen] = useState(false);
  const [isConciergeModalOpen, setIsConciergeModalOpen] = useState(false);
  const [conciergeTab, setConciergeTab] = useState<
    "briefing" | "concierge" | "directory"
  >("briefing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState<string | undefined>(
    undefined
  );

  // 7. Focus Session Hook
  const handleFocusComplete = useCallback(() => {
    soundscapeEngine.playUiChime("complete");
    setLiveAnnouncement(
      "Orbital Focus Session completed. Great work in the Habitat."
    );
  }, []);

  const {
    session: focusSession,
    startSession,
    togglePause,
    extendSession,
    completeOrEndSession,
    updatePreferences,
  } = useFocusSession(handleFocusComplete);

  // 8. Hydrate visitor preferences from localStorage & OS reduced-motion media query
  useEffect(() => {
    try {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mql.matches) {
        setReducedMotion(true);
      }

      const visited = localStorage.getItem("hyperabundance_visited_v1");
      if (visited === "true") {
        setHasVisitedBefore(true);
      }

      const savedAuth = localStorage.getItem("hyperabundance_auth_v1");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.isSignedIn) {
          setIsSignedIn(true);
          setUserEmail(parsed.userEmail || "builder@hyperabundance.org");
          setUserId(parsed.userId || "member-orbital-1");
        }
        if (parsed.connectedAccounts) {
          setConnectedAccounts(parsed.connectedAccounts);
        }
      }

      const savedIdeasRaw = localStorage.getItem("hyperabundance_saved_ideas_v1");
      if (savedIdeasRaw) {
        setSavedIdeaSlugs(JSON.parse(savedIdeasRaw));
      }

      const savedDraftsRaw = localStorage.getItem("hyperabundance_levl_drafts_v1");
      if (savedDraftsRaw) {
        setSavedDrafts(JSON.parse(savedDraftsRaw));
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  // 9. Update room ambient audio zone when waypoint changes
  const activeWaypoint = useMemo(
    () => getWaypointById(activeWaypointId),
    [activeWaypointId]
  );

  const handleSelectWaypoint = useCallback(
    (waypointId: string) => {
      const wp = getWaypointById(waypointId);
      setActiveWaypointId(waypointId);
      soundscapeEngine.setWing(wp.wing);
      soundscapeEngine.playUiChime("arrive");
      setLiveAnnouncement(`Navigated to ${wp.label} in ${wp.wing.toUpperCase()} wing.`);
    },
    []
  );

  // 10. Space Elevator Arrival Handlers
  const handleStartAscent = useCallback(() => {
    setArrivalPhase("ascending");
    soundscapeEngine.playUiChime("arrive");
    localStorage.setItem("hyperabundance_visited_v1", "true");
    setHasVisitedBefore(true);
  }, []);

  const handleSkipToDestination = useCallback(
    (waypointId?: string) => {
      const targetId = waypointId || "atrium-commons";
      setArrivalPhase("in_station");
      handleSelectWaypoint(targetId);
      localStorage.setItem("hyperabundance_visited_v1", "true");
      setHasVisitedBefore(true);
    },
    [handleSelectWaypoint]
  );

  // 11. Selecting an AGI Futures Idea updates both activeIdea and its Sector Booth hologram in place
  const handleSelectIdea = useCallback((idea: AgiFuturesIdea) => {
    setActiveIdea(idea);
    setSectorIdeaMap((prev) => ({
      ...prev,
      [idea.sectorId]: idea,
    }));
  }, []);

  const handleOpenIdeaDrawer = useCallback(
    (idea?: AgiFuturesIdea) => {
      if (idea) {
        handleSelectIdea(idea);
      }
      setIsIdeaDrawerOpen(true);
    },
    [handleSelectIdea]
  );

  const handleToggleSaveIdea = useCallback((slug: string) => {
    setSavedIdeaSlugs((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem("hyperabundance_saved_ideas_v1", JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const handlePlantSeed = useCallback(
    (
      seed: Omit<
        CommunityIdeaSeed,
        "id" | "slug" | "createdAt" | "votes" | "isEditorialBlueprint"
      >
    ) => {
      const newSeed: CommunityIdeaSeed = {
        ...seed,
        id: `seed-${Date.now()}`,
        slug: seed.descriptor
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        createdAt: "Just now",
        votes: {
          world_needs_this: 1,
          id_build_this: 1,
          id_fund_this: 0,
          id_use_this: 0,
        },
        isEditorialBlueprint: false,
      };
      setCommunitySeeds((prev) => [newSeed, ...prev]);
      setLiveAnnouncement(`Planted community idea seed: ${seed.descriptor}`);
    },
    []
  );

  const handleSubmitContribution = useCallback(
    (payload: { ideaSlug: string; kind: string; title: string; body: string }) => {
      setContributionsByIdea((prev) => {
        const list = prev[payload.ideaSlug] || [];
        return {
          ...prev,
          [payload.ideaSlug]: [
            {
              id: `contrib-${Date.now()}`,
              author: isSignedIn ? userEmail.split("@")[0] : "Habitat Member",
              kind: payload.kind,
              title: payload.title,
              body: payload.body,
              createdAt: "Just now",
            },
            ...list,
          ],
        };
      });
      setLiveAnnouncement(`Added builder note to ${payload.ideaSlug}`);
    },
    [isSignedIn, userEmail]
  );

  // 12. LEVL Bar Handlers
  const handleOpenLevlDrawer = useCallback((modalitySlug?: string) => {
    if (modalitySlug) {
      setInitialLevlModalitySlug(modalitySlug);
    }
    setIsLevlDrawerOpen(true);
  }, []);

  const handleSaveLevlDraft = useCallback((draft: ProtocolDraftPreview) => {
    setSavedDrafts((prev) => {
      const next = [draft, ...prev];
      try {
        localStorage.setItem("hyperabundance_levl_drafts_v1", JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
    setLiveAnnouncement(`Saved LEVL protocol draft: ${draft.title}`);
  }, []);

  // 13. Member Matching Handlers
  const handleSaveOwnBanner = useCallback(
    (banner: {
      displayName: string;
      roleTag: string;
      building: string;
      lookingFor: string;
      canHelpWith: string;
      linkedIdeaSlug?: string;
      isVisible: boolean;
    }) => {
      if (!banner.isVisible) {
        setMemberBanners((prev) => prev.filter((b) => b.id !== "own-member-banner"));
        setLiveAnnouncement("Hidden your Member Matching Banner.");
        return;
      }
      const newRecord: MemberBannerRecord = {
        id: "own-member-banner",
        displayName: banner.displayName,
        handle: `@${banner.displayName.toLowerCase().replace(/[^a-z0-9]/g, "") || "builder"}`,
        roleTag: banner.roleTag,
        avatarColor: "#38bdf8",
        currentDestination: activeWaypoint.label,
        presenceStatus: focusSession.isActive ? "focus" : "available",
        building: banner.building,
        lookingFor: banner.lookingFor,
        canHelpWith: banner.canHelpWith,
        linkedIdeaSlug: banner.linkedIdeaSlug,
        sectorTags: [
          activeWaypoint.wing === "levl" ? "Longevity & Biotech" : "AGI Futures",
        ],
        isCurrentUser: true,
      };
      setMemberBanners((prev) => [
        newRecord,
        ...prev.filter((b) => b.id !== "own-member-banner"),
      ]);
      setLiveAnnouncement("Updated your Member Matching Banner in the Habitat.");
    },
    [activeWaypoint.label, activeWaypoint.wing, focusSession.isActive]
  );

  const handleSendAsyncIntro = useCallback((recipientId: string, message: string) => {
    setSentIntros((prev) => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), message],
    }));
    setLiveAnnouncement("Sent asynchronous intro note.");
  }, []);

  const handleBlockMember = useCallback((memberId: string) => {
    setBlockedIds((prev) => [...prev, memberId]);
  }, []);

  const handleReportMember = useCallback((_memberId: string, _reason: string) => {
    setLiveAnnouncement("Member report logged for station moderation.");
  }, []);

  // 14. Auth & Account Link Handlers
  const handleRequestSignIn = useCallback((reason: string) => {
    setAuthPromptReason(reason);
    setIsAuthModalOpen(true);
  }, []);

  const handleSignInSuccess = useCallback(
    (email: string) => {
      const cleanEmail = email.trim() || "builder@hyperabundance.org";
      const nextUserId = `user-${cleanEmail.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
      setIsSignedIn(true);
      setUserEmail(cleanEmail);
      setUserId(nextUserId);
      setAuthPromptReason(undefined);
      try {
        localStorage.setItem(
          "hyperabundance_auth_v1",
          JSON.stringify({
            isSignedIn: true,
            userEmail: cleanEmail,
            userId: nextUserId,
            connectedAccounts,
          })
        );
      } catch {
        // Ignore
      }
      setLiveAnnouncement(`Signed into Habitat Pass as ${cleanEmail}. Live Gemini AI Residents unlocked.`);
    },
    [connectedAccounts]
  );

  const handleSignOut = useCallback(() => {
    setIsSignedIn(false);
    setUserId("guest-visitor");
    try {
      localStorage.removeItem("hyperabundance_auth_v1");
    } catch {
      // Ignore
    }
    setLiveAnnouncement("Signed out of Habitat Pass.");
  }, []);

  const handleToggleAccountLink = useCallback(
    (provider: keyof ConnectedAccountsState) => {
      setConnectedAccounts((prev) => {
        const next = { ...prev, [provider]: !prev[provider] };
        try {
          localStorage.setItem(
            "hyperabundance_auth_v1",
            JSON.stringify({
              isSignedIn,
              userEmail,
              userId,
              connectedAccounts: next,
            })
          );
        } catch {
          // Ignore
        }
        return next;
      });
    },
    [isSignedIn, userEmail, userId]
  );

  // Filter out blocked members
  const visibleBanners = useMemo(
    () => memberBanners.filter((b) => !blockedIds.includes(b.id)),
    [memberBanners, blockedIds]
  );

  return (
    <main
      id="content"
      tabIndex={-1}
      className="relative h-screen w-screen overflow-hidden bg-[#030712] select-none"
    >
      {/* Screen-Reader Polite Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* 3D Orbital Station Canvas */}
      <OrbitalCanvas
        activeWaypointId={activeWaypointId}
        onSelectWaypoint={handleSelectWaypoint}
        activeIdea={activeIdea}
        sectorIdeaMap={sectorIdeaMap}
        onOpenIdeaDrawer={handleOpenIdeaDrawer}
        onOpenLevlDrawer={handleOpenLevlDrawer}
        onOpenScreeningModal={() => setIsScreeningModalOpen(true)}
        onOpenMatchingDrawer={() => setIsMatchingDrawerOpen(true)}
        onOpenConciergeDrawer={() => {
          setConciergeTab("concierge");
          setIsConciergeModalOpen(true);
        }}
        isFocusMode={focusSession.isActive && !focusSession.isPaused}
        reducedMotion={reducedMotion}
        qualityTier={qualityTier}
      />

      {/* Top Orbital Navigation & Room/Pod Switcher */}
      <TopOrbitalNav
        activeWaypointId={activeWaypointId}
        onSelectWaypoint={handleSelectWaypoint}
        onOpenIdeaDrawer={() => setIsIdeaDrawerOpen(true)}
        onOpenLevlDrawer={() => setIsLevlDrawerOpen(true)}
        onOpenMatchingDrawer={() => setIsMatchingDrawerOpen(true)}
        onOpenBriefingAndDirectory={(tab) => {
          setConciergeTab(tab);
          setIsConciergeModalOpen(true);
        }}
        onOpenAuthModal={() => {
          setAuthPromptReason(undefined);
          setIsAuthModalOpen(true);
        }}
        onReplayArrival={() => setArrivalPhase("welcome")}
        isSignedIn={isSignedIn}
        userEmail={userEmail}
        isFocusMode={focusSession.isActive && !focusSession.isPaused}
        qualityTier={qualityTier}
        onChangeQualityTier={setQualityTier}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
      />

      {/* Compact Collapsible Room Badge & Quick Actions (Top-Left Below Nav) */}
      <aside
        aria-label="Current Room Context and Quick Actions"
        className={`pointer-events-auto fixed top-16 left-4 z-20 hidden rounded-2xl border border-white/15 bg-slate-950/68 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:block ${
          isRoomCardExpanded ? "w-80 p-3.5" : "w-auto px-3 py-2"
        } ${
          focusSession.isActive && !focusSession.isPaused
            ? "opacity-35 hover:opacity-95"
            : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsRoomCardExpanded((prev) => !prev)}
            className="flex cursor-pointer items-center gap-2 text-left"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/35 bg-sky-500/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-sky-200">
              <Compass className="h-3 w-3" />
              {activeWaypoint.shortLabel}
            </span>
            <span className="text-[11px] font-medium text-slate-300 hover:text-white">
              {isRoomCardExpanded ? "Hide Info ▴" : "Room Info & Actions ▾"}
            </span>
          </button>
          <span className="text-[10px] text-slate-400">418 km LEO</span>
        </div>

        {isRoomCardExpanded && (
          <div className="mt-2.5 border-t border-white/10 pt-2.5">
            <h1 className="text-sm font-semibold text-white">
              {activeWaypoint.label}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {activeWaypoint.description}
            </p>

            {/* Contextual Quick Triggers Based on Wing */}
            <div className="mt-3 grid grid-cols-1 gap-1.5">
              {activeWaypoint.wing === "agifutures" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsIdeaDrawerOpen(true)}
                    className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-left text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/25"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                      Inspect Hologram ({activeIdea.title})
                    </span>
                    <span className="text-[10px] text-emerald-300/80">33 Ideas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMatchingDrawerOpen(true)}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-sky-300" />
                      Co-Founder & Builder Matching
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {visibleBanners.length} Active
                    </span>
                  </button>
                </>
              ) : activeWaypoint.wing === "levl" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsLevlDrawerOpen(true)}
                    className="flex items-center justify-between rounded-xl border border-teal-400/30 bg-teal-500/15 px-3 py-2 text-left text-xs font-medium text-teal-200 transition hover:bg-teal-500/25"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                      Open LEVL Protocol Bar & Spa
                    </span>
                    <span className="text-[10px] text-teal-300/80">mylevl.ai</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsScreeningModalOpen(true)}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Film className="h-3.5 w-3.5 text-amber-300" />
                      Watch Research Screening Wall
                    </span>
                    <span className="text-[10px] text-slate-400">Auto-Ducks DJ</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectWaypoint("levl-lounge-entry")}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-400/25 bg-teal-500/10 px-2.5 py-2 text-xs font-medium text-teal-200 transition hover:bg-teal-500/20"
                    >
                      LEVL Wing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectWaypoint("agi-club-overview")}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-2 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/20"
                    >
                      AGI Futures
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConciergeTab("briefing");
                      setIsConciergeModalOpen(true);
                    }}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-amber-300" />
                      Station Briefing & 2D Directory
                    </span>
                    <span className="text-[10px] text-slate-400">Open</span>
                  </button>
                </>
              )}
            </div>

            {/* Sister Platform Direct Handoff Strip */}
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px] text-slate-400">
              <span>Sister Platforms:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.mylevl.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-300 hover:underline"
                >
                  myLEVL.ai
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a
                  href="https://www.agifutures.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-300 hover:underline"
                >
                  AGIFutures.org
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Bottom Focus Sanctuary Timer & Procedural DJ Bar */}
      <BottomFocusAndDjBar
        focusSession={focusSession}
        onStartFocus={(opts) => {
          startSession({
            ...opts,
            workspaceWaypointId: activeWaypointId,
          });
          soundscapeEngine.playUiChime("save");
          setLiveAnnouncement(
            `Started ${opts.durationMinutes} minute focus session in ${activeWaypoint.label}.`
          );
        }}
        onTogglePauseFocus={togglePause}
        onExtendFocus={extendSession}
        onEndFocus={completeOrEndSession}
        onUpdateFocusPrefs={updatePreferences}
        onReturnToMyWorkspace={() =>
          handleSelectWaypoint(
            focusSession.workspaceWaypointId || "pod-earthview-1"
          )
        }
        activeWaypointId={activeWaypointId}
      />

      {/* Space Elevator Skippable Arrival Sequence */}
      <SpaceElevatorOverlay
        phase={arrivalPhase}
        onStartAscent={handleStartAscent}
        onSkipToDestination={handleSkipToDestination}
        onOpen2DDirectory={() => {
          setArrivalPhase("in_station");
          setConciergeTab("directory");
          setIsConciergeModalOpen(true);
        }}
        savedWorkspaceId={focusSession.workspaceWaypointId || "pod-earthview-1"}
        hasVisitedBefore={hasVisitedBefore}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
      />

      {/* AGI Futures Holographic Idea Booth Drawer */}
      <IdeaBoothDrawer
        isOpen={isIdeaDrawerOpen}
        onClose={() => setIsIdeaDrawerOpen(false)}
        activeIdea={activeIdea}
        onSelectIdea={handleSelectIdea}
        savedIdeaSlugs={savedIdeaSlugs}
        onToggleSaveIdea={handleToggleSaveIdea}
        communitySeeds={communitySeeds}
        onPlantSeed={handlePlantSeed}
        onSubmitContribution={handleSubmitContribution}
        contributionsByIdea={contributionsByIdea}
        isSignedIn={isSignedIn}
        userId={userId}
        onRequestSignIn={handleRequestSignIn}
      />

      {/* LEVL Longevity Bar & Spa Drawer */}
      <LevlBarDrawer
        isOpen={isLevlDrawerOpen}
        onClose={() => setIsLevlDrawerOpen(false)}
        initialModalitySlug={initialLevlModalitySlug}
        savedDrafts={savedDrafts}
        onSaveDraftExplicitly={handleSaveLevlDraft}
        onOpenScreeningModal={() => {
          setIsLevlDrawerOpen(false);
          setIsScreeningModalOpen(true);
        }}
        isSignedIn={isSignedIn}
        userId={userId}
        onRequestSignIn={handleRequestSignIn}
      />

      {/* LEVL Research Screening Wall Modal (Auto-Ducks DJ Music) */}
      <LevlScreeningModal
        isOpen={isScreeningModalOpen}
        onClose={() => setIsScreeningModalOpen(false)}
        onInspectModality={(slug) => {
          setIsScreeningModalOpen(false);
          handleOpenLevlDrawer(slug);
        }}
      />

      {/* Asynchronous Member Matching Board Drawer */}
      <MemberMatchingDrawer
        isOpen={isMatchingDrawerOpen}
        onClose={() => setIsMatchingDrawerOpen(false)}
        banners={visibleBanners}
        onSaveOwnBanner={handleSaveOwnBanner}
        onSendAsyncIntro={handleSendAsyncIntro}
        sentIntros={sentIntros}
        blockedIds={blockedIds}
        onBlockMember={handleBlockMember}
        onReportMember={handleReportMember}
        isSignedIn={isSignedIn}
        onRequestSignIn={handleRequestSignIn}
        onInspectIdeaSlug={(slug) => {
          const found = AGI_FUTURES_IDEAS.find((i) => i.slug === slug);
          if (found) {
            setIsMatchingDrawerOpen(false);
            handleOpenIdeaDrawer(found);
          }
        }}
      />

      {/* Station Briefing, Concierge AI, & 2D Accessible Directory Modal */}
      <ConciergeAndBriefingModal
        isOpen={isConciergeModalOpen}
        onClose={() => setIsConciergeModalOpen(false)}
        initialTab={conciergeTab}
        onSelectWaypoint={(waypointId) => {
          handleSelectWaypoint(waypointId);
          setIsConciergeModalOpen(false);
        }}
        onOpenIdea={(idea) => {
          setIsConciergeModalOpen(false);
          handleOpenIdeaDrawer(idea);
        }}
        onOpenLevlModality={(slug) => {
          setIsConciergeModalOpen(false);
          handleOpenLevlDrawer(slug);
        }}
        isSignedIn={isSignedIn}
        userId={userId}
        onRequestSignIn={handleRequestSignIn}
      />

      {/* Habitat Pass Auth & Sister Platform Account Linking Modal */}
      <AuthAndLinksModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        promptReason={authPromptReason}
        isSignedIn={isSignedIn}
        userEmail={userEmail}
        onSignInSuccess={handleSignInSuccess}
        onSignOut={handleSignOut}
        connectedAccounts={connectedAccounts}
        onToggleAccountLink={handleToggleAccountLink}
      />
    </main>
  );
}
