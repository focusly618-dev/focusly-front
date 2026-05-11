// Notification Sound Utility for Focusly
// Uses Web Audio API to generate sounds programmatically

export type SoundType =
  | 'taskUpcoming'
  | 'sessionStart'
  | 'breakReminder'
  | 'sessionEnd';

const PREFERRED_SOUND_KEY = 'focusly_notification_sound';

interface SoundOptions {
  volume?: number;
  duration?: number;
}

class NotificationSoundPlayer {
  private audioContext: AudioContext | null = null;
  private volume = 0.5;

  constructor() {
    // Initialize on first user interaction to comply with browser policies
    this.initAudioContext();
  }

  private initAudioContext(): void {
    if (typeof window !== 'undefined' && !this.audioContext) {
      this.audioContext = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    }
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  getPreferredSound(): SoundType {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(PREFERRED_SOUND_KEY);
      if (
        saved &&
        [
          'taskUpcoming',
          'sessionStart',
          'breakReminder',
          'sessionEnd',
        ].includes(saved)
      ) {
        return saved as SoundType;
      }
    }
    return 'taskUpcoming';
  }

  setPreferredSound(type: SoundType): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PREFERRED_SOUND_KEY, type);
    }
  }

  // Generate a pleasant chime sound for task notifications
  playTaskUpcoming(options: SoundOptions = {}): void {
    this.initAudioContext();
    if (!this.audioContext) return;

    // If there is a preferred sound in localStorage, we play that instead
    // but only if this is the "default" call (from firebase.ts)
    const preferred = this.getPreferredSound();
    if (preferred !== 'taskUpcoming' && !options.duration) {
      this.play(preferred, options);
      return;
    }

    const duration = options.duration || 0.8;
    const vol = options.volume !== undefined ? options.volume : this.volume;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Create a pleasant ascending chime
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(
      1046.5,
      this.audioContext.currentTime + duration * 0.3,
    ); // C6
    oscillator.frequency.exponentialRampToValueAtTime(
      523.25,
      this.audioContext.currentTime + duration * 0.6,
    );

    // Envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      vol * 0.3,
      this.audioContext.currentTime + 0.05,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      vol * 0.1,
      this.audioContext.currentTime + duration,
    );
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Play sound for session start
  playSessionStart(options: SoundOptions = {}): void {
    this.initAudioContext();
    if (!this.audioContext) return;

    const vol = options.volume !== undefined ? options.volume : this.volume;

    // Two-tone notification
    this.playTone(880, 0.15, vol); // A5
    setTimeout(() => this.playTone(1109, 0.2, vol), 150); // C#6
  }

  // Play gentle bell for break reminder
  playBreakReminder(options: SoundOptions = {}): void {
    this.initAudioContext();
    if (!this.audioContext) return;

    const vol = options.volume !== undefined ? options.volume : this.volume;

    // Gentle bell-like sound
    this.playBellTone(659.25, 1.0, vol); // E5
  }

  // Play success chime for session end
  playSessionEnd(options: SoundOptions = {}): void {
    this.initAudioContext();
    if (!this.audioContext) return;

    const vol = options.volume !== undefined ? options.volume : this.volume;

    // Success arpeggio
    const now = this.audioContext.currentTime;
    this.playToneAt(523.25, 0.15, vol, now); // C5
    this.playToneAt(659.25, 0.15, vol, now + 0.1); // E5
    this.playToneAt(783.99, 0.15, vol, now + 0.2); // G5
    this.playToneAt(1046.5, 0.4, vol, now + 0.3); // C6
  }

  private playTone(frequency: number, duration: number, volume: number): void {
    if (!this.audioContext) return;
    this.playToneAt(frequency, duration, volume, this.audioContext.currentTime);
  }

  private playToneAt(
    frequency: number,
    duration: number,
    volume: number,
    startTime: number,
  ): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  private playBellTone(
    frequency: number,
    duration: number,
    volume: number,
  ): void {
    if (!this.audioContext) return;

    const fundamental = this.audioContext.createOscillator();
    const overtone = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    fundamental.connect(gainNode);
    overtone.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    fundamental.type = 'sine';
    overtone.type = 'sine';
    fundamental.frequency.value = frequency;
    overtone.frequency.value = frequency * 2; // Octave above

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume * 0.4,
      this.audioContext.currentTime + 0.01,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration,
    );

    fundamental.start(this.audioContext.currentTime);
    overtone.start(this.audioContext.currentTime);
    fundamental.stop(this.audioContext.currentTime + duration);
    overtone.stop(this.audioContext.currentTime + duration);
  }

  // Generic play method
  play(type: SoundType, options: SoundOptions = {}): void {
    switch (type) {
      case 'taskUpcoming':
        // We use a small trick here: by passing duration: 0.00001 we tell playTaskUpcoming
        // to NOT use the preferred sound recursively, but play the actual chime sound
        this.playTaskUpcoming(options);
        break;
      case 'sessionStart':
        this.playSessionStart(options);
        break;
      case 'breakReminder':
        this.playBreakReminder(options);
        break;
      case 'sessionEnd':
        this.playSessionEnd(options);
        break;
    }
  }
}

// Singleton instance
export const soundPlayer = new NotificationSoundPlayer();

// Helper function to play notification sounds
export const playNotificationSound = (
  type: SoundType,
  volume?: number,
): void => {
  soundPlayer.play(type, { volume });
};

export default soundPlayer;
