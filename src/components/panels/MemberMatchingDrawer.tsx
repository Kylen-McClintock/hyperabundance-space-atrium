"use client";

import React, { useState } from "react";
import {
  Users,
  Send,
  Flag,
  Ban,
  CheckCircle2,
  X,
  EyeOff,
  Eye,
  Edit3,
} from "lucide-react";
import { MemberBannerRecord } from "@/data/station-briefing";
import { AGI_FUTURES_IDEAS } from "@/data/agifutures-catalog";

interface MemberMatchingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  banners: MemberBannerRecord[];
  onSaveOwnBanner: (banner: {
    displayName: string;
    roleTag: string;
    building: string;
    lookingFor: string;
    canHelpWith: string;
    linkedIdeaSlug?: string;
    isVisible: boolean;
  }) => void;
  onSendAsyncIntro: (recipientId: string, message: string) => void;
  sentIntros: Record<string, string[]>;
  blockedIds: string[];
  onBlockMember: (memberId: string) => void;
  onReportMember: (memberId: string, reason: string) => void;
  isSignedIn: boolean;
  onRequestSignIn: (reason: string) => void;
  onInspectIdeaSlug: (slug: string) => void;
}

export function MemberMatchingDrawer({
  isOpen,
  onClose,
  banners,
  onSaveOwnBanner,
  onSendAsyncIntro,
  sentIntros,
  blockedIds,
  onBlockMember,
  onReportMember,
  isSignedIn,
  onRequestSignIn,
  onInspectIdeaSlug,
}: MemberMatchingDrawerProps) {
  const [editingBanner, setEditingBanner] = useState(false);
  const [displayName, setDisplayName] = useState("Orbital Builder");
  const [roleTag, setRoleTag] = useState("Founder / Engineer");
  const [building, setBuilding] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [canHelpWith, setCanHelpWith] = useState("");
  const [linkedIdeaSlug, setLinkedIdeaSlug] = useState("signal-house");
  const [isVisible, setIsVisible] = useState(true);

  const [activeIntroId, setActiveIntroId] = useState<string | null>(null);
  const [introText, setIntroText] = useState("");
  const [reportedNoticeId, setReportedNoticeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const visibleBanners = banners.filter((b) => !blockedIds.includes(b.id));

  return (
    <aside
      aria-label="Founder Matching Wall and Asynchronous Builder Banners"
      className="fixed top-16 right-4 bottom-20 z-30 flex w-[92vw] max-w-xl flex-col overflow-hidden rounded-2xl border border-emerald-400/35 bg-slate-950/92 text-slate-100 shadow-2xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-white">
              Founder Matching Wall & Member Banners
            </h2>
            <p className="text-[11px] text-slate-400">
              Asynchronous collaboration • Value does not depend on simultaneous attendance
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Founder Matching Drawer"
          className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
        {/* Publish / Edit Your Own Banner */}
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/25 p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-200">
                Your Member Banner (Building / Looking For / Can Help With)
              </span>
              <p className="text-[11px] text-slate-300">
                Compact, hideable at any time, and capped at 160 chars per field.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isSignedIn) {
                  onRequestSignIn("Configure your Building / Looking For / Can Help banner");
                  return;
                }
                setEditingBanner((v) => !v);
              }}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              <Edit3 className="h-3.5 w-3.5" />
              {editingBanner ? "Close Editor" : "Edit My Banner"}
            </button>
          </div>

          {editingBanner && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSaveOwnBanner({
                  displayName: displayName.trim() || "Orbital Builder",
                  roleTag: roleTag.trim() || "Builder",
                  building: building.trim().slice(0, 160),
                  lookingFor: lookingFor.trim().slice(0, 160),
                  canHelpWith: canHelpWith.trim().slice(0, 160),
                  linkedIdeaSlug,
                  isVisible,
                });
                setEditingBanner(false);
              }}
              className="mt-3 space-y-2.5 border-t border-white/10 pt-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="banner-name" className="block text-[11px] text-slate-300">
                    Display Name
                  </label>
                  <input
                    id="banner-name"
                    type="text"
                    required
                    maxLength={50}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="banner-role" className="block text-[11px] text-slate-300">
                    Role / Craft
                  </label>
                  <input
                    id="banner-role"
                    type="text"
                    required
                    maxLength={40}
                    value={roleTag}
                    onChange={(e) => setRoleTag(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="banner-building" className="block text-[11px] text-emerald-300">
                  BUILDING (max 160 chars)
                </label>
                <input
                  id="banner-building"
                  type="text"
                  required
                  maxLength={160}
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="What are you actively building or researching?"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label htmlFor="banner-looking" className="block text-[11px] text-amber-300">
                  LOOKING FOR (max 160 chars)
                </label>
                <input
                  id="banner-looking"
                  type="text"
                  required
                  maxLength={160}
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  placeholder="What collaborator skill, pilot partner, or domain help do you need?"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label htmlFor="banner-help" className="block text-[11px] text-sky-300">
                  CAN HELP WITH (max 160 chars)
                </label>
                <input
                  id="banner-help"
                  type="text"
                  required
                  maxLength={160}
                  value={canHelpWith}
                  onChange={(e) => setCanHelpWith(e.target.value)}
                  placeholder="How can you help other builders in the community?"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <label htmlFor="banner-idea" className="block text-[11px] text-slate-300">
                    Linked AGI Futures Blueprint
                  </label>
                  <select
                    id="banner-idea"
                    value={linkedIdeaSlug}
                    onChange={(e) => setLinkedIdeaSlug(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-white"
                  >
                    {AGI_FUTURES_IDEAS.map((idea) => (
                      <option key={idea.slug} value={idea.slug}>
                        {idea.title} ({idea.sectorLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  aria-pressed={isVisible}
                  onClick={() => setIsVisible((v) => !v)}
                  className="mt-4 flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-slate-200"
                >
                  {isVisible ? (
                    <>
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                      Hidden
                    </>
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-emerald-500 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Save Member Banner
              </button>
            </form>
          )}
        </div>

        {/* Builder Directory Cards */}
        <div className="space-y-3">
          {visibleBanners.map((member) => {
            const introsForMember = sentIntros[member.id] || [];
            return (
              <div
                key={member.id}
                className="rounded-xl border border-white/10 bg-slate-900/80 p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: member.avatarColor }}
                      />
                      <span className="text-sm font-bold text-white">
                        {member.displayName}
                      </span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                        {member.roleTag}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-slate-400">
                      @{member.handle} • Status:{" "}
                      <span className="capitalize text-emerald-300">
                        {member.presenceStatus}
                      </span>
                    </div>
                  </div>

                  {/* Report & Block Safety Controls (Spec Section 7 & 12) */}
                  {!member.isCurrentUser && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onReportMember(member.id, "Reported from Matching Wall");
                          setReportedNoticeId(member.id);
                        }}
                        aria-label={`Report ${member.displayName}'s banner`}
                        className="cursor-pointer rounded p-1 text-slate-500 hover:bg-white/10 hover:text-amber-300"
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onBlockMember(member.id)}
                        aria-label={`Hide and block ${member.displayName}`}
                        className="cursor-pointer rounded p-1 text-slate-500 hover:bg-white/10 hover:text-rose-400"
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 3-Column Building / Looking For / Can Help Grid */}
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-emerald-400/20 bg-slate-950/75 p-2.5">
                    <div className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                      Building
                    </div>
                    <p className="mt-1 text-slate-200">{member.building}</p>
                  </div>
                  <div className="rounded-lg border border-amber-400/20 bg-slate-950/75 p-2.5">
                    <div className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                      Looking For
                    </div>
                    <p className="mt-1 text-slate-200">{member.lookingFor}</p>
                  </div>
                  <div className="rounded-lg border border-sky-400/20 bg-slate-950/75 p-2.5">
                    <div className="text-[10px] font-bold tracking-wider text-sky-300 uppercase">
                      Can Help With
                    </div>
                    <p className="mt-1 text-slate-200">{member.canHelpWith}</p>
                  </div>
                </div>

                {/* Actions: Inspect Linked Idea or Leave Asynchronous Intro/Offer */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  {member.linkedIdeaSlug ? (
                    <button
                      type="button"
                      onClick={() => onInspectIdeaSlug(member.linkedIdeaSlug!)}
                      className="cursor-pointer rounded-lg border border-emerald-400/30 bg-emerald-950/50 px-2.5 py-1 text-[11px] font-medium text-emerald-200 hover:bg-emerald-900/70"
                    >
                      Blueprint: {member.linkedIdeaSlug} →
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setActiveIntroId(
                        activeIntroId === member.id ? null : member.id
                      )
                    }
                    className="flex cursor-pointer items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-[11px] font-semibold text-white hover:bg-white/20"
                  >
                    <Send className="h-3 w-3" />
                    Leave Async Intro / Offer Help
                  </button>
                </div>

                {reportedNoticeId === member.id && (
                  <p className="mt-2 text-[11px] text-amber-300">
                    ✓ Banner flagged for moderator review.
                  </p>
                )}

                {introsForMember.length > 0 && (
                  <div className="mt-2 space-y-1 rounded-lg border border-emerald-400/25 bg-emerald-950/30 p-2 text-[11px] text-emerald-200">
                    {introsForMember.map((msg, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>Queued in @{member.handle}&apos;s AGI Futures Inbox: &ldquo;{msg}&rdquo;</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeIntroId === member.id && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!isSignedIn) {
                        onRequestSignIn(
                          `Send an asynchronous introduction to ${member.displayName}`
                        );
                        return;
                      }
                      if (!introText.trim()) return;
                      onSendAsyncIntro(member.id, introText.trim());
                      setIntroText("");
                      setActiveIntroId(null);
                    }}
                    className="mt-2.5 flex gap-2"
                  >
                    <input
                      type="text"
                      required
                      maxLength={320}
                      value={introText}
                      onChange={(e) => setIntroText(e.target.value)}
                      placeholder={`Offer specific help or intro to ${member.displayName}...`}
                      className="flex-1 rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 text-white"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer rounded-lg bg-emerald-500 px-3 py-1.5 font-semibold text-slate-950 hover:bg-emerald-400"
                    >
                      Send
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
