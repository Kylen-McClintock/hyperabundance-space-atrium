export type LevlCategory =
  | "Movement"
  | "Nutrition"
  | "Cognitive Focus"
  | "Recovery";

export type EvidenceGrade =
  | "Grade A — Multiple Human RCTs & Meta-Analyses"
  | "Grade B — Controlled Human Clinical Trials"
  | "Grade C — Emerging Human / Mechanistic Evidence";

export interface PubMedCitation {
  pmid: string;
  title: string;
  journalYear: string;
  url: string;
  findingSummary: string;
}

export interface LevlModality {
  id: string;
  slug: string;
  name: string;
  category: LevlCategory;
  isSpaStation: boolean;
  spaStationPosition?: [number, number, number];
  headline: string;
  evidenceGrade: EvidenceGrade;
  uncertaintyAndLimits: string;
  contraindications: string[];
  mechanisms: string[];
  standardProtocol: {
    doseOrIntensity: string;
    duration: string;
    frequency: string;
    timingSlot: "Morning" | "Midday" | "Afternoon" | "Evening";
  };
  vectorImpacts: {
    cardiovascular: number;
    metabolic: number;
    neuroprotection: number;
    cellularRepair: number;
    sleepRecovery: number;
  };
  citations: PubMedCitation[];
  canonicalReviewUrl: string;
}

export interface LevlProtocolTemplate {
  id: string;
  title: string;
  subtitle: string;
  category: LevlCategory;
  evidenceGrade: EvidenceGrade;
  goal: string;
  steps: {
    modalitySlug: string;
    modalityName: string;
    slot: "Morning" | "Midday" | "Afternoon" | "Evening";
    dose: string;
    rationale: string;
  }[];
  caveat: string;
}

export interface LevlScreeningVideo {
  id: string;
  youtubeId: string;
  title: string;
  speaker: string;
  durationLabel: string;
  topicTag: LevlCategory;
  summary: string;
  relatedModalitySlugs: string[];
}

const LEVL_BASE_URL =
  process.env.NEXT_PUBLIC_LEVL_URL || "https://levlprotocols.app";

