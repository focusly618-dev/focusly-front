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
        p: '12px 16px',
        borderRadius: '16px',
        mx: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(30, 41, 59, 0.3)'
            : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 4px 24px rgba(0, 0, 0, 0.25)'
            : '0 4px 16px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(30, 41, 59, 0.5)'
              : 'rgba(255, 255, 255, 0.9)',
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-2px)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 8px 30px rgba(99, 102, 241, 0.12), 0 0 8px ${theme.palette.primary.main}15`
              : `0 8px 24px rgba(99, 102, 241, 0.08)`,
          '& .profile-avatar': {
            transform: 'scale(1.05)',
            borderColor: theme.palette.primary.main,
          },
        },
      }}
    >
      <Avatar
        className="profile-avatar"
        src={user?.picture}
        alt={user?.name}
        sx={{
          width: 36,
          height: 36,
          border: '2px solid',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {user?.name?.charAt(0)}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight="800"
          color="text.primary"
          noWrap
          sx={{
            fontSize: '13.5px',
            letterSpacing: '-0.01em',
          }}
        >
          {user?.name || 'User Name'}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{
            display: 'block',
            fontSize: '11px',
            opacity: 0.8,
          }}
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
          width: 30,
          height: 30,
          color: colorMode.mode === 'dark' ? '#fbbf24' : '#3b82f6',
          bgcolor: alpha(
            colorMode.mode === 'dark' ? '#fbbf24' : '#3b82f6',
            0.08,
          ),
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            bgcolor: alpha(
              colorMode.mode === 'dark' ? '#fbbf24' : '#3b82f6',
              0.16,
            ),
            transform: 'rotate(180deg) scale(1.05)',
          },
        }}
      >
        {colorMode.mode === 'dark' ? (
          <LightModeIcon sx={{ fontSize: 16 }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 16 }} />
        )}
      </IconButton>
    </Box>
  );
};
