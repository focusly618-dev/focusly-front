import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

const dispatch = vi.fn();
let pushEnabled: boolean | undefined;
vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => dispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { user: { id: 'u-1', pushEnabled } } }),
}));

// The real sound player builds an AudioContext, which jsdom doesn't have.
const setPreferredSound = vi.fn();
vi.mock('@/utils', () => ({
  soundPlayer: {
    getPreferredSound: () => 'taskUpcoming',
    setPreferredSound: (sound: string) => setPreferredSound(sound),
  },
}));
const playSound = vi.fn();
vi.mock('@/hooks/useNotificationSounds', () => ({
  useNotificationSounds: () => ({ playSound }),
}));

const { NotificationsSection } =
  await import('@/pages/Profile/sections/NotificationsSection');

describe('NotificationsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushEnabled = undefined;
  });

  it('describes what the reminders switch does', () => {
    render(<NotificationsSection />);
    const toggle = screen.getByRole('switch');

    expect(toggle).toHaveAccessibleName(
      'profilePage.notifications.remindersTitle',
    );
    expect(toggle).toHaveAccessibleDescription(
      'profilePage.notifications.remindersDesc',
    );
  });

  it('reminders are on unless the user turned them off', () => {
    render(<NotificationsSection />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('turning reminders off saves the preference', () => {
    render(<NotificationsSection />);
    fireEvent.click(screen.getByRole('switch'));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { pushEnabled: false } }),
    );
  });

  it('picking a sound previews and stores it', () => {
    render(<NotificationsSection />);
    fireEvent.click(
      screen.getByRole('radio', {
        name: /notificationSettings.sound.softBell/,
      }),
    );

    expect(setPreferredSound).toHaveBeenCalledWith('breakReminder');
    expect(playSound).toHaveBeenCalledWith('breakReminder');
  });
});
