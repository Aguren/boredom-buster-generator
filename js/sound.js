/* ==========================================================================
   HIA SOUND ENGINE // WEB AUDIO SYNTHESIZER
   ========================================================================== */

const SoundEngine = {
    ctx: null,
    enabled: true,

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    // 1. Tactile Key Click (Plays on typing clues)
    playKeyClick() {
        if (!this.enabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // High frequency micro-click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
    },

    // 2. Access Granted / Terminal Unlock Chime
    playAccessGranted() {
        if (!this.enabled) return;
        this.init();

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (index * 0.06));

            gain.gain.setValueAtTime(0, now + (index * 0.06));
            gain.gain.linearRampToValueAtTime(0.1, now + (index * 0.06) + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.06) + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + (index * 0.06));
            osc.stop(now + (index * 0.06) + 0.25);
        });
    },

    // 3. Teletype Beep (Plays during boot sequence lines)
    playBlip() {
        if (!this.enabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    },

    // 4. PDF Transmit Fanfare (Plays on compile button click)
    playCompileSound() {
        if (!this.enabled) return;
        this.init();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.3);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
    }
};

window.SoundEngine = SoundEngine;