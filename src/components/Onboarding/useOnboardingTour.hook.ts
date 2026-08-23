import { useState } from 'react';
import { ACTIONS, EVENTS, STATUS, type CallBackProps } from 'react-joyride';
import { TaskBar } from '@/pages/Home/components/Sidebar/types/Sidebar.types';

const TOUR_STORAGE_KEY = 'focusly_tour_seen';

export const useOnboardingTour = (onTabChange: (tab: TaskBar) => void) => {
  const [run, setRun] = useState(() => !localStorage.getItem(TOUR_STORAGE_KEY));
  const [stepIndex, setStepIndex] = useState(0);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      // Navigation Logic (Adjusted indices)
      if (nextIndex >= 4 && nextIndex <= 8) onTabChange(TaskBar.Tasks);
      else if (nextIndex >= 10 && nextIndex <= 13) onTabChange(TaskBar.Workspace);
      else if (nextIndex >= 15 && nextIndex <= 18) onTabChange(TaskBar.Insights);
      else onTabChange(TaskBar.DailyPlan);

      setStepIndex(nextIndex);
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }
  };

  return { run, stepIndex, handleJoyrideCallback };
};
