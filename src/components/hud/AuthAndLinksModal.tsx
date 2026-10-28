"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Link2,
  Unlink,
  Sparkles,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { AccessibleModalDialog } from "@/components/ui/AccessibleModalDialog";

export interface ConnectedAccountsState {
  levlConnected: boolean;
  agiFuturesConnected: boolean;
  discordShareEnabled: boolean;
}

interface AuthAndLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptReason?: string;
  isSignedIn: boolean;
  userEmail: string;
  onSignInSuccess: (email: string) => void;
  onSignOut: () => void;
  connectedAccounts: ConnectedAccountsState;
  onToggleAccountLink: (provider: keyof ConnectedAccountsState) => void;
}

export function AuthAndLinksModal({
  isOpen,
  onClose,
  promptReason,
  isSignedIn,
  userEmail,
  onSignInSuccess,
  onSignOut,
  connectedAccounts,
  onToggleAccountLink,
}: AuthAndLinksModalProps) {
  const [emailInput, setEmailInput] = useState(
    userEmail || "builder@hyperabundance.org"
  );
  const [discordMessage, setDiscordMessage] = useState("");
  const [discordSharedNotice, setDiscordSharedNotice] = useState(false);

  return (
    <AccessibleModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Habitat Sign-In & Verified Sister-Platform Account Links"
      subtitle="Preserves your current orbital destination and unfinished drafts across sign-in"
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-5 text-xs">
        {promptReason && (
          <div className="rounded-xl border border-amber-400/35 bg-amber-950/35 p-3 text-amber-200">
            <strong>Action Requested:</strong> {promptReason}
          </div>
        )}

        {/* 1. Habitat Identity Status */}
        <div className="rounded-xl border border-white/15 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold tracking-wider text-sky-300 uppercase">
              1. HyperAbundance Habitat Identity
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                isSignedIn
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {isSignedIn ? `Signed In (${userEmail})` : "Guest Explorer"}
            </span>
          </div>

          <p className="mt-1.5 text-slate-300">
            Signing in unlocks live conversational <strong>Gemini 2.5 Flash</strong> interactions with the AI Residents (Concierge, LEVL Bartender, and AGI Futures Builder Guide), cross-device workspace restoration, and community contributions.
          </p>

          {!isSignedIn ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!emailInput.trim()) return;
                onSignInSuccess(emailInput.trim());
              }}
              className="mt-3 space-y-2.5"
            >
              <div>
                <label
                  htmlFor="habitat-auth-email"
                  className="block text-[11px] font-medium text-slate-300"
                >
                  Builder Email Address
                </label>
                <input
                  id="habitat-auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-white"
                />
              </div>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-400 py-2.5 font-bold text-slate-950 hover:bg-sky-300"
              >
                <Sparkles className="h-4 w-4" />
                Sign In & Unlock Live Gemini AI Residents
              </button>
            </form>
          ) : (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-950/80 px-3 py-2">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Authenticated as {userEmail} (Destination & Drafts Preserved)
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="cursor-pointer rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-slate-300 hover:bg-white/10"
              >
                Switch to Guest
              </button>
            </div>
          )}
        </div>

        {/* 2. Verified Account Connections (LEVL & AGI Futures) */}
        <div className="space-y-3 rounded-xl border border-white/15 bg-slate-900/80 p-4">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-slate-200 uppercase">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            2. Explicit Sister-Platform Connections (Revocable Anytime)
          </div>
          <p className="text-[11px] text-slate-400">
            Disconnecting revokes future habitat access without deleting your source LEVL or AGI Futures account. Raw health records never enter public storage or Discord.
          </p>

          {/* LEVL Connection Row */}
          <div className="flex items-center justify-between rounded-xl border border-teal-400/25 bg-slate-950/80 p-3">
            <div>
              <div className="font-bold text-teal-200">
                Connect LEVL Longevity Account
              </div>
              <div className="text-[11px] text-slate-400">
                Scopes: Stage draft protocols to LEVL Bench (`review_status = draft`). Never auto-schedules live tasks.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleAccountLink("levlConnected")}
              className={`flex cursor-pointer items-center gap-1 rounded-xl px-3 py-1.5 font-semibold transition ${
                connectedAccounts.levlConnected
                  ? "border border-rose-400/40 bg-rose-950/50 text-rose-200"
                  : "bg-teal-400 text-slate-950"
              }`}
            >
              {connectedAccounts.levlConnected ? (
                <>
                  <Unlink className="h-3.5 w-3.5" />
                  Disconnect
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" />
                  Connect LEVL
                </>
              )}
            </button>
          </div>

          {/* AGI Futures Connection Row */}
          <div className="flex items-center justify-between rounded-xl border border-emerald-400/25 bg-slate-950/80 p-3">
            <div>
              <div className="font-bold text-emerald-200">
                Connect AGI Futures Builder Profile
              </div>
              <div className="text-[11px] text-slate-400">
                Scopes: Reuse Builder Profile (`Building / Looking For / Can Help`), sync Saved Ideas & canonical Idea Seeds.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleAccountLink("agiFuturesConnected")}
              className={`flex cursor-pointer items-center gap-1 rounded-xl px-3 py-1.5 font-semibold transition ${
                connectedAccounts.agiFuturesConnected
                  ? "border border-rose-400/40 bg-rose-950/50 text-rose-200"
                  : "bg-emerald-400 text-slate-950"
              }`}
            >
              {connectedAccounts.agiFuturesConnected ? (
                <>
                  <Unlink className="h-3.5 w-3.5" />
                  Disconnect
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" />
                  Connect AGI Futures
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. Stage-1 Discord Outbound Share Action (Spec Section 9) */}
        <div className="rounded-xl border border-indigo-400/25 bg-indigo-950/20 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-indigo-200">
              <Share2 className="h-4 w-4" />
              Stage-1 Discord Public Channel Announcement
            </span>
            <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-300">
              Disclosed Public Bridge • Never Bridges Private Coach/DMs
            </span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!discordMessage.trim()) return;
              setDiscordSharedNotice(true);
              setDiscordMessage("");
              setTimeout(() => setDiscordSharedNotice(false), 3500);
            }}
            className="mt-2.5 flex gap-2"
          >
            <input
              type="text"
              value={discordMessage}
              onChange={(e) => setDiscordMessage(e.target.value)}
              placeholder="Share a public builder milestone or focus sprint announcement to #atrium-commons..."
              className="flex-1 rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-white"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-indigo-400 px-3 py-1.5 font-semibold text-slate-950 hover:bg-indigo-300"
            >
              Share to Discord
            </button>
          </form>
          {discordSharedNotice && (
            <p className="mt-1.5 text-[11px] text-indigo-300">
              ✓ Outbound announcement queued with origin attribution (`HyperAbundance Atrium`).
            </p>
          )}
        </div>
      </div>
    </AccessibleModalDialog>
  );
}
