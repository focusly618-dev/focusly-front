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

// pdfjs-dist's canvas module references DOMMatrix at import time (used for
// page-rendering transforms); jsdom doesn't implement it, so anything that
// imports documentConverters.ts (Import Content modal) throws at module
// load. A minimal stub is enough — these tests never render an actual PDF
// page, only exercise the xlsx/dispatch conversion paths.
class FakeDOMMatrix {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  e = 0;
  f = 0;
}

Object.defineProperty(window, 'DOMMatrix', {
  value: FakeDOMMatrix,
  writable: true,
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
