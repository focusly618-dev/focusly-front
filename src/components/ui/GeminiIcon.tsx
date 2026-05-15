import { SvgIcon } from '@mui/material';
import type { SvgIconProps } from '@mui/material';

export const GeminiIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e88e5" />
          <stop offset="50%" stopColor="#9c27b0" />
          <stop offset="100%" stopColor="#e91e63" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5L14.5 9.5L21.5 12L14.5 14.5L12 21.5L9.5 14.5L2.5 12L9.5 9.5L12 2.5Z"
        fill="url(#gemini-gradient)"
      />
    </SvgIcon>
  );
};
