import Joyride, { STATUS, type CallBackProps } from 'react-joyride';
import { useTheme } from '@mui/material';
import type { OnboardingWrapperProps } from './OnboardingWrapper.types';
import { buildJoyrideStyles } from './OnboardingWrapper.styles';

export const OnboardingWrapper = ({
  steps,
  run,
  onFinish,
}: OnboardingWrapperProps) => {
  const theme = useTheme();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      if (onFinish) onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={buildJoyrideStyles(theme)}
    />
  );
};
