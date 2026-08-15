import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Node's built-in --experimental-webstorage localStorage shadows jsdom's
// implementation without a backing file, leaving `window.localStorage` undefined.
// A deterministic in-memory polyfill sidesteps that Node/jsdom version coupling.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new MemoryStorage(),
  writable: true,
});

// jsdom has no Web Audio API. NotificationSoundPlayer (src/utils/notifications
// /notificationSounds.ts) constructs an AudioContext eagerly at module load
// time (a singleton instantiated at import), so anything that transitively
// imports `@/utils` — most hooks in this codebase do, via sileo/toast
// helpers — throws immediately without this stub, unrelated to whatever
// that test actually exercises.
class FakeAudioParam {
  setValueAtTime() {
    return this;
  }
  linearRampToValueAtTime() {
    return this;
  }
  exponentialRampToValueAtTime() {
    return this;
  }
}

class FakeAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      frequency: new FakeAudioParam(),
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  createGain() {
    return {
      gain: new FakeAudioParam(),
      connect: () => {},
    };
  }
}

Object.defineProperty(window, 'AudioContext', {
  value: FakeAudioContext,
  writable: true,
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
