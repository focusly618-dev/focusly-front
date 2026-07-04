import React from 'react';
import {
  Container,
  Stack,
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Paper,
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
} from '@mui/icons-material';
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
  DesktopMonitorFrame,
  DesktopMonitorScreen,
  DesktopMonitorStand,
  DesktopMonitorBase,
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
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <DesktopMonitorFrame>
                      <DesktopMonitorScreen>
                        <Stack direction="row" sx={{ height: '100%' }}>
                          {/* Sidebar */}
                          <Box
                            sx={{
                              width: 80,
                              borderRight: '1px solid',
                              borderColor: 'divider',
                              bgcolor: 'rgba(0,0,0,0.01)',
                              p: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 45,
                                height: 8,
                                bgcolor: 'text.secondary',
                                opacity: 0.2,
                                borderRadius: 2,
                              }}
                            />
                            <Box
                              sx={{
                                width: 35,
                                height: 6,
                                bgcolor: 'text.secondary',
                                opacity: 0.1,
                                borderRadius: 2,
                              }}
                            />
                            <Box
                              sx={{
                                width: 40,
                                height: 6,
                                bgcolor: 'text.secondary',
                                opacity: 0.1,
                                borderRadius: 2,
                              }}
                            />
                          </Box>
                          {/* Grid Content */}
                          <Box
                            sx={{
                              flexGrow: 1,
                              p: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 100,
                                height: 10,
                                bgcolor: 'text.primary',
                                opacity: 0.7,
                                borderRadius: 2,
                              }}
                            />
                            <Grid container spacing={1}>
                              {[
                                {
                                  title: 'Focus Task Management',
                                  col: '#60A5FA',
                                },
                                { title: 'Personal Calendar', col: '#34D399' },
                                {
                                  title: 'Deep Work Reminders',
                                  col: '#F59E0B',
                                },
                                {
                                  title: 'Unified Documentation',
                                  col: '#EF4444',
                                },
                              ].map((item, idx) => (
                                <Grid size={{ xs: 6 }} key={idx}>
                                  <Paper
                                    sx={{
                                      p: 1,
                                      border: '1px solid',
                                      borderColor: 'divider',
                                      borderRadius: '6px',
                                      bgcolor: 'background.paper',
                                      boxShadow: 'none',
                                    }}
                                  >
                                    <Stack spacing={1}>
                                      <Box
                                        sx={{
                                          width: 8,
                                          height: 8,
                                          borderRadius: '50%',
                                          bgcolor: item.col,
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          height: 4,
                                          bgcolor: 'text.secondary',
                                          opacity: 0.15,
                                          borderRadius: 1,
                                          width: '80%',
                                        }}
                                      />
                                    </Stack>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Stack>
                      </DesktopMonitorScreen>
                      <DesktopMonitorStand />
                      <DesktopMonitorBase />
                    </DesktopMonitorFrame>
                  </Box>
                </FeatureBlockCard>
              </Grid>

              {/* Atomic Tasks */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FeatureBlockCard dark>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          bgcolor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          display: 'inline-flex',
                        }}
                      >
                        <CheckBoxIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.375rem',
                          color: '#FFFFFF',
                        }}
                      >
                        Atomic Tasks
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ color: '#A1A1AA', lineHeight: 1.6 }}
                    >
                      Break down massive projects into actionable items. Use
                      natural language processing to set due dates and
                      priorities instantly.
                    </Typography>
                  </Stack>

                  {/* Checklist Mockup */}
                  <Stack
                    spacing={1.5}
                    sx={{
                      mt: 'auto',
                      p: 1.5,
                      borderRadius: '12px',
                      border: '1px solid #27272A',
                      bgcolor: '#111112',
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ borderBottom: '1px solid #27272A', pb: 1 }}
                    >
                      <Box
                        sx={{
                          height: 6,
                          bgcolor: 'rgba(255,255,255,0.3)',
                          width: 80,
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 12,
                          width: 12,
                          borderRadius: '50%',
                          border: '1.5px solid rgba(255,255,255,0.3)',
                        }}
                      />
                    </Stack>
                    <Stack spacing={1}>
                      {/* Item 1 */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          border: '1px solid #27272A',
                          bgcolor: '#0A0A0B',
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <CheckCircleIcon
                            sx={{ fontSize: 14, color: '#16A34A' }}
                          />
                          <Box
                            sx={{
                              height: 6,
                              bgcolor: 'rgba(255,255,255,0.3)',
                              width: 120,
                              borderRadius: 1,
                            }}
                          />
                        </Stack>
                        <Button
                          size="small"
                          variant="text"
                          sx={{
                            textTransform: 'none',
                            color: '#60A5FA',
                            fontSize: '0.65rem',
                            minWidth: 0,
                            p: 0,
                          }}
                        >
                          Done
                        </Button>
                      </Stack>
                      {/* Item 2 */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          border: '1px solid #27272A',
                          bgcolor: '#0A0A0B',
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              height: 12,
                              width: 12,
                              borderRadius: 3,
                              border: '1.5px solid rgba(255,255,255,0.3)',
                            }}
                          />
                          <Box
                            sx={{
                              height: 6,
                              bgcolor: 'rgba(255,255,255,0.15)',
                              width: 160,
                              borderRadius: 1,
                            }}
                          />
                        </Stack>
                      </Stack>
                      {/* Item 3 */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          border: '1px solid #27272A',
                          bgcolor: '#0A0A0B',
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              height: 12,
                              width: 12,
                              borderRadius: 3,
                              border: '1.5px solid rgba(255,255,255,0.3)',
                            }}
                          />
                          <Box
                            sx={{
                              height: 6,
                              bgcolor: 'rgba(255,255,255,0.15)',
                              width: 100,
                              borderRadius: 1,
                            }}
                          />
                        </Stack>
                        <Button
                          size="small"
                          variant="text"
                          sx={{
                            textTransform: 'none',
                            color: '#EF4444',
                            fontSize: '0.65rem',
                            minWidth: 0,
                            p: 0,
                          }}
                        >
                          Priority
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
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
                    {/* Mockup Calendar Layout */}
                    <Box
                      sx={{
                        height: '100%',
                        p: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        pb={0.5}
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box
                          sx={{
                            width: 70,
                            height: 10,
                            bgcolor: 'text.primary',
                            opacity: 0.6,
                            borderRadius: 1,
                          }}
                        />
                        <Stack direction="row" spacing={0.5}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'divider',
                            }}
                          />
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'divider',
                            }}
                          />
                        </Stack>
                      </Stack>
                      {/* Grid cells */}
                      <Grid container spacing={0.5} sx={{ flexGrow: 1 }}>
                        {[...Array(15)].map((_, idx) => (
                          <Grid size={{ xs: 2.4 }} key={idx}>
                            <Paper
                              sx={{
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '4px',
                                p: 0.5,
                                bgcolor: 'background.paper',
                                boxShadow: 'none',
                                position: 'relative',
                              }}
                            >
                              {idx === 2 && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    left: 4,
                                    right: 4,
                                    height: 12,
                                    bgcolor: 'rgba(96, 165, 250, 0.15)',
                                    borderLeft: '2px solid #60A5FA',
                                    borderRadius: '2px',
                                  }}
                                />
                              )}
                              {idx === 6 && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    left: 4,
                                    right: 4,
                                    height: 12,
                                    bgcolor: 'rgba(52, 211, 153, 0.15)',
                                    borderLeft: '2px solid #34D399',
                                    borderRadius: '2px',
                                  }}
                                />
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
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
                      sx={{ color: '#A1A1AA', lineHeight: 1.5 }}
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
                      sx={{ color: '#A1A1AA', lineHeight: 1.5 }}
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
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      Real-Time Insights
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#A1A1AA', lineHeight: 1.6 }}
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
                <DesktopMonitorFrame>
                  <DesktopMonitorScreen
                    sx={{
                      height: 260,
                      bgcolor: '#0A0A0B',
                      borderColor: '#27272A',
                    }}
                  >
                    {/* Line chart widget */}
                    <Box
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        height: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'rgba(255,255,255,0.15)',
                          width: 60,
                          borderRadius: 1,
                        }}
                      />
                      {/* Lines vector rendering */}
                      <Box
                        sx={{
                          flexGrow: 1,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <svg
                          viewBox="0 0 100 40"
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                          }}
                        >
                          <path
                            d="M0,35 Q15,10 30,25 T60,5 T90,20 L100,30"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2"
                          />
                          <circle cx="30" cy="25" r="2" fill="#3B82F6" />
                          <circle cx="60" cy="5" r="2" fill="#3B82F6" />
                        </svg>
                      </Box>
                    </Box>
                  </DesktopMonitorScreen>
                  <DesktopMonitorStand />
                  <DesktopMonitorBase />
                </DesktopMonitorFrame>
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