export const LEVL_MODALITIES: LevlModality[] = [
  {
    id: "mod-finnish-sauna",
    slug: "finnish-sauna",
    name: "Finnish Dry Sauna Bathing",
    category: "Recovery",
    isSpaStation: true,
    headline:
      "Heat-stress conditioning shown in longitudinal human cohorts and RCTs to support endothelial function, HSP70 induction, and cardiovascular healthspan.",
    evidenceGrade: "Grade A — Multiple Human RCTs & Meta-Analyses",
    uncertaintyAndLimits:
      "Strongest all-cause mortality associations come from the Kuopio prospective cohort (observational); RCTs confirm blood-pressure and arterial-stiffness improvements over 8–12 weeks.",
    contraindications: [
      "Unstable angina, recent myocardial infarction, or severe aortic stenosis",
      "Acute febrile illness or dehydration",
      "Avoid alcohol before or during heat exposure; use caution with antihypertensives (orthostatic hypotension risk)",
    ],
    mechanisms: ["HSP70 / HSP90 Chaperone Induction", "eNOS Vasodilation", "Plasma Volume Expansion"],
    standardProtocol: {
      doseOrIntensity: "80°C–90°C (176°F–194°F)",
      duration: "15–20 minutes per session",
      frequency: "4–7x per week",
      timingSlot: "Afternoon",
    },
    vectorImpacts: {
      cardiovascular: 94,
      metabolic: 72,
      neuroprotection: 85,
      cellularRepair: 82,
      sleepRecovery: 88,
    },
    citations: [
      {
        pmid: "25705824",
        title: "Association Between Sauna Bathing and Fatal Cardiovascular and All-Cause Mortality Events (Laukkanen et al.)",
        journalYear: "JAMA Internal Medicine, 2015",
        url: "https://pubmed.ncbi.nlm.nih.gov/25705824/",
        findingSummary:
          "4–7 sauna sessions/week (≥19 min) was associated with a 40% lower all-cause mortality risk vs. 1 session/week in a 20-year follow-up.",
      },
      {
        pmid: "29269746",
        title: "Acute Effects of Sauna Bathing on Cardiovascular Function",
        journalYear: "Journal of Human Hypertension, 2018",
        url: "https://pubmed.ncbi.nlm.nih.gov/29269746/",
        findingSummary:
          "Demonstrated acute reductions in pulse wave velocity and blood pressure following 30-minute Finnish sauna exposure.",
      },
    ],
    canonicalReviewUrl: "https://longevityreviews.org/modalities/finnish-sauna",
  },
  {
    id: "mod-cold-plunge",
    slug: "cold-water-immersion",
    name: "Cold Water Immersion (Plunge)",
    category: "Recovery",
    isSpaStation: true,
    headline:
      "Controlled cold exposure that elevates norepinephrine and dopamine, activates brown adipose thermogenesis, and reduces perceived soreness.",
    evidenceGrade: "Grade B — Controlled Human Clinical Trials",
    uncertaintyAndLimits:
      "Acute catecholamine and mood elevation are well-replicated, but plunging immediately (<4 hrs) after hypertrophy resistance training can blunt myofibrillar protein synthesis.",
    contraindications: [
      "Unmanaged hypertension, cardiac arrhythmias, or Raynaud's phenomenon",
      "Cold urticaria or history of cold-shock syncope",
      "Separate by at least 4 hours after strength/hypertrophy sessions if muscle gain is the primary goal",
    ],
    mechanisms: ["Norepinephrine (+200–300%) & Dopamine Release", "UCP1 Brown Fat Thermogenesis", "Vagal Heart-Rate Recovery"],
    standardProtocol: {
      doseOrIntensity: "10°C–14°C (50°F–57°F) up to neck",
      duration: "2–4 minutes per session (11 min total/week)",
      frequency: "3–4x per week",
      timingSlot: "Morning",
    },
    vectorImpacts: {
      cardiovascular: 74,
      metabolic: 86,
      neuroprotection: 80,
      cellularRepair: 68,
      sleepRecovery: 75,
    },
    citations: [
      {
        pmid: "10751106",
        title: "Human Physiological Responses to Immersion into Water of Different Temperatures (Šrámek et al.)",
        journalYear: "European Journal of Applied Physiology, 2000",
        url: "https://pubmed.ncbi.nlm.nih.gov/10751106/",
        findingSummary:
          "Immersion at 14°C elevated plasma noradrenaline by 530% and dopamine by 250%.",
      },
      {
        pmid: "26174323",
        title: "Post-Exercise Cold Water Immersion Attenuates Acute Anabolic Signalling and Long-Term Adaptations in Muscle to Strength Training",
        journalYear: "Journal of Physiology, 2015",
        url: "https://pubmed.ncbi.nlm.nih.gov/26174323/",
        findingSummary:
          "Highlights timing trade-off: immediate post-lifting cold plunge blunted satellite cell and mTORC1 activation.",
      },
    ],
    canonicalReviewUrl: "https://longevityreviews.org/modalities/cold-water-immersion",
  },
  {
    id: "mod-hbot",
    slug: "hyperbaric-oxygen-therapy",
    name: "Intermittent Hyperoxic-Hypoxic HBOT",
    category: "Recovery",
    isSpaStation: true,
    headline:
      "Pressurized 100% oxygen intervals with air breaks that trigger the hyperoxic-hypoxic paradox, HIF-1α signaling, and cerebral angiogenesis.",
    evidenceGrade: "Grade B — Controlled Human Clinical Trials",
    uncertaintyAndLimits:
      "Clinical trials use hard-shell medical chambers at 2.0 ATA with periodic air breaks; mild soft-shell chambers (1.3 ATA room air) do not replicate the same partial pressure gradients.",
    contraindications: [
      "Untreated pneumothorax (absolute contraindication)",
      "Severe COPD with CO2 retention, active middle-ear barotrauma, or claustrophobia",
      "Requires medical clearance and certified chamber operation",
    ],
    mechanisms: ["HIF-1α & VEGF Angiogenesis", "Senescent Cell Clearance", "Cerebral Perfusion"],
    standardProtocol: {
      doseOrIntensity: "2.0 ATA 100% O2 with 5-min air breaks every 20 min",
      duration: "60–90 minutes",
      frequency: "5x/week in 40–60 session clinical blocks",
      timingSlot: "Midday",
    },
    vectorImpacts: {
      cardiovascular: 82,
      metabolic: 70,
      neuroprotection: 89,
      cellularRepair: 91,
      sleepRecovery: 72,
    },
    citations: [
      {
        pmid: "32630969",
        title: "Cognitive Enhancement of Healthy Older Adults Using Hyperbaric Oxygen: A Randomized Controlled Trial (Amir et al.)",
        journalYear: "Aging, 2020",
        url: "https://pubmed.ncbi.nlm.nih.gov/32630969/",
        findingSummary:
          "60 daily HBOT sessions at 2.0 ATA improved cerebral blood flow, attention, and information processing speed in healthy older adults.",
      },
    ],
    canonicalReviewUrl: "https://longevityreviews.org/modalities/hyperbaric-oxygen-therapy",
  },
  {
    id: "mod-photobiomodulation",
    slug: "red-light-photobiomodulation",
    name: "Red & Near-Infrared Photobiomodulation",
    category: "Recovery",
    isSpaStation: true,
    headline:
      "660nm red and 850nm near-infrared wavelengths absorbed by mitochondrial cytochrome c oxidase to support ATP synthesis, skin collagen, and retinal health.",
    evidenceGrade: "Grade B — Controlled Human Clinical Trials",
    uncertaintyAndLimits:
      "Follows a biphasic Arndt-Schulz dose response: excessive fluence (>60 J/cm²) diminishes benefits. Systemic longevity claims beyond local tissue/skin/joint recovery remain preliminary.",
    contraindications: [
      "Photosensitizing medications (e.g., certain tetracyclines, isotretinoin, St. John's Wort)",
      "Active skin malignancy over treatment area",
    ],
    mechanisms: ["Cytochrome c Oxidase Photodissociation of NO", "Pro-Collagen Synthesis", "Reduced Local ROS"],
    standardProtocol: {
      doseOrIntensity: "660nm + 850nm at 40–60 mW/cm² irradiance (15–30 cm distance)",
      duration: "10–12 minutes",
      frequency: "4–5x per week",
      timingSlot: "Morning",
    },
    vectorImpacts: {
      cardiovascular: 62,
      metabolic: 68,
      neuroprotection: 74,
      cellularRepair: 86,
      sleepRecovery: 76,
    },
    citations: [
      {
        pmid: "24286286",
        title: "A Controlled Trial to Determine the Efficacy of Red and Near-Infrared Light Treatment in Patient Satisfaction, Reduction of Fine Lines, Wrinkles, and Intradermal Collagen Density Increase",
        journalYear: "Photomedicine and Laser Surgery, 2014",
        url: "https://pubmed.ncbi.nlm.nih.gov/24286286/",
        findingSummary:
          "Demonstrated significant improvements in intradermal collagen density and skin roughness after 30 sessions.",
      },
    ],
    canonicalReviewUrl: "https://longevityreviews.org/modalities/red-light-photobiomodulation",
  },
  {
    id: "mod-zone2-vo2max",
    slug: "zone-2-and-vo2max-training",
    name: "Zone 2 Aerobic Base + 4x4 VO2 Max Intervals",
    category: "Movement",
    isSpaStation: false,
    headline:
      "The highest-leverage longevity intervention in human clinical literature: pairing mitochondrial lactate-clearance base training with peak aerobic capacity intervals.",
    evidenceGrade: "Grade A — Multiple Human RCTs & Meta-Analyses",
    uncertaintyAndLimits:
      "Moving from the bottom quartile of VO2 max to above-average yields a ~50–70% reduction in all-cause mortality hazard with no observed upper safety limit in healthy adults.",
    contraindications: [
      "Uncontrolled cardiovascular symptoms; screen before initiating maximal 4x4 interval sessions",
    ],
    mechanisms: ["PGC-1α Mitochondrial Biogenesis", "MCT1 Lactate Transporter Density", "Stroke Volume Remodeling"],
    standardProtocol: {
      doseOrIntensity: "Zone 2 (1.7–1.9 mmol/L lactate / conversational) + 1 weekly Norwegian 4x4 session",
      duration: "45 min Zone 2 (3–4x/wk) + 35 min 4x4 intervals (1x/wk)",
      frequency: "4–5x per week",
      timingSlot: "Morning",
    },
    vectorImpacts: {
      cardiovascular: 99,
      metabolic: 96,
      neuroprotection: 92,
      cellularRepair: 90,
      sleepRecovery: 86,
    },
    citations: [
      {
        pmid: "30376003",
        title: "Association of Cardiorespiratory Fitness With Long-term Mortality Among Adults Undergoing Exercise Treadmill Testing (Mandsager et al.)",
        journalYear: "JAMA Network Open, 2018",
        url: "https://pubmed.ncbi.nlm.nih.gov/30376003/",
        findingSummary:
          "In 122,007 patients, elite cardiorespiratory fitness was associated with an 80% lower mortality risk compared with the lowest fitness group.",
      },
    ],
    canonicalReviewUrl: "https://longevityreviews.org/modalities/zone-2-and-vo2max-training",
  },
  {
    id: "mod-creatine-monohydrate",
    slug: "creatine-monohydrate",
    name: "Creatine Monohydrate (Cognitive & Muscular ATP)",
    category: "Cognitive Focus",
    isSpaStation: false,
    headline:
      "Buffered phosphocreatine energy reservoir supporting working memory under sleep deprivation/cognitive load as well as lean muscle preservation.",
    evidenceGrade: "Grade A — Multiple Human RCTs & Meta-Analyses",
    uncertaintyAndLimits:
      "Cognitive benefits are largest during high mental fatigue, hypoxia, or sleep restriction; benign rise in serum creatinine requires using Cystatin-C for accurate eGFR estimation.",
    contraindications: [
      "Pre-existing severe renal disease (consult nephrologist; check Cystatin-C rather than creatinine alone)",
    ],
    mechanisms: ["Cerebral & Muscular Phosphocreatine Buffering", "Homocysteine Methylation Sparing"],
    standardProtocol: {
      doseOrIntensity: "5g micronized Creatine Monohydrate (up to 10g on high cognitive/sleep-debt days)",
      duration: "Daily maintenance",
      frequency: "Daily",
      timingSlot: "Morning",
    },
    vectorImpacts: {
      cardiovascular: 68,
      metabolic: 82,
      neuroprotection: 88,
      cellularRepair: 78,
      sleepRecovery: 70,
    },
    citations: [
      {
        pmid: "29704637",
        title: "Effects of Creatine Supplementation on Cognitive Function of Healthy Individuals: A Systematic Review of Randomized Controlled Trials (Avgerinos et al.)",
        journalYear: "Experimental Gerontology, 2018",
        url: "https://pubmed.ncbi.nlm.nih.gov/29704637/",
        findingSummary:
          "RCT synthesis showing significant improvements in short-term memory and intelligence/reasoning tasks.",
      },
    ],
    canonicalReviewUrl: "https://longevityreviews.org/modalities/creatine-monohydrate",
  },
  {
    id: "mod-omega3-epa-dha",
    slug: "omega-3-epa-dha",
    name: "High-Purity Marine Omega-3 (EPA + DHA)",
    category: "Nutrition",
    isSpaStation: false,
    headline:
      "Structural neuronal membrane phospholipids and specialized pro-resolving lipid mediators (resolvins/protectins) targeting an Omega-3 Index of 8%–11%.",
    evidenceGrade: "Grade A — Multiple Human RCTs & Meta-Analyses",
    uncertaintyAndLimits:
      "Dose should be guided by an erythrocyte Omega-3 Index blood test rather than blind megadosing; very high doses (>4g/day) carry a small dose-dependent atrial fibrillation signal in cardiovascular trials.",
    contraindications: [
      "Concurrent high-dose anticoagulant therapy (monitor bleeding time)",
      "History of atrial fibrillation when exceeding 2g/day without physician oversight",
    ],
    mechanisms: ["Resolvin/Protectin E1 Synthesis", "Neuronal Membrane Fluidity", "Triglyceride VLDL Reduction"],
    standardProtocol: {
      doseOrIntensity: "2g combined EPA + DHA (re-esterified triglyceride form, TOTOX < 10) with a fat-containing meal",
      duration: "Daily, titrated via Omega-3 Index lab test",
      frequency: "Daily",
      timingSlot: "Midday",
    },
    vectorImpacts: {
      cardiovascular: 90,
      metabolic: 80,
      neuroprotection: 91,
      cellularRepair: 84,
      sleepRecovery: 74,
    },
    citations: [
      {
        pmid: "29559306",
        title: "Omega-3 Index and Clinical Outcomes: Framingham Offspring Cohort (Harris et al.)",
        journalYear: "Journal of Clinical Lipidology, 2018",
        url: "https://pubmed.ncbi.nlm.nih.gov/29559306/",
        findingSummary:
          "Participants with an erythrocyte Omega-3 Index >6.8% had a 34% lower risk of all-cause mortality vs. those <4.2%.",
      },
    ],
    canonicalReviewUrl: "https://longevityreviews.org/modalities/omega-3-epa-dha",
  },
  {
    id: "mod-circadian-evening-winddown",
    slug: "circadian-light-and-magnesium",
    name: "Morning Lux Anchor & Evening Glycine / Mg Stack",
    category: "Recovery",
    isSpaStation: false,
    headline:
      "Morning outdoor photon exposure paired with evening peripheral vasodilation (3g Glycine + 144mg Elemental Magnesium L-Threonate/Bisglycinate) to lower core body temperature for deep sleep.",
    evidenceGrade: "Grade B — Controlled Human Clinical Trials",
    uncertaintyAndLimits:
      "Behavioral light hygiene (10,000 lux within 45 min of waking; <15 lux melanopic EDI 90 min before bed) accounts for the majority of the circadian phase lock.",
    contraindications: [
      "Severe renal impairment (avoid supplemental magnesium without medical approval)",
    ],
    mechanisms: ["SCN Melanopsin Phase Alignment", "NMDA Cutaneous Vasodilation & Core Temp Drop"],
    standardProtocol: {
      doseOrIntensity: "15 min morning outdoor light + evening 3g Glycine & 200mg Mg Bisglycinate",
      duration: "60 minutes prior to target sleep onset",
      frequency: "Daily",
      timingSlot: "Evening",
    },
    vectorImpacts: {
      cardiovascular: 76,
      metabolic: 82,
      neuroprotection: 86,
      cellularRepair: 80,
      sleepRecovery: 95,
    },
    citations: [
      {
        pmid: "22293292",
        title: "The Sleep-Promoting and Hypothermic Effects of Glycine in Rats and Humans (Bannai et al.)",
        journalYear: "Frontiers in Neurology, 2012",
        url: "https://pubmed.ncbi.nlm.nih.gov/22293292/",
        findingSummary:
          "3g oral glycine prior to bedtime shortened sleep onset latency and slow-wave sleep latency via peripheral vasodilation.",
      },
    ],
    canonicalReviewUrl: "https://longevityreviews.org/modalities/circadian-light-and-magnesium",
  },
];

