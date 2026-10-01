import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GridViewIcon from '@mui/icons-material/GridView';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ImageIcon from '@mui/icons-material/Image';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import StarIcon from '@mui/icons-material/Star';
import FolderIcon from '@mui/icons-material/Folder';
import { CuteRobotIcon } from '@/components/ui';
import { pulse, truncateSx } from '@/styles/mui';

const MotionBox = motion.create(Box);

// This mock always renders in the dark Focusly look, whatever the site theme.
const c = {
  text: '#FAFAFA',
  muted: '#A1A1AA',
  frame: '#111827',
  deep: '#0B0F14',
  line: 'rgba(255, 255, 255, 0.06)',
  lineSoft: 'rgba(255, 255, 255, 0.04)',
  lineStrong: 'rgba(255, 255, 255, 0.08)',
  violet300: '#c4b5fd',
  violet400: '#a78bfa',
  violet500: '#8b5cf6',
  violet600: '#7c3aed',
  indigo600: '#4f46e5',
  purple300: '#d8b4fe',
  purple500: '#a855f7',
  emerald300: '#6ee7b7',
  emerald400: '#34d399',
  emerald500: '#10b981',
  amber300: '#fcd34d',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
} as const;

const mono =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

const ping = keyframes`
  75%, 100% { transform: scale(2); opacity: 0; }
`;

const navItemSx = (active: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  px: 1.25,
  py: 0.75,
  fontSize: '12px',
  borderRadius: '8px',
  border: '1px solid',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  ...(active
    ? { bgcolor: c.lineSoft, color: c.text, borderColor: c.lineSoft }
    : {
        color: c.muted,
        borderColor: 'transparent',
        '&:hover': { color: c.text },
      }),
});

const coverActionSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  cursor: 'pointer',
  transition: 'color 0.15s ease',
  '&:hover': { color: c.text },
} as const;

const dashboardCardSx = {
  bgcolor: `${c.frame}80`,
  border: `1px solid ${c.line}`,
  borderRadius: '16px',
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
} as const;

const cardLabelSx = {
  fontSize: '9px',
  fontWeight: 700,
  color: c.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
} as const;

const cardValueSx = {
  fontSize: '24px',
  lineHeight: '32px',
  fontWeight: 700,
  color: c.text,
} as const;

const cardHintSx = {
  m: 0,
  mt: 0.25,
  fontSize: '9px',
  color: c.muted,
} as const;

const windowDot = (color: string) => (
  <Box
    component="span"
    sx={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      bgcolor: color,
      opacity: 0.8,
    }}
  />
);

