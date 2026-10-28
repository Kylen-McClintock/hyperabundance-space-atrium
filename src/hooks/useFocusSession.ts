"use client";

import { useState, useEffect, useCallback } from "react";

export interface FocusSessionState {
  isActive: boolean;
  isPaused: boolean;
  mode: "timed" | "untimed";
  durationMinutes: number;
  startedAtMs: number | null;
  targetEndAtMs: number | null;
  pausedRemainingMs: number | null;
  elapsedMs: number;
  remainingMs: number;
  intention: string;
  shareIntentionPublicly: boolean;
  workspaceWaypointId: string;
  completedSessionsCount: number;
}

const STORAGE_KEY = "hyperabundance_focus_session_v1";

const DEFAULT_STATE: FocusSessionState = {
  isActive: false,
  isPaused: false,
  mode: "timed",
  durationMinutes: 25,
  startedAtMs: null,
  targetEndAtMs: null,
  pausedRemainingMs: null,
  elapsedMs: 0,
  remainingMs: 25 * 60 * 1000,
  intention: "",
  shareIntentionPublicly: false,
  workspaceWaypointId: "pod-earthview-1",
  completedSessionsCount: 0,
};

export function useFocusSession(onComplete?: () => void) {
  const [session, setSession] = useState<FocusSessionState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage so session survives refresh, tab changes, and reconnects
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FocusSessionState>;
        const now = Date.now();
        let next: FocusSessionState = { ...DEFAULT_STATE, ...parsed };

        if (next.isActive && !next.isPaused && next.startedAtMs) {
          if (next.mode === "timed" && next.targetEndAtMs) {
            const rem = Math.max(0, next.targetEndAtMs - now);
            next.remainingMs = rem;
            next.elapsedMs = next.durationMinutes * 60 * 1000 - rem;
            if (rem === 0) {
              next.isActive = false;
              next.completedSessionsCount = (next.completedSessionsCount || 0) + 1;
            }
          } else {
            next.elapsedMs = Math.max(0, now - next.startedAtMs);
          }
        }
        setSession(next);
      }
    } catch {
      // Ignore storage parse failure
    }
    setHydrated(true);
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore quota errors
    }
  }, [session, hydrated]);

  // Drift-proof timestamp tick (handles background tab throttling accurately)
  useEffect(() => {
    if (!session.isActive || session.isPaused) return;

    const tick = () => {
      const now = Date.now();
      setSession((prev) => {
        if (!prev.isActive || prev.isPaused || !prev.startedAtMs) return prev;
        if (prev.mode === "timed" && prev.targetEndAtMs) {
          const rem = Math.max(0, prev.targetEndAtMs - now);
          const elapsed = prev.durationMinutes * 60 * 1000 - rem;
          if (rem <= 0) {
            onComplete?.();
            return {
              ...prev,
              isActive: false,
              remainingMs: 0,
              elapsedMs: prev.durationMinutes * 60 * 1000,
              completedSessionsCount: prev.completedSessionsCount + 1,
            };
          }
          return { ...prev, remainingMs: rem, elapsedMs: elapsed };
        } else {
          return { ...prev, elapsedMs: Math.max(0, now - prev.startedAtMs) };
        }
      });
    };

    const interval = setInterval(tick, 500);
    const handleVisibility = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [session.isActive, session.isPaused, onComplete]);

  const startSession = useCallback(
    (opts: {
      mode?: "timed" | "untimed";
      durationMinutes?: number;
      intention?: string;
      shareIntentionPublicly?: boolean;
      workspaceWaypointId?: string;
    }) => {
      const now = Date.now();
      const mode = opts.mode ?? session.mode;
      const durationMinutes = opts.durationMinutes ?? session.durationMinutes;
      const durationMs = durationMinutes * 60 * 1000;

      setSession((prev) => ({
        ...prev,
        isActive: true,
        isPaused: false,
        mode,
        durationMinutes,
        startedAtMs: now,
        targetEndAtMs: mode === "timed" ? now + durationMs : null,
        pausedRemainingMs: null,
        elapsedMs: 0,
        remainingMs: durationMs,
        intention: opts.intention ?? prev.intention,
        shareIntentionPublicly:
          opts.shareIntentionPublicly ?? prev.shareIntentionPublicly,
        workspaceWaypointId:
          opts.workspaceWaypointId ?? prev.workspaceWaypointId,
      }));
    },
    [session.mode, session.durationMinutes]
  );

  const togglePause = useCallback(() => {
    const now = Date.now();
    setSession((prev) => {
      if (!prev.isActive) return prev;
      if (!prev.isPaused) {
        return {
          ...prev,
          isPaused: true,
          pausedRemainingMs: prev.remainingMs,
        };
      } else {
        const rem = prev.pausedRemainingMs ?? prev.durationMinutes * 60 * 1000;
        return {
          ...prev,
          isPaused: false,
          startedAtMs: now - prev.elapsedMs,
          targetEndAtMs: prev.mode === "timed" ? now + rem : null,
          pausedRemainingMs: null,
        };
      }
    });
  }, []);

  const extendSession = useCallback((extraMinutes: number) => {
    const extraMs = extraMinutes * 60 * 1000;
    setSession((prev) => ({
      ...prev,
      durationMinutes: prev.durationMinutes + extraMinutes,
      targetEndAtMs: prev.targetEndAtMs ? prev.targetEndAtMs + extraMs : null,
      remainingMs: prev.remainingMs + extraMs,
    }));
  }, []);

  const completeOrEndSession = useCallback(
    (markCompleted: boolean) => {
      if (markCompleted) onComplete?.();
      setSession((prev) => ({
        ...prev,
        isActive: false,
        isPaused: false,
        startedAtMs: null,
        targetEndAtMs: null,
        pausedRemainingMs: null,
        completedSessionsCount: markCompleted
          ? prev.completedSessionsCount + 1
          : prev.completedSessionsCount,
      }));
    },
    [onComplete]
  );

  const updatePreferences = useCallback(
    (patch: Partial<Pick<FocusSessionState, "intention" | "shareIntentionPublicly" | "durationMinutes" | "mode" | "workspaceWaypointId">>) => {
      setSession((prev) => ({
        ...prev,
        ...patch,
        remainingMs:
          !prev.isActive && patch.durationMinutes
            ? patch.durationMinutes * 60 * 1000
            : prev.remainingMs,
      }));
    },
    []
  );

  return {
    session,
    hydrated,
    startSession,
    togglePause,
    extendSession,
    completeOrEndSession,
    updatePreferences,
  };
}
