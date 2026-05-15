import { useState, useEffect, useMemo } from 'react';

interface UseFocusModeTimerProps {
  initialMinutes: number;
  isActive: boolean;
  onComplete: () => void;
  onTick?: (secondsPassed: number) => void;
}

export const useFocusModeTimer = ({
  initialMinutes,
  isActive,
  onComplete,
  onTick,
}: UseFocusModeTimerProps) => {
  const [secondsPassed, setSecondsPassed] = useState(() => {
    const saved = localStorage.getItem('focus_mode_seconds_passed');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [targetSeconds, setTargetSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    setTargetSeconds(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    localStorage.setItem('focus_mode_seconds_passed', secondsPassed.toString());
  }, [secondsPassed]);

  const progress = useMemo(() => {
    if (targetSeconds === 0) return 0;
    return (secondsPassed / targetSeconds) * 100;
  }, [secondsPassed, targetSeconds]);

  const isOvertime = useMemo(
    () => secondsPassed > targetSeconds,
    [secondsPassed, targetSeconds],
  );

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsPassed((prev) => {
          const next = prev + 1;

          onTick?.(1);
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, targetSeconds, onComplete, onTick]);

  return {
    secondsPassed,
    setSecondsPassed,
    progress,
    formatTime,
    isOvertime,
    targetSeconds,
    setTargetSeconds,
  };
};
