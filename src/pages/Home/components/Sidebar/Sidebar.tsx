import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  Badge,
  Popover,
  Divider,
  Fade,
  alpha,
  useTheme,
  Avatar,
} from '@mui/material';
import { useMemo, useState } from 'react';
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isSameWeek,
  startOfMonth,
} from 'date-fns';
import {
  Dashboard as DashboardIcon,
  CheckCircle as TasksIcon,
  BarChart as InsightsIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  NotificationsNone as NotificationsNoneIcon,
  CheckCircleOutline as CheckNotifIcon,
  DeleteOutline as DeleteNotifIcon,
  DoneAll as DoneAllIcon,
  InboxOutlined as InboxIcon,
} from '@mui/icons-material';
import {
  SidebarContainer,
  Logo,
  AddTaskButton,
  NavItem,
} from './Sidebar.styles';
import { TaskBar, type SidebarProps } from './types/Sidebar.types';
import { useAppSelector } from '@/redux/hooks';
import { useSearchParams } from 'react-router-dom';
import { FocuslyLogo } from '@/components/ui';
import { CuteRobotIcon } from '@/components/ui';
import { useContext } from 'react';
import { ColorModeContext } from '@/context/ColorModeContext';

const Sidebar = ({ activeTab, changeStatusTab }: SidebarProps) => {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const { tasks } = useAppSelector((state) => state.task);
  const { user } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();

  // Notifications state
  const [notifAnchor, setNotifAnchor] = useState<HTMLButtonElement | null>(
    null,
  );
  const [notifications, setNotifications] = useState<
    { id: string; title: string; time: string; read: boolean }[]
  >([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifOpen = Boolean(notifAnchor);

  const handleNotifOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const markAsRead = (id: string) =>
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const markAllRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id: string) =>
    setNotifications((p) => p.filter((n) => n.id !== id));

  const taskId = searchParams.get('taskId');
  const activeURLTask = useMemo(
    () => tasks.find((t) => t.id === taskId),
    [tasks, taskId],
  );
  const currentView = searchParams.get('v') || 'day';
  const currentDateStr = searchParams.get('d');

  const currentDate = useMemo(() => {
    if (currentDateStr) {
      const [year, month, day] = currentDateStr.split('-').map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month - 1, day);
      }
    }
    return new Date();
  }, [currentDateStr]);

  const showMiniCalendar = true;

  const miniCalendarDays = useMemo(() => {
    const startOfCurrentMonth = startOfMonth(currentDate);
    const startOfGrid = startOfWeek(startOfCurrentMonth, { weekStartsOn: 1 }); // 1 = Monday
    return Array.from({ length: 42 }, (_, i) => addDays(startOfGrid, i));
  }, [currentDate]);

  return (
    <SidebarContainer>
      <Box paddingLeft={3} paddingRight={3}>
        <Logo
          id="joyride-logo"
          as="div"
          sx={{ justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FocuslyLogo size={30} />
            Focusly
          </Box>
          <IconButton
            size="small"
            onClick={handleNotifOpen}
            sx={{ color: 'text.secondary' }}
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
      </Box>
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

      <AddTaskButton
        id="joyride-add-task"
        onClick={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.set('action', 'create');
          setSearchParams(newParams);
        }}
        startIcon={
          <AddIcon
            sx={{
              color: 'white',
              background: '#3b82f6',
              borderRadius: '10px',
            }}
          />
        }
      >
        {activeURLTask ? activeURLTask.title : 'Add New Task'}
      </AddTaskButton>

      {showMiniCalendar && (
        <Box
          sx={{
            px: 2.5,
            pb: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 0.5,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: '0.68rem',
              }}
            >
              {format(currentDate, 'MMMM yyyy')}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 0.3,
              textAlign: 'center',
            }}
          >
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, idx) => (
              <Typography
                key={idx}
                variant="caption"
                sx={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: 'text.disabled',
                  py: 0.5,
                }}
              >
                {letter}
              </Typography>
            ))}
            {miniCalendarDays.map((dayDate, idx) => {
              const isSelected = isSameDay(dayDate, currentDate);
              const isToday = isSameDay(dayDate, new Date());
              const isCurrentMonth =
                dayDate.getMonth() === currentDate.getMonth();
              const isInSelectedWeek =
                currentView === 'week' &&
                isSameWeek(dayDate, currentDate, { weekStartsOn: 1 });

              return (
                <Box
                  key={idx}
                  onClick={() => {
                    const newParams = new URLSearchParams(
                      searchParams.toString(),
                    );
                    newParams.set('d', format(dayDate, 'yyyy-MM-dd'));
                    setSearchParams(newParams);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    aspectRatio: '1',
                    borderRadius: isSelected ? '50%' : '4px',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: isSelected || isToday ? 700 : 500,
                    transition: 'all 0.15s ease-in-out',
                    bgcolor: isSelected
                      ? '#ef4444'
                      : isInSelectedWeek
                        ? theme.palette.mode === 'dark'
                          ? 'rgba(99, 102, 241, 0.12)'
                          : 'rgba(59, 130, 246, 0.08)'
                        : 'transparent',
                    color: isSelected
                      ? '#ffffff'
                      : !isCurrentMonth
                        ? 'text.disabled'
                        : isToday
                          ? '#3b82f6'
                          : 'text.primary',
                    border:
                      isToday && !isSelected
                        ? '1px solid rgba(59, 130, 246, 0.4)'
                        : 'none',
                    '&:hover': {
                      bgcolor: isSelected
                        ? '#ef4444'
                        : theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {format(dayDate, 'd')}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <List sx={{ padding: '16px' }}>
        <ListItem disablePadding>
          <NavItem
            id="joyride-daily-plan"
            active={activeTab === TaskBar.DailyPlan}
            onClick={() => changeStatusTab(TaskBar.DailyPlan)}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Daily Plan"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </NavItem>
        </ListItem>
        <ListItem disablePadding>
          <NavItem
            id="joyride-tasks"
            active={activeTab === TaskBar.Tasks}
            onClick={() => changeStatusTab(TaskBar.Tasks)}
          >
            <ListItemIcon>
              <TasksIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tasks"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </NavItem>
        </ListItem>
        <ListItem disablePadding>
          <NavItem
            id="joyride-workspace"
            active={activeTab === TaskBar.Workspace}
            onClick={() => changeStatusTab(TaskBar.Workspace)}
          >
            <ListItemIcon>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    activeTab === TaskBar.Workspace
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'transparent',
                  borderRadius: 1,
                }}
              >
                {/* Custom Document Icon or similar */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </Box>
            </ListItemIcon>
            <ListItemText
              primary="Workspace"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </NavItem>
        </ListItem>
        <ListItem disablePadding>
          <NavItem
            id="joyride-ask-ai"
            active={activeTab === TaskBar.AskAI}
            onClick={() => changeStatusTab(TaskBar.AskAI)}
            sx={{
              '&': {
                position: 'relative',
                overflow: 'hidden',
              },
              ...(activeTab === TaskBar.AskAI && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(19,127,236,0.12) 0%, rgba(124,58,237,0.08) 100%)',
                  borderRadius: 'inherit',
                },
              }),
            }}
          >
            <ListItemIcon>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <CuteRobotIcon
                  size={22}
                  variant="mini"
                  primaryColor={
                    activeTab === TaskBar.AskAI
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary
                  }
                  eyeColor={
                    activeTab === TaskBar.AskAI
                      ? '#22d3ee'
                      : theme.palette.text.secondary
                  }
                />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary="Ask AI"
              primaryTypographyProps={{
                fontWeight: activeTab === TaskBar.AskAI ? 700 : 500,
                sx: {
                  background:
                    activeTab === TaskBar.AskAI
                      ? `linear-gradient(90deg, ${theme.palette.primary.main}, #7c3aed)`
                      : 'none',
                  WebkitBackgroundClip:
                    activeTab === TaskBar.AskAI ? 'text' : 'unset',
                  WebkitTextFillColor:
                    activeTab === TaskBar.AskAI ? 'transparent' : 'inherit',
                },
              }}
            />
          </NavItem>
        </ListItem>
        <ListItem disablePadding>
          <NavItem
            id="joyride-insights"
            active={activeTab === TaskBar.Insights}
            onClick={() => changeStatusTab(TaskBar.Insights)}
          >
            <ListItemIcon>
              <InsightsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Insights"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </NavItem>
        </ListItem>
      </List>

      <Box flexGrow={1} />
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
    </SidebarContainer>
  );
};

export default Sidebar;
