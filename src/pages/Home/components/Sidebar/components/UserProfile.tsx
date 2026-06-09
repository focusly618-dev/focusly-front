import { Box, Typography, Avatar, IconButton, alpha } from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { TaskBar } from '../types/Sidebar.types';
import type { UseSidebarReturn } from '../hooks/useSidebar';

interface UserProfileProps {
  sidebar: UseSidebarReturn;
}

export const UserProfile = ({ sidebar }: UserProfileProps) => {
  const { user, theme, colorMode, changeStatusTab } = sidebar;

  return (
    <Box
      id="joyride-user-profile"
      onClick={() => changeStatusTab(TaskBar.Settings)}
      sx={{
        p: 1.5,
        borderRadius: 3,
        mx: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s',
        flexShrink: 0,
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Avatar
        src={user?.picture}
        alt={user?.name}
        sx={{
          width: 32,
          height: 32,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {user?.name?.charAt(0)}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight="700"
          color="text.primary"
          noWrap
        >
          {user?.name || 'User Name'}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ display: 'block' }}
        >
          View Profile
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          colorMode.toggleColorMode();
        }}
        sx={{
          color: colorMode.mode === 'dark' ? '#fbbf24' : '#3b82f6',
          bgcolor: alpha(
            colorMode.mode === 'dark' ? '#fbbf24' : '#3b82f6',
            0.1,
          ),
          '&:hover': {
            bgcolor: alpha(
              colorMode.mode === 'dark' ? '#fbbf24' : '#3b82f6',
              0.2,
            ),
          },
        }}
      >
        {colorMode.mode === 'dark' ? (
          <LightModeIcon sx={{ fontSize: 18 }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 18 }} />
        )}
      </IconButton>
    </Box>
  );
};
