import React from 'react';

interface CalendarSlotWrapperProps {
  children: React.ReactElement<{ onContextMenu?: React.MouseEventHandler }>;
  value?: Date;
  onContextMenu?: (e: React.MouseEvent, date: Date) => void;
}

/**
 * Custom wrapper for time slots in Day and Week views.
 * Captures right-clicks to trigger the slot context menu.
 */
export const CalendarSlotWrapper: React.FC<CalendarSlotWrapperProps> = ({
  children,
  value,
  onContextMenu,
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu && value) {
      e.preventDefault();
      onContextMenu(e, value);
    }
  };

  // Clone the child element and attach the context menu handler directly to it.
  // This avoids introducing an extra wrapper div that breaks CSS child combinators.
  return React.cloneElement(children, {
    onContextMenu: handleContextMenu,
  });
};
