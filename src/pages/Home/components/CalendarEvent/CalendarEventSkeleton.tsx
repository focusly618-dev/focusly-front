import { Skeleton } from '@mui/material';
import { EventContainer, PRIORITY_COLORS } from './CalendarEvent.styles';

// Cycle through real priority colors so the 3 placeholders read as a set of
// distinct tasks (matching the variety of a real day) instead of 3 identical
// gray blocks.
const SKELETON_ACCENT_COLORS = [
  PRIORITY_COLORS[2].main,
  PRIORITY_COLORS[3].main,
  PRIORITY_COLORS[1].main,
];

interface CalendarEventSkeletonProps {
  colorIndex?: number;
}

/**
 * Lightweight placeholder rendered in place of a `CalendarEvent` while the
 * calendar's underlying data is still loading. Deliberately hook-free: it
 * must never call `useCalendarContextMenu` (which assumes a real
 * Task/GoogleCalendarEvent `resource`), so it stays a pure presentational
 * component. Reuses the real `EventContainer` shell (same border, radius,
 * background, left color accent) so it reads as an actual task card rather
 * than a generic gray rectangle, with two shimmering lines standing in for
 * the time range and title text.
 */
export const CalendarEventSkeleton = ({
  colorIndex = 0,
}: CalendarEventSkeletonProps) => (
  <EventContainer
    variant={{
      main: SKELETON_ACCENT_COLORS[colorIndex % SKELETON_ACCENT_COLORS.length],
    }}
    sx={{ cursor: 'default', pointerEvents: 'none' }}
  >
    <Skeleton
      variant="text"
      animation="wave"
      width="35%"
      height={12}
      sx={{ borderRadius: '3px', transform: 'none', mb: 0.5 }}
    />
    <Skeleton
      variant="text"
      animation="wave"
      width="72%"
      height={14}
      sx={{ borderRadius: '3px', transform: 'none' }}
    />
  </EventContainer>
);
