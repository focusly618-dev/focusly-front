import {
  Box,
  Typography,
  Button,
  IconButton,
  Badge,
  Popover,
  Divider,
  Fade,
  alpha,
} from '@mui/material';
import {
  NotificationsNone as NotificationsNoneIcon,
  CheckCircleOutline as CheckNotifIcon,
  DeleteOutline as DeleteNotifIcon,
  DoneAll as DoneAllIcon,
  InboxOutlined as InboxIcon,
} from '@mui/icons-material';
import { Logo } from '../Sidebar.styles';
import { FocuslyLogo } from '@/components/ui';
import type { UseSidebarReturn } from '../hooks/useSidebar';

interface SidebarHeaderProps {
  sidebar: UseSidebarReturn;
}

export const SidebarHeader = ({ sidebar }: SidebarHeaderProps) => {
  const {
    theme,
    unreadCount,
    notifOpen,
    notifAnchor,
    notifications,
    handleNotifOpen,
    handleNotifClose,
    markAsRead,
    markAllRead,
    deleteNotif,
  } = sidebar;

  return (
    <Box sx={{ px: { xs: 0, lg: 3 } }}>
      <Logo
        id="joyride-logo"
        as="div"
        sx={{
          justifyContent: { xs: 'center', lg: 'space-between' },
          px: { xs: 2, lg: 0 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FocuslyLogo size={30} />
          <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>
            Focusly
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={handleNotifOpen}
          sx={{
            color: 'text.secondary',
            display: { xs: 'none', lg: 'inline-flex' },
          }}
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
        </IconButton>
      </Logo>

      {/* Notification Popover */}
      <Popover
        open={notifOpen}
        anchorEl={notifAnchor}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
        transitionDuration={250}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              maxHeight: 420,
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
        <Box sx={{ overflowY: 'auto', maxHeight: 280 }}>
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
                Notifications about tasks and focus sessions will appear here.
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
                      <CheckNotifIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => deleteNotif(n.id)}
                    sx={{
                      color: alpha(theme.palette.text.primary, 0.3),
                      '&:hover': {
                        bgcolor: alpha('#ef4444', 0.1),
                        color: '#ef4444',
                      },
                    }}
                  >
                    <DeleteNotifIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'center' }}>
              <Button
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={markAllRead}
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
    </Box>
  );
};
