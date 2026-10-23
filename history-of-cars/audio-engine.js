/**
 * The History of Cars - Procedural Web Audio Engine
 * Synthesizes realistic engine sounds, turbo blow-offs, electric inverters,
 * and ambient highway audio purely using the Web Audio API without any external audio files.
 */

class CarAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.activeNodes = [];
    this.revOscillators = [];
    this.throttleGain = null;
    this.isRevving = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAll();
    }
    return this.isMuted;
  }

  stopAll() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.isRevving = false;
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playSeatbeltClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Metallic latch click
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Procedural Engine Rev Synthesizer
   */
  startThrottleRev(profileName = 'v8-muscle') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    this.stopAll();
    this.isRevving = true;
    const now = this.ctx.currentTime;

    if (profileName === 'steam-chug') {
      this._synthesizeSteam(now);
    } else if (profileName === 'electric-hum' || profileName === 'electric-hyper') {
      this._synthesizeElectric(now, profileName === 'electric-hyper');
    } else {
      this._synthesizeCombustion(now, profileName);
    }
  }

  stopThrottleRev() {
    if (!this.isRevving || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Wind down
    if (this.throttleGain) {
      try {
        this.throttleGain.gain.setValueAtTime(this.throttleGain.gain.value, now);
        this.throttleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      } catch (e) {}
    }

    setTimeout(() => {
      this.stopAll();
    }, 650);
  }

  _synthesizeCombustion(now, profileName) {
    const isV12 = profileName === 'v12-howl' || profileName === 'v6-vtec';
    const isTurbo = profileName.includes('turbo');
    const isPuttPutt = profileName === 'putt-putt';

    const baseFreq = isPuttPutt ? 45 : isV12 ? 140 : 75;
    const targetFreq = isPuttPutt ? 95 : isV12 ? 550 : 280;

    // Dual detuned oscillators for authentic exhaust rumble
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const masterGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq * 1.015, now);

    // Rev up curve
    osc1.frequency.exponentialRampToValueAtTime(targetFreq, now + 1.2);
    osc2.frequency.exponentialRampToValueAtTime(targetFreq * 1.015, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(baseFreq * 3, now);
    filter.frequency.exponentialRampToValueAtTime(targetFreq * 4, now + 1.2);
    filter.Q.value = 4.0;

    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.25, now + 0.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);

    this.throttleGain = masterGain;
    this.activeNodes.push(osc1, osc2, filter, masterGain);

    // If Turbocharged, add turbo spool whine and wastegate pop
    if (isTurbo) {
      const turboOsc = this.ctx.createOscillator();
      const turboGain = this.ctx.createGain();
      turboOsc.type = 'sine';
      turboOsc.frequency.setValueAtTime(800, now);
      turboOsc.frequency.exponentialRampToValueAtTime(3200, now + 1.2);

      turboGain.gain.setValueAtTime(0.001, now);
      turboGain.gain.linearRampToValueAtTime(0.06, now + 1.0);

      turboOsc.connect(turboGain);
      turboGain.connect(this.ctx.destination);
      turboOsc.start(now);
      this.activeNodes.push(turboOsc, turboGain);
    }
  }

  _synthesizeElectric(now, isHyper = false) {
    const baseFreq = isHyper ? 320 : 220;
    const targetFreq = isHyper ? 1400 : 780;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    oscHarmonic.type = 'triangle';

    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 1.4);

    oscHarmonic.frequency.setValueAtTime(baseFreq * 2, now);
    oscHarmonic.frequency.exponentialRampToValueAtTime(targetFreq * 2.02, now + 1.4);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    oscHarmonic.start(now);

    this.throttleGain = gain;
    this.activeNodes.push(osc, oscHarmonic, gain);
  }

  _synthesizeSteam(now) {
    // Rhythmic puffing pulse
    const bufferSize = this.ctx.sampleRate * 2.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 2.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    this.activeNodes.push(whiteNoise, filter, gain);
    this.throttleGain = gain;
  }
}

export const audioEngine = new CarAudioEngine();
