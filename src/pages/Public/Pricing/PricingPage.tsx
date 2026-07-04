import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import {
  CheckCircleRounded as CheckCircleIcon,
  HighlightOffOutlined as CancelIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import Navbar from '@/components/layout/Navbar';
import { NavLink } from 'react-router-dom';
import {
  Footer,
  FooterText,
  PageWrapper,
  MainContent,
} from '@/pages/Public/LandingPage/LandingPage.styles';
import {
  PricingSection,
  SectionHeader,
  PricingTitle,
  PricingCard,
  CardBadge,
  PricingButton,
  CompareSection,
  CompareTableContainer,
  CompareHeaderCell,
  CompareCell,
} from './PricingPage.styles';

const PricingPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  const handleFaqChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedFaq(isExpanded ? panel : false);
    };

  return (
    <PageWrapper>
      <Navbar />

      <MainContent>
        <PricingSection>
          <Container maxWidth="lg">
            <SectionHeader>
              <PricingTitle variant="h1">
                Simple, Transparent Pricing.
              </PricingTitle>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  maxWidth: 640,
                  mx: 'auto',
                }}
              >
                Choose the plan that fits your pace. No hidden fees, no complex
                tiers. Just high-performance productivity tools for everyone.
              </Typography>
            </SectionHeader>

            {/* Plans Cards */}
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="stretch"
              sx={{ maxWidth: 1000, mx: 'auto' }}
            >
              {/* Free */}
              <Grid size={{ xs: 12, md: 4 }}>
                <PricingCard>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, fontSize: '1.5rem' }}
                    >
                      Free
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: '2.5rem', fontWeight: 800 }}
                    >
                      $0
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: '#A1A1AA',
                          fontWeight: 400,
                        }}
                      >
                        {' '}
                        / forever
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Essentials for focused individuals getting started.
                    </Typography>
                  </Stack>

                  <Stack spacing={2} sx={{ flexGrow: 1, pt: 2 }}>
                    {[
                      { name: '3 Active Projects', include: true },
                      { name: 'Daily Focus Timer', include: true },
                      { name: 'Web App Access', include: true },
                      { name: 'Advanced Analytics', include: false },
                    ].map((feat, idx) => (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        key={idx}
                      >
                        {feat.include ? (
                          <CheckCircleIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                        ) : (
                          <CancelIcon
                            sx={{
                              color: 'text.secondary',
                              opacity: 0.4,
                              fontSize: 18,
                            }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          color={
                            feat.include ? 'text.primary' : 'text.secondary'
                          }
                          sx={{ opacity: feat.include ? 1 : 0.6 }}
                        >
                          {feat.name}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <PricingButton
                    variant="outlined"
                    component={NavLink}
                    to="/login"
                  >
                    Get Started
                  </PricingButton>
                </PricingCard>
              </Grid>

              {/* Pro */}
              <Grid size={{ xs: 12, md: 4 }}>
                <PricingCard featured>
                  <CardBadge>MOST POPULAR</CardBadge>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, fontSize: '1.5rem' }}
                    >
                      Pro
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: '2.5rem', fontWeight: 800 }}
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
                        / month
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Power tools for professionals who value their time.
                    </Typography>
                  </Stack>

                  <Stack spacing={2} sx={{ flexGrow: 1, pt: 2 }}>
                    {[
                      { name: 'Unlimited Projects', include: true },
                      { name: 'Desktop & Mobile App', include: true },
                      { name: 'Advanced Analytics Dashboard', include: true },
                      { name: 'Custom Focus Sounds', include: true },
                      { name: 'Calendar Integrations', include: true },
                    ].map((feat, idx) => (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        key={idx}
                      >
                        <CheckCircleIcon
                          sx={{ color: 'primary.main', fontSize: 18 }}
                        />
                        <Typography variant="body2">{feat.name}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <PricingButton
                    variant="contained"
                    component={NavLink}
                    to="/login"
                  >
                    Upgrade to Pro
                  </PricingButton>
                </PricingCard>
              </Grid>

              {/* Enterprise */}
              <Grid size={{ xs: 12, md: 4 }}>
                <PricingCard>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, fontSize: '1.5rem' }}
                    >
                      Enterprise
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: '2.5rem', fontWeight: 800 }}
                    >
                      $39
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: '#A1A1AA',
                          fontWeight: 400,
                        }}
                      >
                        {' '}
                        / month
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Scalable solutions for teams and organizations.
                    </Typography>
                  </Stack>

                  <Stack spacing={2} sx={{ flexGrow: 1, pt: 2 }}>
                    {[
                      { name: 'Everything in Pro', include: true },
                      { name: 'Team Collaboration Tools', include: true },
                      { name: 'Admin Controls & SSO', include: true },
                      { name: 'Dedicated Success Manager', include: true },
                    ].map((feat, idx) => (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        key={idx}
                      >
                        <CheckCircleIcon
                          sx={{ color: 'primary.main', fontSize: 18 }}
                        />
                        <Typography variant="body2">{feat.name}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <PricingButton
                    variant="outlined"
                    component={NavLink}
                    to="/login"
                  >
                    Contact Sales
                  </PricingButton>
                </PricingCard>
              </Grid>
            </Grid>

            {/* Compare features section */}
            <CompareSection>
              <Typography
                variant="h2"
                sx={{
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '2rem',
                  mb: 1,
                }}
              >
                Compare features
              </Typography>
              <CompareTableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <CompareHeaderCell>Feature</CompareHeaderCell>
                      <CompareHeaderCell>Free</CompareHeaderCell>
                      <CompareHeaderCell sx={{ color: 'primary.main' }}>
                        Pro
                      </CompareHeaderCell>
                      <CompareHeaderCell>Enterprise</CompareHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        name: 'Daily Focus Hours',
                        free: '2 Hours',
                        pro: 'Unlimited',
                        ent: 'Unlimited',
                      },
                      {
                        name: 'Cross-platform Sync',
                        free: '—',
                        pro: (
                          <CheckCircleIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                        ),
                        ent: (
                          <CheckCircleIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                        ),
                      },
                      {
                        name: 'AI Smart Scheduling',
                        free: '—',
                        pro: (
                          <CheckCircleIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                        ),
                        ent: (
                          <CheckCircleIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                        ),
                      },
                      {
                        name: 'Custom Dashboards',
                        free: '1',
                        pro: 'Unlimited',
                        ent: 'Unlimited',
                      },
                      {
                        name: 'Data Export (CSV/JSON)',
                        free: '—',
                        pro: (
                          <CheckCircleIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                        ),
                        ent: (
                          <CheckCircleIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                        ),
                      },
                      {
                        name: 'Team Reporting',
                        free: '—',
                        pro: '—',
                        ent: (
                          <CheckCircleIcon
                            sx={{ color: 'primary.main', fontSize: 18 }}
                          />
                        ),
                      },
                      {
                        name: 'SLA Support',
                        free: '—',
                        pro: '—',
                        ent: '24/7 Priority',
                      },
                    ].map((row, idx) => (
                      <TableRow key={idx}>
                        <CompareCell sx={{ fontWeight: 600 }}>
                          {row.name}
                        </CompareCell>
                        <CompareCell color="text.secondary">
                          {row.free}
                        </CompareCell>
                        <CompareCell
                          sx={{
                            color: 'primary.main',
                            fontWeight: typeof row.pro === 'string' ? 600 : 400,
                          }}
                        >
                          {row.pro}
                        </CompareCell>
                        <CompareCell
                          sx={{
                            fontWeight: typeof row.ent === 'string' ? 600 : 400,
                          }}
                        >
                          {row.ent}
                        </CompareCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CompareTableContainer>
            </CompareSection>

            {/* Frequently Asked Questions */}
            <Box sx={{ mt: 12 }}>
              <Typography
                variant="h2"
                sx={{
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '2rem',
                  mb: 6,
                }}
              >
                Frequently Asked Questions
              </Typography>
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                {[
                  {
                    q: 'Can I change plans at any time?',
                    a: 'Yes, you can upgrade, downgrade, or cancel your plan at any time from your settings panel.',
                  },
                  {
                    q: 'Do you offer discounts for educational use?',
                    a: 'Yes! We offer a 50% discount for students, educators, and non-profit organizations. Reach out to our support team.',
                  },
                  {
                    q: 'What forms of payment do you accept?',
                    a: 'We accept all major credit cards, Apple Pay, Google Pay, and PayPal.',
                  },
                  {
                    q: 'Is my data secure with Focusly?',
                    a: 'Data security is our top priority. We use industry-standard encryption for data in transit and at rest.',
                  },
                ].map((faq, idx) => {
                  const panelId = `panel-${idx}`;
                  return (
                    <Accordion
                      key={idx}
                      expanded={expandedFaq === panelId}
                      onChange={handleFaqChange(panelId)}
                      sx={{
                        backgroundColor: 'background.paper',
                        backgroundImage: 'none',
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px !important',
                        mb: '12px !important',
                        '&::before': { display: 'none' },
                        '&.Mui-expanded': {
                          borderColor: 'text.primary',
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                        sx={{ padding: '12px 24px' }}
                      >
                        <Typography
                          sx={{ fontWeight: 600, fontSize: '0.9375rem' }}
                        >
                          {faq.q}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          padding: '0 24px 20px 24px',
                          color: 'text.secondary',
                          fontSize: '0.9375rem',
                          lineHeight: 1.6,
                        }}
                      >
                        <Typography>{faq.a}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </Box>
          </Container>
        </PricingSection>
      </MainContent>

      <Footer>
        <FooterText variant="body2">
          © 2024 Focusly. Built for high-performance productivity.
        </FooterText>
      </Footer>
    </PageWrapper>
  );
};

export default PricingPage;
