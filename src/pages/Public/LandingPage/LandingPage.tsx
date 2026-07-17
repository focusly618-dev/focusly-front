import React, { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Avatar,
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import {
  PlayCircleOutline as PlayCircleOutlineIcon,
  AutoAwesome as AutoAwesomeIcon,
  NotificationsNoneOutlined as NotificationsIcon,
  CheckCircleRounded as CheckCircleIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Flag as FlagIcon,
  Add as AddIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import Navbar from '@/components/layout/Navbar';
import AnimatedHeroEditor from './components/AnimatedHeroEditor';

import {
  PageWrapper,
  MainContent,
  SectionWrapper,
  SectionHeader,
  HeroSection,
  HeroBgDecoration,
  NewBadge,
  NewBadgeText,
  HeroTitle,
  HeroSubtitle,
  HeroPrimaryButton,
  HeroSecondaryButton,
  FeaturesGrid,
  FeatureCard,
  MockupTextLine,
  MockupTaskItem,
  MockupCheckbox,
  MockupCalendarEvent,
  FeatureIconBox,
  FeatureTitle,
  FeatureDescription,
  FeatureMockupMini,
  AISectionWrapper,
  AIBulletItem,
  AIBulletIcon,
  AIBulletTextStack,
  TimelineStepWrapper,
  TimelineDot,
  TimelineLine,
  PricingGrid,
  PricingCard,
  PricingCardBadge,
  TestimonialCard,
  FaqAccordion,
  FaqSummary,
  FaqDetails,
  FooterContainer,
  FooterLink,
} from './LandingPage.styles';

const TypewriterMock = ({
  text,
  delay = 1000,
}: {
  text: string;
  delay?: number;
}) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let isMounted = true;

    const runAnimation = async () => {
      while (isMounted) {
        setDisplayed('');
        await new Promise((r) => setTimeout(r, delay));

        for (let i = 1; i <= text.length; i++) {
          if (!isMounted) return;
          setDisplayed(text.substring(0, i));
          await new Promise((r) => setTimeout(r, 80 + Math.random() * 40));
        }

        await new Promise((r) => setTimeout(r, 2000));
      }
    };

    runAnimation();

    return () => {
      isMounted = false;
    };
  }, [text, delay]);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '2px',
          height: '1.2em',
          backgroundColor: '#a78bfa',
          marginLeft: '2px',
          animation: 'blink 0.8s infinite',
        }}
      />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

