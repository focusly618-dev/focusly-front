import { useState } from 'react';
import type { ToolbarProps, View } from 'react-big-calendar';
import type { ICalendarEvent } from '../CalendarEvent';
import { Navigate } from 'react-big-calendar';
import type { CalendarNavigateAction } from '../CalendarView/calendarView.types';
import {
  Box,
  Button,
  IconButton,
  Popover,
  Typography,
  Divider,
  Fade,
  alpha,
  useTheme,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircleOutline as CheckIcon,
  DeleteOutline as DeleteIcon,
  DoneAll as DoneAllIcon,
  InboxOutlined as InboxIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { ToolbarContainer } from './CalendarToolbar.styles';

interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [];

interface CustomToolbarProps extends ToolbarProps<ICalendarEvent, object> {
  isSessionActive?: boolean;
  onNavigateAction?: (action: CalendarNavigateAction) => void;
  onMobileMenuClick?: () => void;
}

export const CalendarToolbar = (props: CustomToolbarProps) => {
  const { date, onNavigate, onNavigateAction, onMobileMenuClick } = props;
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const goToBack = () =>
    onNavigateAction ? onNavigateAction('PREV') : onNavigate(Navigate.PREVIOUS);
  const goToNext = () =>
    onNavigateAction ? onNavigateAction('NEXT') : onNavigate(Navigate.NEXT);

  return (
    <>
      <ToolbarContainer
        sx={{
          px: 4,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? 'transparent' : '#ffffff',
        }}
      >
        {/* Left side: Month Year Title & Subtitle */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '24px', md: '28px' },
            }}
          >
            {format(date, 'MMMM yyyy')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.5,
              fontSize: '13px',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Organized clarity for your deep work sessions.
          </Typography>
        </Box>

        {/* Center: View Toggle Pill Selector */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.04)',
            borderRadius: '30px',
            p: 0.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {['day', 'week', 'month'].map((v) => {
            const isSelected = props.view === v;
            return (
              <Button
                key={v}
                onClick={() => props.onView(v as View)}
                sx={{
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3,
                  py: 0.75,
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  bgcolor: isSelected
                    ? (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : '#ffffff'
                    : 'transparent',
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  minWidth: '70px',
                  '&:hover': {
                    bgcolor: isSelected
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12)'
                            : '#ffffff'
                      : 'action.hover',
                  },
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            );
          })}
        </Box>

        {/* Right side: Navigation Arrows */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {onMobileMenuClick && (
            <IconButton
              onClick={onMobileMenuClick}
              sx={{
                display: { xs: 'flex', md: 'none' },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                p: 1,
                color: 'text.secondary',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <IconButton
            onClick={goToBack}
            sx={{
              width: 36,
              height: 36,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '50%',
              color: 'text.primary',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <ChevronLeft sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            onClick={goToNext}
            sx={{
              width: 36,
              height: 36,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '50%',
              color: 'text.primary',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <ChevronRight sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </ToolbarContainer>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
        transitionDuration={250}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 440,
              mt: 1,
              borderRadius: '16px',
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: '0.65rem',
                px: 1.2,
                py: 0.3,
                borderRadius: '6px',
              }}
            >
              {unreadCount} NEW
            </Box>
          )}
        </Box>

        <Divider />

        {/* Content */}
        <Box sx={{ overflowY: 'auto', maxHeight: 300 }}>
          {notifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 5,
                px: 3,
                gap: 1.5,
              }}
            >
              <InboxIcon
                sx={{
                  fontSize: 44,
                  color: alpha(theme.palette.text.primary, 0.15),
                }}
              />
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                No notifications yet
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                textAlign="center"
              >
                You&apos;re all caught up! Notifications about tasks and focus
                sessions will appear here.
              </Typography>
            </Box>
          ) : (
            notifications.map((n) => (
              <Box
                key={n.id}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  transition: 'background 0.2s',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                  borderLeft: n.read
                    ? 'none'
                    : `3px solid ${theme.palette.primary.main}`,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={n.read ? 400 : 600}
                    noWrap
                  >
                    {n.title}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {n.time}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.3, flexShrink: 0 }}>
                  {!n.read && (
                    <IconButton
                      size="small"
                      onClick={() => markAsRead(n.id)}
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => deleteNotification(n.id)}
                    sx={{
                      color: alpha(theme.palette.text.primary, 0.3),
                      '&:hover': {
                        bgcolor: alpha('#ef4444', 0.1),
                        color: '#ef4444',
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box
              sx={{ p: 1.5, display: 'flex', justifyContent: 'center', gap: 2 }}
            >
              <Button
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                Mark all read
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};
