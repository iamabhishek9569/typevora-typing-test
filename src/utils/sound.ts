/**
 * High-fidelity Web Audio Mechanical Keyboard Synthesizer
 * Generates realistic mechanical switch clicks, thocks, and clacks with zero external audio files.
 */

export type SwitchType = 'thock' | 'blue' | 'clack';

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  public init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.createNoiseBuffer();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private createNoiseBuffer() {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 0.05; // 50ms of noise
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  /**
   * Realistic Mechanical Key Click/Clack
   */
  public playKeyClick(type: 'char' | 'space' | 'backspace' | 'enter' = 'char', volume = 0.5) {
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 1. Actuation Crisp Click (Noise + High Bandpass Filter)
      if (this.noiseBuffer) {
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        // Random variance between keys for natural typing feel
        const baseFreq = type === 'space' ? 1200 : type === 'backspace' ? 1800 : 2400;
        noiseFilter.frequency.setValueAtTime(baseFreq + (Math.random() * 400 - 200), now);
        noiseFilter.Q.setValueAtTime(type === 'space' ? 2 : 4, now);

        const noiseGain = ctx.createGain();
        const noiseVol = type === 'space' ? volume * 0.45 : volume * 0.4;
        noiseGain.gain.setValueAtTime(noiseVol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'space' ? 0.045 : 0.03));

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseSource.start(now);
        noiseSource.stop(now + 0.05);
      }

      // 2. Bottom-out "Thock" (Warm Low-Frequency Resonance Body)
      const thockOsc = ctx.createOscillator();
      const thockGain = ctx.createGain();

      thockOsc.type = 'triangle';
      // Low body pitch for mechanical switch feel
      const lowPitch = type === 'space' ? 110 : type === 'backspace' ? 160 : 180 + Math.random() * 40;
      thockOsc.frequency.setValueAtTime(lowPitch + 60, now);
      thockOsc.frequency.exponentialRampToValueAtTime(lowPitch, now + 0.025);

      const thockVol = type === 'space' ? volume * 0.7 : volume * 0.5;
      thockGain.gain.setValueAtTime(thockVol, now);
      thockGain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'space' ? 0.06 : 0.045));

      thockOsc.connect(thockGain);
      thockGain.connect(ctx.destination);

      thockOsc.start(now);
      thockOsc.stop(now + 0.07);

      // 3. Tactile Switch Snap (High Sine Ping)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();

      snapOsc.type = 'sine';
      const snapFreq = type === 'space' ? 580 : 880 + Math.random() * 160;
      snapOsc.frequency.setValueAtTime(snapFreq, now);
      snapOsc.frequency.exponentialRampToValueAtTime(snapFreq * 0.4, now + 0.018);

      snapGain.gain.setValueAtTime(volume * 0.3, now);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.025);
    } catch {
      // Audio autoplay restriction fallback
    }
  }

  /**
   * Error keystroke sound (dull mechanical thud / switch stall)
   */
  public playKeyError(volume = 0.5) {
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(volume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Fallback
    }
  }

  /**
   * Test completion celebration chime
   */
  public playSuccessChime(volume = 0.4) {
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(volume * 0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // Fallback
    }
  }
}

export const soundEngine = new SoundEngine();
