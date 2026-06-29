import React from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';

export const WorkspaceEditorSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        bgcolor: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Header Skeleton */}
        <Box
          sx={{
            height: '64px',
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            bgcolor: theme.palette.background.paper,
          }}
        >
          {/* Left: Back button & Breadcrumb */}
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={120} height={20} />
          </Box>

          {/* Right: Actions, Lang selector, Save status */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: '6px' }} />
            <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: '6px' }} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>

        {/* Content Skeleton */}
        <Box
          sx={{
            flex: 1,
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            overflowY: 'auto',
            width: '100%',
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          {/* Icon Placeholder */}
          <Box display="flex" flexDirection="column" gap={2} sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={64} height={64} />
          </Box>

          {/* Title */}
          <Skeleton variant="text" width="60%" height={56} sx={{ mb: 4 }} />

          {/* Body Paragraph Blocks */}
          <Skeleton variant="text" width="95%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />

          {/* Heading 2 */}
          <Skeleton variant="text" width="30%" height={32} sx={{ mt: 2, mb: 1 }} />

          {/* Bullet List Placeholder */}
          <Box display="flex" flexDirection="column" gap={1.5} sx={{ pl: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Skeleton variant="circular" width={6} height={6} />
              <Skeleton variant="text" width="70%" height={20} />
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Skeleton variant="circular" width={6} height={6} />
              <Skeleton variant="text" width="85%" height={20} />
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Skeleton variant="circular" width={6} height={6} />
              <Skeleton variant="text" width="50%" height={20} />
            </Box>
          </Box>

          {/* Code Block Placeholder */}
          <Box
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              p: 2.5,
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Skeleton variant="text" width="45%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
        </Box>
      </Box>

      {/* Sidebar Skeleton (Right side) */}
      <Box
        sx={{
          width: '360px',
          height: '100%',
          bgcolor: theme.palette.background.paper,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderLeft: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width={140} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>

        <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: '12px' }} />

        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
        </Box>
      </Box>
    </Box>
  );
};
