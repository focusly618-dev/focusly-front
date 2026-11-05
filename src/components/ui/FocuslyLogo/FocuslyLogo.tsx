import { Box } from '@mui/material';

import type { FocuslyLogoProps } from './FocuslyLogo.types';
import { containerSx } from './FocuslyLogo.styles';

/**
 * The brand mark: brand green tile with the white "auto_awesome" sparkles.
 * The same drawing as public/logo.svg (favicon, installed app icon) and the
 * site navbar's Logo, so the app, the tab and the site match.
 */
export const FocuslyLogo = ({ size = 24, sx }: FocuslyLogoProps) => {
  return (
    <Box sx={containerSx(size, sx)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="512" height="512" rx="144" fill="#008767" />
        <path
          transform="translate(92 92) scale(13.6667)"
          fill="#ffffff"
          d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 6-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25zm-7.5-5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12zm-1.51 3.49L9 15.17l-.99-2.18L5.83 12l2.18-.99L9 8.83l.99 2.18 2.18.99z"
        />
      </svg>
    </Box>
  );
};
