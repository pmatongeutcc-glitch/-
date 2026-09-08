// Web Audio API sound effects and confetti generator
import { SoundSetKey, SoundType } from "../types";

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedAudioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (e) {
    console.warn("AudioContext error", e);
    return null;
  }
}

// Noise buffer generator for hits, swooshes, and explosions
function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function playSound(
  type: SoundType,
  enabled: boolean = true,
  soundSet: SoundSetKey = "retro"
) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    // ==========================================
    // 1. RETRO 8-BIT ARCADE SOUND SET
    // ==========================================
    if (soundSet === "retro") {
      if (type === "habit" || type === "good") {
        // 8-bit coin jump (B5 -> E6)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.06);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.12, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "boss_hit") {
        // 8-bit crunch hit: pitch drop + noise burst
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
        oscGain.gain.setValueAtTime(0.16, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);

        // Filtered noise snap
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, 0.08);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(800, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.14, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
      } else if (type === "boss_crit") {
        // 8-bit laser critical strike: fast triple arpeggio burst + bass thud
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "square";
        thud.frequency.setValueAtTime(140, now);
        thud.frequency.exponentialRampToValueAtTime(45, now + 0.15);
        thudGain.gain.setValueAtTime(0.18, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        thud.connect(thudGain);
        thudGain.connect(ctx.destination);
        thud.start(now);
        thud.stop(now + 0.15);

        [0, 0.04, 0.08].forEach((delay, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          const baseFreq = idx === 0 ? 659.25 : idx === 1 ? 987.77 : 1567.98;
          osc.frequency.setValueAtTime(baseFreq, now + delay);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + delay + 0.07);
          gain.gain.setValueAtTime(0.15, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.09);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.09);
        });
      } else if (type === "boss_weakness") {
        // 8-bit Super Effective / Weakness Exploited: High sparkle arpeggio + crystal ping + rising pitch
        const sparkNoise = ctx.createBufferSource();
        sparkNoise.buffer = createNoiseBuffer(ctx, 0.12);
        const sparkFilter = ctx.createBiquadFilter();
        sparkFilter.type = "bandpass";
        sparkFilter.frequency.setValueAtTime(3200, now);
        sparkFilter.Q.setValueAtTime(6, now);
        const sparkGain = ctx.createGain();
        sparkGain.gain.setValueAtTime(0.18, now);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        sparkNoise.connect(sparkFilter);
        sparkFilter.connect(sparkGain);
        sparkGain.connect(ctx.destination);
        sparkNoise.start(now);

        // Ascending high arpeggio sequence (G5, B5, D6, G6)
        const notes = [783.99, 987.77, 1174.66, 1567.98];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          const start = now + idx * 0.035;
          osc.frequency.setValueAtTime(freq, start);
          osc.frequency.linearRampToValueAtTime(freq * 1.08, start + 0.08);
          gain.gain.setValueAtTime(0.14, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + (idx === 3 ? 0.25 : 0.09));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + (idx === 3 ? 0.25 : 0.09));
        });
      } else if (type === "boss_super_crit") {
        // 8-bit Super Critical: Heavy explosion + weakness sparkle + high power arpeggio
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, 0.18);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1600, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.18);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        const notes = [523.25, 783.99, 1046.5, 1567.98, 2093.0];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          const start = now + idx * 0.035;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.16, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + (idx === 4 ? 0.35 : 0.09));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + (idx === 4 ? 0.35 : 0.09));
        });
      } else if (type === "boss_defeat") {
        // 8-bit explosion followed by triumphant arcade victory fan-fare
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, 0.25);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.linearRampToValueAtTime(150, now + 0.25);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        // Ascending 8-bit arpeggio: C5, E5, G5, C6, E6
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          const start = now + 0.18 + idx * 0.07;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + (idx === 4 ? 0.35 : 0.09));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + (idx === 4 ? 0.35 : 0.09));
        });
      } else if (type === "levelup") {
        // Classic 8-bit fanfare: C5 -> E5 -> G5 -> C6 chord
        const notes = [
          { f: 523.25, d: 0.08, t: 0 },
          { f: 659.25, d: 0.08, t: 0.08 },
          { f: 783.99, d: 0.08, t: 0.16 },
          { f: 1046.5, d: 0.35, t: 0.24 },
        ];
        notes.forEach(({ f, d, t: dt }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(f, now + dt);
          gain.gain.setValueAtTime(0.12, now + dt);
          gain.gain.exponentialRampToValueAtTime(0.001, now + dt + d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + dt);
          osc.stop(now + dt + d);
        });
      } else if (type === "bad") {
        // 8-bit descending buzz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(75, now + 0.22);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "gacha") {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          const start = now + idx * 0.09;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.14, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.25);
        });
      } else if (type === "timer") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1760, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      }
      return;
    }

    // ==========================================
    // 2. FANTASY RPG SOUND SET
    // ==========================================
    if (soundSet === "fantasy") {
      if (type === "habit" || type === "good") {
        // Magical fairy chime / glockenspiel (C6 + C7 shimmer)
        const fundamental = 1046.5;
        [fundamental, fundamental * 2].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.3);
          const initialVol = idx === 0 ? 0.14 : 0.07;
          gain.gain.setValueAtTime(initialVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        });
      } else if (type === "boss_hit") {
        // Steel blade slash & impact
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, 0.14);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(2400, now);
        filter.frequency.exponentialRampToValueAtTime(600, now + 0.14);
        filter.Q.setValueAtTime(3, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        // Low body impact thud
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(160, now);
        thud.frequency.exponentialRampToValueAtTime(50, now + 0.12);
        thudGain.gain.setValueAtTime(0.15, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        thud.connect(thudGain);
        thudGain.connect(ctx.destination);
        thud.start(now);
        thud.stop(now + 0.12);
      } else if (type === "boss_crit") {
        // Thunder blade critical strike: Deep bass + magic blade slash + sparkling ring
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(110, now);
        thud.frequency.exponentialRampToValueAtTime(40, now + 0.25);
        thudGain.gain.setValueAtTime(0.22, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        thud.connect(thudGain);
        thudGain.connect(ctx.destination);
        thud.start(now);
        thud.stop(now + 0.25);

        // Magical dual steel ring (1568Hz + 2349Hz)
        [1567.98, 2349.32].forEach((freq) => {
          const bell = ctx.createOscillator();
          const bellGain = ctx.createGain();
          bell.type = "triangle";
          bell.frequency.setValueAtTime(freq, now + 0.03);
          bellGain.gain.setValueAtTime(0.12, now + 0.03);
          bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          bell.connect(bellGain);
          bellGain.connect(ctx.destination);
          bell.start(now + 0.03);
          bell.stop(now + 0.4);
        });
      } else if (type === "boss_weakness") {
        // Fantasy Elemental Armor Shatter & Pierce: Glass/crystal fracture + piercing whoosh + enchanted bell
        const shatterNoise = ctx.createBufferSource();
        shatterNoise.buffer = createNoiseBuffer(ctx, 0.16);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(3600, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.16);
        filter.Q.setValueAtTime(4, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        shatterNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        shatterNoise.start(now);

        // High crystalline harmonic chime (E6 1318.51Hz & B6 1975.53Hz & E7 2637Hz)
        [1318.51, 1975.53, 2637.0].forEach((freq, idx) => {
          const chime = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          chime.type = "sine";
          chime.frequency.setValueAtTime(freq, now + idx * 0.02);
          chimeGain.gain.setValueAtTime(idx === 0 ? 0.15 : 0.09, now + idx * 0.02);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
          chime.connect(chimeGain);
          chimeGain.connect(ctx.destination);
          chime.start(now + idx * 0.02);
          chime.stop(now + 0.38);
        });

        // Piercing enchanted blade sting (triangle 880Hz -> 1320Hz)
        const sting = ctx.createOscillator();
        const stingGain = ctx.createGain();
        sting.type = "triangle";
        sting.frequency.setValueAtTime(880, now);
        sting.frequency.exponentialRampToValueAtTime(1320, now + 0.14);
        stingGain.gain.setValueAtTime(0.14, now);
        stingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        sting.connect(stingGain);
        stingGain.connect(ctx.destination);
        sting.start(now);
        sting.stop(now + 0.14);
      } else if (type === "boss_super_crit") {
        // Fantasy Super Divine Critical: Thunder boom + armor shatter + celestial triple ring
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(120, now);
        thud.frequency.exponentialRampToValueAtTime(35, now + 0.3);
        thudGain.gain.setValueAtTime(0.25, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        thud.connect(thudGain);
        thudGain.connect(ctx.destination);
        thud.start(now);
        thud.stop(now + 0.3);

        [1046.5, 1567.98, 2093.0, 3135.96].forEach((freq, idx) => {
          const bell = ctx.createOscillator();
          const bellGain = ctx.createGain();
          bell.type = "triangle";
          bell.frequency.setValueAtTime(freq, now + idx * 0.03);
          bellGain.gain.setValueAtTime(0.12, now + idx * 0.03);
          bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          bell.connect(bellGain);
          bellGain.connect(ctx.destination);
          bell.start(now + idx * 0.03);
          bell.stop(now + 0.5);
        });
        // Epic Heroic Fanfare & Victory Brass
        const chord = [392.0, 523.25, 659.25, 783.99, 1046.5];
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          const start = now + idx * 0.08;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.14, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.55);
        });
      } else if (type === "levelup") {
        // Grand Royal Horn Fanfare
        const notes = [
          { f: 392.0, t: 0, d: 0.12 },
          { f: 523.25, t: 0.1, d: 0.12 },
          { f: 659.25, t: 0.2, d: 0.12 },
          { f: 783.99, t: 0.3, d: 0.4 },
          { f: 1046.5, t: 0.3, d: 0.4 },
        ];
        notes.forEach(({ f, t: dt, d }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, now + dt);
          gain.gain.setValueAtTime(0.14, now + dt);
          gain.gain.exponentialRampToValueAtTime(0.001, now + dt + d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + dt);
          osc.stop(now + dt + d);
        });
      } else if (type === "bad") {
        // Low dungeon beast groan
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.28);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === "gacha") {
        // Fairy harp glissando
        const arpeggio = [587.33, 739.99, 880.0, 1174.66, 1479.98];
        arpeggio.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          const start = now + idx * 0.08;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.35);
        });
      } else if (type === "timer") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(700, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
      return;
    }

    // ==========================================
    // 3. ZEN & CRYSTAL CHIMES SOUND SET
    // ==========================================
    if (soundSet === "zen") {
      if (type === "habit" || type === "good") {
        // Crystal singing bowl / pure bell (D5 587.33Hz + overtone)
        const fundamental = 587.33;
        const overtone = fundamental * 2.76;
        [
          { f: fundamental, v: 0.15, d: 0.48 },
          { f: overtone, v: 0.04, d: 0.3 },
        ].forEach(({ f, v, d }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(v, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + d);
        });
      } else if (type === "boss_hit") {
        // Bamboo woodblock tap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = "triangle";
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(680, now);
        filter.Q.setValueAtTime(6, now);
        osc.frequency.setValueAtTime(720, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === "boss_crit") {
        // Sacred bronze ting-sha chime (1174Hz + 2790Hz sparkling shimmer)
        [1174.66, 2790.0].forEach((freq, idx) => {
          const bell = ctx.createOscillator();
          const gain = ctx.createGain();
          bell.type = "sine";
          bell.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(idx === 0 ? 0.16 : 0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          bell.connect(gain);
          gain.connect(ctx.destination);
          bell.start(now);
          bell.stop(now + 0.55);
        });
      } else if (type === "boss_weakness") {
        // Zen Crystal Harmonic Resonance: Pure crystal chime cascade + hollow bamboo snap + singing bowl pulse
        const fundamental = 528.0; // 528Hz Solfeggio frequency
        const bowl = ctx.createOscillator();
        const bowlGain = ctx.createGain();
        bowl.type = "sine";
        bowl.frequency.setValueAtTime(fundamental, now);
        bowlGain.gain.setValueAtTime(0.18, now);
        bowlGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        bowl.connect(bowlGain);
        bowlGain.connect(ctx.destination);
        bowl.start(now);
        bowl.stop(now + 0.5);

        // Ascending harmonic crystal chimes (1046.5Hz C6 -> 1567.98Hz G6 -> 2093Hz C7)
        [1046.5, 1567.98, 2093.0].forEach((freq, idx) => {
          const chime = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          chime.type = "sine";
          chime.frequency.setValueAtTime(freq, now + idx * 0.04);
          chimeGain.gain.setValueAtTime(idx === 0 ? 0.16 : 0.1, now + idx * 0.04);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          chime.connect(chimeGain);
          chimeGain.connect(ctx.destination);
          chime.start(now + idx * 0.04);
          chime.stop(now + 0.45);
        });

        // Crisp high bamboo woodblock tap
        const tap = ctx.createOscillator();
        const tapGain = ctx.createGain();
        const tapFilter = ctx.createBiquadFilter();
        tap.type = "triangle";
        tapFilter.type = "bandpass";
        tapFilter.frequency.setValueAtTime(850, now);
        tapFilter.Q.setValueAtTime(8, now);
        tap.frequency.setValueAtTime(880, now);
        tap.frequency.exponentialRampToValueAtTime(440, now + 0.06);
        tapGain.gain.setValueAtTime(0.15, now);
        tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        tap.connect(tapFilter);
        tapFilter.connect(tapGain);
        tapGain.connect(ctx.destination);
        tap.start(now);
        tap.stop(now + 0.07);
      } else if (type === "boss_super_crit") {
        // Zen Super Celestial Strike: Deep temple bell + crystal cascade + bronze ting-sha
        const gong = ctx.createOscillator();
        const gongGain = ctx.createGain();
        gong.type = "sine";
        gong.frequency.setValueAtTime(164.81, now);
        gongGain.gain.setValueAtTime(0.22, now);
        gongGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        gong.connect(gongGain);
        gongGain.connect(ctx.destination);
        gong.start(now);
        gong.stop(now + 0.65);

        [880.0, 1174.66, 1760.0, 2790.0].forEach((freq, idx) => {
          const chime = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          chime.type = "sine";
          chime.frequency.setValueAtTime(freq, now + idx * 0.035);
          chimeGain.gain.setValueAtTime(0.14, now + idx * 0.035);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          chime.connect(chimeGain);
          chimeGain.connect(ctx.destination);
          chime.start(now + idx * 0.035);
          chime.stop(now + 0.55);
        });
      } else if (type === "boss_defeat") {
        // Deep Resonant Temple Gong / Bell
        const fundamental = 164.81; // E3
        [fundamental, fundamental * 3].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(idx === 0 ? 0.22 : 0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.75);
        });
      } else if (type === "levelup") {
        // Meditative Ascending Singing Bowls (Pentatonic Peace)
        const notes = [659.25, 783.99, 880.0, 987.77, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          const start = now + idx * 0.09;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.5);
        });
      } else if (type === "bad") {
        // Soft hollow bamboo muted knock
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === "gacha") {
        // Wind chimes in the breeze
        const pentatonic = [587.33, 659.25, 783.99, 880.0, 1046.5];
        pentatonic.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          const start = now + idx * 0.07 + Math.random() * 0.03;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.1, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.4);
        });
      } else if (type === "timer") {
        // Solfeggio 528Hz bell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(528, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === "click") {
        // Water drop click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      }
      return;
    }

    // ==========================================
    // 4. CYBERPUNK SCI-FI SYNTH SOUND SET
    // ==========================================
    if (soundSet === "cyberpunk") {
      if (type === "habit" || type === "good") {
        // Holographic digital laser pulse
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3200, now);
        filter.Q.setValueAtTime(4, now);
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === "boss_hit") {
        // Plasma blaster hit
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(3, now);
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.11);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === "boss_crit") {
        // EMP Overload shockwave: Dual FM sweep
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "sawtooth";
        osc2.type = "square";
        osc1.frequency.setValueAtTime(1600, now);
        osc1.frequency.exponentialRampToValueAtTime(250, now + 0.18);
        osc2.frequency.setValueAtTime(800, now);
        osc2.frequency.exponentialRampToValueAtTime(125, now + 0.18);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.2);
        osc2.stop(now + 0.2);
      } else if (type === "boss_weakness") {
        // Cyberpunk Vulnerability Hack / Shield Breach: Dual digital ionization zap + laser burst + sub drop
        const zapNoise = ctx.createBufferSource();
        zapNoise.buffer = createNoiseBuffer(ctx, 0.15);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(2600, now);
        filter.frequency.exponentialRampToValueAtTime(700, now + 0.15);
        filter.Q.setValueAtTime(5, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        zapNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        zapNoise.start(now);

        // Dual high-tech laser chirps (1760Hz & 3520Hz with fast descending pitch modulation)
        [1760.0, 3520.0].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + idx * 0.02);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + idx * 0.02 + 0.12);
          gain.gain.setValueAtTime(idx === 0 ? 0.14 : 0.08, now + idx * 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.02);
          osc.stop(now + 0.2);
        });

        // Sub-bass punch kick
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = "sine";
        sub.frequency.setValueAtTime(180, now);
        sub.frequency.exponentialRampToValueAtTime(40, now + 0.16);
        subGain.gain.setValueAtTime(0.22, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        sub.connect(subGain);
        subGain.connect(ctx.destination);
        sub.start(now);
        sub.stop(now + 0.16);
      } else if (type === "boss_super_crit") {
        // Cyberpunk Super Railgun Overdrive: Deep sub rumble + dual EMP shockwave + ionization pulse
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = "sine";
        sub.frequency.setValueAtTime(140, now);
        sub.frequency.exponentialRampToValueAtTime(30, now + 0.28);
        subGain.gain.setValueAtTime(0.25, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        sub.connect(subGain);
        subGain.connect(ctx.destination);
        sub.start(now);
        sub.stop(now + 0.28);

        [880.0, 1320.0, 1760.0, 2640.0].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.35, now + idx * 0.03 + 0.15);
          gain.gain.setValueAtTime(0.12, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + 0.3);
        });
      } else if (type === "boss_defeat") {
        // Warp Drive Meltdown & Synthwave victory chord
        const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(2800, now);
          filter.Q.setValueAtTime(3, now);
          const start = now + idx * 0.06;
          osc.frequency.setValueAtTime(freq * 2, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.5);
        });
      } else if (type === "levelup") {
        // Cyber synthwave arpeggio overdrive
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          const start = now + idx * 0.06;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.35);
        });
      } else if (type === "bad") {
        // Dissonant glitch error buzz
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "sawtooth";
        osc2.type = "square";
        osc1.frequency.setValueAtTime(140, now);
        osc2.frequency.setValueAtTime(210, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.18);
        osc2.stop(now + 0.18);
      } else if (type === "gacha") {
        // Holo matrix decode
        const notes = [783.99, 1046.5, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          const start = now + idx * 0.07;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.11, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.25);
        });
      } else if (type === "timer") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.setValueAtTime(2400, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      }
      return;
    }
  } catch (e) {
    console.warn("Audio playback error", e);
  }
}

