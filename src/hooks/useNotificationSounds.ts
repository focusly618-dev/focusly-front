import { useCallback, useState } from 'react';
import { soundPlayer, playNotificationSound } from '@/utils/notificationSounds';
import Swal from 'sweetalert2';

type SoundType =
  | 'taskUpcoming'
  | 'sessionStart'
  | 'breakReminder'
  | 'sessionEnd';

const TEST_MESSAGES: Record<SoundType, { title: string; body: string }> = {
  taskUpcoming: {
    title: 'Task Coming Up!',
    body: 'Your next task starts in 5 minutes. Get ready!',
  },
  sessionStart: {
    title: 'Focus Session Started',
    body: 'Your deep work session has begun. Stay focused!',
  },
  breakReminder: {
    title: 'Time for a Break',
    body: "You've been working hard. Take a 5-minute break.",
  },
  sessionEnd: {
    title: 'Session Complete!',
    body: 'Great job! Your focus session has ended.',
  },
};

interface UseNotificationSoundsReturn {
  playSound: (type: SoundType, showNotification?: boolean) => void;
  setVolume: (volume: number) => void;
  volume: number;
  isPlaying: boolean;
}

export const useNotificationSounds = (
  initialVolume = 0.5,
): UseNotificationSoundsReturn => {
  const [volume, setVolumeState] = useState(initialVolume);
  const [isPlaying, setIsPlaying] = useState(false);

  const setVolume = useCallback((vol: number) => {
    const clampedVolume = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVolume);
    soundPlayer.setVolume(clampedVolume);
  }, []);

  const playSound = useCallback(
    (type: SoundType, showNotification = true) => {
      setIsPlaying(true);
      playNotificationSound(type, volume);

      // Show test notification with professional Notion/Motion style
      if (showNotification) {
        const message = TEST_MESSAGES[type];
        const iconMap: Record<SoundType, string> = {
          taskUpcoming: '⏰',
          sessionStart: '▶️',
          breakReminder: '⏸️',
          sessionEnd: '🏁',
        };

        void Swal.fire({
          html: `
          <div style="display: flex; align-items: center; gap: 16px; font-family: inherit;">
            <div class="motion-notification-icon-wrapper">${iconMap[type]}</div>
            <div style="flex: 1; min-width: 0; text-align: left;">
              <div class="motion-notification-title">${message.title}</div>
              <div class="motion-notification-body">${message.body}</div>
            </div>
          </div>
        `,
          toast: true,
          position: 'top-end',
          timer: 5000,
          timerProgressBar: false,
          showConfirmButton: false,
          showCloseButton: false,
          showDenyButton: false,
          background: 'transparent',
          padding: '0',
          customClass: {
            popup: 'motion-notification',
          },
          showClass: {
            popup: 'motion-slide-in',
          },
          hideClass: {
            popup: 'motion-slide-out',
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      }

      // Reset playing state after a short delay
      setTimeout(() => setIsPlaying(false), 1000);
    },
    [volume],
  );

  return {
    playSound,
    setVolume,
    volume,
    isPlaying,
  };
};

export default useNotificationSounds;
