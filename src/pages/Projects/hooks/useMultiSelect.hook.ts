import { useState } from 'react';

// Tracks a multi-selection by id while keeping the selected items around, so
// the confirm dialog can still show names after the user changes page.
export const useMultiSelect = <T extends { id: string }>() => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState<Map<string, T>>(() => new Map());

  const startSelecting = () => setIsSelecting(true);

  const stopSelecting = () => {
    setIsSelecting(false);
    setSelected(new Map());
  };

  const toggle = (item: T) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.set(item.id, item);
      }
      return next;
    });
  };

  const areAllSelected = (items: T[]) =>
    items.length > 0 && items.every((item) => selected.has(item.id));

  // Selects every visible item, or clears them if they are all selected.
  const toggleAll = (items: T[]) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (items.every((item) => next.has(item.id))) {
        items.forEach((item) => next.delete(item.id));
      } else {
        items.forEach((item) => next.set(item.id, item));
      }
      return next;
    });
  };

  return {
    state: {
      isSelecting,
      selectedItems: Array.from(selected.values()),
      selectedCount: selected.size,
    },
    actions: {
      startSelecting,
      stopSelecting,
      toggle,
      toggleAll,
      isSelected: (id: string) => selected.has(id),
      areAllSelected,
    },
  };
};
