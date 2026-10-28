import {
  AGI_FUTURES_IDEAS,
  AgiFuturesIdea,
  getIdeaBySlug,
} from "@/data/agifutures-catalog";
import {
  LEVL_MODALITIES,
  LEVL_PROTOCOL_TEMPLATES,
  LevlModality,
} from "@/data/levl-catalog";

export type ResidentRole = "concierge" | "levl_bartender" | "agi_builder_guide";

export interface ProtocolDraftPreview {
  draftId: string;
  title: string;
  goal: string;
  evidenceSummary: string;
  caveat: string;
  steps: {
    modalitySlug: string;
    modalityName: string;
    slot: "Morning" | "Midday" | "Afternoon" | "Evening";
    dose: string;
    rationale: string;
  }[];
}

export interface ResidentReplyPayload {
  residentRole: ResidentRole;
  residentName: string;
  badgeText: string;
  mode: "guest-deterministic" | "authenticated-gemini" | "fallback-deterministic";
  authNotice?: string;
  replyMarkdown: string;
  citations?: {
    label: string;
    url: string;
    gradeOrSource: string;
  }[];
  suggestedWaypointId?: string;
  protocolDraft?: ProtocolDraftPreview;
  blueprintSeparation?: {
    publishedSummary: string;
    aiSuggestions: string[];
    firstExperiment: string;
  };
}

