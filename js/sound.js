/* ==========================================================================
   HIA THEME-AWARE SYNTHESIZER ENGINE // WEB AUDIO API
   ========================================================================== */

class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    getCurrentThemeId() {
        return window.ThemeManager ? window.ThemeManager.currentThemeId : 'theme-spy';
    }

    /**
     * Play Key Click Sound (Adapts to current theme)
     */
    playKeyClick() {
        this.init();
        const theme = this.getCurrentThemeId();

        switch (theme) {
            case 'theme-magic':
            case 'theme-royal':
            case 'theme-sleuth':
                this.playChime(523.25, 0.08); // High magical chime (C5)
                break;
            case 'theme-pirate':
                this.playThud(120, 0.05); // Low wooden click
                break;
            case 'theme-galaxy':
                this.playLaserBlip(800, 200, 0.06); // Space laser blip
                break;
            default: // theme-spy, theme-stealth, theme-dossier
                this.playTacticalBeep(600, 0.04); // Standard retro terminal click
                break;
        }
    }

    /**
     * Play Selection / Blip Sound (Adapts to current theme)
     */
    playBlip() {
        this.init();
        const theme = this.getCurrentThemeId();

        switch (theme) {
            case 'theme-magic':
            case 'theme-royal':
                this.playHarpeSweep();
                break;
            case 'theme-pirate':
                this.playThud(180, 0.08);
                break;
            case 'theme-galaxy':
                this.playLaserBlip(1200, 400, 0.08);
                break;
            default:
                this.playTacticalBeep(900, 0.06);
                break;
        }
    }

    /**
     * Play PDF Download / Compile Sound (Adapts to current theme)
     */
    playCompileSound() {
        this.init();
        const theme = this.getCurrentThemeId();

        if (theme === 'theme-magic' || theme === 'theme-royal') {
            this.playMagicalArpeggio();
        } else if (theme === 'theme-galaxy') {
            this.playSciFiWarp();
        } else {
            this.playTacticalSuccess();
        }
    }

    // --- SYNTHESIZER SOUND GENERATORS ---

    playTacticalBeep(freq, duration) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playChime(freq, duration) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playThud(freq, duration) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playLaserBlip(startFreq, endFreq, duration) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playMagicalArpeggio() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playChime(freq, 0.2);
            }, idx * 70);
        });
    }

    playTacticalSuccess() {
        const notes = [440, 554.37, 659.25]; // A4, C#5, E5
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTacticalBeep(freq, 0.15);
            }, idx * 80);
        });
    }

    playSciFiWarp() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playHarpeSweep() {
        this.playChime(659.25, 0.1);
        setTimeout(() => this.playChime(880, 0.12), 60);
    }
}

window.SoundEngine = new SoundEngine();