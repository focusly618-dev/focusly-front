import type { Step } from 'react-joyride';

export interface OnboardingWrapperProps {
  steps: Step[];
  run: boolean;
  onFinish?: () => void;
}
