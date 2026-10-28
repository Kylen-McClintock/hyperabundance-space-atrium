"use client";

import { WingId } from "@/lib/spatial/waypoint-registry";

export type DjMood = "deep-focus" | "calm" | "energetic" | "night-horizon";

export interface DjTrackInfo {
  id: string;
  title: string;
  artist: string;
  mood: DjMood;
  license: string;
  bpm: number;
  description: string;
}

export const DJ_TRACK_CATALOG: Record<DjMood, DjTrackInfo> = {
  "deep-focus": {
    id: "synth-deep-focus",
    title: "Orbital Apogee (Deep Focus)",
    artist: "HyperAbundance Procedural Synth Engine",
    mood: "deep-focus",
    license: "Original First-Party Web Audio Synthesis (Royalty-Free / CC0)",
    bpm: 60,
    description:
      "Warm sub-orbital analog pad in D minor9 with subtle binaural focus harmonics.",
  },
  calm: {
    id: "synth-orbital-calm",
    title: "Botanical Canopy & Earthshine (Calm)",
    artist: "HyperAbundance Procedural Synth Engine",
    mood: "calm",
    license: "Original First-Party Web Audio Synthesis (Royalty-Free / CC0)",
    bpm: 52,
    description:
      "Weightless glass overtones, warm travertine reverb tail, and gentle harmonic swells.",
  },
  energetic: {
    id: "synth-builder-flow",
    title: "Inventor's Meridian (Builder Flow)",
    artist: "HyperAbundance Procedural Synth Engine",
    mood: "energetic",
    license: "Original First-Party Web Audio Synthesis (Royalty-Free / CC0)",
    bpm: 108,
    description:
      "Optimistic polyrhythmic arpeggio pulse with warm copper-synth chord beds.",
  },
  "night-horizon": {
    id: "synth-night-horizon",
    title: "Terminator Line City Lights (Night Horizon)",
    artist: "HyperAbundance Procedural Synth Engine",
    mood: "night-horizon",
    license: "Original First-Party Web Audio Synthesis (Royalty-Free / CC0)",
    bpm: 48,
    description:
      "Deep meditative cosmic drone for late-night writing and quiet reading.",
  },
};

const MOOD_CHORD_FREQUENCIES: Record<DjMood, number[]> = {
  "deep-focus": [146.83, 220.0, 261.63, 329.63, 440.0], // D3, A3, C4, E4, A4 (Dm9)
  calm: [174.61, 220.0, 261.63, 349.23, 392.0], // Fmaj9
  energetic: [196.0, 246.94, 293.66, 369.99, 440.0], // Gmaj9
  "night-horizon": [110.0, 164.81, 220.0, 246.94, 329.63], // Asus2/9
};

class OrbitalSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private uiGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private arpInterval: ReturnType<typeof setInterval> | null = null;

  private isPlaying = false;
  private isMuted = false;
  private isDuckedByVideo = false;
  private currentMood: DjMood = "deep-focus";
  private currentWing: WingId = "atrium";

  private musicVolume = 0.45;
  private ambientVolume = 0.35;
  private uiVolume = 0.5;

  public start(mood: DjMood = this.currentMood): boolean {
    if (typeof window === "undefined") return false;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioContextClass();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      this.currentMood = mood;
      this.rebuildGraph();
      this.isPlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  public stop(): void {
    this.clearNodes();
    this.isPlaying = false;
  }

  public setMood(mood: DjMood): void {
    this.currentMood = mood;
    if (this.isPlaying) {
      this.rebuildGraph();
    }
  }

  public setWing(wing: WingId): void {
    this.currentWing = wing;
    if (this.ctx && this.filterNode) {
      const targetCutoff =
        wing === "levl"
          ? 950
          : wing === "agifutures"
          ? 1450
          : wing === "conservatory"
          ? 850
          : 1100;
      this.filterNode.frequency.setTargetAtTime(
        targetCutoff,
        this.ctx.currentTime,
        0.8
      );
    }
  }

  public setVolumes(vols: {
    music?: number;
    ambient?: number;
    ui?: number;
    muted?: boolean;
  }): void {
    if (typeof vols.music === "number") this.musicVolume = vols.music;
    if (typeof vols.ambient === "number") this.ambientVolume = vols.ambient;
    if (typeof vols.ui === "number") this.uiVolume = vols.ui;
    if (typeof vols.muted === "boolean") this.isMuted = vols.muted;
    this.applyGains();
  }

  public setVideoScreeningActive(active: boolean): void {
    this.isDuckedByVideo = active;
    this.applyGains();
  }

  public playUiChime(kind: "arrive" | "complete" | "save" = "arrive"): void {
    if (!this.ctx || this.isMuted || this.uiVolume <= 0.01) return;
    try {
      if (this.ctx.state === "suspended") this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";

      const notes =
        kind === "complete"
          ? [523.25, 659.25, 783.99, 1046.5]
          : kind === "save"
          ? [440, 554.37, 659.25]
          : [440, 659.25];

      notes.forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
      });

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(
        0.08 * this.uiVolume,
        now + 0.03
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + notes.length * 0.14 + 0.25
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + notes.length * 0.14 + 0.3);
    } catch {
      // Ignore chime errors if context not unlocked
    }
  }

  private applyGains(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const effectiveMusic =
      this.isMuted || this.isDuckedByVideo ? 0.0001 : Math.max(0.0001, this.musicVolume * 0.18);
    const effectiveAmbient =
      this.isMuted || this.isDuckedByVideo ? 0.0001 : Math.max(0.0001, this.ambientVolume * 0.08);

    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(effectiveMusic, now, 0.35);
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(effectiveAmbient, now, 0.35);
    }
  }

  private clearNodes(): void {
    if (this.arpInterval) {
      clearInterval(this.arpInterval);
      this.arpInterval = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already-stopped oscillator
      }
    });
    this.activeOscillators = [];
  }

  private rebuildGraph(): void {
    if (!this.ctx) return;
    this.clearNodes();

    const now = this.ctx.currentTime;
    this.musicGain = this.ctx.createGain();
    this.ambientGain = this.ctx.createGain();
    this.uiGain = this.ctx.createGain();

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.setValueAtTime(1050, now);
    this.filterNode.Q.setValueAtTime(0.7, now);

    this.musicGain.connect(this.filterNode);
    this.ambientGain.connect(this.filterNode);
    this.filterNode.connect(this.ctx.destination);

    this.applyGains();

    // 1. Warm Analog Pad Voices
    const chord = MOOD_CHORD_FREQUENCIES[this.currentMood];
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const voiceGain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((idx - 2) * 4.5, now);

      voiceGain.gain.setValueAtTime(0.18 / chord.length, now);

      // Slow breathing modulation
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.07 + idx * 0.03, now);
      lfoGain.gain.setValueAtTime(0.05 / chord.length, now);

      lfo.connect(lfoGain);
      lfoGain.connect(voiceGain.gain);
      osc.connect(voiceGain);
      voiceGain.connect(this.musicGain);

      osc.start(now);
      lfo.start(now);
      this.activeOscillators.push(osc, lfo);
    });

    // 2. Subtle Orbital Hull & Botanical Air Ambience (Filtered Sub-Harmonic)
    const hullOsc = this.ctx.createOscillator();
    hullOsc.type = "sine";
    hullOsc.frequency.setValueAtTime(55.0, now); // A1 warm room fundamental
    hullOsc.connect(this.ambientGain);
    hullOsc.start(now);
    this.activeOscillators.push(hullOsc);

    // 3. Gentle Arpeggio Note Plucks for Builder Flow / Calm
    const intervalMs =
      this.currentMood === "energetic"
        ? 550
        : this.currentMood === "calm"
        ? 1800
        : 2600;

    let step = 0;
    this.arpInterval = setInterval(() => {
      if (
        !this.ctx ||
        !this.musicGain ||
        !this.isPlaying ||
        this.isMuted ||
        this.isDuckedByVideo ||
        document.hidden
      ) {
        return;
      }
      const notes = MOOD_CHORD_FREQUENCIES[this.currentMood];
      const noteFreq = notes[step % notes.length] * 2;
      step++;

      const t = this.ctx.currentTime;
      const pluck = this.ctx.createOscillator();
      const pluckGain = this.ctx.createGain();
      pluck.type = "sine";
      pluck.frequency.setValueAtTime(noteFreq, t);

      pluckGain.gain.setValueAtTime(0.0001, t);
      pluckGain.gain.exponentialRampToValueAtTime(0.045, t + 0.04);
      pluckGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);

      pluck.connect(pluckGain);
      pluckGain.connect(this.musicGain);
      pluck.start(t);
      pluck.stop(t + 1.45);
    }, intervalMs);
  }
}

export const soundscapeEngine = new OrbitalSoundscapeEngine();
