import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import {
  generateDeterministicResidentReply,
  ResidentRole,
} from "@/lib/ai/deterministic-residents";
import { getIdeaBySlug, AGI_FUTURES_IDEAS } from "@/data/agifutures-catalog";
import { LEVL_MODALITIES } from "@/data/levl-catalog";

export const maxDuration = 30;

// Per-user rate limit & idempotency cache (prevents duplicate tool effects and runaway API costs)
const userQuotaWindow = new Map<string, { count: number; resetAt: number }>();
const idempotencyCache = new Map<string, unknown>();
const MAX_REQUESTS_PER_HOUR = 25;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const role: ResidentRole = body.role || "concierge";
    const message: string = (body.message || "").trim().slice(0, 1200);
    const contextIdeaSlug: string | undefined = body.contextIdeaSlug;
    const contextModalitySlug: string | undefined = body.contextModalitySlug;
    const isSignedIn: boolean = Boolean(body.isSignedIn);
    const userId: string = body.userId || "guest";
    const idempotencyKey: string | undefined = body.idempotencyKey;

    if (!message) {
      return NextResponse.json(
        { error: "Please enter a question or prompt." },
        { status: 400 }
      );
    }

    // Deduplicate retried requests
    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      return NextResponse.json(idempotencyCache.get(idempotencyKey));
    }

    // 1. Auth Gate: Guests use the zero-cost deterministic grounded engine
    if (!isSignedIn) {
      const guestReply = generateDeterministicResidentReply({
        role,
        message,
        contextIdeaSlug,
        contextModalitySlug,
        isSignedIn: false,
        reason: "guest",
      });
      if (idempotencyKey) idempotencyCache.set(idempotencyKey, guestReply);
      return NextResponse.json(guestReply);
    }

    // 2. Signed-In Per-User Rate Limit Check
    const now = Date.now();
    const bucket = userQuotaWindow.get(userId);
    if (!bucket || now > bucket.resetAt) {
      userQuotaWindow.set(userId, { count: 1, resetAt: now + 60 * 60 * 1000 });
    } else if (bucket.count >= MAX_REQUESTS_PER_HOUR) {
      const rateLimitedFallback = generateDeterministicResidentReply({
        role,
        message,
        contextIdeaSlug,
        contextModalitySlug,
        isSignedIn: true,
        reason: "fallback",
      });
      rateLimitedFallback.authNotice =
        "Hourly live AI quota reached (25/hr). Showing grounded catalog answer.";
      return NextResponse.json(rateLimitedFallback);
    } else {
      bucket.count += 1;
    }

    // 3. Base deterministic grounded payload (for citations, draft cards, and fallback)
    const basePayload = generateDeterministicResidentReply({
      role,
      message,
      contextIdeaSlug,
      contextModalitySlug,
      isSignedIn: true,
      reason: "fallback",
    });

    const hasGeminiKey = Boolean(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
    );

    if (!hasGeminiKey) {
      if (idempotencyKey) idempotencyCache.set(idempotencyKey, basePayload);
      return NextResponse.json(basePayload);
    }

    // 4. Live Gemini 2.5 Flash Call for Signed-In Users
    let systemPrompt = "";
    if (role === "levl_bartender") {
      const modContext = LEVL_MODALITIES.map(
        (m) =>
          `- ${m.name} (${m.slug}): ${m.evidenceGrade} | ${m.standardProtocol.doseOrIntensity}, ${m.standardProtocol.duration}, ${m.standardProtocol.frequency} | Contraindications: ${m.contraindications.join("; ")} | PubMed PMIDs: ${m.citations.map((c) => c.pmid).join(", ")}`
      ).join("\n");

      systemPrompt = `You are Sora, the AI Protocol Bartender inside the LEVL Longevity Lounge of the HyperAbundance Orbital Atrium.
Rules:
1. You are a presentation of LEVL's evidence-backed longevity coach. Always state your evidence grade (Grade A RCTs, Grade B Clinical Trials, Grade C Mechanistic) and cite the real PubMed PMIDs from the approved catalog below.
2. NEVER invent citations or PMIDs. Distinguish evidence strength and uncertainty clearly.
3. Highlight contraindications and timing trade-offs (e.g., cold plunge <4h after hypertrophy training).
4. Never claim that chatting or visiting a virtual spa station activates a live schedule or counts as a real treatment. Remind the user they can click "Save Draft & Open in LEVL" below to review on their LEVL Bench.
Approved Public LEVL Catalog:
${modContext}`;
    } else if (role === "agi_builder_guide") {
      const idea =
        (contextIdeaSlug && getIdeaBySlug(contextIdeaSlug)) ||
        AGI_FUTURES_IDEAS[0];
      systemPrompt = `You are Kaelen, the AI Builder Guide inside the AGI Futures Inventor's Club of the HyperAbundance Space Atrium.
Rules:
1. Ground your explanation in the canonical AGI Futures blueprint below.
2. Explicitly separate your response into two sections with markdown headers:
   - ### [Published AGI Futures Blueprint: ${idea.title}] (summarize thesis, why now, moat/impact scores)
   - ### [AI Builder Guide Suggestions] (identify key assumptions to falsify, propose a concrete 14-day experiment, and suggest collaborator skills to match on the Founder Matching Wall).
Canonical Blueprint Context:
Title: ${idea.title} (${idea.scoreTitle})
Sector: ${idea.sectorLabel}
Description: ${idea.description}
Thesis: ${idea.thesis}
Why Now: ${idea.whyNow}
Assumptions: ${idea.keyAssumptions.join(" | ")}
First Experiment: ${idea.firstExperiment}
Canonical URL: ${idea.canonicalUrl}`;
    } else {
      systemPrompt = `You are Aethel, the AI Resident Concierge of the HyperAbundance Orbital Atrium.
Help the visitor choose between Focus Mode (6 outward-protruding Earthview Bubble Pods or Upper Conservatory), Explore Longevity (LEVL Lounge & Protocol Bar), Explore Startup Blueprints (AGI Futures 6 Sector Holo-Booths covering 33 ideas), or Connect (Sunken Glass-Floor Lounges & Founder Matching Wall). Keep answers concise, warm, and action-oriented.`;
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: message,
    });

    const livePayload = {
      ...basePayload,
      mode: "authenticated-gemini" as const,
      authNotice: "Signed-In Live Gemini 2.5 Flash • Grounded on Canonical Catalog",
      replyMarkdown: text || basePayload.replyMarkdown,
    };

    if (idempotencyKey) idempotencyCache.set(idempotencyKey, livePayload);
    return NextResponse.json(livePayload);
  } catch {
    const fallback = generateDeterministicResidentReply({
      role: "concierge",
      message: "Help me navigate the station",
      isSignedIn: false,
      reason: "fallback",
    });
    return NextResponse.json(fallback);
  }
}
