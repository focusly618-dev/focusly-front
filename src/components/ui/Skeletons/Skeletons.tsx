import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, type SxProps, type Theme } from '@mui/material';
import { skeletonWidth } from './skeletonWidth';

// Placeholders shown while data loads. They keep the shape of what's coming
// (so nothing jumps when it arrives), shimmer with MUI's wave in every theme,
// and tell screen readers that the region is loading.

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

/** The loading region: announced once, its placeholders hidden from AT. */
export const LoadingRegion: React.FC<{
  children: React.ReactNode;
  label?: string;
  sx?: SxProps<Theme>;
}> = ({ children, label, sx }) => {
  const { t } = useTranslation();
  return (
    <Box role="status" aria-busy="true" aria-live="polite" sx={sx}>
      <Box component="span" sx={visuallyHidden}>
        {label ?? t('common.loading')}
      </Box>
      <Box aria-hidden sx={{ display: 'contents' }}>
        {children}
      </Box>
    </Box>
  );
};

/** A line of text; `width` varies so a list doesn't look stamped. */
export const TextSkeleton: React.FC<{
  width?: number | string;
  height?: number;
  sx?: SxProps<Theme>;
}> = ({ width = '100%', height = 12, sx }) => (
  <Skeleton
    animation="wave"
    variant="rounded"
    width={width}
    height={height}
    sx={[{ borderRadius: '4px' }, ...(Array.isArray(sx) ? sx : [sx])]}
  />
);

/**
 * Rows like a list (conversations, projects, notifications, tasks): an
 * optional leading icon, a title and a shorter second line.
 */
export const ListRowSkeleton: React.FC<{
  rows?: number;
  leading?: 'circle' | 'square' | 'dot' | false;
  lines?: 1 | 2;
  dense?: boolean;
  label?: string;
  sx?: SxProps<Theme>;
}> = ({ rows = 4, leading = 'circle', lines = 2, dense, label, sx }) => (
  <LoadingRegion label={label} sx={sx}>
    {Array.from({ length: rows }, (_, i) => (
      <Box
        key={i}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: dense ? 1 : 1.5,
          py: dense ? 0.75 : 1.25,
          px: dense ? 0.5 : 0,
        }}
      >
        {leading === 'dot' && (
          <Skeleton animation="wave" variant="circular" width={8} height={8} />
        )}
        {leading === 'circle' && (
          <Skeleton
            animation="wave"
            variant="circular"
            width={dense ? 20 : 32}
            height={dense ? 20 : 32}
          />
        )}
        {leading === 'square' && (
          <Skeleton
            animation="wave"
            variant="rounded"
            width={dense ? 20 : 32}
            height={dense ? 20 : 32}
            sx={{ borderRadius: '8px' }}
          />
        )}
        <Box sx={{ flex: 1, minWidth: 0, display: 'grid', gap: 0.75 }}>
          <TextSkeleton width={skeletonWidth(i)} height={dense ? 10 : 12} />
          {lines === 2 && (
            <TextSkeleton width={skeletonWidth(i, 3)} height={dense ? 8 : 10} />
          )}
        </Box>
      </Box>
    ))}
  </LoadingRegion>
);

/** A conversation opening: alternating question and answer bubbles. */
export const ChatSkeleton: React.FC<{ label?: string }> = ({ label }) => (
  <LoadingRegion
    label={label}
    sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}
  >
    {[0, 1, 2].map((i) => (
      <React.Fragment key={i}>
        <Box sx={{ alignSelf: 'flex-end', width: 'min(60%, 360px)' }}>
          <Skeleton
            animation="wave"
            variant="rounded"
            height={i === 1 ? 56 : 40}
            sx={{ borderRadius: '16px 16px 4px 16px' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={28}
            height={28}
          />
          <Box sx={{ flex: 1, display: 'grid', gap: 1, maxWidth: 560 }}>
            <TextSkeleton width="92%" height={13} />
            <TextSkeleton width="86%" height={13} />
            <TextSkeleton width={skeletonWidth(i)} height={13} />
          </Box>
        </Box>
      </React.Fragment>
    ))}
  </LoadingRegion>
);