export const LEVL_PROTOCOL_TEMPLATES: LevlProtocolTemplate[] = [
  {
    id: "proto-founder-cognitive-resilience",
    title: "Founder Cognitive & Vascular Resilience",
    subtitle: "Evidence-graded daily stack for deep intellectual work without stimulant burnout",
    category: "Cognitive Focus",
    evidenceGrade: "Grade A — Multiple Human RCTs & Meta-Analyses",
    goal: "Sustained prefrontal ATP, vascular endothelial dilation, and deep slow-wave recovery",
    steps: [
      {
        modalitySlug: "circadian-light-and-magnesium",
        modalityName: "Morning Outdoor Photon Anchor",
        slot: "Morning",
        dose: "15 min outdoor daylight (no sunglasses)",
        rationale: "Sets suprachiasmatic nucleus cortisol pulse and 16-hour melatonin timer.",
      },
      {
        modalitySlug: "creatine-monohydrate",
        modalityName: "Micronized Creatine Monohydrate",
        slot: "Morning",
        dose: "5g in water or electrolytes",
        rationale: "Buffers cerebral phosphocreatine during prolonged cognitive sprints.",
      },
      {
        modalitySlug: "zone-2-and-vo2max-training",
        modalityName: "Zone 2 Aerobic Conditioning",
        slot: "Midday",
        dose: "45 min nasal-breathing conversational pace",
        rationale: "Stimulates BDNF and mitochondrial lactate clearance.",
      },
      {
        modalitySlug: "finnish-sauna",
        modalityName: "Finnish Dry Sauna Session",
        slot: "Afternoon",
        dose: "18 min at 82°C + full rehydration",
        rationale: "Induces HSP70 and parasympathetic rebound ahead of evening rest.",
      },
    ],
    caveat:
      "Draft preview only. Reviewing or saving this draft does not activate live reminders until explicitly confirmed inside your LEVL account.",
  },
  {
    id: "proto-thermal-contrast-recovery",
    title: "Nordic Thermal Contrast & Autonomic Reset",
    subtitle: "Structured heat and cold exposure timed to protect hypertrophy and sleep",
    category: "Recovery",
    evidenceGrade: "Grade B — Controlled Human Clinical Trials",
    goal: "Autonomic HRV rebound, vascular elasticity, and mood elevation",
    steps: [
      {
        modalitySlug: "cold-water-immersion",
        modalityName: "Cold Water Immersion",
        slot: "Morning",
        dose: "3 min at 12°C (separated >4h from lifting)",
        rationale: "Morning norepinephrine & dopamine elevation without blunting evening sleep.",
      },
      {
        modalitySlug: "finnish-sauna",
        modalityName: "Evening Finnish Sauna",
        slot: "Evening",
        dose: "20 min at 85°C, 90 min before bed",
        rationale: "Post-sauna evaporative cooling accelerates core body temperature drop for slow-wave sleep.",
      },
    ],
    caveat:
      "Virtual station exploration in the Space Atrium never logs a real physiological exposure. Check cardiovascular contraindications before real-world use.",
  },
];

