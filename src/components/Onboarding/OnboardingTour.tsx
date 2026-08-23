import React from 'react';
import Joyride from 'react-joyride';
import { useTheme } from '@mui/material';
import type { OnboardingTourProps } from './OnboardingTour.types';
import { getOnboardingSteps, ONBOARDING_LOCALE } from './OnboardingTour.utils';
import { useOnboardingTour } from './useOnboardingTour.hook';
import { buildOnboardingTourStyles } from './OnboardingTour.styles';

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onTabChange }) => {
  const theme = useTheme();
  const steps = getOnboardingSteps();
  const { run, stepIndex, handleJoyrideCallback } = useOnboardingTour(onTabChange);

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      locale={ONBOARDING_LOCALE}
      styles={buildOnboardingTourStyles(theme)}
    />
  );
};
