// Generador de sonidos usando Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  constructor() {
    // Inicializar AudioContext cuando sea necesario
    this.initAudioContext();
  }

  private initAudioContext(): void {
    if (typeof window !== 'undefined' && !this.audioContext) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioContext = new AudioContextClass();
          this.isInitialized = true;
        }
      } catch (e) {
        console.warn('AudioContext no disponible:', e);
      }
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(e => console.warn('Error resumiendo AudioContext:', e));
    }
    
    return this.audioContext!;
  }

  /**
   * Sonido de ruleta girando - sonido continuo tipo "whoosh"
   */
  playRouletteSpinning(): void {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    
    // Crear oscilador con pitch descendente
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Sonido descendente tipo "whoosh"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.5);
    
    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Sonido de dinero cayendo - sonido de monedas
   */
  playMoneyFall(): void {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    
    // Crear varios "dings" de monedas
    const coinCount = 5;
    for (let i = 0; i < coinCount; i++) {
      const delay = i * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Frecuencia aleatoria para cada moneda
      const freq = 800 + Math.random() * 400;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + delay + 0.3);
      
      gain.gain.setValueAtTime(0.4, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.3);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    }
  }

  /**
   * Sonido de ganancia - campana ding
   */
  playWinChime(): void {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.50, now); // Do5
    osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.5); // Do4
    
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Sonido de pérdida - sonido bajo y triste
   */
  playLosSound(): void {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(392, now); // Sol4
    osc.frequency.exponentialRampToValueAtTime(196, now + 0.4); // Sol3
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Sonido de click/botón
   */
  playClickSound(): void {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Sonido de jackpot - sonido celebración
   */
  playJackpotSound(): void {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    
    // Secuencia de notas para celebración
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Do5, Mi5, Sol5, Do6
    
    notes.forEach((freq, index) => {
      const delay = index * 0.15;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0.4, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.2);
    });
  }

  /**
   * Sonido de spin para slots - sonido de moneda metálica
   */
  playSlotSpinSound(): void {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;
    
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + i * 100, now + delay);
      osc.frequency.exponentialRampToValueAtTime(250 + i * 50, now + delay + 0.1);
      
      gain.gain.setValueAtTime(0.25, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.1);
    }
  }

  /**
   * Inicializar el audio para permitir que suene
   * Debe ser llamado desde un evento de usuario
   */
  public initializeAudio(): void {
    try {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log('AudioContext resumido');
        }).catch(e => console.warn('Error al reanudar audio:', e));
      }
    } catch (e) {
      console.warn('Error inicializando audio:', e);
    }
  }
}

// Crear instancia global
export const soundManager = new SoundManager();
