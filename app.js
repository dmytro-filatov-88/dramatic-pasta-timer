/**
 * Dramatic Pasta Timer — Strategic Carbohydrate Launch Facility
 * Autonomous Bored AI Web Experiment
 * Pure Vanilla JS + Procedural Web Audio API + HTML5 Canvas
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL WEB AUDIO SYNTHESIZER (Zero external MP3 dependencies)
  // =========================================================================

  class PastaAudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.isInitialized = false;
      this.bubblingNode = null;
      this.bubbleInterval = null;
      this.sirenOsc = null;
      this.sirenLfo = null;
      this.sirenGain = null;
    }

    init() {
      if (this.isInitialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.isInitialized = true;
      } catch (err) {
        console.warn('Web Audio initialization error:', err);
      }
    }

    resume() {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.3, this.ctx.currentTime);
      }
      return !this.muted;
    }

    // Heavy relay click
    playClick() {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.04);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.05);
    }

    // Flip safety cover clunk
    playCoverFlip(isOpening) {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isOpening ? 180 : 320, t);
      osc.frequency.exponentialRampToValueAtTime(isOpening ? 380 : 140, t + 0.08);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.1);
    }

    // High tech radar ping for seconds tick
    playTick(isUrgent = false) {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isUrgent ? 'sawtooth' : 'sine';
      const freq = isUrgent ? 1600 : 980;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.03);
      gain.gain.setValueAtTime(isUrgent ? 0.25 : 0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.05);
    }

    // Dramatic Italian Opera Stab (Orchestral minor brass/strings chord)
    playOperaStab() {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      // D minor dramatic chord: D3 (146.8), F3 (174.6), A3 (220.0), D4 (293.7), F4 (349.2)
      const freqs = [146.83, 174.61, 220.00, 293.66, 349.23];
      
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, t);
        filter.frequency.exponentialRampToValueAtTime(450, t + 0.7);

        gain.gain.setValueAtTime(0.0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.8);
      });
    }

    // Start bubbling ambient water audio loop
    startBubbling() {
      if (this.muted || !this.ctx || this.bubblingNode) return;
      // Noise generator through resonant filter
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02; // pinkish noise
        lastOut = data[i];
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(550, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(3.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      noiseSource.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.masterGain);

      noiseSource.start();
      this.bubblingNode = { source: noiseSource, gain: gain, filter: bandpass };

      // Periodic random bubble pops
      this.bubbleInterval = setInterval(() => {
        if (!this.muted && this.ctx && this.bubblingNode) {
          this.playBubblePop();
        }
      }, 160);
    }

    playBubblePop() {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startFreq = 260 + Math.random() * 200;
      const endFreq = startFreq + 350 + Math.random() * 300;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.045);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.06);
    }

    stopBubbling() {
      if (this.bubbleInterval) {
        clearInterval(this.bubbleInterval);
        this.bubbleInterval = null;
      }
      if (this.bubblingNode) {
        try {
          this.bubblingNode.source.stop();
        } catch (e) {}
        this.bubblingNode = null;
      }
    }

    // Emergency AL DENTE Air-Raid Siren
    startSiren() {
      if (this.sirenOsc || !this.ctx) return;
      const t = this.ctx.currentTime;
      this.sirenOsc = this.ctx.createOscillator();
      this.sirenOsc.type = 'sawtooth';

      this.sirenLfo = this.ctx.createOscillator();
      this.sirenLfo.type = 'triangle';
      this.sirenLfo.frequency.setValueAtTime(0.8, t); // 0.8 Hz whoop cycle

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(280, t); // swing +/- 280Hz
      this.sirenOsc.frequency.setValueAtTime(680, t); // center frequency

      this.sirenLfo.connect(lfoGain);
      lfoGain.connect(this.sirenOsc.frequency);

      this.sirenGain = this.ctx.createGain();
      this.sirenGain.gain.setValueAtTime(this.muted ? 0 : 0.22, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      this.sirenOsc.connect(filter);
      filter.connect(this.sirenGain);
      this.sirenGain.connect(this.masterGain);

      this.sirenLfo.start(t);
      this.sirenOsc.start(t);
    }

    stopSiren() {
      if (this.sirenOsc) {
        try {
          this.sirenOsc.stop();
          this.sirenLfo.stop();
        } catch (e) {}
        this.sirenOsc = null;
        this.sirenLfo = null;
        this.sirenGain = null;
      }
    }

    // Triumphant Fanfare when Drained
    playVictoryFanfare() {
      if (this.muted || !this.ctx) return;
      const notes = [
        { f: 261.63, d: 0.12, del: 0 },     // C4
        { f: 329.63, d: 0.12, del: 0.14 },  // E4
        { f: 392.00, d: 0.12, del: 0.28 },  // G4
        { f: 523.25, d: 0.45, del: 0.42 }   // C5
      ];
      const startT = this.ctx.currentTime;
      notes.forEach(note => {
        const t = startT + note.del;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + note.d + 0.05);
      });
    }

    // Wooden Spoon Knock
    playWoodKnock() {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.08);
    }

    // Snap Pasta Sacrilege (High snap + screeching dissonance)
    playSnapPasta() {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      // High snap transient
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'sawtooth';
      snapOsc.frequency.setValueAtTime(2400, t);
      snapOsc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
      snapGain.gain.setValueAtTime(0.6, t);
      snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
      snapOsc.connect(snapGain);
      snapGain.connect(this.masterGain);
      snapOsc.start(t);
      snapOsc.stop(t + 0.07);

      // Horror discordant tritone stab
      [220, 311.13, 440, 622.25].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    }

    // Italian Gesture Che Vuoi Synth Flourish
    playCheVuoi() {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const chord = [392.00, 493.88, 587.33]; // G major accordion
      chord.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.65);
      });
    }
  }

  // =========================================================================
  // 2. HYDROTHERMAL BOILING REACTOR SIMULATION (Canvas 2D)
  // =========================================================================

  class ReactorCanvas {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
      this.bubbles = [];
      this.steamParticles = [];
      this.pastaItems = [];
      this.pastaType = 'spaghetti';
      this.boilIntensity = 0.25; // 0.25 = idle simmer, 1.0 = rolling boil
      this.spoonActive = false;
      this.drained = false;
      this.time = 0;

      this.initPasta();
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.canvas.width = rect.width * (window.devicePixelRatio || 1);
        this.canvas.height = rect.height * (window.devicePixelRatio || 1);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
      }
    }

    setPasta(type) {
      this.pastaType = type;
      this.initPasta();
    }

    setBoilIntensity(intensity) {
      this.boilIntensity = intensity;
    }

    setSpoon(active) {
      this.spoonActive = active;
    }

    setDrained(drained) {
      this.drained = drained;
    }

    initPasta() {
      this.pastaItems = [];
      const count = 28;
      for (let i = 0; i < count; i++) {
        this.pastaItems.push({
          x: Math.random() * (this.width || 600),
          y: (this.height ? this.height * 0.4 : 200) + Math.random() * ((this.height || 400) * 0.45),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          angle: Math.random() * Math.PI * 2,
          va: (Math.random() - 0.5) * 0.05,
          length: 30 + Math.random() * 40,
          wiggle: Math.random() * 10
        });
      }
    }

    step() {
      this.time += 0.025;
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // Background metallic cylinder vessel
      const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
      bgGrad.addColorStop(0, '#10131d');
      bgGrad.addColorStop(0.5, '#191d2c');
      bgGrad.addColorStop(1, '#10131d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Heat plate glow at bottom
      const heatGrad = ctx.createRadialGradient(w / 2, h, 10, w / 2, h, w * 0.5);
      const heatColor = this.boilIntensity > 0.5 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.2)';
      heatGrad.addColorStop(0, heatColor);
      heatGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = heatGrad;
      ctx.fillRect(0, h * 0.65, w, h * 0.35);

      if (this.drained) {
        // Drained view: Golden cooked pasta resting in the empty vessel with steam
        this.renderDrainedState(ctx, w, h);
        return;
      }

      // Water surface level
      const waterLevelY = h * 0.32;

      // Draw water body
      const waterGrad = ctx.createLinearGradient(0, waterLevelY, 0, h);
      waterGrad.addColorStop(0, 'rgba(14, 165, 233, 0.45)');
      waterGrad.addColorStop(0.6, 'rgba(3, 105, 161, 0.7)');
      waterGrad.addColorStop(1, 'rgba(2, 44, 75, 0.85)');
      ctx.fillStyle = waterGrad;

      // Surface wave path
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, waterLevelY);
      const waveFreq = 0.02;
      const waveAmp = (this.spoonActive ? 2 : 6) * this.boilIntensity;
      for (let x = 0; x <= w; x += 15) {
        const dy = Math.sin(x * waveFreq + this.time * 4) * waveAmp;
        ctx.lineTo(x, waterLevelY + dy);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Foam line along surface
      ctx.strokeStyle = this.spoonActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = this.spoonActive ? 2 : 4 * this.boilIntensity;
      ctx.stroke();

      // Spawn bubbles from bottom
      const spawnRate = Math.floor(this.boilIntensity * 6);
      for (let i = 0; i < spawnRate; i++) {
        if (Math.random() < 0.6) {
          this.bubbles.push({
            x: Math.random() * w,
            y: h - 10,
            r: 2 + Math.random() * (6 * this.boilIntensity),
            vy: (1.5 + Math.random() * 3) * this.boilIntensity,
            vx: (Math.random() - 0.5) * 1.5,
            wobble: Math.random() * 6
          });
        }
      }

      // Update & Draw Bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i];
        b.y -= b.vy;
        b.x += Math.sin(this.time * 3 + b.wobble) * 0.8 + b.vx;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // Popped at surface
        if (b.y <= waterLevelY) {
          // Spawn steam particle
          if (Math.random() < 0.4) {
            this.steamParticles.push({
              x: b.x,
              y: b.y,
              r: 3 + Math.random() * 5,
              vy: 1 + Math.random() * 1.5,
              opacity: 0.6
            });
          }
          this.bubbles.splice(i, 1);
        }
      }

      // Update & Draw Pasta Items in Convection currents
      this.renderPasta(ctx, w, h, waterLevelY);

      // Update & Draw Steam
      for (let i = this.steamParticles.length - 1; i >= 0; i--) {
        const s = this.steamParticles[i];
        s.y -= s.vy;
        s.r += 0.2;
        s.opacity -= 0.012;
        ctx.fillStyle = `rgba(240, 245, 255, ${Math.max(0, s.opacity)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.opacity <= 0 || s.y < 0) {
          this.steamParticles.splice(i, 1);
        }
      }

      // Measurement glass reflections & markings
      this.renderOverlays(ctx, w, h);
    }

    renderPasta(ctx, w, h, waterLevelY) {
      ctx.save();
      const speedMult = this.boilIntensity * 1.4;

      this.pastaItems.forEach(p => {
        // Convective looping physics: rise in center, fall at edges
        const centerDist = (p.x - w / 2) / (w / 2);
        const convectiveY = -Math.cos(centerDist * Math.PI * 0.5) * speedMult * 1.5;
        const convectiveX = Math.sign(centerDist) * (1 - Math.abs(centerDist)) * speedMult * 0.8;

        p.x += p.vx + convectiveX;
        p.y += p.vy + convectiveY;
        p.angle += p.va * speedMult;

        // Boundary containment
        if (p.x < 20) { p.x = 20; p.vx *= -0.8; }
        if (p.x > w - 20) { p.x = w - 20; p.vx *= -0.8; }
        if (p.y < waterLevelY + 15) { p.y = waterLevelY + 15; p.vy = Math.abs(p.vy) + 0.5; }
        if (p.y > h - 25) { p.y = h - 25; p.vy = -Math.abs(p.vy) - 0.5; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;

        if (this.pastaType === 'spaghetti' || this.pastaType === 'capellini') {
          // Flexible strand
          ctx.beginPath();
          const len = this.pastaType === 'capellini' ? p.length * 0.7 : p.length;
          ctx.lineWidth = this.pastaType === 'capellini' ? 1.5 : 2.5;
          ctx.moveTo(-len / 2, 0);
          const cpY = Math.sin(this.time * 5 + p.wiggle) * 12;
          ctx.quadraticCurveTo(0, cpY, len / 2, 0);
          ctx.stroke();
        } else if (this.pastaType === 'penne') {
          // Tubular diagonal penne
          ctx.fillRect(-14, -5, 28, 10);
          ctx.strokeRect(-14, -5, 28, 10);
          // Ribs
          ctx.strokeStyle = '#d97706';
          ctx.beginPath();
          ctx.moveTo(-5, -5); ctx.lineTo(-5, 5);
          ctx.moveTo(5, -5); ctx.lineTo(5, 5);
          ctx.stroke();
        } else if (this.pastaType === 'farfalle') {
          // Bowtie Farfalle
          ctx.beginPath();
          ctx.moveTo(-12, -8);
          ctx.lineTo(0, -2);
          ctx.lineTo(12, -8);
          ctx.lineTo(12, 8);
          ctx.lineTo(0, 2);
          ctx.lineTo(-12, 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (this.pastaType === 'rigatoni') {
          // Thick ribbed cylinder
          ctx.fillRect(-12, -8, 24, 16);
          ctx.strokeRect(-12, -8, 24, 16);
          ctx.strokeStyle = '#d97706';
          ctx.beginPath();
          ctx.moveTo(-4, -8); ctx.lineTo(-4, 8);
          ctx.moveTo(4, -8); ctx.lineTo(4, 8);
          ctx.stroke();
        } else if (this.pastaType === 'tortellini') {
          // Plump stuffed tortellini ring
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      ctx.restore();
    }

    renderDrainedState(ctx, w, h) {
      // Golden cooked pile at bottom
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.78, w * 0.38, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Steam plumes billowing
      if (Math.random() < 0.6) {
        this.steamParticles.push({
          x: w * 0.25 + Math.random() * w * 0.5,
          y: h * 0.75,
          r: 6 + Math.random() * 8,
          vy: 1.8 + Math.random() * 2,
          opacity: 0.8
        });
      }

      for (let i = this.steamParticles.length - 1; i >= 0; i--) {
        const s = this.steamParticles[i];
        s.y -= s.vy;
        s.r += 0.3;
        s.opacity -= 0.015;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, s.opacity)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.opacity <= 0) this.steamParticles.splice(i, 1);
      }

      // Al Dente Stamp Text
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DRAINED & CHEF CERTIFIED 🍝', w / 2, h * 0.45);
    }

    renderOverlays(ctx, w, h) {
      // Depth ruler tick marks on the right side
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      for (let y = 60; y < h; y += 40) {
        ctx.fillRect(w - 14, y, 10, 1);
        ctx.fillText(`${Math.round(h - y)}mm`, w - 18, y + 3);
      }
    }
  }

  // =========================================================================
  // 3. MASTER APPLICATION CONTROLLER
  // =========================================================================

  class PastaApp {
    constructor() {
      this.audio = new PastaAudioEngine();
      this.canvas = new ReactorCanvas(document.getElementById('reactor-canvas'));

      // State
      this.state = 'STANDBY'; // 'STANDBY' | 'ARMED' | 'BOILING' | 'AL_DENTE' | 'DRAINED'
      this.targetDuration = 540; // 9 minutes default
      this.remainingTime = 540;
      this.selectedSlug = 'spaghetti';
      this.selectedName = 'Spaghetti No. 5';
      this.isDrillMode = false; // 10s warp speed
      this.isCoverFlipped = false;
      this.timerInterval = null;
      this.lastTickSecond = -1;

      this.cacheElements();
      this.bindEvents();
      this.render();
      this.log('DEFCON CARB initialized. Awaiting carbohydrate payload authorization.');

      // Start animation loop
      const loop = () => {
        this.canvas.step();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    cacheElements() {
      this.els = {
        // Hud
        defconIndicator: document.getElementById('defcon-indicator'),
        defconText: document.getElementById('defcon-text'),
        hudTemp: document.getElementById('hud-temp'),
        hudSalinity: document.getElementById('hud-salinity'),
        btnDrill: document.getElementById('btn-drill-mode'),
        drillLabel: document.getElementById('drill-label'),
        btnSound: document.getElementById('btn-sound'),
        soundIcon: document.getElementById('sound-icon'),
        soundLabel: document.getElementById('sound-label'),

        // Silo
        pastaGrid: document.getElementById('pasta-grid'),
        pastaCards: document.querySelectorAll('.pasta-card'),
        customSlider: document.getElementById('custom-time-slider'),
        customDisplay: document.getElementById('custom-minutes-display'),
        specTargetName: document.getElementById('spec-target-name'),
        specWindowTime: document.getElementById('spec-window-time'),

        // Reactor
        spoonOverlay: document.getElementById('spoon-overlay'),
        telemetryConvection: document.getElementById('telemetry-convection'),
        telemetryStarch: document.getElementById('telemetry-starch'),
        telemetryBubbles: document.getElementById('telemetry-bubbles'),
        reactorBanner: document.getElementById('reactor-status-banner'),
        reactorStatusText: document.getElementById('reactor-status-text'),
        thermoclineFill: document.getElementById('thermocline-fill'),
        cookPercent: document.getElementById('cook-percent'),

        // Launch
        missionBadge: document.getElementById('mission-status-badge'),
        clockDisplay: document.getElementById('clock-display'),
        clockStateBanner: document.getElementById('clock-state-banner'),
        switchSalt: document.getElementById('switch-salt'),
        switchBoil: document.getElementById('switch-boil'),
        safetyCage: document.getElementById('safety-cover-cage'),
        btnFlipCover: document.getElementById('btn-flip-cover'),
        coverText: document.getElementById('cover-text'),
        btnMainAction: document.getElementById('btn-main-action'),
        launchIcon: document.getElementById('launch-icon'),
        launchText: document.getElementById('launch-text'),
        launchSub: document.getElementById('launch-sub'),

        btnPause: document.getElementById('btn-pause'),
        pauseLabel: document.getElementById('pause-label'),
        btnReset: document.getElementById('btn-reset'),
        btnDrainTest: document.getElementById('btn-drain-test'),

        // Defense
        btnSnap: document.getElementById('btn-snap-pasta'),
        btnOil: document.getElementById('btn-oil-water'),
        btnSpoon: document.getElementById('btn-wooden-spoon'),
        btnCheCazzo: document.getElementById('btn-che-cazzo'),

        // Terminal & Modal
        termLine: document.getElementById('term-line'),
        alarmOverlay: document.getElementById('alarm-overlay'),
        aldenteModal: document.getElementById('aldente-modal'),
        modalBtnDrain: document.getElementById('modal-btn-drain'),
        modalBtnDismiss: document.getElementById('modal-btn-dismiss'),
        gestureLayer: document.getElementById('gesture-layer')
      };
    }

    bindEvents() {
      // User gesture audio resume
      const resumeAudio = () => this.audio.resume();
      window.addEventListener('click', resumeAudio, { once: true });
      window.addEventListener('keydown', resumeAudio, { once: true });

      // Pasta Selection
      this.els.pastaCards.forEach(card => {
        card.addEventListener('click', () => {
          if (this.state === 'BOILING') return;
          this.audio.playClick();
          this.els.pastaCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          const seconds = parseInt(card.dataset.time, 10);
          this.selectedSlug = card.dataset.slug;
          this.selectedName = card.dataset.name;
          this.targetDuration = seconds;
          this.remainingTime = seconds;

          this.els.customSlider.value = seconds;
          this.updateCustomDisplay(seconds);
          this.canvas.setPasta(this.selectedSlug);

          this.els.specTargetName.textContent = this.selectedName;
          this.log(`Payload loaded: ${this.selectedName} (${this.formatTime(seconds)}). Target firmness locked.`);
          this.renderClock();
        });
      });

      // Custom Slider
      this.els.customSlider.addEventListener('input', (e) => {
        if (this.state === 'BOILING') return;
        const seconds = parseInt(e.target.value, 10);
        this.targetDuration = seconds;
        this.remainingTime = seconds;
        this.updateCustomDisplay(seconds);
        this.els.pastaCards.forEach(c => c.classList.remove('active'));
        this.renderClock();
      });

      // Safety Flip Cover
      this.els.btnFlipCover.addEventListener('click', () => {
        this.toggleSafetyCover();
      });

      // Big Red Launch Button
      this.els.btnMainAction.addEventListener('click', () => {
        this.handleMainAction();
      });

      // Secondary controls
      this.els.btnPause.addEventListener('click', () => {
        this.togglePause();
      });

      this.els.btnReset.addEventListener('click', () => {
        this.reset();
      });

      this.els.btnDrainTest.addEventListener('click', () => {
        this.triggerDrainSuccess();
      });

      // Tactical Defense Buttons
      this.els.btnSnap.addEventListener('click', () => this.easterEggSnap());
      this.els.btnOil.addEventListener('click', () => this.easterEggOil());
      this.els.btnSpoon.addEventListener('click', () => this.toggleSpoon());
      this.els.btnCheCazzo.addEventListener('click', (e) => this.easterEggCheVuoi(e));

      // Sound toggle
      this.els.btnSound.addEventListener('click', () => {
        const soundOn = this.audio.toggleMute();
        this.els.soundIcon.textContent = soundOn ? '🔊' : '🔇';
        this.els.soundLabel.textContent = soundOn ? 'SOUND ON' : 'MUTED';
        this.log(`Audio output ${soundOn ? 'ACTIVE' : 'MUTED'}`);
      });

      // Drill mode toggle
      this.els.btnDrill.addEventListener('click', () => {
        this.isDrillMode = !this.isDrillMode;
        this.els.btnDrill.classList.toggle('active', this.isDrillMode);
        this.els.drillLabel.textContent = this.isDrillMode ? '⏩ WARP ACTIVE (10s)' : '10s DRILL MODE';
        this.log(`Time Dilation: ${this.isDrillMode ? '10-SECOND RAPID SIMULATION' : 'REAL TIME (1s/s)'}`);
        this.audio.playClick();
      });

      // Modal Actions
      this.els.modalBtnDrain.addEventListener('click', () => {
        this.els.aldenteModal.classList.add('hidden');
        this.triggerDrainSuccess();
      });

      this.els.modalBtnDismiss.addEventListener('click', () => {
        this.els.aldenteModal.classList.add('hidden');
        this.log('WARNING: User refused emergency drain. Pasta integrity collapsing!');
      });

      // Keyboard Shortcuts
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.code === 'Space') {
          e.preventDefault();
          if (this.state === 'STANDBY' && !this.isCoverFlipped) {
            this.toggleSafetyCover();
          } else if (this.state === 'ARMED') {
            this.handleMainAction();
          } else if (this.state === 'BOILING') {
            this.togglePause();
          }
        } else if (e.key === 'd' || e.key === 'D') {
          this.els.btnDrill.click();
        } else if (e.key === 'm' || e.key === 'M') {
          this.els.btnSound.click();
        } else if (e.key === 'r' || e.key === 'R') {
          this.reset();
        } else if (e.key === 'n' || e.key === 'N') {
          this.toggleSpoon();
        }
      });
    }

    updateCustomDisplay(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      this.els.customDisplay.textContent = `${m}m ${s < 10 ? '0' : ''}${s}s`;
    }

    toggleSafetyCover() {
      this.isCoverFlipped = !this.isCoverFlipped;
      this.audio.playCoverFlip(this.isCoverFlipped);
      this.els.btnFlipCover.classList.toggle('flipped', this.isCoverFlipped);
      this.els.coverText.textContent = this.isCoverFlipped ? 'ARMED: INTERLOCK DISENGAGED' : '⚠️ FLIP SAFETY COVER ⚠️';

      if (this.isCoverFlipped && this.state === 'STANDBY') {
        this.state = 'ARMED';
        this.els.btnMainAction.disabled = false;
        this.els.missionBadge.textContent = 'READY TO LAUNCH';
        this.els.missionBadge.classList.add('alert-badge');
        this.log('Safety interlock retracted. LAUNCH TRIGGER LIVE.');
      } else if (!this.isCoverFlipped && this.state === 'ARMED') {
        this.state = 'STANDBY';
        this.els.btnMainAction.disabled = true;
        this.els.missionBadge.textContent = 'STANDBY';
        this.els.missionBadge.classList.remove('alert-badge');
      }
    }

    handleMainAction() {
      if (this.state === 'ARMED') {
        // Pre-flight checks
        if (!this.els.switchSalt.checked) {
          alert('SAFETY ABORT: Water must be salty as the sea! Engage salinity switch.');
          return;
        }
        if (!this.els.switchBoil.checked) {
          alert('SAFETY ABORT: Water must be at a violent rolling boil before drop!');
          return;
        }

        // Ignite boil countdown!
        this.startBoilingSequence();
      } else if (this.state === 'AL_DENTE') {
        this.triggerDrainSuccess();
      }
    }

    startBoilingSequence() {
      this.state = 'BOILING';
      this.audio.playOperaStab();
      this.audio.startBubbling();
      this.canvas.setBoilIntensity(1.0);
      this.canvas.setDrained(false);

      this.els.btnMainAction.classList.add('running');
      this.els.launchIcon.textContent = '🔥';
      this.els.launchText.textContent = 'BOIL SEQUENCE ACTIVE';
      this.els.launchSub.textContent = 'HYDROTHERMAL REACTION RUNNING';
      this.els.btnPause.disabled = false;

      this.els.defconIndicator.className = 'defcon-badge defcon-critical';
      this.els.defconText.textContent = 'DEFCON 1: COOKING IN PROGRESS';
      this.els.missionBadge.textContent = 'ACTIVE';

      this.els.telemetryBubbles.textContent = 'MAX TURBULENCE';
      this.els.telemetryBubbles.className = 'dial-value text-red';
      this.els.reactorBanner.textContent = 'WARNING: STARCH HYDRATION REACTION IN PROGRESS';

      this.log(`T-Minus ${this.formatTime(this.remainingTime)}: Pasta dropped! Nonna is watching.`);

      // Interval ticker (100ms precision)
      const tickRate = 100;
      const stepDecrement = this.isDrillMode ? (this.targetDuration / 100) : 0.1; // Drill finishes in 10s

      this.timerInterval = setInterval(() => {
        const decrement = this.isDrillMode ? (this.targetDuration / 100) : 0.1;
        this.remainingTime = Math.max(0, this.remainingTime - decrement);

        this.renderClock();
        this.updateProgress();

        const currentSec = Math.floor(this.remainingTime);
        if (currentSec !== this.lastTickSecond) {
          this.lastTickSecond = currentSec;
          const isUrgent = this.remainingTime <= 45;
          this.audio.playTick(isUrgent);

          // Sub-minute al dente milestone alert
          if (currentSec === 45) {
            this.triggerPreAlDenteWarning();
          }
        }

        if (this.remainingTime <= 0) {
          clearInterval(this.timerInterval);
          this.triggerAlDenteClimax();
        }
      }, tickRate);
    }

    togglePause() {
      if (this.state !== 'BOILING') return;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.audio.stopBubbling();
        this.canvas.setBoilIntensity(0.3);
        this.els.pauseLabel.textContent = 'RESUME CLOCK';
        this.els.clockStateBanner.textContent = 'PAUSED: POT SIMMERING';
        this.log('Timer paused. Convective currents decelerated.');
      } else {
        this.startBoilingSequence();
        this.els.pauseLabel.textContent = 'PAUSE CLOCK';
      }
    }

    triggerPreAlDenteWarning() {
      this.els.alarmOverlay.classList.add('active');
      this.els.clockDisplay.classList.add('danger');
      this.els.reactorBanner.classList.add('alert');
      this.els.reactorBanner.textContent = '🚨 ENTERING CRITICAL 45-SECOND AL DENTE WINDOW!';
      this.audio.playOperaStab();
      this.log('CRITICAL: 45 SECONDS REMAINING! PREPARE COLANDER IMMEDIATELY!');
    }

    triggerAlDenteClimax() {
      this.state = 'AL_DENTE';
      this.audio.stopBubbling();
      this.audio.startSiren();

      document.body.classList.add('shake-violent');
      this.els.alarmOverlay.classList.add('active');
      this.els.clockDisplay.classList.add('danger');
      this.els.btnMainAction.classList.remove('running');
      this.els.btnMainAction.classList.add('al-dente');
      this.els.launchIcon.textContent = '🚨';
      this.els.launchText.textContent = 'EMERGENCY DRAIN NOW!';
      this.els.launchSub.textContent = 'CLICK TO SAVE PASTA';

      this.els.aldenteModal.classList.remove('hidden');
      this.log('🚨 EMERGENCY AL DENTE REACHED! DRAIN POT OR FACE FLACCIDITY!');
    }

    triggerDrainSuccess() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.state = 'DRAINED';
      this.audio.stopSiren();
      this.audio.stopBubbling();
      this.audio.playVictoryFanfare();

      document.body.classList.remove('shake-violent');
      this.els.alarmOverlay.classList.remove('active');
      this.els.aldenteModal.classList.add('hidden');

      this.canvas.setDrained(true);
      this.canvas.setBoilIntensity(0);

      this.els.clockDisplay.classList.remove('danger');
      this.els.defconIndicator.className = 'defcon-badge defcon-normal';
      this.els.defconText.textContent = 'MISSION ACCOMPLISHED: CHEF';
      this.els.missionBadge.textContent = 'DRAINED';
      this.els.missionBadge.classList.remove('alert-badge');

      this.els.btnMainAction.classList.remove('running', 'al-dente');
      this.els.btnMainAction.disabled = true;
      this.els.btnPause.disabled = true;
      this.els.launchIcon.textContent = '🏆';
      this.els.launchText.textContent = 'DRAINED TO PERFECTION';
      this.els.launchSub.textContent = 'TOSS IN SAUCE FOR 60 SECONDS';

      this.els.reactorBanner.textContent = 'MISSION SUCCESS: PASTA SAVED FROM MUSHY DESTRUCTION';
      this.log('Triumphant Drain executed! 1 cup pasta water retained. Certified Al Dente Master.');

      // Floating celebratory emojis
      for (let i = 0; i < 15; i++) {
        setTimeout(() => this.spawnFloatingEmoji('🤌'), i * 80);
      }
    }

    reset() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.audio.stopSiren();
      this.audio.stopBubbling();
      this.audio.playClick();

      document.body.classList.remove('shake-violent');
      this.els.alarmOverlay.classList.remove('active');
      this.els.aldenteModal.classList.add('hidden');

      this.state = 'STANDBY';
      this.remainingTime = this.targetDuration;
      this.isCoverFlipped = false;
      this.canvas.setDrained(false);
      this.canvas.setBoilIntensity(0.25);

      this.els.btnFlipCover.classList.remove('flipped');
      this.els.coverText.textContent = '⚠️ FLIP SAFETY COVER ⚠️';
      this.els.btnMainAction.disabled = true;
      this.els.btnMainAction.className = 'big-red-button';
      this.els.launchIcon.textContent = '🚀';
      this.els.launchText.textContent = 'IGNITE BOIL SEQUENCE';
      this.els.launchSub.textContent = 'DROP PASTA INTO THE ABYSS';
      this.els.btnPause.disabled = true;
      this.els.pauseLabel.textContent = 'PAUSE CLOCK';

      this.els.defconIndicator.className = 'defcon-badge defcon-normal';
      this.els.defconText.textContent = 'DEFCON CARB: READY';
      this.els.missionBadge.textContent = 'ARMED';
      this.els.missionBadge.classList.add('alert-badge');

      this.els.telemetryBubbles.textContent = 'IDLE';
      this.els.telemetryBubbles.className = 'dial-value text-cyan';
      this.els.reactorBanner.className = 'reactor-status-banner';
      this.els.reactorBanner.textContent = 'REACTOR AWAITING IGNITION COMMAND';

      this.renderClock();
      this.updateProgress();
      this.log('System reset. Awaiting payload ignition.');
    }

    updateProgress() {
      const elapsed = this.targetDuration - this.remainingTime;
      const pct = Math.min(100, Math.max(0, (elapsed / this.targetDuration) * 100));
      this.els.thermoclineFill.style.width = `${pct}%`;
      this.els.cookPercent.textContent = `${pct.toFixed(0)}%`;
      this.els.telemetryStarch.textContent = `${pct.toFixed(1)}% GEL`;
    }

    renderClock() {
      const totalSec = Math.max(0, this.remainingTime);
      const m = Math.floor(totalSec / 60);
      const s = Math.floor(totalSec % 60);
      const ms = Math.floor((totalSec % 1) * 10);
      this.els.clockDisplay.innerHTML = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}<span class="clock-ms">.${ms}</span>`;

      if (this.state === 'BOILING') {
        if (totalSec > 45) {
          this.els.clockStateBanner.textContent = 'COAGULATION PHASE: GLUTEN MATRIX STRENGTHENING';
        } else {
          this.els.clockStateBanner.textContent = '⚠️ FINAL AL DENTE WINDOW: PREPARE COLANDER!';
        }
      }
    }

    formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }

    log(msg) {
      if (this.els.termLine) {
        this.els.termLine.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      }
    }

    // Easter Egg: Snap Spaghetti
    easterEggSnap() {
      this.audio.playSnapPasta();
      document.body.classList.add('shake-violent');
      setTimeout(() => document.body.classList.remove('shake-violent'), 600);

      if (this.state === 'BOILING') {
        this.remainingTime += 20; // 20s penalty!
        this.targetDuration += 20;
        this.renderClock();
        this.log('SACRILEGE! Never break pasta! Nonna added +20s penalty to your boil.');
      } else {
        this.log('FATAL ANOMALY: A pasta strand was snapped! Nonna weeps in heaven.');
      }
      this.spawnFloatingEmoji('💔');
      this.spawnFloatingEmoji('🤌');
    }

    // Easter Egg: Add Olive Oil
    easterEggOil() {
      this.audio.playTick(true);
      alert('⚠️ SACRILEGE DETECTED:\nOlive oil floats on top of boiling water and coats the pasta as you drain it, preventing your sauce from adhering! Stop doing this!');
      this.log('WARNING: Olive oil injection rejected by hydrodynamics and tradition.');
    }

    // Toggle Nonna's Spoon
    toggleSpoon() {
      const active = !this.canvas.spoonActive;
      this.canvas.setSpoon(active);
      this.audio.playWoodKnock();
      this.els.btnSpoon.classList.toggle('active', active);
      this.els.spoonOverlay.classList.toggle('hidden', !active);
      this.log(`Nonna's wooden spoon ${active ? 'ENGAGED across reactor pot (Foam suppressed)' : 'DISENGAGED'}`);
    }

    // Easter Egg: Che Vuoi
    easterEggCheVuoi(e) {
      this.audio.playCheVuoi();
      const x = e.clientX || window.innerWidth / 2;
      const y = e.clientY || window.innerHeight / 2;
      this.spawnFloatingEmoji('🤌', x, y);
      this.log('Che cazzo vuoi?! Emotion level calibrated to 100% Italian.');
    }

    spawnFloatingEmoji(emoji, x, y) {
      const el = document.createElement('div');
      el.className = 'floating-hand';
      el.textContent = emoji;
      el.style.left = `${(x || Math.random() * (window.innerWidth - 60)) + (Math.random() * 40 - 20)}px`;
      el.style.top = `${(y || window.innerHeight * 0.7) + (Math.random() * 40 - 20)}px`;
      this.els.gestureLayer.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PastaApp());
  } else {
    new PastaApp();
  }

})();
