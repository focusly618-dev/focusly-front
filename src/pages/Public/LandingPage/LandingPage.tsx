import React, { useState } from 'react';
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
} from '@mui/icons-material';
import Navbar from '@/components/layout/Navbar';

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
  MonitorContainer,
  MonitorScreen,
  MonitorStand,
  MonitorBase,
  MockupSidebar,
  MockupSidebarItem,
  MockupSidebarIndicator,
  MockupSidebarText,
  MockupMain,
  MockupHeader,
  MockupTitle,
  MockupGrid,
  MockupCard,
  MockupTextLine,
  MockupTaskItem,
  MockupCheckbox,
  MockupCalendarEvent,
  FloatingEmoji,
  FeaturesGrid,
  FeatureCard,
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
            <Grid container spacing={8} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3.5}>
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
                      startIcon={
                        <PlayCircleOutlineIcon sx={{ fontSize: 20 }} />
                      }
                    >
                      Watch Demo
                    </HeroSecondaryButton>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    pt={2}
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
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MonitorContainer>
                  {/* Floating Emojis */}
                  <FloatingEmoji top="15%" left="-8%" delay={0}>
                    ✨
                  </FloatingEmoji>
                  <FloatingEmoji top="70%" left="-6%" delay={1.5}>
                    🧠
                  </FloatingEmoji>
                  <FloatingEmoji top="85%" left="45%" delay={0.8}>
                    ✅
                  </FloatingEmoji>
                  <FloatingEmoji top="2%" left="82%" delay={2.3}>
                    🚀
                  </FloatingEmoji>
                  <FloatingEmoji top="50%" left="92%" delay={1.1}>
                    📅
                  </FloatingEmoji>
                  <FloatingEmoji top="-8%" left="40%" delay={1.8}>
                    📌
                  </FloatingEmoji>

                  <MonitorScreen>
                    {/* Sidebar */}
                    <MockupSidebar>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        pb={1.5}
                      >
                        <AutoAwesomeIcon
                          sx={{ fontSize: 14, color: '#60A5FA' }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                        >
                          Focusly
                        </Typography>
                      </Stack>
                      <MockupSidebarItem active>
                        <MockupSidebarIndicator color="#60A5FA" />
                        <MockupSidebarText />
                      </MockupSidebarItem>
                      <MockupSidebarItem>
                        <MockupSidebarIndicator color="#34D399" />
                        <MockupSidebarText />
                      </MockupSidebarItem>
                      <MockupSidebarItem>
                        <MockupSidebarIndicator color="#F59E0B" />
                        <MockupSidebarText />
                      </MockupSidebarItem>
                    </MockupSidebar>

                    {/* Main area */}
                    <MockupMain>
                      <MockupHeader>
                        <MockupTitle />
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: '#60A5FA',
                            opacity: 0.15,
                          }}
                        />
                      </MockupHeader>

                      <MockupGrid container spacing={2}>
                        {/* Tasks widget */}
                        <Grid size={{ xs: 7 }}>
                          <MockupCard>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                opacity: 0.6,
                              }}
                            >
                              My Tasks
                            </Typography>
                            <Stack spacing={1}>
                              <MockupTaskItem>
                                <CheckCircleIcon
                                  sx={{ fontSize: 12, color: '#16A34A' }}
                                />
                                <MockupTextLine width={60} />
                              </MockupTaskItem>
                              <MockupTaskItem>
                                <MockupCheckbox />
                                <MockupTextLine width={80} />
                              </MockupTaskItem>
                              <MockupTaskItem>
                                <MockupCheckbox />
                                <MockupTextLine width={50} />
                              </MockupTaskItem>
                            </Stack>
                          </MockupCard>
                        </Grid>

                        {/* Session timer widget */}
                        <Grid size={{ xs: 5 }}>
                          <MockupCard sx={{ justifyContent: 'space-between' }}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                opacity: 0.6,
                              }}
                            >
                              Timer
                            </Typography>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 800,
                                fontSize: '1.5rem',
                                color: '#60A5FA',
                                alignSelf: 'center',
                              }}
                            >
                              25:00
                            </Typography>
                            <Box
                              sx={{
                                height: 4,
                                width: '100%',
                                borderRadius: 2,
                                backgroundColor: 'rgba(96,165,250,0.1)',
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  width: '70%',
                                  borderRadius: 2,
                                  backgroundColor: '#60A5FA',
                                }}
                              />
                            </Box>
                          </MockupCard>
                        </Grid>

                        {/* AI suggest widget */}
                        <Grid size={{ xs: 12 }}>
                          <MockupCard
                            sx={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 1.5,
                              border: '1px solid rgba(96, 165, 250, 0.15)',
                              backgroundColor: 'rgba(96, 165, 250, 0.03)',
                            }}
                          >
                            <AutoAwesomeIcon
                              sx={{ color: '#60A5FA', fontSize: 16 }}
                            />
                            <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                              <MockupTextLine width={75} />
                              <MockupTextLine width={45} />
                            </Stack>
                          </MockupCard>
                        </Grid>
                      </MockupGrid>
                    </MockupMain>
                  </MonitorScreen>
                  <MonitorStand />
                  <MonitorBase />
                </MonitorContainer>
              </Grid>
            </Grid>
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
                Go from chaos to focus in six simple steps.
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

              {/* Step 1 */}
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
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack spacing={1}>
                      <MockupTextLine width={60} />
                      <Box
                        sx={{
                          height: 35,
                          borderRadius: 6,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'rgba(0,0,0,0.02)',
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                        }}
                      >
                        <MockupTextLine width={30} />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </TimelineStepWrapper>

              {/* Step 2 */}
              <TimelineStepWrapper container spacing={4}>
                <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: 1 } }}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>
                        U
                      </Avatar>
                      <MockupTextLine width={50} />
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
                      Invite Team 👥
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bring coworkers and clients together in seconds.
                    </Typography>
                  </Stack>
                </Grid>
              </TimelineStepWrapper>

              {/* Step 3 */}
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
                      Create Projects 📁
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Milestone boards track all of the fundamental elements.
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
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack spacing={1}>
                      <MockupTextLine width={40} />
                      <Box
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#60A5FA',
                          width: '60%',
                        }}
                      />
                    </Stack>
                  </Paper>
                </Grid>
              </TimelineStepWrapper>
            </Stack>

            <Box sx={{ textAlign: 'center', mt: 8 }}>
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
                      More for team leaders.
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
                      'Team Sync',
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
                      For custom deployments.
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
                    Custom
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
                    Contact Sales
                  </Button>
                  <Stack spacing={2} pt={1.5}>
                    {[
                      'Dedicated Support',
                      'Custom AI Training',
                      'SLA & SSO',
                      'Team Roles',
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
