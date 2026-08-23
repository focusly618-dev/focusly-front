import {
  Bolt as LightningIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';

import packageJson from '../../../package.json';

export const CURRENT_RELEASE_VERSION = packageJson.version;

// This file only exports data/constants (no components), so fast-refresh
// boundary detection doesn't apply here.
// eslint-disable-next-line react-refresh/only-export-components
export const releaseData = {
  title: "What's New in FocusCal",
  description:
    "System performance improvements and critical bug fixes for better reliability. We've optimized the kinetic engine for even smoother deep work transitions.",
  features: [
    {
      icon: <LightningIcon sx={{ color: '#4ade80', fontSize: 16 }} />,
      text: '30% faster dashboard load times',
    },
    {
      icon: <SyncIcon sx={{ color: '#60a5fa', fontSize: 16 }} />,
      text: 'Calendar sync integrity patch',
    },
  ],
};
