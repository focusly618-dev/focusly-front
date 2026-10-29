import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    // The key itself, so the tests can tell which page is on screen
    t: (key: string, opts?: string | { defaultValue?: string }) =>
      typeof opts === 'string' ? opts : key,
  }),
}));

const { GUIDES, GuideHost, SectionGuideModal, openSectionGuide } =
  await import('@/components/Guide');

const titleOf = (section: string, step: string) =>
  `guide.${section}.steps.${step}.title`;

describe('SectionGuideModal', () => {
  it('pages through a section with next, back and the dots', () => {
    const onClose = vi.fn();
    render(<SectionGuideModal section="calendar" onClose={onClose} />);
    const steps = GUIDES.calendar;

    expect(
      screen.getByText(titleOf('calendar', steps[0].id)),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(steps.length);
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute(
      'aria-selected',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      screen.getByText(titleOf('calendar', steps[1].id)),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(
      screen.getByText(titleOf('calendar', steps[0].id)),
    ).toBeInTheDocument();

    // Jump straight to a page from its dot
    fireEvent.click(screen.getAllByRole('tab')[3]);
    expect(
      screen.getByText(titleOf('calendar', steps[3].id)),
    ).toBeInTheDocument();
  });

  it('finishes on the last page, and closes from the ✕ too', () => {
    const onClose = vi.fn();
    render(<SectionGuideModal section="insights" onClose={onClose} />);
    const last = GUIDES.insights.length - 1;

    fireEvent.click(screen.getAllByRole('tab')[last]);
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Close guide' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('moves with the arrow keys', () => {
    render(<SectionGuideModal section="tasks" onClose={() => {}} />);
    const next = screen.getByRole('button', { name: 'Next' });
    fireEvent.keyDown(next, { key: 'ArrowRight' });
    expect(
      screen.getByText(titleOf('tasks', GUIDES.tasks[1].id)),
    ).toBeInTheDocument();
    fireEvent.keyDown(next, { key: 'ArrowLeft' });
    expect(
      screen.getByText(titleOf('tasks', GUIDES.tasks[0].id)),
    ).toBeInTheDocument();
  });

  it('draws every page of every guide', () => {
    for (const section of Object.keys(GUIDES) as (keyof typeof GUIDES)[]) {
      const { unmount } = render(
        <SectionGuideModal section={section} onClose={() => {}} />,
      );
      GUIDES[section].forEach((step, i) => {
        fireEvent.click(screen.getAllByRole('tab')[i]);
        expect(screen.getByText(titleOf(section, step.id))).toBeInTheDocument();
      });
      unmount();
    }
  });
});

describe('GuideHost', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  const firstTitle = (section: keyof typeof GUIDES) =>
    titleOf(section, GUIDES[section][0].id);

  it("opens a section's guide on its first visit, and never again once closed", () => {
    const { rerender } = render(<GuideHost section="tasks" />);
    expect(screen.queryByText(firstTitle('tasks'))).toBeNull();

    act(() => vi.advanceTimersByTime(700));
    expect(screen.getByText(firstTitle('tasks'))).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close guide' }));
    act(() => vi.advanceTimersByTime(500));
    expect(localStorage.getItem('focusly_guide_seen_tasks')).toBe('1');

    // Away and back: already seen
    rerender(<GuideHost section="calendar" />);
    rerender(<GuideHost section="tasks" />);
    act(() => vi.advanceTimersByTime(700));
    expect(screen.queryByText(firstTitle('tasks'))).toBeNull();
  });

  it('shows only the guide of the section on screen', () => {
    localStorage.setItem('focusly_guide_seen_tasks', '1');
    const { rerender } = render(<GuideHost section="tasks" />);
    rerender(<GuideHost section="editor" />);
    act(() => vi.advanceTimersByTime(700));

    expect(screen.getByText(firstTitle('editor'))).toBeInTheDocument();
    expect(screen.queryByText(firstTitle('tasks'))).toBeNull();
  });

  it('reopens the current guide on request, even once seen', () => {
    localStorage.setItem('focusly_guide_seen_askAi', '1');
    render(<GuideHost section="askAi" />);
    act(() => vi.advanceTimersByTime(700));
    expect(screen.queryByText(firstTitle('askAi'))).toBeNull();

    act(() => openSectionGuide());
    expect(screen.getByText(firstTitle('askAi'))).toBeInTheDocument();
  });
});

describe('guide translations', () => {
  const read = (lang: string) =>
    JSON.parse(
      readFileSync(
        join(__dirname, `../../src/i18n/locales/${lang}/translation.json`),
        'utf-8',
      ),
    ).guide;

  it.each(['es', 'en', 'ja', 'pt-BR', 'fr', 'de', 'it', 'ko', 'zh-CN'])(
    'has every page written in %s',
    (lang) => {
      const guide = read(lang);
      for (const [section, steps] of Object.entries(GUIDES)) {
        expect(guide[section]?.label, `${lang} ${section}`).toBeTruthy();
        for (const { id } of steps) {
          expect(
            guide[section].steps[id]?.title,
            `${lang} ${section}.${id}`,
          ).toBeTruthy();
          expect(
            guide[section].steps[id]?.body,
            `${lang} ${section}.${id}`,
          ).toBeTruthy();
        }
      }
      for (const key of ['next', 'back', 'done', 'close', 'openGuide']) {
        expect(guide.ui[key], `${lang} ui.${key}`).toBeTruthy();
      }
    },
  );
});