function matchBestIdea(query: string, contextIdeaSlug?: string): AgiFuturesIdea {
  if (contextIdeaSlug) {
    const exact = getIdeaBySlug(contextIdeaSlug);
    if (exact) return exact;
  }
  const q = query.toLowerCase();
  const scored = AGI_FUTURES_IDEAS.map((idea) => {
    let score = 0;
    if (q.includes(idea.slug.toLowerCase())) score += 10;
    if (q.includes(idea.title.toLowerCase())) score += 10;
    if (idea.description.toLowerCase().split(/\W+/).some((w) => w.length > 4 && q.includes(w)))
      score += 3;
    if (idea.sectorLabel.toLowerCase().split(/\W+/).some((w) => w.length > 4 && q.includes(w)))
      score += 2;
    return { idea, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].idea : AGI_FUTURES_IDEAS[0];
}

function matchBestModality(
  query: string,
  contextModalitySlug?: string
): LevlModality {
  if (contextModalitySlug) {
    const exact = LEVL_MODALITIES.find((m) => m.slug === contextModalitySlug);
    if (exact) return exact;
  }
  const q = query.toLowerCase();
  for (const mod of LEVL_MODALITIES) {
    if (
      q.includes(mod.slug.replace(/-/g, " ")) ||
      q.includes(mod.name.toLowerCase()) ||
      (q.includes("sauna") && mod.slug.includes("sauna")) ||
      ((q.includes("cold") || q.includes("plunge")) && mod.slug.includes("cold")) ||
      ((q.includes("hbot") || q.includes("oxygen")) && mod.slug.includes("hyperbaric")) ||
      ((q.includes("red light") || q.includes("nir")) && mod.slug.includes("red-light")) ||
      ((q.includes("vo2") || q.includes("zone 2") || q.includes("cardio")) &&
        mod.slug.includes("zone-2")) ||
      (q.includes("creatine") && mod.slug.includes("creatine")) ||
      ((q.includes("omega") || q.includes("fish oil") || q.includes("epa")) &&
        mod.slug.includes("omega-3")) ||
      ((q.includes("sleep") || q.includes("magnesium") || q.includes("glycine")) &&
        mod.slug.includes("circadian"))
    ) {
      return mod;
    }
  }
  return LEVL_MODALITIES[0];
}

export function generateDeterministicResidentReply(params: {
  role: ResidentRole;
  message: string;
  contextIdeaSlug?: string;
  contextModalitySlug?: string;
  isSignedIn: boolean;
  reason?: "guest" | "fallback";
}): ResidentReplyPayload {
  const { role, message, contextIdeaSlug, contextModalitySlug, isSignedIn, reason } =
    params;

  const authNotice = !isSignedIn
    ? "Guest Mode (Grounded Catalog Engine) — Sign in to unlock live conversational Gemini AI with this avatar."
    : reason === "fallback"
    ? "Grounded Catalog Mode — Using verified local knowledge base."
    : undefined;

  // -------------------------------------------------------------------------
  // 1. ORBITAL CONCIERGE
  // -------------------------------------------------------------------------
  if (role === "concierge") {
    const q = message.toLowerCase();
    let suggestedWaypointId = "pod-earthview-1";
    let recommendationText =
      "For uninterrupted deep work, drift up to **Earthview Bubble Pod α1 (+24 ft)** on the upper west hull rib—it faces straight out toward Earth with a timestamp-anchored Focus Timer and private intention log.";

    if (q.includes("longevity") || q.includes("sauna") || q.includes("levl") || q.includes("sleep") || q.includes("protocol")) {
      suggestedWaypointId = "levl-protocol-bar";
      recommendationText =
        "Head through the west portal into the **LEVL Longevity Lounge**. At the **Protocol Bar**, you can inspect Grade-A/B human clinical evidence on Zone 2/VO2 max, Finnish sauna, cold plunge, and sleep architecture, and assemble a reviewable draft for your LEVL Bench.";
    } else if (q.includes("startup") || q.includes("idea") || q.includes("agi") || q.includes("build") || q.includes("founder")) {
      suggestedWaypointId = "agi-holo-table";
      recommendationText =
        "Step through the east portal into the **AGI Futures Inventor's Club**. You can visit any of the **6 Sector Holo-Booths** or the **Central Holographic Table** to swipe through all 33 canonical startup blueprints (including *Signal House*, *HelioTerra*, *BioWalls*, and *Main Street Legacy*) without needing to walk down a corridor.";
    } else if (q.includes("people") || q.includes("match") || q.includes("collaborat") || q.includes("connect")) {
      suggestedWaypointId = "agi-matching-wall";
      recommendationText =
        "Visit the **Founder Matching Wall** in the AGI Futures wing or relax in the **West Sunken Earth-Glass Lounge**. You can browse asynchronous *Building / Looking For / Can Help* banners and leave an introduction that persists even when the recipient is offline.";
    }

    return {
      residentRole: "concierge",
      residentName: "Aethel • Orbital Atrium Concierge",
      badgeText: "AI RESIDENT • STATION CONCIERGE",
      mode: isSignedIn ? "fallback-deterministic" : "guest-deterministic",
      authNotice,
      replyMarkdown: `Welcome to the **HyperAbundance Orbital Atrium**. Every space here is designed around attention sovereignty and useful action:\n\n- **Focus:** 6 outward-protruding convex **Earthview Bubble Pods** (+12 ft to +28 ft) and the upper **Botanical Conservatory**.\n- **Explore Longevity (LEVL Wing):** Sourced PubMed evidence, Spa modality stations, and draft-only Protocol Bartender handoff.\n- **Explore & Build Ideas (AGI Futures Wing):** 33 canonical startup blueprints across 6 swipable 3D holographic booths.\n\n**Recommended Next Step:** ${recommendationText}`,
      suggestedWaypointId,
    };
  }

  // -------------------------------------------------------------------------
  // 2. LEVL PROTOCOL BARTENDER
  // -------------------------------------------------------------------------
  if (role === "levl_bartender") {
    const mod = matchBestModality(message, contextModalitySlug);
    const q = message.toLowerCase();
    const template =
      q.includes("thermal") || q.includes("sauna") || q.includes("cold")
        ? LEVL_PROTOCOL_TEMPLATES[1]
        : LEVL_PROTOCOL_TEMPLATES[0];

    const draftId = `atrium-draft-${mod.slug}-${Date.now().toString(36).slice(-4)}`;

    return {
      residentRole: "levl_bartender",
      residentName: "Sora • LEVL Protocol Bartender",
      badgeText: "AI RESIDENT • LEVL COACH & BUILDER INTERFACE",
      mode: isSignedIn ? "fallback-deterministic" : "guest-deterministic",
      authNotice,
      replyMarkdown: `### ${mod.name} (${mod.category})\n**Evidence Strength:** ${mod.evidenceGrade}\n\n${mod.headline}\n\n- **Standard Protocol Parameters:** ${mod.standardProtocol.doseOrIntensity} • ${mod.standardProtocol.duration} • ${mod.standardProtocol.frequency} (${mod.standardProtocol.timingSlot} slot)\n- **Key Mechanisms:** ${mod.mechanisms.join(", ")}\n- **Evidence Boundaries & Uncertainty:** ${mod.uncertaintyAndLimits}\n- **Contraindications & Safety Notes:** ${mod.contraindications.join("; ")}\n\n*Note: Exploring at the Protocol Bar never modifies your live LEVL schedule. Review the draft card below and click **Save Draft & Open in LEVL** if you want to stage it on your LEVL Bench.*`,
      citations: mod.citations.map((c) => ({
        label: `${c.title} (${c.journalYear}) — PMID ${c.pmid}`,
        url: c.url,
        gradeOrSource: mod.evidenceGrade,
      })),
      protocolDraft: {
        draftId,
        title: `${mod.name} — Atrium Protocol Draft`,
        goal: template.goal,
        evidenceSummary: `${mod.evidenceGrade} (${mod.citations.length} PubMed citation${mod.citations.length > 1 ? "s" : ""} attached)`,
        caveat:
          "Draft only. Does not schedule tasks onto Today until you explicitly review and activate inside LEVL.",
        steps: [
          {
            modalitySlug: mod.slug,
            modalityName: mod.name,
            slot: mod.standardProtocol.timingSlot,
            dose: `${mod.standardProtocol.doseOrIntensity} (${mod.standardProtocol.duration})`,
            rationale: mod.headline,
          },
          ...template.steps
            .filter((s) => s.modalitySlug !== mod.slug)
            .slice(0, 2),
        ],
      },
    };
  }

  // -------------------------------------------------------------------------
  // 3. AGI FUTURES BUILDER GUIDE
  // -------------------------------------------------------------------------
  const idea = matchBestIdea(message, contextIdeaSlug);

  return {
    residentRole: "agi_builder_guide",
    residentName: "Kaelen • AGI Futures Builder Guide",
    badgeText: "AI RESIDENT • BUILDER GUIDE",
    mode: isSignedIn ? "fallback-deterministic" : "guest-deterministic",
    authNotice,
    replyMarkdown: `### [Published AGI Futures Blueprint] ${idea.title}\n**${idea.scoreTitle}** • *Sector: ${idea.sectorLabel}*\n\n- **Core Thesis:** ${idea.thesis}\n- **Why Now:** ${idea.whyNow}\n- **Composite Scores:** Moat **${idea.scores.moat}/100** • Execution Difficulty **${idea.scores.difficulty}/100** • Civilizational Impact **${idea.scores.impact}/100**\n- **Expected Valuation Trajectory:** 2030: **${idea.forecasts.y2030}** → 2035: **${idea.forecasts.y2035}** → 2040: **${idea.forecasts.y2040}**\n\n---\n\n### [AI Builder Guide Suggestions — Distinct from Published Blueprint]\n1. **Critical Assumptions to Falsify First:**\n${idea.keyAssumptions.map((a) => `   - ${a}`).join("\n")}\n2. **Proposed 14-Day Wedge Experiment:** ${idea.firstExperiment}\n3. **High-Leverage Collaborator Skills Needed:** ${idea.neededSkills.join(" • ")}`,
    citations: [
      {
        label: `Canonical AGI Futures Blueprint: ${idea.title}`,
        url: idea.canonicalUrl,
        gradeOrSource: "CC BY-NC-SA 4.0 • AGI Futures Editorial Blueprint",
      },
    ],
    blueprintSeparation: {
      publishedSummary: `${idea.description} (${idea.thesis})`,
      aiSuggestions: [
        ...idea.keyAssumptions.map((a) => `Test assumption: ${a}`),
        `Recruit collaborators in: ${idea.neededSkills.join(", ")}`,
      ],
      firstExperiment: idea.firstExperiment,
    },
  };
}
