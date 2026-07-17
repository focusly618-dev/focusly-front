import React, { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import {
  FolderOutlined as FolderIcon,
  CheckBoxOutlined as CheckBoxIcon,
  CalendarMonthOutlined as CalendarIcon,
  NotesOutlined as NotesIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircleRounded as CheckCircleIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  PeopleOutlined as PeopleIcon,
  LockOutlined as LockIcon,
  AssessmentOutlined as AssessmentIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Flag as FlagIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/layout/Navbar';

import {
  PageWrapper,
  MainContent,
  FeaturesHero,
  HeroBadge,
  HeroBadgeText,
  FeatureSectionWrapper,
  SectionHeader,
  FeatureBlockCard,
  MacbookFrame,
  MacbookScreen,
  MacbookKeyboard,
  AnalyticsDarkSection,
  DarkReviewCard,
  AnalyticsProgressBar,
  AnalyticsProgressBarFill,
  CtaBanner,
  CtaPrimaryButton,
  CtaSecondaryButton,
  FooterContainer,
  FooterLink,
} from './FeaturesPage.styles';

const AnimatedWorkspaceMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const workspaces = [
    {
      id: 0,
      name: 'Marketing Strategy',
      color: '#8b5cf6',
      badge: 'MARKETING',
      projects: ['Q3 Campaign Plan', 'Social Assets', 'Influencer Outreach'],
    },
    {
      id: 1,
      name: 'Product Design',
      color: '#10b981',
      badge: 'DESIGN',
      projects: ['UX Wireframes v2', 'Design System Specs', 'Mobile Mockups'],
    },
    {
      id: 2,
      name: 'Engineering Labs',
      color: '#f59e0b',
      badge: 'ENGINEERING',
      projects: ['GraphQL Gateway v2', 'Vite Optimization', 'Performance Logs'],
    },
  ];

  const current = workspaces[activeTab];
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        mt: 'auto',
        pt: 2,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '520px',
          height: '240px',
          borderRadius: '16px',
          border: isDark
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.08)',
          bgcolor: isDark ? '#0B0F14' : '#F9FAFB',
          boxShadow: isDark
            ? '0 12px 40px rgba(0,0,0,0.5)'
            : '0 12px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/* Mockup Sidebar */}
        <Box
          sx={{
            width: '150px',
            borderRight: isDark
              ? '1px solid rgba(255,255,255,0.06)'
              : '1px solid rgba(0,0,0,0.06)',
            bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {/* Windows Dots */}
          <Stack direction="row" spacing={0.8} sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#FF5F56',
                opacity: 0.8,
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#FFBD2E',
                opacity: 0.8,
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#27C93F',
                opacity: 0.8,
              }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{
              fontSize: '9px',
              fontWeight: 700,
              color: 'text.secondary',
              letterSpacing: 0.5,
              mb: 0.5,
            }}
          >
            WORKSPACES
          </Typography>

          <Stack spacing={0.5}>
            {workspaces.map((ws) => (
              <Stack
                key={ws.id}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  px: 1,
                  py: 0.8,
                  borderRadius: '6px',
                  bgcolor:
                    activeTab === ws.id
                      ? isDark
                        ? 'rgba(255,255,255,0.04)'
                        : 'rgba(0,0,0,0.04)'
                      : 'transparent',
                  border:
                    activeTab === ws.id
                      ? isDark
                        ? '1px solid rgba(255,255,255,0.05)'
                        : '1px solid rgba(0,0,0,0.05)'
                      : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <FolderIcon
                  sx={{
                    fontSize: 13,
                    color: activeTab === ws.id ? ws.color : 'text.disabled',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: activeTab === ws.id ? 700 : 500,
                    color:
                      activeTab === ws.id
                        ? isDark
                          ? '#FAFAFA'
                          : '#111827'
                        : 'text.secondary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {ws.name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Mockup Content Panel */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                height: '100%',
                width: '100%',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: '4px',
                    bgcolor: `${current.color}15`,
                    border: `1px solid ${current.color}30`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '8px',
                      fontWeight: 800,
                      color: current.color,
                      letterSpacing: 0.5,
                    }}
                  >
                    {current.badge}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                  /
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                >
                  Projects
                </Typography>
              </Stack>

              <Typography
                variant="h6"
                sx={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: isDark ? '#FAFAFA' : '#111827',
                  mt: -0.5,
                }}
              >
                {current.name}
              </Typography>

              <Stack spacing={1} sx={{ mt: 0.5 }}>
                {current.projects.map((proj, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      p: 1,
                      borderRadius: '6px',
                      border: isDark
                        ? '1px solid rgba(255,255,255,0.04)'
                        : '1px solid rgba(0,0,0,0.06)',
                      bgcolor: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isDark
                          ? 'rgba(255,255,255,0.2)'
                          : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      #
                    </span>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      {proj}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

const AnimatedAtomicTasksMockup: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [taskStep, setTaskStep] = useState(0);
  const [clickRipple, setClickRipple] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [isTask1Checked, setIsTask1Checked] = useState(false);
  const [task2Priority, setTask2Priority] = useState('LOW');
  const [task3Status, setTask3Status] = useState('TODO');

  const cursorCoords = [
    { x: 380, y: 190 },
    { x: 26, y: 55 },
    { x: 410, y: 110 },
    { x: 410, y: 165 },
    { x: 380, y: 190 },
  ];

  const currentCursor = cursorCoords[taskStep];

  useEffect(() => {
    const timer = setInterval(() => {
      setTaskStep((prev) => {
        const next = (prev + 1) % 5;
        if (next === 0) {
          setIsTask1Checked(false);
          setTask2Priority('LOW');
          setTask3Status('TODO');
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let triggerTimer: ReturnType<typeof setTimeout> | undefined;
    let rippleTimer: ReturnType<typeof setTimeout> | undefined;

    if (taskStep === 1) {
      triggerTimer = setTimeout(() => {
        setClickRipple({ x: 26, y: 55 });
        setIsTask1Checked(true);
        rippleTimer = setTimeout(() => setClickRipple(null), 600);
      }, 1500);
    } else if (taskStep === 2) {
      triggerTimer = setTimeout(() => {
        setClickRipple({ x: 410, y: 110 });
        setTask2Priority('HIGH');
        rippleTimer = setTimeout(() => setClickRipple(null), 600);
      }, 1500);
    } else if (taskStep === 3) {
      triggerTimer = setTimeout(() => {
        setClickRipple({ x: 410, y: 165 });
        setTask3Status('IN PROGRESS');
        rippleTimer = setTimeout(() => setClickRipple(null), 600);
      }, 1500);
    }

    return () => {
      if (triggerTimer) clearTimeout(triggerTimer);
      if (rippleTimer) clearTimeout(rippleTimer);
    };
  }, [taskStep]);

  return (
    <Box
      sx={{
        mt: 'auto',
        pt: 2,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '520px',
          height: '240px',
          borderRadius: '16px',
          border: isDark
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.08)',
          bgcolor: isDark ? '#0B0F14' : '#F9FAFB',
          boxShadow: isDark
            ? '0 12px 40px rgba(0,0,0,0.5)'
            : '0 12px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: 0.5,
              }}
            >
              ATOMIC CHECKLIST
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '9px',
                fontWeight: 700,
                color: 'primary.main',
                px: 1,
                py: 0.2,
                borderRadius: '4px',
                bgcolor: 'rgba(124, 58, 237, 0.1)',
              }}
            >
              {taskStep === 0 && 'Idle...'}
              {taskStep === 1 && 'Completing Task...'}
              {taskStep === 2 && 'Changing Priority...'}
              {taskStep === 3 && 'Updating Status...'}
              {taskStep === 4 && 'Resetting...'}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            {/* Task 1 */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 1.2,
                borderRadius: '8px',
                border: isDark
                  ? '1px solid rgba(255,255,255,0.04)'
                  : '1px solid rgba(0,0,0,0.06)',
                bgcolor: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF',
                transition: 'all 0.3s ease',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {isTask1Checked ? (
                  <CheckCircleIcon
                    sx={{ fontSize: 16, color: 'success.main' }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{ fontSize: 16, color: 'text.disabled' }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textDecoration: isTask1Checked ? 'line-through' : 'none',
                    opacity: isTask1Checked ? 0.4 : 1,
                    transition: 'all 0.3s ease',
                    color: isDark ? '#FAFAFA' : '#111827',
                  }}
                >
                  Finish GraphQL API
                </Typography>
              </Stack>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: '4px',
                    bgcolor: isTask1Checked
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(59, 130, 246, 0.1)',
                    border: isTask1Checked
                      ? '1px solid rgba(16, 185, 129, 0.2)'
                      : '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '8px',
                      fontWeight: 800,
                      color: isTask1Checked ? '#10b981' : '#3b82f6',
                    }}
                  >
                    {isTask1Checked ? 'DONE' : 'TODO'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    border: '1px solid rgba(234, 179, 8, 0.2)',
                    bgcolor: 'rgba(234, 179, 8, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <FlagIcon sx={{ fontSize: 9, color: '#eab308', mr: 0.5 }} />
                  <Typography
                    sx={{ fontSize: '8px', fontWeight: 700, color: '#eab308' }}
                  >
                    MEDIUM
                  </Typography>
                </Box>
              </Box>
            </Stack>

            {/* Task 2 */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 1.2,
                borderRadius: '8px',
                border: isDark
                  ? '1px solid rgba(255,255,255,0.04)'
                  : '1px solid rgba(0,0,0,0.06)',
                bgcolor: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <RadioButtonUncheckedIcon
                  sx={{ fontSize: 16, color: 'text.disabled' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isDark ? '#FAFAFA' : '#111827',
                  }}
                >
                  Gym Workout
                </Typography>
              </Stack>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: '4px',
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <Typography
                    sx={{ fontSize: '8px', fontWeight: 800, color: '#3b82f6' }}
                  >
                    TODO
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    border:
                      task2Priority === 'HIGH'
                        ? '1px solid rgba(239, 68, 68, 0.2)'
                        : '1px solid rgba(59, 130, 246, 0.2)',
                    bgcolor:
                      task2Priority === 'HIGH'
                        ? 'rgba(239, 68, 68, 0.05)'
                        : 'rgba(59, 130, 246, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <FlagIcon
                    sx={{
                      fontSize: 9,
                      color: task2Priority === 'HIGH' ? '#ef4444' : '#3b82f6',
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '8px',
                      fontWeight: 700,
                      color: task2Priority === 'HIGH' ? '#ef4444' : '#3b82f6',
                    }}
                  >
                    {task2Priority}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            {/* Task 3 */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 1.2,
                borderRadius: '8px',
                border: isDark
                  ? '1px solid rgba(255,255,255,0.04)'
                  : '1px solid rgba(0,0,0,0.06)',
                bgcolor: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <RadioButtonUncheckedIcon
                  sx={{ fontSize: 16, color: 'text.disabled' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isDark ? '#FAFAFA' : '#111827',
                  }}
                >
                  Review UI/UX Mockups
                </Typography>
              </Stack>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: '4px',
                    bgcolor:
                      task3Status === 'IN PROGRESS'
                        ? 'rgba(139, 92, 246, 0.15)'
                        : 'rgba(59, 130, 246, 0.1)',
                    border:
                      task3Status === 'IN PROGRESS'
                        ? '1px solid rgba(139, 92, 246, 0.3)'
                        : '1px solid rgba(59, 130, 246, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '8px',
                      fontWeight: 800,
                      color:
                        task3Status === 'IN PROGRESS' ? '#a78bfa' : '#3b82f6',
                    }}
                  >
                    {task3Status}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    bgcolor: 'rgba(239, 68, 68, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <FlagIcon sx={{ fontSize: 9, color: '#ef4444', mr: 0.5 }} />
                  <Typography
                    sx={{ fontSize: '8px', fontWeight: 700, color: '#ef4444' }}
                  >
                    HIGH
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ opacity: 0.3, mt: 1 }}
        >
          <AddIcon
            sx={{ fontSize: 14, color: isDark ? '#FAFAFA' : '#111827' }}
          />
          <Typography
            sx={{
              fontSize: '10px',
              color: isDark ? '#FAFAFA' : '#111827',
              fontStyle: 'italic',
            }}
          >
            Add new task...
          </Typography>
        </Stack>

        {/* Animated Mouse Cursor */}
        <motion.div
          animate={{ x: currentCursor.x, y: currentCursor.y }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
              color: isDark ? '#FAFAFA' : '#111827',
            }}
          >
            <path
              d="M4 4L11.5 20L14.2 13.2L21 10.5L4 4Z"
              fill="currentColor"
              stroke={isDark ? '#000000' : '#FFFFFF'}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Click Ripple Effect */}
        {clickRipple && (
          <motion.div
            initial={{ scale: 0.1, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: clickRipple.x - 10,
              top: clickRipple.y - 10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: 'rgba(167, 139, 250, 0.4)',
              border: '1px solid rgba(167, 139, 250, 0.8)',
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const AnimatedInsightsMockup: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const chartPoints = [
    { day: 'Mon', value: 4, x: 30, y: 100 },
    { day: 'Tue', value: 6, x: 90, y: 70 },
    { day: 'Wed', value: 3, x: 150, y: 115 },
    { day: 'Thu', value: 7, x: 210, y: 55 },
    { day: 'Fri', value: 5, x: 270, y: 85 },
    { day: 'Sat', value: 8, x: 330, y: 40 },
    { day: 'Sun', value: 4, x: 390, y: 100 },
  ];

  const heatmapData = [
    [1, 0, 2, 3, 1, 0, 2, 1, 3, 0, 1, 2, 3, 1, 0, 2, 1, 3],
    [2, 1, 0, 2, 3, 1, 0, 3, 2, 1, 0, 1, 2, 3, 1, 0, 3, 2],
    [3, 2, 1, 0, 2, 2, 1, 0, 1, 3, 2, 0, 1, 2, 2, 1, 0, 1],
    [0, 3, 2, 1, 0, 3, 2, 1, 0, 2, 3, 1, 0, 3, 2, 1, 0, 2],
    [1, 2, 3, 0, 1, 1, 3, 2, 0, 1, 2, 3, 0, 1, 1, 3, 2, 0],
  ];

  const areaPath =
    `M ${chartPoints[0].x} 140 ` +
    chartPoints.map((p) => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${chartPoints[chartPoints.length - 1].x} 140 Z`;

  const linePath = chartPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: isDark ? '#0B0F14' : '#F9FAFB',
        borderRadius: '16px',
        border: isDark
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(0,0,0,0.08)',
        boxShadow: isDark
          ? '0 12px 40px rgba(0,0,0,0.5)'
          : '0 12px 40px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 800,
              color: isDark ? '#FAFAFA' : '#111827',
            }}
          >
            Productivity Insights
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: '8px', color: 'text.secondary' }}
          >
            Real-time analytics for your focus sessions
          </Typography>
        </Stack>
        <Box
          sx={{
            px: 1,
            py: 0.2,
            borderRadius: '4px',
            border: isDark
              ? '1px solid rgba(255,255,255,0.06)'
              : '1px solid rgba(0,0,0,0.06)',
            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <Typography
            sx={{ fontSize: '8px', fontWeight: 600, color: 'text.secondary' }}
          >
            Weekly View
          </Typography>
        </Box>
      </Stack>

      {/* Stats Cards Grid */}
      <Grid container spacing={1}>
        {[
          {
            title: 'Total Focus',
            val: '24.5h',
            change: '+12% this wk',
            color: '#10b981',
          },
          {
            title: 'Completed Tasks',
            val: '92%',
            change: '+8% vs last wk',
            color: '#3b82f6',
          },
          {
            title: 'Energy Score',
            val: '85%',
            change: 'Optimal focus',
            color: '#eab308',
          },
        ].map((stat, idx) => (
          <Grid size={{ xs: 4 }} key={idx}>
            <Box
              sx={{
                p: 1,
                borderRadius: '8px',
                border: isDark
                  ? '1px solid rgba(255,255,255,0.04)'
                  : '1px solid rgba(0,0,0,0.06)',
                bgcolor: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '8px',
                  fontWeight: 600,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {stat.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: isDark ? '#FAFAFA' : '#111827',
                }}
              >
                {stat.val}
              </Typography>
              <Typography
                sx={{
                  fontSize: '7px',
                  color: stat.color,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {stat.change}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Area Chart Mockup */}
      <Box
        sx={{
          position: 'relative',
          height: '110px',
          border: isDark
            ? '1px solid rgba(255,255,255,0.04)'
            : '1px solid rgba(0,0,0,0.04)',
          bgcolor: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
          borderRadius: '8px',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{ fontSize: '8px', fontWeight: 700, color: 'text.secondary' }}
        >
          Productivity Trends (Hours/Day)
        </Typography>

        <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '65px' }}>
          <svg
            viewBox="0 0 420 150"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              overflow: 'visible',
            }}
          >
            <line
              x1="0"
              y1="40"
              x2="420"
              y2="40"
              stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
              strokeDasharray="3"
            />
            <line
              x1="0"
              y1="85"
              x2="420"
              y2="85"
              stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
              strokeDasharray="3"
            />
            <line
              x1="0"
              y1="130"
              x2="420"
              y2="130"
              stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
              strokeDasharray="3"
            />

            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#chartGradient)" />

            <motion.path
              d={linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />

            {chartPoints.map((p, idx) => (
              <g
                key={idx}
                onMouseEnter={() => setHoveredDay(idx)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredDay === idx ? 6 : 4}
                  fill="#3b82f6"
                />
                {hoveredDay === idx && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={10}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                )}
              </g>
            ))}
          </svg>

          {/* SVG X-Axis Labels */}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ px: 1, mt: 0.5 }}
          >
            {chartPoints.map((p, idx) => (
              <Typography
                key={idx}
                sx={{
                  fontSize: '7px',
                  fontWeight: hoveredDay === idx ? 700 : 500,
                  color: hoveredDay === idx ? '#3b82f6' : 'text.secondary',
                  transition: 'all 0.2s',
                }}
              >
                {p.day}
              </Typography>
            ))}
          </Stack>

          {/* Tooltip Overlay */}
          <AnimatePresence>
            {hoveredDay !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                style={{
                  position: 'absolute',
                  left: `${(chartPoints[hoveredDay].x / 420) * 85}%`,
                  top: `${(chartPoints[hoveredDay].y / 150) * 45}%`,
                  backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                  border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '7px',
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                >
                  {chartPoints[hoveredDay].day}
                </Typography>
                <Typography
                  sx={{ fontSize: '8px', fontWeight: 800, color: '#3b82f6' }}
                >
                  {chartPoints[hoveredDay].value} hrs focus
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Activity Heatmap Grid Mockup */}
      <Stack
        spacing={0.8}
        sx={{
          p: 1,
          border: isDark
            ? '1px solid rgba(255,255,255,0.04)'
            : '1px solid rgba(0,0,0,0.04)',
          bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
          borderRadius: '8px',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{ fontSize: '8px', fontWeight: 700, color: 'text.secondary' }}
          >
            Focus Heatmap Grid
          </Typography>
          <Typography sx={{ fontSize: '7px', color: 'text.secondary' }}>
            54 focus blocks
          </Typography>
        </Stack>
        <Stack direction="column" spacing={0.3}>
          {heatmapData.map((row, rowIdx) => (
            <Stack key={rowIdx} direction="row" spacing={0.3}>
              {row.map((cell, cellIdx) => {
                let opacity = 0.05;
                if (cell === 1) opacity = 0.25;
                if (cell === 2) opacity = 0.6;
                if (cell === 3) opacity = 1.0;
                return (
                  <Box
                    key={cellIdx}
                    sx={{
                      width: 11,
                      height: 11,
                      borderRadius: '2px',
                      bgcolor:
                        cell === 0
                          ? isDark
                            ? 'rgba(255, 255, 255, 0.04)'
                            : 'rgba(0, 0, 0, 0.04)'
                          : '#10B981',
                      opacity: opacity,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.25)',
                        opacity: 1,
                        cursor: 'pointer',
                        boxShadow: cell > 0 ? '0 0 6px #10B981' : 'none',
                      },
                    }}
                  />
                );
              })}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

const AnimatedCalendarSyncMockup: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [syncStep, setSyncStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSyncStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: isDark ? '#0B0F14' : '#F9FAFB',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        position: 'relative',
      }}
    >
      {/* Calendar Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          borderBottom: isDark
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(0,0,0,0.06)',
          pb: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarIcon sx={{ fontSize: 14, color: 'primary.main' }} />
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 800,
              color: isDark ? '#FAFAFA' : '#111827',
            }}
          >
            Focusly Master Calendar
          </Typography>
        </Stack>

        {/* Sync Status Badge */}
        <AnimatePresence mode="wait">
          {syncStep === 1 ? (
            <motion.div
              key="syncing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#3b82f6',
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.5)', opacity: 0.4 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              />
              <Typography
                sx={{ fontSize: '8px', color: '#3b82f6', fontWeight: 700 }}
              >
                SYNCING...
              </Typography>
            </motion.div>
          ) : syncStep >= 2 ? (
            <motion.div
              key="synced"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Typography
                sx={{
                  fontSize: '8px',
                  color: '#10b981',
                  fontWeight: 700,
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  px: 1,
                  py: 0.2,
                  borderRadius: '4px',
                }}
              >
                GOOGLE CALENDAR SYNCED
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              key="unsynced"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Typography
                sx={{
                  fontSize: '8px',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                Local View Only
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>

      {/* Calendar Timeline slots */}
      <Stack
        spacing={1}
        sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}
      >
        {/* Timeline Slot 09:00 */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography
            sx={{
              fontSize: '8px',
              color: 'text.secondary',
              width: '25px',
              textAlign: 'right',
            }}
          >
            09:00
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              p: 0.8,
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              bgcolor: 'rgba(59, 130, 246, 0.05)',
            }}
          >
            <Typography
              sx={{ fontSize: '9px', fontWeight: 600, color: '#3b82f6' }}
            >
              Daily Standup (Google Calendar)
            </Typography>
          </Box>
        </Stack>

        {/* Timeline Slot 10:00 - 12:00 */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography
            sx={{
              fontSize: '8px',
              color: 'text.secondary',
              width: '25px',
              textAlign: 'right',
            }}
          >
            10:00
          </Typography>
          <Box sx={{ flexGrow: 1, height: '34px', position: 'relative' }}>
            <AnimatePresence mode="wait">
              {syncStep >= 2 ? (
                <motion.div
                  key="slot-synced"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '6px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(139, 92, 246, 0.15)',
                  }}
                >
                  <Typography
                    sx={{ fontSize: '9px', fontWeight: 800, color: '#a78bfa' }}
                  >
                    ⚡ Auto-Focus Slot (Protected)
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '7px',
                      color: isDark
                        ? 'rgba(255,255,255,0.4)'
                        : 'rgba(0,0,0,0.5)',
                    }}
                  >
                    Protected from calendar conflict invites
                  </Typography>
                </motion.div>
              ) : (
                <motion.div
                  key="slot-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '6px',
                    border: isDark
                      ? '1.5px dashed rgba(255,255,255,0.08)'
                      : '1.5px dashed rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '8px',
                      color: 'text.secondary',
                      fontStyle: 'italic',
                    }}
                  >
                    Available Focus Slot
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Stack>

        {/* Timeline Slot 12:00 */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mt: 1.5 }}
        >
          <Typography
            sx={{
              fontSize: '8px',
              color: 'text.secondary',
              width: '25px',
              textAlign: 'right',
            }}
          >
            12:00
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              p: 0.8,
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              bgcolor: 'rgba(16, 185, 129, 0.05)',
            }}
          >
            <Typography
              sx={{ fontSize: '9px', fontWeight: 600, color: '#10b981' }}
            >
              Lunch Break
            </Typography>
          </Box>
        </Stack>

        {/* Timeline Slot 13:00 - 15:00 */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography
            sx={{
              fontSize: '8px',
              color: 'text.secondary',
              width: '25px',
              textAlign: 'right',
            }}
          >
            13:00
          </Typography>
          <Box sx={{ flexGrow: 1, height: '34px', position: 'relative' }}>
            <AnimatePresence mode="wait">
              {syncStep >= 2 ? (
                <motion.div
                  key="slot-synced-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '6px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(245, 158, 11, 0.15)',
                  }}
                >
                  <Typography
                    sx={{ fontSize: '9px', fontWeight: 800, color: '#f59e0b' }}
                  >
                    🔒 Deep Work Block
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '7px',
                      color: isDark
                        ? 'rgba(255,255,255,0.4)'
                        : 'rgba(0,0,0,0.5)',
                    }}
                  >
                    Synced from Calendar integrations
                  </Typography>
                </motion.div>
              ) : (
                <motion.div
                  key="slot-empty-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '6px',
                    border: isDark
                      ? '1.5px dashed rgba(255,255,255,0.08)'
                      : '1.5px dashed rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '8px',
                      color: 'text.secondary',
                      fontStyle: 'italic',
                    }}
                  >
                    Available Focus Slot
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Stack>
      </Stack>

      {/* Syncing Overlay Modal */}
      <AnimatePresence>
        {syncStep === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isDark
                ? 'rgba(11, 15, 20, 0.85)'
                : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack spacing={2} alignItems="center">
              {/* Spinner */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '3px solid rgba(59, 130, 246, 0.1)',
                  borderTopColor: '#3b82f6',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isDark ? '#FAFAFA' : '#111827',
                }}
              >
                Syncing with Google Calendar...
              </Typography>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

const FeaturesPage: React.FC = () => {
  return (
    <PageWrapper>
      <Navbar />

      <MainContent>
        {/* --- HERO SECTION --- */}
        <FeaturesHero>
          <Container maxWidth="lg">
            <Stack spacing={2} alignItems="center">
              <HeroBadge>
                <HeroBadgeText variant="caption">Product Detail</HeroBadgeText>
              </HeroBadge>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
              >
                Designed for Deep Work.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  mx: 'auto',
                  mt: 1,
                }}
              >
                Explore the tools that help high-performance teams eliminate
                distractions and master their workflow.
              </Typography>
            </Stack>
          </Container>
        </FeaturesHero>

        {/* --- GRID 1: WORKSPACES & ATOMIC TASKS --- */}
        <FeatureSectionWrapper>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="stretch">
              {/* Intelligent Workspaces */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FeatureBlockCard>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          bgcolor: 'rgba(59,130,246,0.06)',
                          border: '1px solid rgba(59,130,246,0.1)',
                          display: 'inline-flex',
                        }}
                      >
                        <FolderIcon
                          sx={{ color: 'primary.main', fontSize: 20 }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, fontSize: '1.375rem' }}
                      >
                        Intelligent Workspaces
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Create customized environments for different projects.
                      Each workspace defines its own tasks, lists, and focus
                      settings to minimize context switching.
                    </Typography>
                  </Stack>

                  {/* Monitor Mockup */}
                  <AnimatedWorkspaceMockup />
                </FeatureBlockCard>
              </Grid>

              {/* Atomic Tasks */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FeatureBlockCard>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          bgcolor: 'rgba(59,130,246,0.06)',
                          border: '1px solid rgba(59,130,246,0.1)',
                          display: 'inline-flex',
                        }}
                      >
                        <CheckBoxIcon
                          sx={{ color: 'primary.main', fontSize: 20 }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.375rem',
                        }}
                      >
                        Atomic Tasks
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Break down massive projects into actionable items. Use
                      natural language processing to set due dates and
                      priorities instantly.
                    </Typography>
                  </Stack>

                  {/* Checklist Mockup */}
                  <AnimatedAtomicTasksMockup />
                </FeatureBlockCard>
              </Grid>
            </Grid>
          </Container>
        </FeatureSectionWrapper>

        {/* --- UNIFIED CALENDAR SECTION --- */}
        <FeatureSectionWrapper>
          <Container maxWidth="lg">
            <Grid container spacing={8} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <MacbookFrame>
                  <MacbookScreen>
                    <AnimatedCalendarSyncMockup />
                  </MacbookScreen>
                  <MacbookKeyboard />
                </MacbookFrame>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={4}>
                  <Stack spacing={2}>
                    <HeroBadge>
                      <HeroBadgeText variant="caption">
                        SYNC MANAGEMENT
                      </HeroBadgeText>
                    </HeroBadge>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                      }}
                    >
                      Unified Calendar
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Sync and unify all your tasks and focus slots directly
                      from Google Calendar into one master view. Keep track of
                      your daily schedule without context switching.
                    </Typography>
                  </Stack>

                  <Stack spacing={3}>
                    {/* Bullet 1 */}
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          bgcolor: 'rgba(59,130,246,0.06)',
                          border: '1px solid rgba(59,130,246,0.1)',
                          color: 'primary.main',
                          display: 'flex',
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 18 }} />
                      </Box>
                      <Stack spacing={0.5}>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          Auto-Focus Slots
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Automatically identify deep work blocks and protect
                          them from incoming invites.
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Bullet 2 */}
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          bgcolor: 'rgba(59,130,246,0.06)',
                          border: '1px solid rgba(59,130,246,0.1)',
                          color: 'primary.main',
                          display: 'flex',
                        }}
                      >
                        <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                      </Box>
                      <Stack spacing={0.5}>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          Google Calendar Sync
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Real-time sync keeps your tasks and meetings unified
                          with Google Calendar.
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </FeatureSectionWrapper>

        {/* --- GRID 2: NOTES & AI ASSISTANT --- */}
        <FeatureSectionWrapper>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="stretch">
              {/* Second Brain Notes */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FeatureBlockCard>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          bgcolor: 'rgba(59,130,246,0.06)',
                          border: '1px solid rgba(59,130,246,0.1)',
                          display: 'inline-flex',
                        }}
                      >
                        <NotesIcon
                          sx={{ color: 'primary.main', fontSize: 20 }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, fontSize: '1.375rem' }}
                      >
                        Second Brain Notes
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      With nesting and bi-directional links support, connect
                      ideas using bidirectional links to build your personal
                      knowledge base.
                    </Typography>
                  </Stack>

                  {/* Notes Mockup */}
                  <Stack
                    spacing={1.5}
                    sx={{
                      mt: 'auto',
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'rgba(0,0,0,0.01)',
                    }}
                  >
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'text.secondary',
                          opacity: 0.25,
                          width: '100%',
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'text.secondary',
                          opacity: 0.15,
                          width: '90%',
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'text.secondary',
                          opacity: 0.15,
                          width: '50%',
                          borderRadius: 1,
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          bgcolor: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.15)',
                          borderRadius: '4px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.65rem',
                            color: 'primary.main',
                            fontWeight: 600,
                          }}
                        >
                          #specifications
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          bgcolor: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.15)',
                          borderRadius: '4px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.65rem',
                            color: 'primary.main',
                            fontWeight: 600,
                          }}
                        >
                          #meeting-notes
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </FeatureBlockCard>
              </Grid>

              {/* Focusly AI */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FeatureBlockCard>
                  <Stack spacing={1.5}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: '8px',
                            bgcolor: 'rgba(59,130,246,0.06)',
                            border: '1px solid rgba(59,130,246,0.1)',
                            display: 'inline-flex',
                          }}
                        >
                          <AutoAwesomeIcon
                            sx={{ color: 'primary.main', fontSize: 20 }}
                          />
                        </Box>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 700, fontSize: '1.375rem' }}
                        >
                          Focusly AI
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          bgcolor: 'primary.main',
                          borderRadius: '4px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.65rem',
                            color: '#FFFFFF',
                            fontWeight: 700,
                          }}
                        >
                          NEW
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Your personal productivity engineer. Summarize long
                      threads, suggest task prioritizations based on your energy
                      levels, and draft responses.
                    </Typography>
                  </Stack>

                  {/* AI Assistant Chat Bubble */}
                  <Stack
                    spacing={1.5}
                    sx={{
                      mt: 'auto',
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.15)',
                      bgcolor: 'rgba(59, 130, 246, 0.02)',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AutoAwesomeIcon
                        sx={{ color: 'primary.main', fontSize: 14 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      >
                        Focusly AI
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', lineHeight: 1.4 }}
                    >
                      "Focusly: It looks like you've been in meetings all day.
                      Would you like to schedule 2 hours for deep work on the
                      'Marketing Strategy Specs'?"
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        py: 0.75,
                        boxShadow: 'none',
                      }}
                    >
                      Enable AI Assistant
                    </Button>
                  </Stack>
                </FeatureBlockCard>
              </Grid>
            </Grid>
          </Container>
        </FeatureSectionWrapper>

        {/* --- DARK INSIGHTS SECTION --- */}
        <AnalyticsDarkSection>
          <Container maxWidth="lg">
            {/* Centered reviews row */}
            <Grid container spacing={4} sx={{ mb: 8 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <DarkReviewCard>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ color: '#3B82F6', fontSize: '1.25rem' }}>
                        ⏱
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        Dev Activities
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      Track application usage to specify intervals, sources, and
                      context sync.
                    </Typography>
                  </Stack>
                </DarkReviewCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <DarkReviewCard>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ color: '#3B82F6', fontSize: '1.25rem' }}>
                        📊
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        Weekly Review
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      A Sunday morning summary of your accomplishments and focus
                      leaks.
                    </Typography>
                  </Stack>
                </DarkReviewCard>
              </Grid>
            </Grid>

            {/* Main insights row */}
            <Grid container spacing={8} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={4}>
                  <Stack spacing={2}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      Real-Time Insights
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Visualize your productivity trends. Understand where your
                      time goes and optimize your schedule for maximum output.
                    </Typography>
                  </Stack>

                  {/* Progress bars list */}
                  <Stack spacing={3}>
                    {/* Item 1 */}
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Focus Score
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: '#3B82F6' }}
                        >
                          92%
                        </Typography>
                      </Stack>
                      <AnalyticsProgressBar>
                        <AnalyticsProgressBarFill width="92%" />
                      </AnalyticsProgressBar>
                    </Stack>

                    {/* Item 2 */}
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Deep Work Avg
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: '#3B82F6' }}
                        >
                          4.2h
                        </Typography>
                      </Stack>
                      <AnalyticsProgressBar>
                        <AnalyticsProgressBarFill width="70%" />
                      </AnalyticsProgressBar>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>

              {/* Monitor Mockup right */}
              <Grid size={{ xs: 12, md: 6 }}>
                <AnimatedInsightsMockup />
              </Grid>
            </Grid>
          </Container>
        </AnalyticsDarkSection>

        {/* --- BUILD TOGETHER SECTION --- */}
        <FeatureSectionWrapper
          id="build-together"
          bgColor="transparent"
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Container maxWidth="lg">
            <SectionHeader>
              <Typography variant="h2">Build Together</Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                Collaboration that doesn't sacrifice individual focus.
              </Typography>
            </SectionHeader>

            <Grid container spacing={4}>
              {/* Shared Channels */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: 'none',
                    height: '100%',
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '8px',
                        bgcolor: 'rgba(59,130,246,0.06)',
                        border: '1px solid rgba(59,130,246,0.1)',
                        color: 'primary.main',
                        display: 'inline-flex',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <PeopleIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, fontSize: '1.25rem' }}
                    >
                      Shared Channels
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Centralize project discussions and assets in one
                      transparent location.
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              {/* Roles & Permissions */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: 'none',
                    height: '100%',
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '8px',
                        bgcolor: 'rgba(59,130,246,0.06)',
                        border: '1px solid rgba(59,130,246,0.1)',
                        color: 'primary.main',
                        display: 'inline-flex',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <LockIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, fontSize: '1.25rem' }}
                    >
                      Roles & Permissions
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Granular control over who accesses what, ensuring data
                      security and privacy.
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              {/* Resource Leveling */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: 'none',
                    height: '100%',
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '8px',
                        bgcolor: 'rgba(59,130,246,0.06)',
                        border: '1px solid rgba(59,130,246,0.1)',
                        color: 'primary.main',
                        display: 'inline-flex',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <AssessmentIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, fontSize: '1.25rem' }}
                    >
                      Resource Leveling
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Balance workloads across your team to prevent burnout and
                      maximize output.
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </FeatureSectionWrapper>

        {/* --- CALL TO ACTION BLUE BANNER --- */}
        <FeatureSectionWrapper bgColor="transparent" sx={{ border: 'none' }}>
          <Container maxWidth="lg">
            <CtaBanner>
              <Typography
                variant="h2"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                }}
              >
                Ready to find your flow?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: 500,
                  lineHeight: 1.6,
                }}
              >
                Join 10,000+ professionals who have reclaimed their focus with
                Focusly.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={1}>
                <CtaPrimaryButton component={NavLink} to="/login">
                  Get Started for Free
                </CtaPrimaryButton>
                <CtaSecondaryButton component={NavLink} to="/login">
                  Schedule a Demo
                </CtaSecondaryButton>
              </Stack>
            </CtaBanner>
          </Container>
        </FeatureSectionWrapper>
      </MainContent>

      {/* --- FOOTER --- */}
      <FooterContainer>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AutoAwesomeIcon
                    sx={{ fontSize: 18, color: 'primary.main' }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Focusly
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 300, lineHeight: 1.5 }}
                >
                  The open OS for high-performance teams.
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  <IconButton
                    href="https://github.com"
                    target="_blank"
                    color="inherit"
                    size="small"
                  >
                    <GitHubIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton
                    href="https://linkedin.com"
                    target="_blank"
                    color="inherit"
                    size="small"
                  >
                    <LinkedInIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton
                    href="https://twitter.com"
                    target="_blank"
                    color="inherit"
                    size="small"
                  >
                    <TwitterIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 4, md: 2.3 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  display: 'block',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Platform
              </Typography>
              <Stack spacing={1.25}>
                <FooterLink href="/features">Features</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="#">Resources</FooterLink>
              </Stack>
            </Grid>

            <Grid size={{ xs: 4, md: 2.3 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  display: 'block',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Company
              </Typography>
              <Stack spacing={1.25}>
                <FooterLink href="#">Blog</FooterLink>
                <FooterLink href="#">Contact</FooterLink>
              </Stack>
            </Grid>

            <Grid size={{ xs: 4, md: 2.3 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  display: 'block',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Legal
              </Typography>
              <Stack spacing={1.25}>
                <FooterLink href="#">Privacy</FooterLink>
                <FooterLink href="#">Terms</FooterLink>
              </Stack>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 8,
              pt: 4,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Focusly Tech. Designed to help you
              focus.
            </Typography>
          </Box>
        </Container>
      </FooterContainer>
    </PageWrapper>
  );
};

export default FeaturesPage;