const AnimatedProjectMockup = () => {
  const [projectStep, setProjectStep] = useState(0);
  const [typedProject, setTypedProject] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (projectStep === 2) {
      const target = 'Mobile App';
      let len = 0;
      setTypedProject('');
      interval = setInterval(() => {
        if (len < target.length) {
          len++;
          setTypedProject(target.substring(0, len));
        } else {
          clearInterval(interval);
        }
      }, 100);
    } else {
      setTypedProject('');
    }
    return () => clearInterval(interval);
  }, [projectStep]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProjectStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const isProductDesignExpanded = projectStep >= 1 && projectStep <= 3;
  const showMobileAppTypewriter = projectStep === 2;
  const showMobileAppCreated = projectStep >= 3;

  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.01)'
            : 'rgba(0,0,0,0.01)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        minHeight: '220px',
      }}
    >
      <Stack spacing={2}>
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
            WORKSPACES & PROJECTS
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
            {projectStep === 0 && 'Waiting...'}
            {projectStep === 1 && 'Expanding Folder...'}
            {projectStep === 2 && 'Creating Project...'}
            {projectStep === 3 && 'Project Created!'}
            {projectStep === 4 && 'Hiding Folders...'}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          {/* Folder 1: Marketing Strategy */}
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ExpandMoreIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <FolderIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: '12px' }}
              >
                Marketing Strategy
              </Typography>
            </Stack>
            <Stack spacing={0.5} sx={{ pl: 3.5 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ opacity: 0.8 }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.3)',
                    marginRight: '6px',
                  }}
                >
                  #
                </span>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '11px', fontWeight: 500 }}
                >
                  Q3 Campaign Plan
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Folder 2: Product Design */}
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              {isProductDesignExpanded ? (
                <ExpandMoreIcon
                  sx={{ fontSize: 14, color: 'text.secondary' }}
                />
              ) : (
                <ChevronRightIcon
                  sx={{ fontSize: 14, color: 'text.secondary' }}
                />
              )}
              <FolderIcon sx={{ fontSize: 16, color: '#10b981' }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: '12px' }}
              >
                Product Design
              </Typography>
            </Stack>

            {isProductDesignExpanded && (
              <Stack spacing={0.5} sx={{ pl: 3.5 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ opacity: 0.8 }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.3)',
                      marginRight: '6px',
                    }}
                  >
                    #
                  </span>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: '11px', fontWeight: 500 }}
                  >
                    UX Wireframes
                  </Typography>
                </Stack>
                {showMobileAppTypewriter && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ color: 'primary.main' }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#a78bfa',
                        marginRight: '6px',
                      }}
                    >
                      #
                    </span>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      {typedProject}
                      <span
                        className="animate-pulse"
                        style={{
                          display: 'inline-block',
                          width: '2px',
                          height: '12px',
                          backgroundColor: '#a78bfa',
                          marginLeft: '2px',
                        }}
                      >
                        |
                      </span>
                    </Typography>
                  </Stack>
                )}
                {showMobileAppCreated && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ opacity: 0.8 }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.3)',
                        marginRight: '6px',
                      }}
                    >
                      #
                    </span>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '11px', fontWeight: 500 }}
                    >
                      Mobile App
                    </Typography>
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>

          {/* Folder 3: Engineering Labs */}
          <Stack direction="row" spacing={1} alignItems="center">
            <ChevronRightIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <FolderIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: '12px' }}
            >
              Engineering Labs
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const LandingPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  const handleFaqChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedFaq(isExpanded ? panel : false);
    };

  const features = [
    {
      icon: '🗂',
      title: 'Workspaces',
      description:
        'Seamlessly separate personal, startup, and side projects with dedicated workspaces.',
      mock: (
        <Stack spacing={1} sx={{ p: 0.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '4px',
                backgroundColor: '#60A5FA',
              }}
            />
            <MockupTextLine width={60} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '4px',
                backgroundColor: '#34D399',
              }}
            />
            <MockupTextLine width={45} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '4px',
                backgroundColor: '#F59E0B',
              }}
            />
            <MockupTextLine width={30} />
          </Stack>
        </Stack>
      ),
    },
    {
      icon: '✅',
      title: 'Tasks',
      description:
        'Create lists, prioritize, add labels, tags, assignees, and due dates.',
      mock: (
        <Stack spacing={1} sx={{ p: 0.5 }}>
          <MockupTaskItem>
            <CheckCircleIcon sx={{ fontSize: 12, color: '#16A34A' }} />
            <MockupTextLine width={60} />
          </MockupTaskItem>
          <MockupTaskItem>
            <MockupCheckbox />
            <MockupTextLine width={80} />
          </MockupTaskItem>
        </Stack>
      ),
    },
    {
      icon: '📅',
      title: 'Calendar',
      description:
        'Sync and unify all your tasks and focus slots directly from Google Calendar.',
      mock: (
        <Stack spacing={1} sx={{ p: 0.5 }}>
          <MockupCalendarEvent>
            <MockupTextLine width={80} opacity={0.6} />
            <MockupTextLine width={40} opacity={0.4} />
          </MockupCalendarEvent>
        </Stack>
      ),
    },
    {
      icon: '📝',
      title: 'Notes',
      description:
        'Markdown documentation for project specs, plans, and guidelines.',
      mock: (
        <Stack spacing={0.75} sx={{ p: 0.5 }}>
          <MockupTextLine width={100} />
          <MockupTextLine width={90} />
          <MockupTextLine width={50} />
        </Stack>
      ),
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description:
        'Intelligent helper schedules focus blocks, updates statuses, and summaries files.',
      mock: (
        <Box
          sx={{
            p: 1,
            borderRadius: '8px',
            backgroundColor: 'rgba(96, 165, 250, 0.08)',
            border: '1px solid rgba(96, 165, 250, 0.15)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <AutoAwesomeIcon sx={{ fontSize: 12, color: '#60A5FA' }} />
            <MockupTextLine width={75} />
          </Stack>
        </Box>
      ),
    },
    {
      icon: '📈',
      title: 'Analytics',
      description:
        'Detailed metrics show focus trends and behavioral insights.',
      mock: (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-end"
          sx={{ height: 50, pt: 1, px: 1 }}
        >
          <Box
            sx={{
              flex: 1,
              height: '35%',
              backgroundColor: '#E5E5E5',
              borderRadius: '3px 3px 0 0',
            }}
          />
          <Box
            sx={{
              flex: 1,
              height: '65%',
              backgroundColor: '#E5E5E5',
              borderRadius: '3px 3px 0 0',
            }}
          />
          <Box
            sx={{
              flex: 1,
              height: '90%',
              backgroundColor: '#60A5FA',
              borderRadius: '3px 3px 0 0',
            }}
          />
        </Stack>
      ),
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Smart updates only notify you when it actually matters.',
      mock: (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 0.5 }}>
          <NotificationsIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
          <MockupTextLine width={70} />
        </Stack>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Navbar />

      <MainContent>
        {/* --- HERO SECTION --- */}
        <HeroSection id="home">
          <HeroBgDecoration />
          <Container maxWidth="lg">
            <Stack spacing={8} alignItems="center" textAlign="center" pt={4}>
              <Stack spacing={3.5} alignItems="center" maxWidth={800}>
                <NewBadge>
                  <NewBadgeText variant="caption">
                    ✨ New: 2.0 Workspaces out now →
                  </NewBadgeText>
                </NewBadge>

                <HeroTitle variant="h1">
                  Everything you need to stay focused.
                </HeroTitle>

                <HeroSubtitle variant="body1">
                  Organize projects, tasks, calendars, notes and workspaces in
                  one beautiful productivity platform.
                </HeroSubtitle>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  pt={1}
                  justifyContent="center"
                >
                  <HeroPrimaryButton
                    variant="contained"
                    component={NavLink}
                    to="/login"
                  >
                    Get Started 🚀
                  </HeroPrimaryButton>
                  <HeroSecondaryButton
                    variant="outlined"
                    onClick={() => {
                      const el = document.getElementById('how-it-works');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    startIcon={<PlayCircleOutlineIcon sx={{ fontSize: 20 }} />}
                  >
                    Watch Demo
                  </HeroSecondaryButton>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  pt={2}
                  justifyContent="center"
                >
                  <Stack direction="row" spacing={-1}>
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        border: '2px solid white',
                      }}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuASvp08irYPQnxkzbjjLwJyRG7en12csWr8DYSXylHoWBTrL8UykeXCAA-iGmI4sAtu4PAqvnR9IXgY8-d3JJkRPiP6sBMpjUgBp7IqW-eElWCam725z38w9k7BP4DDcyfynSyeJqIXJd8n4yxtAZApsZtbZg6Ztm-RVNPWh0B_wdzlL_VXARvbB744jKYMqC4g5eXrdTpP_V4k5vtADFibcesvGXVhf5188drmS1llcWWuEcbfI1jpx2vBBRa23f7DvAU4_f2wbCk"
                    />
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        border: '2px solid white',
                      }}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXu55VmqkCP_oPHKHMJMC6gFyEjJVlAyOqObWU0VwCQEYQbzemo62ZA50tW59qDr0qom-ggc-0PIO_6vD0I512AQjo5XrD5aDCyCmbNatiiSi80IcNhkwcGTdnJ2RDLF8PXOsc6DVoLyv22IVsXXEyYpzwBxiEqId0Xv1lyKzos4hG-NeU55kFW5ivXF_2GtZjs81THCIfVsfsGWJ6nCyxPgxays05axMLC5BQ6tBOQF7mwzUSUDGC-lSHRiBP8yxHAPH_IrJ-qgZs"
                    />
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        border: '2px solid white',
                      }}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm2jgaJS3ykFcZ7AMOsGNlMmJgSGe9zAMYYKnN-VQ8h1t3FXc3Sy9mNrMRuYOShR7f-4t3kD6kZAVvm3Os35KwQff2JQf8veS4xefDGaIy4F_pGtmMU2G_B-wrDki0DDwvKGjVkLiPwaewq69NiI1Pe5qD3TGC5LPAjm2YwvmPXpH-AbgjC0n0CTpSEe8XhH-GrC5NaOwRL9EocCLqunHPsw0yOpOn5HQsVK0Jz5p7FuH0hTJHav_jsW6yb-5eyVtPUdxeLpzRwkE"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Trusted by +10,000+ creators
                  </Typography>
                </Stack>
              </Stack>

              {/* Animated Productivity Editor */}
              <Box sx={{ width: '100%', pt: 2 }}>
                <AnimatedHeroEditor />
              </Box>
            </Stack>
          </Container>
        </HeroSection>

        {/* --- FEATURES GRID --- */}
        <SectionWrapper id="features">
          <Container maxWidth="lg">
            <SectionHeader>
              <Typography variant="h2">The OS for productivity.</Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                Powerful downloads for high-performance teams. Simplify your
                workflow without actual linking of subject.
              </Typography>
            </SectionHeader>

            <FeaturesGrid container spacing={3.5}>
              {features.map((feature, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <FeatureCard>
                    <FeatureIconBox>{feature.icon}</FeatureIconBox>
                    <FeatureTitle variant="h3">{feature.title}</FeatureTitle>
                    <FeatureDescription variant="body2">
                      {feature.description}
                    </FeatureDescription>
                    <FeatureMockupMini>{feature.mock}</FeatureMockupMini>
                  </FeatureCard>
                </Grid>
              ))}
            </FeaturesGrid>
          </Container>
        </SectionWrapper>

        {/* --- AI PARTNER SECTION (BLACK DARK BANNER) --- */}
        <AISectionWrapper>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: '#FFFFFF',
                      textAlign: 'left',
                      lineHeight: 1.1,
                    }}
                  >
                    Meet your AI productivity partner.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#A1A1AA',
                      fontSize: '1.0625rem',
                      lineHeight: 1.6,
                    }}
                  >
                    Focusly AI acts as a smart, co-pilot engine that understands
                    your projects, analyzes your energy, and schedules your day.
                  </Typography>
                  <Button
                    variant="contained"
                    component={NavLink}
                    to="/login"
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      borderRadius: '9999px',
                      textTransform: 'none',
                      fontWeight: 600,
                      alignSelf: 'flex-start',
                      px: 3.5,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: '#E4E4E7',
                      },
                    }}
                  >
                    Try Focusly AI
                  </Button>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={4}>
                  {[
                    {
                      title: 'Create tasks from thin air',
                      desc: 'Describe a goal, and we will structure the task list, priorities, and deadlines.',
                      icon: '⚡',
                    },
                    {
                      title: 'Summarize everything',
                      desc: 'Sync transcripts or documents, and get key action items.',
                      icon: '📝',
                    },
                    {
                      title: 'Automate workflows',
                      desc: 'Trigger routines based on calendar updates or tasks.',
                      icon: '⚙️',
                    },
                    {
                      title: 'Instant answers',
                      desc: 'Query your entire workspace context instantly.',
                      icon: '💡',
                    },
                  ].map((bullet, idx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                      <AIBulletItem>
                        <AIBulletIcon>{bullet.icon}</AIBulletIcon>
                        <AIBulletTextStack>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 700, color: '#FFFFFF' }}
                          >
                            {bullet.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#A1A1AA', lineHeight: 1.5 }}
                          >
                            {bullet.desc}
                          </Typography>
                        </AIBulletTextStack>
                      </AIBulletItem>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </AISectionWrapper>

        {/* --- HOW IT WORKS (TIMELINE GRID) --- */}
        <SectionWrapper id="how-it-works">
          <Container maxWidth="lg">
            <SectionHeader>
              <Typography variant="h2">Streamlined for success.</Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                Go from chaos to focus in four simple steps.
              </Typography>
            </SectionHeader>

            <Stack
              spacing={8}
              sx={{ position: 'relative', maxWidth: 900, mx: 'auto' }}
            >
              {/* Vertical connector axis line */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TimelineLine />
              </Box>

              {/* Step 1: Workspaces */}
              <TimelineStepWrapper container spacing={4}>
                <Grid
                  size={{ xs: 12, md: 5 }}
                  sx={{ textAlign: { xs: 'left', md: 'right' } }}
                >
                  <Stack spacing={1}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                      }}
                    >
                      Create Workspaces 🗂
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Set up nice, private labs for separate projects, startups,
                      or goals.
                    </Typography>
                  </Stack>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 2 }}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <TimelineDot>1</TimelineDot>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.01)'
                          : 'rgba(0,0,0,0.01)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          letterSpacing: 0.5,
                        }}
                      >
                        NEW WORKSPACE
                      </Typography>
                      <Stack spacing={1}>
                        <Typography
                          sx={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'text.secondary',
                          }}
                        >
                          Workspace Name
                        </Typography>
                        <Box
                          sx={{
                            height: 36,
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.02)'
                                : 'rgba(0,0,0,0.02)',
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: 'text.primary',
                              fontSize: '12px',
                            }}
                          >
                            <TypewriterMock text="My Startup Lab" delay={800} />
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        variant="contained"
                        disabled
                        size="small"
                        sx={{
                          alignSelf: 'flex-end',
                          bgcolor: '#7C3AED !important',
                          color: '#FFF !important',
                          fontSize: '10px',
                          fontWeight: 700,
                          px: 2.5,
                          py: 0.6,
                          borderRadius: '6px',
                          textTransform: 'none',
                          opacity: '0.85 !important',
                        }}
                      >
                        Create Workspace
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              </TimelineStepWrapper>

              {/* Step 2: Create Tasks */}
              <TimelineStepWrapper container spacing={4}>
                <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: 1 } }}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.01)'
                          : 'rgba(0,0,0,0.01)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          letterSpacing: 0.5,
                        }}
                      >
                        TASKS LIST
                      </Typography>
                      <Stack spacing={1.5}>
                        {/* Completed Task */}
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            pb: 1,
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <CheckCircleIcon
                              sx={{ fontSize: 16, color: 'success.main' }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: 'line-through',
                                opacity: 0.5,
                                fontWeight: 500,
                              }}
                            >
                              Gym at 7 AM
                            </Typography>
                          </Stack>
                          <Box
                            sx={{
                              px: 1,
                              py: 0.2,
                              borderRadius: 1,
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                              bgcolor: 'rgba(249, 115, 22, 0.05)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <FlagIcon
                              sx={{ fontSize: 10, color: '#f97316', mr: 0.5 }}
                            />
                            <Typography
                              sx={{
                                fontSize: '9px',
                                fontWeight: 700,
                                color: '#f97316',
                              }}
                            >
                              HIGH
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Uncompleted Task with AI Badge */}
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            pb: 1,
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <RadioButtonUncheckedIcon
                              sx={{ fontSize: 16, color: 'text.disabled' }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              Finish GraphQL API
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-flex',
                                  px: 1,
                                  py: 0.2,
                                  bgcolor: 'rgba(124, 58, 237, 0.1)',
                                  border: '1px solid rgba(124, 58, 237, 0.2)',
                                  borderRadius: '4px',
                                  fontSize: '8px',
                                  color: '#a78bfa',
                                  fontWeight: 800,
                                }}
                              >
                                AI
                              </Box>
                            </Typography>
                          </Stack>
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
                            <FlagIcon
                              sx={{ fontSize: 10, color: '#eab308', mr: 0.5 }}
                            />
                            <Typography
                              sx={{
                                fontSize: '9px',
                                fontWeight: 700,
                                color: '#eab308',
                              }}
                            >
                              MEDIUM
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Input Row mockup with typewriter */}
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <AddIcon
                            sx={{
                              fontSize: 16,
                              color: 'primary.main',
                              opacity: 0.8,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: 'text.primary',
                              fontSize: '12px',
                            }}
                          >
                            <TypewriterMock
                              text="Record demo video"
                              delay={1500}
                            />
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 2 }}
                  sx={{ display: 'flex', justifyContent: 'center', order: 2 }}
                >
                  <TimelineDot>2</TimelineDot>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 3 } }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      Create Tasks 📝
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Break down your goals into structured checklists, assign
                      priorities, and link items directly to workspaces.
                    </Typography>
                  </Stack>
                </Grid>
              </TimelineStepWrapper>

              {/* Step 3: Focus Time */}
              <TimelineStepWrapper container spacing={4}>
                <Grid
                  size={{ xs: 12, md: 5 }}
                  sx={{ textAlign: { xs: 'left', md: 'right' } }}
                >
                  <Stack spacing={1}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                      }}
                    >
                      Focus Time ⚡
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start high-focus sprints with custom timers and beautiful
                      visual progress cards to stay in the zone.
                    </Typography>
                  </Stack>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 2 }}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <TimelineDot>3</TimelineDot>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.01)'
                          : 'rgba(0,0,0,0.01)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Stack spacing={2} alignItems="center">
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          letterSpacing: 0.5,
                          alignSelf: 'flex-start',
                        }}
                      >
                        FOCUS TIMER
                      </Typography>

                      {/* Timer cards row styled like FocusTimerDisplay */}
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="center"
                      >
                        {/* Minutes */}
                        <Box
                          sx={{
                            width: 80,
                            height: 90,
                            borderRadius: '16px',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.02)'
                                : 'rgba(0,0,0,0.02)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            '&::after': {
                              content: '"MINUTES"',
                              position: 'absolute',
                              bottom: 6,
                              fontSize: '6px',
                              fontWeight: 700,
                              letterSpacing: 0.5,
                              color: 'text.secondary',
                            },
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '2rem',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            25
                          </Typography>
                        </Box>

                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 'bold', opacity: 0.5, pb: 1 }}
                        >
                          :
                        </Typography>

                        {/* Seconds */}
                        <Box
                          sx={{
                            width: 80,
                            height: 90,
                            borderRadius: '16px',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.02)'
                                : 'rgba(0,0,0,0.02)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            '&::after': {
                              content: '"SECONDS"',
                              position: 'absolute',
                              bottom: 6,
                              fontSize: '6px',
                              fontWeight: 700,
                              letterSpacing: 0.5,
                              color: 'text.secondary',
                            },
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '2rem',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            00
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Session Progress bar row */}
                      <Stack spacing={0.5} sx={{ width: '100%', pt: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 600,
                              fontSize: '9px',
                            }}
                          >
                            Session Progress
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 600,
                              fontSize: '9px',
                            }}
                          >
                            60%
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            height: 5,
                            width: '100%',
                            bgcolor: 'action.hover',
                            borderRadius: 2.5,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: '60%',
                              bgcolor: '#3b82f6',
                              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                              borderRadius: 2.5,
                            }}
                          />
                        </Box>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              </TimelineStepWrapper>

              {/* Step 4: Create Projects */}
              <TimelineStepWrapper container spacing={4}>
                <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: 1 } }}>
                  <AnimatedProjectMockup />
                </Grid>
                <Grid
                  size={{ xs: 12, md: 2 }}
                  sx={{ display: 'flex', justifyContent: 'center', order: 2 }}
                >
                  <TimelineDot>4</TimelineDot>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 3 } }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      Create Projects 📁
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Milestone boards track all of the fundamental elements.
                    </Typography>
                  </Stack>
                </Grid>
              </TimelineStepWrapper>
            </Stack>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                Plus much more: Focus status 🟢, Smart Analytics 📈, Reminders
                🔔
              </Typography>
            </Box>
          </Container>
        </SectionWrapper>

        {/* --- PRICING PLANS --- */}
        <SectionWrapper id="pricing">
          <Container maxWidth="lg">
            <SectionHeader>
              <Typography variant="h2">Plans for every scale.</Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                Start free, upgrade as you grow.
              </Typography>
            </SectionHeader>

            <PricingGrid container spacing={4} alignItems="stretch">
              {/* Free */}
              <Grid size={{ xs: 12, md: 4 }}>
                <PricingCard>
                  <Stack spacing={0.5}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      Free
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Perfect for individuals.
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      textAlign: 'left',
                    }}
                  >
                    $0
                  </Typography>
                  <Button
                    variant="outlined"
                    component={NavLink}
                    to="/login"
                    fullWidth
                    sx={{
                      py: 1.25,
                      borderRadius: '9999px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Get Started
                  </Button>
                  <Stack spacing={2} pt={1.5}>
                    {[
                      '1 User Workspace',
                      'Unlimited Tasks',
                      'Basic Calendar',
                    ].map((feat, idx) => (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        key={idx}
                      >
                        <CheckCircleIcon
                          sx={{ color: 'primary.main', fontSize: 16 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {feat}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </PricingCard>
              </Grid>

              {/* Pro */}
              <Grid size={{ xs: 12, md: 4 }}>
                <PricingCard featured>
                  <PricingCardBadge>START FREE TRIAL</PricingCardBadge>
                  <Stack spacing={0.5}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      Pro
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      For power users and professionals.
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      textAlign: 'left',
                    }}
                  >
                    $12
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: '#A1A1AA',
                        fontWeight: 400,
                      }}
                    >
                      {' '}
                      / mo
                    </span>
                  </Typography>
                  <Button
                    variant="contained"
                    component={NavLink}
                    to="/login"
                    fullWidth
                    sx={{
                      py: 1.25,
                      borderRadius: '9999px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Go Pro
                  </Button>
                  <Stack spacing={2} pt={1.5}>
                    {[
                      'Unlimited Workspaces',
                      'AI Assistant (500 runs)',
                      'Advanced Analytics',
                      'Google Calendar Integration',
                    ].map((feat, idx) => (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        key={idx}
                      >
                        <CheckCircleIcon
                          sx={{ color: 'primary.main', fontSize: 16 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {feat}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </PricingCard>
              </Grid>

              {/* Enterprise */}
              <Grid size={{ xs: 12, md: 4 }}>
                <PricingCard>
                  <Stack spacing={0.5}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      Enterprise
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      For ultimate productivity.
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      textAlign: 'left',
                    }}
                  >
                    $20
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: '#A1A1AA',
                        fontWeight: 400,
                      }}
                    >
                      {' '}
                      / mo
                    </span>
                  </Typography>
                  <Button
                    variant="outlined"
                    component={NavLink}
                    to="/login"
                    fullWidth
                    sx={{
                      py: 1.25,
                      borderRadius: '9999px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Go Enterprise
                  </Button>
                  <Stack spacing={2} pt={1.5}>
                    {[
                      'Unlimited Lumina AI Runs',
                      'Priority AI Queue Processing',
                      'Advanced Insights & Audits',
                      'Export Workspaces (PDF/Markdown)',
                      'Priority Support & Beta Access',
                      'SLA & Security Protocols',
                    ].map((feat, idx) => (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        key={idx}
                      >
                        <CheckCircleIcon
                          sx={{ color: 'primary.main', fontSize: 16 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {feat}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </PricingCard>
              </Grid>
            </PricingGrid>
          </Container>
        </SectionWrapper>

        {/* --- TESTIMONIALS SECTION --- */}
        <SectionWrapper bgColor="rgba(255, 255, 255, 0.01)">
          <Container maxWidth="lg">
            <SectionHeader>
              <Typography variant="h2">Trusted by the best.</Typography>
            </SectionHeader>

            <Grid container spacing={4}>
              {[
                {
                  name: 'Sarah Jenkins',
                  role: 'Product Lead, Stripe',
                  quote:
                    'Focusly changed how our design team works. The timing blocks reduce project delays by almost 40%.',
                  avatar: 'S',
                },
                {
                  name: 'Alex Rivera',
                  role: 'CTO, Linear',
                  quote:
                    'The calendar sync is flawless. The AI integration works like magic for organizing my daily schedule.',
                  avatar: 'A',
                },
                {
                  name: 'Marcus Chen',
                  role: 'Founder & CEO, Raycast',
                  quote:
                    'The workspace separation is exactly what I needed. Minimalist, premium, and extremely fast.',
                  avatar: 'M',
                },
              ].map((test, idx) => (
                <Grid size={{ xs: 12, md: 4 }} key={idx}>
                  <TestimonialCard>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ color: '#60A5FA' }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: 16 }} />
                      ))}
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: 'italic', lineHeight: 1.6 }}
                    >
                      "{test.quote}"
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      pt={1}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'primary.main',
                          color: 'background.default',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                        }}
                      >
                        {test.avatar}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, display: 'block' }}
                        >
                          {test.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {test.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </TestimonialCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </SectionWrapper>

        {/* --- FAQ SECTION --- */}
        <SectionWrapper>
          <Container maxWidth="md">
            <SectionHeader>
              <Typography variant="h2">Common Questions</Typography>
            </SectionHeader>

            <Box>
              {[
                {
                  q: 'How does the Google Calendar integration work?',
                  a: 'Focusly integrates with Google Calendar to sync all of your meetings and blocks instantly, preventing any double booking.',
                },
                {
                  q: 'Is my data secure?',
                  a: 'Yes, we encrypt all of your workspace data in transit and at rest, and respect your privacy.',
                },
                {
                  q: 'Can I use Focusly for free?',
                  a: 'Absolutely, our Free plan includes all core task management and calendar utilities.',
                },
              ].map((faq, idx) => {
                const panelId = `panel-${idx}`;
                return (
                  <FaqAccordion
                    key={idx}
                    expanded={expandedFaq === panelId}
                    onChange={handleFaqChange(panelId)}
                  >
                    <FaqSummary
                      expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {faq.q}
                      </Typography>
                    </FaqSummary>
                    <FaqDetails>
                      <Typography variant="body2">{faq.a}</Typography>
                    </FaqDetails>
                  </FaqAccordion>
                );
              })}
            </Box>
          </Container>
        </SectionWrapper>
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
                Product
              </Typography>
              <Stack spacing={1.25}>
                <FooterLink href="#features">Features</FooterLink>
                <FooterLink href="#pricing">Pricing</FooterLink>
                <FooterLink href="#">Blog</FooterLink>
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
                <FooterLink href="#about-us">About Us</FooterLink>
                <FooterLink href="#">Careers</FooterLink>
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
                <FooterLink href="#">Terms</FooterLink>
                <FooterLink href="#">Privacy</FooterLink>
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

export default LandingPage;
