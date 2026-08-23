import React from 'react';
import Joyride from 'react-joyride';
import { useTheme } from '@mui/material';
import type { OnboardingTourProps } from './OnboardingTour.types';
import { getOnboardingSteps } from './OnboardingTour.utils';
import { useOnboardingTour } from './useOnboardingTour.hook';

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
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar tour'
      }}
      styles={{
        options: {
          arrowColor: theme.palette.background.paper,
          backgroundColor: theme.palette.background.paper,
          overlayColor: 'rgba(0, 0, 0, 0.65)',
          primaryColor: theme.palette.primary.main,
          textColor: theme.palette.text.primary,
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 16,
          padding: 20,
          fontFamily: '"Outfit", sans-serif',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonBack: {
          color: theme.palette.text.secondary,
          marginRight: 10,
        },
        buttonNext: {
          borderRadius: 8,
          fontWeight: 700,
        },
        buttonSkip: {
          color: theme.palette.text.secondary,
        },
      }}
    />
  );
};
