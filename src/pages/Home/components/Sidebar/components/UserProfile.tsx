import { Box, Typography, Avatar, IconButton, alpha } from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/ui';
import { TaskBar } from '../types/Sidebar.types';
import type { UseSidebarReturn } from '../hooks/useSidebar';

interface UserProfileProps {
  sidebar: UseSidebarReturn;
}

export const UserProfile = ({ sidebar }: UserProfileProps) => {
  const { user, theme, colorMode, changeStatusTab, isCollapsed } = sidebar;
  const { t } = useTranslation();

  return (
    <Box
      id="joyride-user-profile"
      sx={{
        p: { xs: '6px', lg: isCollapsed ? '6px' : '6px 8px' },
        borderRadius: '10px',
        mx: { xs: 0.75, lg: 1 },
        mb: 1.25,
        display: 'flex',
        flexDirection: isCollapsed ? 'column' : { xs: 'column', lg: 'row' },
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: 1,
        border: 'none',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <Box
        onClick={() => changeStatusTab(TaskBar.Settings)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flex: 1,
          minWidth: 0,
          cursor: 'pointer',
          borderRadius: '8px',
          '&:hover .profile-avatar': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Avatar
          className="profile-avatar"
          src={user?.picture}
          alt={user?.name}
          sx={{
            width: 28,
            height: 28,
            border: '1.5px solid',
            borderColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.08)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
          }}
        >
          <Typography
            variant="body2"
            fontWeight="700"
            color="text.primary"
            noWrap
            sx={{
              fontSize: '12px',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
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
              fontSize: '10px',
              opacity: 0.75,
              lineHeight: 1.2,
            }}
          >
            {t('nav.viewProfile', 'Ver perfil')}
          </Typography>
        </Box>
      </Box>

      {!isCollapsed && (
        <Box
          onClick={(e) => {
            e.stopPropagation();
          }}
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            gap: 0.25,
            flexShrink: 0,
          }}
        >
          <LanguageSelector variant="icon" />
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              colorMode.toggleColorMode();
            }}
            sx={{
              width: 24,
              height: 24,
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
              <LightModeIcon sx={{ fontSize: 14 }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 14 }} />
            )}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
