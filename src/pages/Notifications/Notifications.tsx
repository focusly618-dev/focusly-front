import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Typography,
  IconButton,
  Button,
  alpha,
  useTheme,
  Fade,
  Slide,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  NotificationsNone as NotificationsNoneIcon,
  CheckCircleOutline as CheckIcon,
  DeleteOutline as DeleteIcon,
  DoneAll as DoneAllIcon,
  InboxOutlined as InboxIcon,
} from '@mui/icons-material';
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  DELETE_NOTIFICATION,
  DELETE_ALL_NOTIFICATIONS,
} from './Notifications.graphql';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

const formatNotifTime = (createdAtStr: string) => {
  try {
    const date = new Date(createdAtStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateStr = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
    });

    if (isToday) {
      return `Hoy a las ${timeStr}`;
    } else if (isYesterday) {
      return `Ayer a las ${timeStr}`;
    } else {
      return `${dateStr} a las ${timeStr}`;
    }
  } catch {
    return createdAtStr;
  }
};

export const Notifications = () => {
  const theme = useTheme();

  // Load notifications from database
  const { data, loading, error } = useQuery(GET_NOTIFICATIONS);

  // Mutations
  const [markRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [GET_NOTIFICATIONS],
  });
  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ, {
    refetchQueries: [GET_NOTIFICATIONS],
  });
  const [deleteNotif] = useMutation(DELETE_NOTIFICATION, {
    refetchQueries: [GET_NOTIFICATIONS],
  });
  const [deleteAllNotifs] = useMutation(DELETE_ALL_NOTIFICATIONS, {
    refetchQueries: [GET_NOTIFICATIONS],
  });

  const markAsRead = (id: string) => {
    markRead({ variables: { id } });
  };

  const markAllAsRead = () => {
    markAllRead();
  };

  const deleteNotification = (id: string) => {
    deleteNotif({ variables: { id } });
  };

  const deleteAll = () => {
    deleteAllNotifs();
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Ocurrió un error al cargar las notificaciones
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Box>
    );
  }
  const notificationsData = data?.getNotifications || [];
  const notifications: Notification[] = notificationsData.map(
    (n: Record<string, string>) => ({
      id: n.id,
      title: n.title,
      message: n.body,
      time: formatNotifTime(n.createdAt),
      read: n.status === 'read',
      type: n.type as 'info' | 'success' | 'warning',
    }),
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Fade in timeout={400}>
      <Box
        sx={{
          flex: 1,
          height: '100vh',
          overflow: 'auto',
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <NotificationsNoneIcon
                sx={{ color: theme.palette.primary.main, fontSize: 26 }}
              />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Notificaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mantente al día con tus últimas actividades
              </Typography>
            </Box>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} NUEVAS`}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 24,
                }}
              />
            )}
          </Box>

          {notifications.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="text"
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                }}
              >
                Marcar todo como leído
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={deleteAll}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#ef4444',
                }}
              >
                Borrar todo
              </Button>
            </Box>
          )}
        </Box>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <Fade in timeout={600}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.03)})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InboxIcon
                  sx={{
                    fontSize: 48,
                    color: alpha(theme.palette.text.primary, 0.2),
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight={700} color="text.secondary">
                No hay notificaciones aún
              </Typography>
              <Typography
                variant="body2"
                color="text.disabled"
                textAlign="center"
                maxWidth={320}
              >
                Cuando recibas notificaciones sobre tus tareas, sesiones de
                enfoque o recomendaciones de IA, aparecerán aquí.
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {notifications.map((notification, index) => (
              <Slide
                key={notification.id}
                direction="up"
                in
                timeout={300 + index * 80}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    bgcolor: notification.read
                      ? alpha(theme.palette.background.paper, 0.5)
                      : alpha(theme.palette.primary.main, 0.04),
                    border: '1px solid',
                    borderColor: notification.read
                      ? theme.palette.divider
                      : alpha(theme.palette.primary.main, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {/* Read / Unread Status Icons */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      bgcolor: notification.read
                        ? (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.03)'
                        : notification.type === 'warning'
                          ? 'rgba(239, 68, 68, 0.1)'
                          : notification.type === 'success'
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(99, 102, 241, 0.1)',
                      color: notification.read
                        ? 'text.disabled'
                        : notification.type === 'warning'
                          ? '#EF4444'
                          : notification.type === 'success'
                            ? '#22C55E'
                            : '#6366F1',
                      flexShrink: 0,
                    }}
                  >
                    {notification.read ? (
                      <DoneAllIcon sx={{ fontSize: 20 }} />
                    ) : notification.type === 'warning' ? (
                      <NotificationsNoneIcon sx={{ fontSize: 20 }} />
                    ) : notification.type === 'success' ? (
                      <CheckIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <NotificationsNoneIcon sx={{ fontSize: 20 }} />
                    )}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={notification.read ? 500 : 700}
                    >
                      {notification.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.3, lineHeight: 1.5 }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ mt: 0.5, display: 'block' }}
                    >
                      {notification.time}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={() => markAsRead(notification.id)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => deleteNotification(notification.id)}
                      sx={{
                        color: alpha(theme.palette.text.primary, 0.4),
                        '&:hover': {
                          bgcolor: alpha('#ef4444', 0.1),
                          color: '#ef4444',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Slide>
            ))}
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default Notifications;
