import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/react';

const i18n = vi.hoisted(() => ({ language: 'es' }));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({ t: (key: string) => key, i18n }),
}));

const { LoopVideo } = await import('@/pages/Public/Site/components/ui');

const sources = (container: HTMLElement) =>
  [...container.querySelectorAll('source')].map((s) =>
    s.getAttribute('src')!.replace(/^.*\/videos\//, ''),
  );

const failLoad = (container: HTMLElement) => {
  const sourceList = container.querySelectorAll('source');
  fireEvent.error(sourceList[sourceList.length - 1]);
};

describe('the site loop videos', () => {
  beforeEach(() => {
    i18n.language = 'es';
  });

  it('play the Spanish set by default', () => {
    const { container } = render(<LoopVideo name="tasks-hero" alt="" />);
    expect(sources(container)).toEqual([
      'tasks-hero-light.webm',
      'tasks-hero-light.mp4',
    ]);
  });

  it.each(['en', 'ja'])('play the %s set on the %s site', (lang) => {
    i18n.language = lang;
    const { container } = render(<LoopVideo name="tasks-hero" alt="" />);
    expect(sources(container)).toEqual([
      `tasks-hero-light-${lang}.webm`,
      `tasks-hero-light-${lang}.mp4`,
    ]);
    expect(container.querySelector('video')?.getAttribute('poster')).toMatch(
      new RegExp(`tasks-hero-light-${lang}-poster\\.webp$`),
    );
  });

  it.each(['fr', 'pt-BR', 'en-GB', 'zh-CN'])(
    'play the English set on the %s site, which has none of its own',
    (lang) => {
      i18n.language = lang;
      const { container } = render(<LoopVideo name="tasks-hero" alt="" />);
      expect(sources(container)[0]).toBe('tasks-hero-light-en.webm');
    },
  );

  it("fall back to Spanish when a language's video won't load", () => {
    i18n.language = 'en';
    const { container, unmount } = render(
      <LoopVideo name="focus-hero" alt="" />,
    );

    // A language's video that never loaded isn't there: no retry for it
    failLoad(container);
    expect(sources(container)).toEqual([
      'focus-hero-light.webm',
      'focus-hero-light.mp4',
    ]);
    unmount();

    // Later in the session the same video goes straight to Spanish
    const again = render(<LoopVideo name="focus-hero" alt="" />);
    expect(sources(again.container)[0]).toBe('focus-hero-light.webm');
  });

  it('ask again for a video that played before (an expired link)', () => {
    const { container } = render(<LoopVideo name="tasks-hero" alt="" />);
    failLoad(container);
    expect(sources(container)[0]).toBe('tasks-hero-light.webm?r=1');
  });
});