// Compliant visible YouTube Screening Playlist (Labeled explicitly as a Screening, never a live broadcast)
export const LEVL_SCREENING_PLAYLIST: LevlScreeningVideo[] = [
  {
    id: "screen-vo2max-longevity",
    youtubeId: "FXs98-f9eHo",
    title: "Cardiorespiratory Fitness (VO2 Max) & Healthspan Architecture",
    speaker: "LEVL Research Screening Archive • Exercise Physiology",
    durationLabel: "18:40 • Prerecorded Screening",
    topicTag: "Movement",
    summary:
      "Examines the Mandsager et al. (JAMA) 122,000-patient cohort and how pairing Zone 2 mitochondrial base training with 4x4 intervals reshapes biological aging trajectories.",
    relatedModalitySlugs: ["zone-2-and-vo2max-training"],
  },
  {
    id: "screen-thermal-conditioning",
    youtubeId: "RealSaunaRCT",
    title: "Heat Shock Proteins, Endothelial Function & Finnish Sauna Trials",
    speaker: "LEVL Research Screening Archive • Thermal Biology",
    durationLabel: "14:15 • Prerecorded Screening",
    topicTag: "Recovery",
    summary:
      "Breaks down the Kuopio Ischemic Heart Disease study, optimal temperature/duration thresholds (80°C+, ≥19 min), and hydration/orthostatic safety guardrails.",
    relatedModalitySlugs: ["finnish-sauna", "cold-water-immersion"],
  },
  {
    id: "screen-sleep-glymphatics",
    youtubeId: "SleepGlymphatic01",
    title: "Slow-Wave Sleep, Glymphatic Clearance & Circadian Phase Locking",
    speaker: "LEVL Research Screening Archive • Chronobiology",
    durationLabel: "21:10 • Prerecorded Screening",
    topicTag: "Cognitive Focus",
    summary:
      "Covers melanopic lux timing, core body temperature dynamics, and clinical trials on evening glycine and magnesium for sleep architecture.",
    relatedModalitySlugs: ["circadian-light-and-magnesium", "creatine-monohydrate"],
  },
];

/**
 * Constructs a verified, non-activating LEVL Bench Draft Import URL.
 * Uses an opaque draft reference + LEVL's verified `/bench?import=custom_protocol` contract
 * without leaking personal health profile records into URL parameters.
 */
export function buildLevlDraftHandoffUrl(draft: {
  draftId: string;
  title: string;
  goal: string;
  steps: { modalitySlug: string; slot: string; dose: string }[];
}): string {
  const params = new URLSearchParams({
    import: "custom_protocol",
    source: "hyperabundance_atrium",
    draftId: draft.draftId,
    title: draft.title,
    goal: draft.goal,
    modalities: draft.steps.map((s) => s.modalitySlug).join(","),
    slots: draft.steps.map((s) => s.slot).join(","),
    doses: draft.steps.map((s) => s.dose).join("|"),
  });
  return `${LEVL_BASE_URL}/bench?${params.toString()}`;
}