export default function AnimatedHeroEditor() {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');

  // Custom spring configurations for premium feeling
  const springTransition = {
    type: 'spring',
    stiffness: 100,
    damping: 18,
  } as const;
  const fastSpring = { type: 'spring', stiffness: 140, damping: 15 } as const;

  const tasks = [
    { id: 1, text: 'Gym at 7 AM', time: '07:00' },
    { id: 2, text: 'Finish GraphQL API', time: '10:30' },
    { id: 3, text: 'English Practice', time: '16:00' },
  ];

  const calendarEvents = [
    {
      title: 'Workout',
      time: '07:00 - 08:00',
      accent: c.emerald500,
      text: c.emerald300,
    },
    {
      title: 'Deep Work',
      time: '10:00 - 13:00',
      accent: c.violet500,
      text: c.violet300,
    },
    {
      title: 'Lunch',
      time: '13:00 - 14:00',
      accent: c.amber500,
      text: c.amber300,
    },
    {
      title: 'Study',
      time: '15:30 - 17:00',
      accent: c.purple500,
      text: c.purple300,
    },
  ];

  // Control the sequence of steps
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (step === 0) {
      setTypedText('');
      timer = setTimeout(() => setStep(1), 500);
    } else if (step === 1) {
      // Typing "Plan my week"
      const targetText = 'Plan my week';
      let currentLength = 0;

      const typingInterval = setInterval(
        () => {
          if (currentLength < targetText.length) {
            currentLength++;
            setTypedText(targetText.substring(0, currentLength));
          } else {
            clearInterval(typingInterval);
            // Wait after typing finished
            timer = setTimeout(() => {
              setStep(2);
            }, 1200);
          }
        },
        90 + Math.random() * 50,
      ); // Human-like typing speed variation

      return () => {
        clearInterval(typingInterval);
        clearTimeout(timer);
      };
    } else if (step === 2) {
      // Loading state (Lumina AI is writing...)
      timer = setTimeout(() => {
        setStep(3);
      }, 2500);
    } else if (step === 3) {
      // Tasks fade-in
      timer = setTimeout(() => {
        setStep(4);
      }, 2800);
    } else if (step === 4) {
      // AI schedule calendar slide-in
      timer = setTimeout(() => {
        setStep(5);
      }, 4000);
    } else if (step === 5) {
      // Transform to Dashboard
      timer = setTimeout(() => {
        setStep(0); // Restart loop
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: '100%', sm: 700, md: 900 },
        mx: 'auto',
        userSelect: 'none',
        px: { xs: 2, sm: 0 },
      }}
    >
      {/* Background Radial Glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: -40,
          background: `linear-gradient(to top right, ${c.violet600}33, ${c.purple500}1a, transparent)`,
          filter: 'blur(64px)',
          borderRadius: '50%',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Editor Frame */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 540,
          bgcolor: `${c.frame}d9`,
          backdropFilter: 'blur(24px)',
          border: `1px solid ${c.line}`,
          borderRadius: '24px',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          transition: 'all 0.5s ease-in-out',
        }}
      >
        {/* LEFT SIDEBAR (Styled exactly like Focusly's sidebar navigation) */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            width: 192,
            borderRight: `1px solid ${c.line}`,
            bgcolor: `${c.deep}66`,
            p: 2,
            flexShrink: 0,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Mac OS Window Buttons */}
            <Box
              sx={{ display: 'flex', flexDirection: 'row', gap: 0.75, pt: 0.5 }}
            >
              {windowDot('#FF5F56')}
              {windowDot('#FFBD2E')}
              {windowDot('#27C93F')}
            </Box>

            {/* App Branding */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 0.5 }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '6px',
                  background: `linear-gradient(to bottom right, ${c.violet600}, ${c.indigo600})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 6px -1px ${c.violet500}33`,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 11, color: '#ffffff' }} />
              </Box>
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: '12px',
                  color: c.text,
                  letterSpacing: '0.025em',
                }}
              >
                Focusly
              </Box>
            </Box>

            {/* Sidebar Menus & Navigation */}
            <Box
              component="nav"
              sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
            >
              <Box sx={navItemSx(step === 5)}>
                <GridViewIcon
                  sx={{
                    fontSize: 13,
                    color: step === 5 ? c.violet400 : undefined,
                  }}
                />
                <span>Daily Plan</span>
              </Box>
              <Box sx={navItemSx(step === 4)}>
                <CalendarMonthIcon
                  sx={{
                    fontSize: 13,
                    color: step === 4 ? c.violet400 : undefined,
                  }}
                />
                <span>Calendar</span>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1.25,
                  py: 0.75,
                  fontSize: '12px',
                  color: c.muted,
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: c.text },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormatListBulletedIcon sx={{ fontSize: 13 }} />
                  <span>Tasks</span>
                </Box>
              </Box>
              <Box sx={navItemSx(step <= 3)}>
                <InsertDriveFileIcon
                  sx={{
                    fontSize: 13,
                    color: step <= 3 ? c.violet400 : undefined,
                  }}
                />
                <span>Workspaces</span>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Quick Profile */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1,
                py: 0.75,
                border: `1px solid ${c.lineSoft}`,
                bgcolor: `${c.frame}66`,
                borderRadius: '8px',
                fontSize: '12px',
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: c.violet600,
                  fontSize: '10px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                A
              </Box>
              <Box
                component="span"
                sx={{ color: c.muted, fontWeight: 500, ...truncateSx }}
              >
                Alexis
              </Box>
            </Box>
          </Box>
        </Box>

        {/* MAIN CONTAINER */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            bgcolor: `${c.deep}66`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* EDITOR HEADER (Styled exactly like Focusly's StyledEditorHeader) */}
          <Box
            component="header"
            sx={{
              height: 48,
              borderBottom: `1px solid ${c.line}`,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: `${c.frame}4d`,
              zIndex: 10,
              flexShrink: 0,
            }}
          >
            {/* Back Button */}
            <Box>
              <Box
                sx={{
                  height: 28,
                  px: 1.5,
                  borderRadius: '999px',
                  border: `1px solid ${c.lineStrong}`,
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(12px)',
                  color: c.muted,
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: c.text, color: c.text },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 10 }} />
                <span>Back</span>
              </Box>
            </Box>

            {/* Right side header actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              {/* dictation icon */}
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: `1px solid ${c.lineStrong}`,
                  color: c.muted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  '&:hover': { bgcolor: c.lineSoft },
                }}
              >
                <MicIcon sx={{ fontSize: 12 }} />
              </Box>

              {/* Save Status Indicator */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.5,
                  height: 28,
                  border: `1px solid ${c.emerald500}33`,
                  bgcolor: `${c.emerald500}0d`,
                  borderRadius: '999px',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: c.emerald500,
                    boxShadow: `0 0 8px ${c.emerald500}`,
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    color: c.emerald500,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.025em',
                  }}
                >
                  saved
                </Box>
              </Box>
            </Box>
          </Box>

          {/* WORKSPACE CONTENT AREA */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflowY: 'auto',
              overflowX: 'hidden',
              minHeight: 0,
            }}
          >
            <AnimatePresence mode="wait">
              {step <= 4 ? (
                <MotionBox
                  key="editor-workspace"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springTransition}
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                  }}
                >
                  {/* GRADIENT COVER BANNER (Matches Focusly's Cover) */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 96,
                      background:
                        'linear-gradient(to right, rgba(76, 29, 149, 0.4), rgba(88, 28, 135, 0.4), rgba(131, 24, 67, 0.4))',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    {/* Shadow overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </Box>

                  {/* Icon Card & Cover Actions Toolbar Row */}
                  <Box
                    sx={{
                      px: { xs: 3, sm: 4 },
                      position: 'relative',
                      zIndex: 10,
                      flexShrink: 0,
                    }}
                  >
                    {/* Floating icon card sitting on top of the cover edge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -28,
                        left: { xs: 24, sm: 32 },
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        bgcolor: c.frame,
                        border: `1px solid ${c.lineStrong}`,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <StarIcon sx={{ fontSize: 24, color: c.violet400 }} />
                    </Box>

                    {/* Small Actions list matching ghostBtnSx row in Focusly */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 1,
                        pt: 1.25,
                        pb: 1,
                        fontSize: '10px',
                        color: c.muted,
                        fontWeight: 600,
                      }}
                    >
                      <Box sx={coverActionSx}>
                        <InsertEmoticonIcon sx={{ fontSize: 12 }} />
                        <span>Change icon</span>
                      </Box>
                      <Box component="span" sx={{ opacity: 0.3 }}>
                        •
                      </Box>
                      <Box sx={coverActionSx}>
                        <ImageIcon sx={{ fontSize: 12 }} />
                        <span>Change cover</span>
                      </Box>
                      <Box component="span" sx={{ opacity: 0.3 }}>
                        •
                      </Box>
                      <Box sx={coverActionSx}>
                        <AspectRatioIcon sx={{ fontSize: 12 }} />
                        <span>Focus view</span>
                      </Box>
                    </Box>
                  </Box>

                  {/* Text Editor Body Area (Looks like BlockNote view) */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      px: { xs: 3, sm: 4 },
                      pt: 2,
                      pb: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 0,
                    }}
                  >
                    {/* FOLDER BADGE */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1,
                        py: 0.25,
                        bgcolor: `${c.violet500}1a`,
                        color: c.violet400,
                        borderRadius: '4px',
                        border: `1px solid ${c.violet500}33`,
                        mb: 1.5,
                        width: 'max-content',
                        userSelect: 'none',
                      }}
                    >
                      <FolderIcon sx={{ fontSize: 10 }} />
                      <Box
                        component="span"
                        sx={{
                          fontSize: '9px',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                      >
                        PROJECTS
                      </Box>
                    </Box>

                    {/* borderless Title Input */}
                    <Box
                      component="h1"
                      sx={{
                        m: 0,
                        fontSize: { xs: '24px', sm: '30px' },
                        lineHeight: { xs: '32px', sm: '36px' },
                        fontWeight: 800,
                        color: c.text,
                        letterSpacing: '-0.025em',
                        mb: 2.5,
                      }}
                    >
                      Weekly Sprint Planner
                    </Box>

                    {/* BlockNote content container */}
                    <Box
                      sx={{
                        flexGrow: 1,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 220,
                      }}
                    >
                      {/* AI Command Input Bar inside Document Body */}
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: 512,
                          mx: 'auto',
                          bgcolor: 'rgba(24, 24, 27, 0.95)',
                          border: `1px solid ${c.lineStrong}`,
                          borderRadius: '12px',
                          p: 1.75,
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                          mb: 2.5,
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          zIndex: 20,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '8px',
                              background: `linear-gradient(to bottom right, ${c.violet600}, ${c.indigo600})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              boxShadow: `0 4px 6px -1px ${c.violet500}40`,
                            }}
                          >
                            <CuteRobotIcon
                              size={14}
                              variant="mini"
                              primaryColor="#FFF"
                              eyeColor="#FFF"
                            />
                          </Box>
                          <Box
                            sx={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              color: c.text,
                              fontFamily: mono,
                              fontSize: '12px',
                              lineHeight: 1,
                              py: 0.5,
                              position: 'relative',
                            }}
                          >
                            <span>{typedText}</span>
                            {/* Caret */}
                            {step === 1 && (
                              <MotionBox
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.8,
                                  ease: 'linear',
                                }}
                                sx={{
                                  display: 'inline-block',
                                  width: 6,
                                  height: 14,
                                  ml: 0.5,
                                  bgcolor: c.violet400,
                                }}
                              />
                            )}
                            {step === 0 && (
                              <Box
                                component="span"
                                sx={{
                                  color: `${c.muted}66`,
                                  fontSize: '12px',
                                  fontFamily: 'inherit',
                                  position: 'absolute',
                                  left: 0,
                                  fontWeight: 300,
                                  pointerEvents: 'none',
                                }}
                              >
                                Ask Lumina AI to plan your goals...
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {/* Tasks Checklist generated inside Document Body */}
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: 512,
                          mx: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          position: 'relative',
                        }}
                      >
                        <AnimatePresence>
                          {step >= 3 &&
                            tasks.map((task, i) => (
                              <MotionBox
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...fastSpring, delay: i * 0.15 }}
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  p: 1.5,
                                  bgcolor: `${c.frame}66`,
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  borderRadius: '12px',
                                  transition: 'background-color 0.3s ease',
                                  '&:hover': { bgcolor: `${c.frame}99` },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                  }}
                                >
                                  <MotionBox
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.2 + 0.3 }}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: c.violet400,
                                    }}
                                  >
                                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                                  </MotionBox>
                                  <Box
                                    component="span"
                                    sx={{
                                      color: c.text,
                                      fontSize: '12px',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {task.text}
                                  </Box>
                                </Box>
                                <Box
                                  component="span"
                                  sx={{
                                    fontSize: '9px',
                                    fontFamily: mono,
                                    color: c.muted,
                                    bgcolor: `${c.frame}cc`,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: '4px',
                                    border: `1px solid ${c.lineSoft}`,
                                  }}
                                >
                                  {task.time}
                                </Box>
                              </MotionBox>
                            ))}
                        </AnimatePresence>
                      </Box>

                      {/* Lumina AI Writing Overlay (Matches exactly how Lumina AI is writing... is shown in Focusly) */}
                      <AnimatePresence>
                        {step === 2 && (
                          <MotionBox
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              bgcolor: `${c.deep}80`,
                              backdropFilter: 'blur(2px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 30,
                              borderRadius: '12px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.25,
                                px: 2,
                                py: 1.25,
                                borderRadius: '999px',
                                bgcolor: '#1e1b4b',
                                border: `1px solid ${c.violet500}33`,
                                boxShadow:
                                  '0 8px 32px rgba(15, 23, 76, 0.3), 0 0 16px rgba(124, 58, 237, 0.15)',
                                animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                              }}
                            >
                              <CuteRobotIcon
                                size={20}
                                variant="mini"
                                primaryColor="#137fec"
                                eyeColor="#22d3ee"
                              />
                              <Box
                                component="span"
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  color: c.text,
                                  letterSpacing: '0.025em',
                                }}
                              >
                                Lumina AI is writing...
                              </Box>
                            </Box>
                          </MotionBox>
                        )}
                      </AnimatePresence>
                    </Box>
                  </Box>
                </MotionBox>
              ) : (
                /* DASHBOARD VIEW (step 5) */
                <MotionBox
                  key="dashboard-workspace"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springTransition}
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    p: { xs: 3, sm: 4 },
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2.5,
                    }}
                  >
                    <Box
                      component="h3"
                      sx={{
                        m: 0,
                        fontSize: '12px',
                        fontWeight: 700,
                        color: c.text,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <GridViewIcon sx={{ fontSize: 15, color: c.violet400 }} />
                      <span>Today's Focus Workspace</span>
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontSize: '9px',
                        color: c.emerald400,
                        bgcolor: `${c.emerald500}1a`,
                        border: `1px solid ${c.emerald500}33`,
                        px: 1,
                        py: 0.25,
                        borderRadius: '999px',
                        fontWeight: 500,
                      }}
                    >
                      Active Sprint Session
                    </Box>
                  </Box>

                  {/* Dashboard Grid */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                      gap: 2,
                      flexGrow: 1,
                    }}
                  >
                    {/* Card 1: Today's Focus */}
                    <MotionBox
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springTransition, delay: 0.1 }}
                      sx={dashboardCardSx}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box component="span" sx={cardLabelSx}>
                          Today's Focus
                        </Box>
                        <AccessTimeIcon
                          sx={{ fontSize: 14, color: c.violet400 }}
                        />
                      </Box>
                      <Box sx={{ my: 1 }}>
                        <Box component="span" sx={cardValueSx}>
                          3h 45m
                        </Box>
                        <Box component="p" sx={cardHintSx}>
                          Focused flow time scheduled
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          bgcolor: c.deep,
                          height: 4,
                          borderRadius: '999px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            background: `linear-gradient(to right, ${c.violet600}, ${c.purple500})`,
                            height: '100%',
                            width: '75%',
                          }}
                        />
                      </Box>
                    </MotionBox>

                    {/* Card 2: Progress */}
                    <MotionBox
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springTransition, delay: 0.25 }}
                      sx={dashboardCardSx}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box component="span" sx={cardLabelSx}>
                          Progress
                        </Box>
                        <TrendingUpIcon
                          sx={{ fontSize: 14, color: c.emerald400 }}
                        />
                      </Box>
                      <Box sx={{ my: 1 }}>
                        <Box component="span" sx={cardValueSx}>
                          80%
                        </Box>
                        <Box component="p" sx={cardHintSx}>
                          4 of 5 habits checked
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[true, true, true, true, false].map((done, i) => (
                          <Box
                            key={i}
                            component="span"
                            sx={{
                              width: 10,
                              height: 6,
                              borderRadius: '2px',
                              bgcolor: done
                                ? c.violet600
                                : 'rgba(255, 255, 255, 0.1)',
                            }}
                          />
                        ))}
                      </Box>
                    </MotionBox>

                    {/* Card 3: Upcoming */}
                    <MotionBox
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springTransition, delay: 0.4 }}
                      sx={dashboardCardSx}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box component="span" sx={cardLabelSx}>
                          Upcoming
                        </Box>
                        <CalendarMonthIcon
                          sx={{ fontSize: 14, color: c.amber400 }}
                        />
                      </Box>
                      <Box
                        sx={{
                          my: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              fontSize: '10px',
                              fontWeight: 500,
                              color: c.text,
                              ...truncateSx,
                            }}
                          >
                            English Practice
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              fontSize: '9px',
                              fontFamily: mono,
                              color: c.amber300,
                              fontWeight: 600,
                            }}
                          >
                            16:00
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'space-between',
                            opacity: 0.5,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              fontSize: '10px',
                              color: c.text,
                              ...truncateSx,
                            }}
                          >
                            Client Sync
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              fontSize: '9px',
                              fontFamily: mono,
                              fontWeight: 600,
                            }}
                          >
                            18:00
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          fontSize: '8px',
                          color: c.muted,
                          alignSelf: 'flex-start',
                          bgcolor: c.deep,
                          px: 0.75,
                          py: 0.25,
                          borderRadius: '4px',
                          border: `1px solid ${c.lineSoft}`,
                        }}
                      >
                        2 events remaining
                      </Box>
                    </MotionBox>
                  </Box>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        {/* CALENDAR SIDE-PANEL (Slides in on step === 4, styled like Focusly's Right Resizable Sidebar) */}
        <AnimatePresence>
          {step === 4 && (
            <MotionBox
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={springTransition}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: 290,
                bgcolor: `${c.frame}fa`,
                backdropFilter: 'blur(12px)',
                borderLeft: `1px solid ${c.line}`,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: 10,
                boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.6)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  flex: 1,
                }}
              >
                {/* Drag handle mock bar on left edge to look resizable */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'ew-resize',
                    '&:hover': { bgcolor: `${c.violet500}33` },
                  }}
                >
                  <Box
                    sx={{
                      width: '2px',
                      height: 32,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                    }}
                  />
                </Box>

                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${c.line}`,
                    pb: 1.5,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: c.text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <CalendarMonthIcon
                      sx={{ fontSize: 13, color: c.violet400 }}
                    />
                    <span>Daily Plan</span>
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontSize: '9px', color: c.muted, fontFamily: mono }}
                  >
                    Today
                  </Box>
                </Box>

                {/* Hours Grid */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    color: c.muted,
                    fontFamily: mono,
                    position: 'relative',
                    py: 0.5,
                  }}
                >
                  {/* Mock Time Grid Lines */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                      opacity: 0.2,
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((line) => (
                      <Box
                        key={line}
                        sx={{
                          width: '100%',
                          borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    ))}
                  </Box>

                  {/* Calendar Event Cards */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.25,
                      zIndex: 10,
                    }}
                  >
                    {calendarEvents.map((event, idx) => (
                      <MotionBox
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...fastSpring, delay: idx * 0.15 }}
                        sx={{
                          p: 1.25,
                          borderRadius: '12px',
                          border: `1px solid ${event.accent}4d`,
                          bgcolor: `${event.accent}33`,
                          color: event.text,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.25,
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 600,
                            fontSize: '10px',
                            lineHeight: 1.25,
                          }}
                        >
                          {event.title}
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            fontSize: '9px',
                            opacity: 0.7,
                            fontFamily: mono,
                          }}
                        >
                          {event.time}
                        </Box>
                      </MotionBox>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Action indicator at bottom of calendar */}
              <Box
                sx={{
                  mt: 2,
                  pt: 1.5,
                  borderTop: `1px solid ${c.line}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: c.violet400,
                    animation: `${ping} 1s cubic-bezier(0, 0, 0.2, 1) infinite`,
                  }}
                />
                <Box component="span" sx={{ fontSize: '9px', color: c.muted }}>
                  Smart AI Scheduler Active
                </Box>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
