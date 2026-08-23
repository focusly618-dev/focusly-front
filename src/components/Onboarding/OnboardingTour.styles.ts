import type { ComponentProps } from 'react';
import type { Theme } from '@mui/material';
import type Joyride from 'react-joyride';

type JoyrideStyles = ComponentProps<typeof Joyride>['styles'];

export const buildOnboardingTourStyles = (theme: Theme): JoyrideStyles => ({
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
});
