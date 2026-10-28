import { useEffect, useState } from 'react';
import type { GuideSection } from './guideContent';
import { SectionGuideModal } from './SectionGuideModal';
import { OPEN_GUIDE_EVENT, hasSeenGuide, markGuideSeen } from './guideStorage';

// A beat after the section opens, so the guide arrives over a drawn screen
const FIRST_VISIT_DELAY_MS = 600;

/**
 * Shows the current section's guide the first time it's visited, and again
 * whenever it's asked for (the "?" button). Closing it, from any page,
 * counts as seen.
 */
export const GuideHost = ({ section }: { section: GuideSection | null }) => {
  const [openFor, setOpenFor] = useState<GuideSection | null>(null);

  useEffect(() => {
    if (!section || hasSeenGuide(section)) return;
    const timer = setTimeout(() => setOpenFor(section), FIRST_VISIT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [section]);

  useEffect(() => {
    const open = () => {
      if (section) setOpenFor(section);
    };
    window.addEventListener(OPEN_GUIDE_EVENT, open);
    return () => window.removeEventListener(OPEN_GUIDE_EVENT, open);
  }, [section]);

  // Leaving the section closes its guide
  const shown = openFor === section ? openFor : null;

  return (
    <SectionGuideModal
      section={shown}
      onClose={() => {
        if (shown) markGuideSeen(shown);
        setOpenFor(null);
      }}
    />
  );
};