export interface ConfettiOptions {
  colors?: string[];
  intensity?: "low" | "medium" | "high";
  particleCount?: number;
  originX?: number; // 0..100 viewport percentage
  originY?: number; // 0..100 viewport percentage
}

export function fireConfetti(options?: ConfettiOptions) {
  if (typeof document === "undefined") return;
  const colors =
    options?.colors && options.colors.length > 0
      ? options.colors
      : ["#FF7A59", "#06B6D4", "#F59E0B", "#10B981", "#8B5CF6", "#F472B6"];

  const intensity = options?.intensity || "medium";
  const count =
    options?.particleCount !== undefined
      ? options.particleCount
      : intensity === "low"
      ? 24
      : intensity === "high"
      ? 110
      : 55;

  const originX = options?.originX !== undefined ? options.originX : 50;
  const originY = options?.originY !== undefined ? options.originY : 40;

  const velocityBase = intensity === "low" ? 7 : intensity === "high" ? 15 : 11;
  const velocitySpread = intensity === "low" ? 8 : intensity === "high" ? 20 : 14;
  const maxDuration = intensity === "low" ? 75 : intensity === "high" ? 115 : 90;
  const gravity = intensity === "low" ? 0.35 : intensity === "high" ? 0.5 : 0.42;

  for (let i = 0; i < count; i++) {
    const conf = document.createElement("div");
    conf.style.position = "fixed";
    conf.style.left = `${originX}vw`;
    conf.style.top = `${originY}vh`;

    const size =
      intensity === "high"
        ? Math.random() > 0.6
          ? 12
          : Math.random() > 0.3
          ? 9
          : 6
        : Math.random() > 0.5
        ? 10
        : 7;

    conf.style.width = `${size}px`;
    conf.style.height = `${Math.random() > 0.5 ? size : Math.round(size * 1.4)}px`;
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.borderRadius = Math.random() > 0.6 ? "50%" : Math.random() > 0.3 ? "2px" : "4px";
    conf.style.boxShadow = intensity === "high" ? `0 0 6px ${conf.style.backgroundColor}88` : "none";
    conf.style.zIndex = "9999";
    conf.style.pointerEvents = "none";
    document.body.appendChild(conf);

    const angle = Math.random() * Math.PI * 2;
    const velocity = velocityBase + Math.random() * velocitySpread;
    const rotationSpeed = (Math.random() - 0.5) * 28;
    let x = 0;
    let y = 0;
    let time = 0;

    const animate = () => {
      time += 1;
      const progress = time / maxDuration;
      x += Math.cos(angle) * velocity * (1 - progress * 0.85);
      y += Math.sin(angle) * velocity * (1 - progress * 0.85) + time * gravity;
      conf.style.transform = `translate(${x}px, ${y}px) rotate(${time * rotationSpeed}deg)`;
      conf.style.opacity = String(Math.max(0, 1 - progress));
      if (time < maxDuration) {
        requestAnimationFrame(animate);
      } else {
        conf.remove();
      }
    };
    requestAnimationFrame(animate);
  }
}
