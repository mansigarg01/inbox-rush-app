// src/soundEffects.js
// Advanced Web Audio API Engine for Inbox Quest
// Subtle, satisfying, non-copyrighted procedural sound effects & background ambient synthesizer
// Hardened with zero-crash safe wrappers and backward-compatible method aliases

class ArcadeAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;

    // Load persisted settings or sensible defaults
    try {
      this.isMuted = typeof localStorage !== 'undefined' ? localStorage.getItem('inbox_quest_muted') === 'true' : false;
      this.sfxVolume = typeof localStorage !== 'undefined' ? parseFloat(localStorage.getItem('inbox_quest_sfx_vol') || '0.65') : 0.65;
      this.bgmVolume = typeof localStorage !== 'undefined' ? parseFloat(localStorage.getItem('inbox_quest_bgm_vol') || '0.28') : 0.28;
    } catch {
      this.isMuted = false;
      this.sfxVolume = 0.65;
      this.bgmVolume = 0.28;
    }

    // BGM state
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.bgmStep = 0;
  }

  init() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();

          // Master Gain
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);

          // SFX Gain Node
          this.sfxGain = this.ctx.createGain();
          this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
          this.sfxGain.connect(this.masterGain);

          // BGM Gain Node
          this.bgmGain = this.ctx.createGain();
          this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
          this.bgmGain.connect(this.masterGain);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (err) {
      // Audio initialization failed; fail gracefully
      this.ctx = null;
    }
  }

  // ------------------------------------------------------------------
  // Volume & Mute Controls
  // ------------------------------------------------------------------
  toggleMute() {
    try {
      this.init();
      this.isMuted = !this.isMuted;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('inbox_quest_muted', String(this.isMuted));
      }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      }
    } catch {}
    return this.isMuted;
  }

  setSfxVolume(val) {
    try {
      this.init();
      this.sfxVolume = Math.max(0, Math.min(1, val));
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('inbox_quest_sfx_vol', String(this.sfxVolume));
      }
      if (this.sfxGain && this.ctx) {
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      }
    } catch {}
  }

  setBgmVolume(val) {
    try {
      this.init();
      this.bgmVolume = Math.max(0, Math.min(1, val));
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('inbox_quest_bgm_vol', String(this.bgmVolume));
      }
      if (this.bgmGain && this.ctx) {
        this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      }
    } catch {}
  }

  getSettings() {
    return {
      isMuted: this.isMuted,
      sfxVolume: this.sfxVolume,
      bgmVolume: this.bgmVolume,
    };
  }

  // ------------------------------------------------------------------
  // 1. CLUTTER MONSTER INTRO SOUND
  // Low-pitched, mischievous, slightly sinister digital rumble (~1.2s)
  // ------------------------------------------------------------------
  playMonsterIntro() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(65, now + 1.2);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(70, now);
      osc2.frequency.exponentialRampToValueAtTime(38, now + 1.2);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 1.2);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 1.25);

      const chirp = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();
      chirp.type = 'sine';
      chirp.frequency.setValueAtTime(220, now + 0.35);
      chirp.frequency.exponentialRampToValueAtTime(440, now + 0.55);
      chirp.frequency.exponentialRampToValueAtTime(180, now + 0.75);

      chirpGain.gain.setValueAtTime(0.12, now + 0.35);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      chirp.connect(chirpGain);
      chirpGain.connect(this.sfxGain);

      chirp.start(now + 0.35);
      chirp.stop(now + 0.75);
    } catch {}
  }

  // ------------------------------------------------------------------
  // 2. MONSTER REACTION SOUND
  // ------------------------------------------------------------------
  playMonsterReaction() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // ------------------------------------------------------------------
  // 3. SUCCESSFUL CLEANUP
  // ------------------------------------------------------------------
  playClean() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  // Backward compatible alias
  playArchive() {
    this.playClean();
  }

  // Delete
  playDelete() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }

  // ------------------------------------------------------------------
  // 4. CORRECT CLASSIFICATION CHIME
  // ------------------------------------------------------------------
  playCorrectClassification() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      [659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.14, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.18);
      });
    } catch {}
  }

  // ------------------------------------------------------------------
  // 5. VIP EMAIL DISCOVERY / STAR
  // ------------------------------------------------------------------
  playVipDiscovery() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      [739.99, 932.33, 1108.73].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } catch {}
  }

  // Backward compatible alias
  playStar() {
    this.playVipDiscovery();
  }

  // ------------------------------------------------------------------
  // 6. WRONG DECISION / PENALTY
  // ------------------------------------------------------------------
  playWrongDecision() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(130, now + 0.1);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  // Backward compatible alias
  playError() {
    this.playWrongDecision();
  }

  // ------------------------------------------------------------------
  // 7. PROGRESSIVE COMBO SOUNDS
  // ------------------------------------------------------------------
  playComboTier(combo = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      if (combo >= 10) {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.18, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.35);
        });
      } else if (combo >= 5) {
        const notes = [587.33, 739.99, 880];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.16, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.28);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.28);
        });
      } else {
        const notes = [440, 554.37];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.14, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.2);
        });
      }
    } catch {}
  }

  // Backward compatible alias
  playCombo(combo = 1) {
    this.playComboTier(combo);
  }

  // ------------------------------------------------------------------
  // 8. MISSION TARGET MILESTONE
  // ------------------------------------------------------------------
  playMissionMilestone() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 987.77];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.16, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch {}
  }

  // ------------------------------------------------------------------
  // 9. COUNTDOWN TICK
  // ------------------------------------------------------------------
  playCountdownTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.035);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  // ------------------------------------------------------------------
  // 10. FINAL VICTORY CHORD
  // ------------------------------------------------------------------
  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [261.63, 329.63, 392.00, 493.88, 587.33];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.5);
      });
    } catch {}
  }

  // General whoosh / card deal
  playWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // ------------------------------------------------------------------
  // 11. SUBTLE BACKGROUND AMBIENT MUSIC
  // ------------------------------------------------------------------
  startBackgroundMusic() {
    try {
      if (this.bgmPlaying) return;
      this.init();
      if (!this.ctx || !this.bgmGain) return;

      this.bgmPlaying = true;
      this.bgmStep = 0;

      const scale = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33];
      const pattern = [0, 2, 4, 3, 1, 3, 5, 4, 2, 0, 1, 3];

      this.bgmInterval = setInterval(() => {
        try {
          if (!this.bgmPlaying || this.isMuted || !this.ctx || !this.bgmGain || this.bgmVolume <= 0.01) return;

          const noteFreq = scale[pattern[this.bgmStep % pattern.length]];
          this.bgmStep++;

          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(noteFreq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, now);

          gain.gain.setValueAtTime(0.045, now);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.65);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.bgmGain);

          osc.start(now);
          osc.stop(now + 0.65);
        } catch {}
      }, 450);
    } catch {}
  }

  stopBackgroundMusic() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sounds = new ArcadeAudioEngine();
