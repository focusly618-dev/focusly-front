import type { GuideSection } from './guideContent';

// Each section's guide shows once per browser, the first time it's visited.
const STORAGE_PREFIX = 'focusly_guide_seen_';

export const hasSeenGuide = (section: GuideSection): boolean => {
  try {
    return localStorage.getItem(STORAGE_PREFIX + section) === '1';
  } catch {
    // Storage blocked: better never to show it than to show it every visit
    return true;
  }
};

export const markGuideSeen = (section: GuideSection): void => {
  try {
    localStorage.setItem(STORAGE_PREFIX + section, '1');
  } catch {
    // Not remembered; it just may show again
  }
};

// Reopening the current section's guide, from anywhere (the "?" button)
export const OPEN_GUIDE_EVENT = 'focusly:open-guide';
export const openSectionGuide = (): void => {
  window.dispatchEvent(new Event(OPEN_GUIDE_EVENT));
};
