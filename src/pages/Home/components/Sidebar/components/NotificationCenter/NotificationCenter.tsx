import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Popover,
  Fade,
  alpha,
  useTheme,
} from '@mui/material';
import {
  NotificationsNone as NotificationsNoneIcon,
  InboxOutlined as InboxIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppSelector } from '@/redux/hooks';

export const NotificationCenter = () => {
  const theme = useTheme();
  const { tasks } = useAppSelector((state) => state.task);

  const [notifAnchor, setNotifAnchor] = useState<HTMLButtonElement | null>(
    null,
  );
  const [notifications] = useState<
    { id: string; title: string; time: string; read: boolean }[]
  >([]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifOpen = Boolean(notifAnchor);

  // Find next upcoming task
  const now = new Date();
  const nextTask = tasks
    .filter((task) => {
      const startDate = task.estimated_start_date
        ? new Date(task.estimated_start_date)
        : null;
      const deadline = task.deadline ? new Date(task.deadline) : null;
      return (
        (startDate && startDate > now && task.status !== 'Done') ||
        (deadline && deadline > now && task.status !== 'Done')
      );
    })
    .sort((a, b) => {
      const aDate = a.estimated_start_date
        ? new Date(a.estimated_start_date)
        : new Date(a.deadline || 0);
      const bDate = b.estimated_start_date
        ? new Date(b.estimated_start_date)
        : new Date(b.deadline || 0);
      return aDate.getTime() - bDate.getTime();
    })[0];

  const hasUpcomingTask = !!nextTask;
  const formatTime = (date: Date) => format(date, 'h:mm a').toLowerCase();

  const handleNotifOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  return (
    <>
      <IconButton
        size="small"
        onClick={handleNotifOpen}
        sx={{ color: 'text.secondary', position: 'relative' }}
      >
        <Badge
          badgeContent={unreadCount}
          color="primary"
          sx={{
            '& .MuiBadge-badge': { fontSize: 9, height: 16, minWidth: 16 },
          }}
        >
          <NotificationsNoneIcon sx={{ fontSize: 20 }} />
        </Badge>
        {/* Red dot indicator for upcoming task */}
        {hasUpcomingTask && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'error.main',
              border: '2px solid',
              borderColor: 'background.paper',
            }}
          />
        )}
      </IconButton>

      <Popover
        open={notifOpen}
        anchorEl={notifAnchor}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
        transitionDuration={250}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 450,
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          },
        }}
      >
        {/* Tabs Header */}
        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid',
            borderColor: 'divider',
            px: 2,
            pt: 1.5,
          }}
        >
          {['All', 'Mentions', 'System'].map((tab) => (
            <Box
              key={tab}
              sx={{
                px: 2,
                py: 1,
                cursor: 'pointer',
                borderBottom: '2px solid',
                borderColor: tab === 'All' ? 'primary.main' : 'transparent',
                color: tab === 'All' ? 'primary.main' : 'text.secondary',
                fontWeight: tab === 'All' ? 600 : 500,
                fontSize: '14px',
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>

        {/* Content */}
        <Box sx={{ overflowY: 'auto', maxHeight: 360 }}>
          {nextTask && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2.5,
                py: 2,
                gap: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <NotificationsNoneIcon
                  sx={{ color: 'primary.main', fontSize: 22 }}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '15px',
                    color: 'text.primary',
                    lineHeight: 1.4,
                  }}
                >
                  {nextTask.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Upcoming Task
                </Typography>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  flexShrink: 0,
                }}
              >
                {(() => {
                  const taskDate = nextTask.estimated_start_date
                    ? new Date(nextTask.estimated_start_date)
                    : new Date(nextTask.deadline || 0);
                  return formatTime(taskDate);
                })()}
              </Typography>
            </Box>
          )}

          {notifications.length === 0 && !nextTask ? (
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
            </Box>
          ) : (
            notifications.map((n) => (
              <Box
                key={n.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2.5,
                  py: 2,
                  gap: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.grey[500], 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: 'grey.500',
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '15px',
                      color: 'text.primary',
                      lineHeight: 1.4,
                    }}
                  >
                    {n.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '13px',
                    }}
                  >
                    {n.title}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                >
                  {n.time}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Popover>
    </>
  );
};
