import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import type React from 'react';
import { MiniMode } from '@/pages/Home/components/FocusMode/components/MiniMode';
import {
  MINI_MODE_SIZE,
  useFocusModeUI,
} from '@/pages/Home/components/FocusMode/hooks/useFocusModeUI.hook';

const TITLE =
  'Write the quarterly report for the product team and send it to everyone';

const renderMini = () => {
  const handlers = {
    handleMouseDown: vi.fn(),
    setIsActive: vi.fn(),
    handleCloseRequest: vi.fn(),
    setViewMode: vi.fn(),
  };
  render(
    <MiniMode
      position={{ x: 40, y: 40 }}
      formatTime={() => '24:13'}
      timeLeft={1453}
      isActive
      activeItem={{ title: TITLE }}
      progress={40}
      {...handlers}
    />,
  );
  return handlers;
};

describe('MiniMode', () => {
  it('is a small pill with the time and the task cut to one line', () => {
    renderMini();
    const pill = screen.getByRole('group', { name: 'Focus timer' });

    expect(pill).toHaveStyle({
      width: `${MINI_MODE_SIZE.width}px`,
      height: `${MINI_MODE_SIZE.height}px`,
    });
    expect(screen.getByText('24:13')).toBeInTheDocument();
    // One line with an ellipsis; the whole title is in its hover tooltip
    expect(screen.getByText(TITLE)).toHaveClass('MuiTypography-noWrap');
  });

  it('pauses, expands and ends the session from its buttons', () => {
    const handlers = renderMini();

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expand focus mode' }));
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));

    expect(handlers.setIsActive).toHaveBeenCalledWith(false);
    expect(handlers.setViewMode).toHaveBeenCalledWith('full');
    expect(handlers.handleCloseRequest).toHaveBeenCalled();
  });
});

describe('dragging the mini timer', () => {
  const mouseDownOn = (target: Element, x = 100, y = 100) =>
    ({
      target,
      clientX: x,
      clientY: y,
      preventDefault: () => {},
    }) as unknown as React.MouseEvent;

  it('starts on the pill, not on its buttons', () => {
    const { result } = renderHook(() => useFocusModeUI());

    act(() =>
      result.current.handleMouseDown(
        mouseDownOn(document.createElement('button')),
      ),
    );
    expect(result.current.isDragging).toBe(false);

    act(() =>
      result.current.handleMouseDown(
        mouseDownOn(document.createElement('div')),
      ),
    );
    expect(result.current.isDragging).toBe(true);
  });

  it('starts inside the window and never leaves it', async () => {
    const { result } = renderHook(() => useFocusModeUI());
    const inWindow = ({ x, y }: { x: number; y: number }) =>
      x >= 0 &&
      y >= 0 &&
      x + MINI_MODE_SIZE.width <= window.innerWidth &&
      y + MINI_MODE_SIZE.height <= window.innerHeight;

    expect(inWindow(result.current.position)).toBe(true);

    act(() =>
      result.current.handleMouseDown(
        mouseDownOn(document.createElement('div')),
      ),
    );
    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 99999, clientY: -99999 }),
      );
    });

    await waitFor(() =>
      expect(result.current.position.x).toBe(
        window.innerWidth - MINI_MODE_SIZE.width - 12,
      ),
    );
    expect(inWindow(result.current.position)).toBe(true);
  });
});
