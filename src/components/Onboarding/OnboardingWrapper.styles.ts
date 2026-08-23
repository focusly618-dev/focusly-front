import type { ComponentProps } from 'react';
import type { Theme } from '@mui/material';
import type Joyride from 'react-joyride';

type JoyrideStyles = ComponentProps<typeof Joyride>['styles'];

export const buildJoyrideStyles = (theme: Theme): JoyrideStyles => ({
  options: {
    primaryColor: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
    textColor: theme.palette.text.primary,
    arrowColor: theme.palette.background.paper,
    zIndex: 10000,
  },
  tooltipContainer: {
    textAlign: 'left',
    borderRadius: '12px',
    padding: '10px',
  },
  buttonNext: {
    borderRadius: '8px',
    fontWeight: 600,
    padding: '8px 16px',
  },
  buttonBack: {
    marginRight: '10px',
    color: theme.palette.text.secondary,
  },
  buttonSkip: {
    color: theme.palette.text.secondary,
  },
});
