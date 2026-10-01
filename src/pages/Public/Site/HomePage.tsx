import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, ButtonBase } from '@mui/material';
import { visuallyHiddenSx } from '@/styles/mui';
import { useSiteContent } from './content';
import { FONT_HEADING, FONT_MONO, LUMINA, useSiteTokens } from './tokens';
import { SiteIcon } from './icons';
import { scrollToSection, useBilling } from './hooks';
import { PAGES, SIGNUP_PATH } from './routes';
import { SiteLayout } from './components/SiteLayout';
import { HeroDemo } from './components/HeroDemo';
import { LuminaChatDemo } from './components/LuminaChatDemo';
import { InsightsPreview } from './components/InsightsPreview';
import { BillingToggle, PlanCards } from './components/Pricing';
import { Faq } from './components/Faq';
import { DemoModal } from './components/DemoModal';
import {
  Container,
  Eyebrow,
  IconBadge,
  Lead,
  MediaPlaceholder,
  Reveal,
  SectionHeader,
  SiteLink,
} from './components/ui';
import { h2Sx, headingSx, sectionPad, useButtonSx, useCardSx } from './styles';

/** Placeholder media for each pillar tab, in tab order. */
const PILLAR_MEDIA = [
  'video en bucle · planificador semanal\nMP4/WebM < 2 MB · póster · claro/oscuro',
  'video en bucle · modo enfoque\nMP4/WebM < 2 MB · póster · claro/oscuro',
  'captura · workspace con Markdown\nWebP/AVIF + srcset · claro/oscuro',
  'captura · panel de Insights\nWebP/AVIF + srcset · claro/oscuro',
];

const HomePage: React.FC = () => {
  const t = useSiteTokens();
  const { c } = useSiteContent();
  const buttons = useButtonSx();
  const cardSx = useCardSx();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [demoOpen, setDemoOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [betaEmail, setBetaEmail] = useState('');
  const billing = useBilling();

  // Arriving from another page at "/#section": jump to that section.
  useEffect(() => {
    const id = hash.slice(1);
    if (!id) return;
    const timer = setTimeout(() => scrollToSection(id), 60);
    return () => clearTimeout(timer);
  }, [hash]);

  const sectionBand = {
    bgcolor: t.bg2,
    borderTop: `1px solid ${t.border}`,
    borderBottom: `1px solid ${t.border}`,
  } as const;

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const count = c.pillars.tabs.length;
    const next = (tab + (e.key === 'ArrowRight' ? 1 : count - 1)) % count;
    setTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  return (
    <SiteLayout title={`Focusly · ${c.hero.h1}`}>
      <Box component="main" sx={{ containerType: 'inline-size' }}>
        {/* 01 · Hero */}
        <Box
          component="section"
          id="inicio"
          sx={{
            mt: '-72px',
            p: 'calc(72px + clamp(48px,8cqi,96px)) 20px clamp(56px,8cqi,96px)',
            background: `radial-gradient(ellipse 70% 45% at 50% 0%, ${t.brandSoft}, transparent 75%)`,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              maxWidth: 1160,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box
              component="h1"
              sx={{
                ...headingSx,
                fontSize: 'clamp(38px,6.6cqi,70px)',
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                maxWidth: '15ch',
              }}
            >
              {c.hero.h1}
            </Box>
            <Box
              component="p"
              sx={{
                m: 0,
                mt: '22px',
                maxWidth: '38em',
                fontSize: 'clamp(17px,2cqi,19px)',
                lineHeight: 1.6,
                color: t.muted,
                textWrap: 'pretty',
              }}
            >
              {c.hero.sub}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1.5,
                mt: 4,
              }}
            >
              <SiteLink to={SIGNUP_PATH} sx={buttons.primary}>
                {c.hero.cta}
                <SiteIcon name="arrow_forward" />
              </SiteLink>
              <ButtonBase
                aria-haspopup="dialog"
                onClick={() => setDemoOpen(true)}
                sx={{ ...buttons.secondary, fontFamily: 'inherit' }}
              >
                <SiteIcon
                  name="play_circle"
                  size={22}
                  sx={{ color: t.brandText }}
                />
                {c.hero.demo}
              </ButtonBase>
            </Box>
            <Box
              component="p"
              sx={{ m: 0, mt: 2, fontSize: 14, color: t.muted }}
            >
              {c.hero.micro}
            </Box>

            <HeroDemo />
            <Box
              component="p"
              sx={{
                m: 0,
                mt: 1.5,
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                color: t.muted,
              }}
            >
              [PENDIENTE] sustituir por captura real (claro/oscuro, WebP/AVIF +
              srcset) con esta animación encima
            </Box>
          </Box>
        </Box>

        {/* 02 · Trust */}
        <Box
          component="section"
          aria-label={c.trust.aria}
          sx={{
            borderTop: `1px solid ${t.border}`,
            borderBottom: `1px solid ${t.border}`,
            py: '22px',
            px: 2.5,
          }}
        >
          <Box
            sx={{
              maxWidth: 1160,
              mx: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px 32px',
              fontSize: 15,
              color: t.muted,
            }}
          >
            <Box
              component="span"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
            >
              {c.trust.integrates}
              <Box
                component="span"
                title={c.trust.logoTitle}
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '6px',
                  border: `1px dashed ${t.border}`,
                  background: `repeating-linear-gradient(135deg, ${t.stripe} 0 4px, transparent 4px 8px)`,
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 7,
                  color: t.muted,
                }}
              >
                logo
              </Box>
              <Box component="span" sx={{ color: t.text, fontWeight: 600 }}>
                Google Calendar
              </Box>
            </Box>
            <Box
              component="span"
              aria-hidden
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: t.border,
              }}
            />
            <Box
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: '5px',
                borderRadius: '999px',
                bgcolor: t.brandSoft,
                color: t.brandText,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: t.brand,
                }}
              />
              {c.trust.beta}
            </Box>
          </Box>
        </Box>

        {/* 03 · Problem */}
        <Box component="section" id="problema" sx={{ p: sectionPad() }}>
          <Container>
            <SectionHeader
              eyebrow={c.problem.eyebrow}
              title={c.problem.title}
              lead={c.problem.sub}
              maxWidth={680}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 2.5,
                mt: 6,
              }}
            >
              {c.problem.pains.map((pain, i) => (
                <Reveal
                  key={pain.title}
                  component="article"
                  index={i}
                  sx={cardSx}
                >
                  <IconBadge icon={pain.icon} tone="muted" />
                  <Box
                    component="h3"
                    sx={{
                      ...headingSx,
                      fontSize: 21,
                      lineHeight: 1.25,
                      mt: 2.25,
                      mb: 1,
                    }}
                  >
                    {pain.title}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      color: t.muted,
                      fontSize: 15.5,
                      lineHeight: 1.55,
                    }}
                  >
                    {pain.desc}
                  </Box>
                  <Box sx={{ height: '1px', bgcolor: t.border, my: 2.5 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.25,
                      alignItems: 'flex-start',
                      fontSize: 15.5,
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    <SiteIcon
                      name="check_circle"
                      sx={{ color: t.brandText, mt: '2px' }}
                    />
                    {pain.fix}
                  </Box>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* 04 · Product pillars */}
        <Box
          component="section"
          id="producto"
          sx={{ p: sectionPad(), ...sectionBand }}
        >
          <Container>
            <SectionHeader
              eyebrow={c.pillars.eyebrow}
              title={c.pillars.title}
              maxWidth={680}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4.5 }}>
              <Box
                role="tablist"
                aria-label={c.pillars.tabsAria}
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  p: 0.5,
                  borderRadius: '12px',
                  bgcolor: t.surface2,
                  border: `1px solid ${t.border}`,
                  maxWidth: '100%',
                  overflowX: 'auto',
                }}
              >
                {c.pillars.tabs.map((tb, i) => {
                  const on = tab === i;
                  return (
                    <ButtonBase
                      key={tb.label}
                      role="tab"
                      id={`tab-${i}`}
                      aria-selected={on}
                      aria-controls={`panel-${i}`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setTab(i)}
                      onKeyDown={onTabKey}
                      sx={{
                        height: 42,
                        px: 2,
                        borderRadius: '9px',
                        bgcolor: on ? t.surface : 'transparent',
                        color: on ? t.text : t.muted,
                        boxShadow: on ? t.shadow : 'none',
                        fontFamily: 'inherit',
                        fontSize: 15,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        whiteSpace: 'nowrap',
                        transition: 'background-color 200ms, color 200ms',
                      }}
                    >
                      <SiteIcon name={tb.icon} size={19} />
                      {tb.label}
                    </ButtonBase>
                  );
                })}
              </Box>
            </Box>
            <Box sx={{ display: 'grid', mt: 5 }}>
              {c.pillars.tabs.map((tb, i) => {
                const on = tab === i;
                return (
                  <Box
                    key={tb.label}
                    role="tabpanel"
                    id={`panel-${i}`}
                    aria-labelledby={`tab-${i}`}
                    sx={{
                      gridArea: '1/1',
                      opacity: on ? 1 : 0,
                      visibility: on ? 'visible' : 'hidden',
                      transition: 'opacity 250ms ease-out, visibility 250ms',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 5,
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        flex: '1 1 300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.75,
                      }}
                    >
                      <Box
                        component="h3"
                        sx={{
                          ...headingSx,
                          fontSize: 'clamp(24px,3cqi,30px)',
                          lineHeight: 1.15,
                          letterSpacing: '-0.015em',
                        }}
                      >
                        {tb.title}
                      </Box>
                      <Box
                        component="ul"
                        sx={{
                          listStyle: 'none',
                          m: 0,
                          mt: 1,
                          p: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.75,
                        }}
                      >
                        {tb.bullets.map((b) => (
                          <Box
                            key={b}
                            component="li"
                            sx={{
                              display: 'flex',
                              gap: 1.5,
                              fontSize: 16,
                              lineHeight: 1.5,
                            }}
                          >
                            <SiteIcon
                              name="check"
                              sx={{
                                color: t.brandText,
                                mt: '2px',
                                flexShrink: 0,
                              }}
                            />
                            {b}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <MediaPlaceholder
                      label={PILLAR_MEDIA[i]}
                      sx={{ flex: '1.5 1 420px' }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Container>
        </Box>

        {/* 05 · Lumina */}
        <Box
          component="section"
          id="lumina"
          sx={{ p: sectionPad(120), bgcolor: t.lumBg, color: LUMINA.text }}
        >
          <Box
            sx={{
              maxWidth: 1160,
              mx: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 7,
              alignItems: 'center',
            }}
          >
            <Reveal
              sx={{
                flex: '1 1 380px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Eyebrow color={LUMINA.accent}>{c.lumina.eyebrow}</Eyebrow>
              <Box component="h2" sx={{ ...h2Sx, color: LUMINA.heading }}>
                {c.lumina.title}
              </Box>
              <Lead color={LUMINA.muted}>{c.lumina.sub}</Lead>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '24px 28px',
                  mt: 2.5,
                }}
              >
                {c.lumina.caps.map((cap, i) => (
                  <Reveal
                    key={cap.title}
                    index={i}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        bgcolor: LUMINA.accentSoft,
                        color: LUMINA.accent,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <SiteIcon name={cap.icon} size={21} />
                    </Box>
                    <Box
                      component="h3"
                      sx={{
                        m: 0,
                        mt: 0.5,
                        fontSize: 16.5,
                        fontWeight: 600,
                        color: LUMINA.heading,
                      }}
                    >
                      {cap.title}
                    </Box>
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        fontSize: 14.5,
                        lineHeight: 1.55,
                        color: LUMINA.muted,
                      }}
                    >
                      {cap.desc}
                    </Box>
                  </Reveal>
                ))}
              </Box>
            </Reveal>
            <LuminaChatDemo />
          </Box>
        </Box>

        {/* 06 · How it works */}
        <Box component="section" id="como-funciona" sx={{ p: sectionPad() }}>
          <Container>
            <SectionHeader eyebrow={c.how.eyebrow} title={c.how.title} />
            <Box
              component="ol"
              sx={{
                listStyle: 'none',
                p: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 2.5,
                m: 0,
                mt: 6,
              }}
            >
              {c.how.steps.map((step, i) => (
                <Reveal
                  key={step.title}
                  component="li"
                  index={i}
                  sx={{ ...cardSx, boxShadow: 'none', gap: 1.75 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 600,
                        fontSize: 15,
                        color: t.brandText,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <IconBadge icon={step.icon} />
                  </Box>
                  <Box
                    component="h3"
                    sx={{ ...headingSx, fontSize: 20, lineHeight: 1.25 }}
                  >
                    {step.title}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      color: t.muted,
                      fontSize: 15.5,
                      lineHeight: 1.55,
                    }}
                  >
                    {step.desc}
                  </Box>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* 07 · Insights */}
        <Box
          component="section"
          id="insights"
          sx={{ p: sectionPad(), ...sectionBand }}
        >
          <Box
            sx={{
              maxWidth: 1160,
              mx: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              alignItems: 'center',
            }}
          >
            <Reveal
              sx={{
                flex: '1 1 300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Eyebrow>{c.insights.eyebrow}</Eyebrow>
              <Box component="h2" sx={h2Sx}>
                {c.insights.title}
              </Box>
              <Lead>{c.insights.sub}</Lead>
            </Reveal>
            <InsightsPreview />
          </Box>
        </Box>

        {/* 08 · Who it's for */}
        <Box component="section" id="para-quien" sx={{ p: sectionPad() }}>
          <Container>
            <SectionHeader
              eyebrow={c.whoSection.eyebrow}
              title={c.whoSection.title}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 2.5,
                mt: 6,
              }}
            >
              {(
                ['students', 'freelancers', 'developers', 'creators'] as const
              ).map((slug, i) => (
                <Reveal
                  key={slug}
                  component="article"
                  index={i}
                  sx={{ ...cardSx, boxShadow: 'none', gap: 1.5 }}
                >
                  <IconBadge
                    icon={PAGES[slug].icon}
                    size={44}
                    iconSize={24}
                    radius={12}
                  />
                  <Box
                    component="h3"
                    sx={{ ...headingSx, fontSize: 20, mt: 0.5 }}
                  >
                    {c.items[slug].name}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      color: t.muted,
                      fontSize: 15.5,
                      lineHeight: 1.55,
                    }}
                  >
                    {c.items[slug].desc}
                  </Box>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* 09 · Beta */}
        <Box
          component="section"
          id="beta"
          sx={{ px: 2.5, pb: 'clamp(72px,10cqi,112px)' }}
        >
          <Reveal
            sx={{
              maxWidth: 820,
              mx: 'auto',
              border: `1px solid ${t.border}`,
              borderRadius: '20px',
              bgcolor: t.surface2,
              p: 'clamp(32px,6cqi,56px) 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.75,
              alignItems: 'center',
            }}
          >
            <Box
              component="h2"
              sx={{
                ...headingSx,
                fontSize: 'clamp(26px,3.6cqi,36px)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                maxWidth: '20ch',
              }}
            >
              {c.beta.title}
            </Box>
            <Box
              component="p"
              sx={{
                m: 0,
                color: t.muted,
                fontSize: 16.5,
                maxWidth: '34em',
                textWrap: 'pretty',
              }}
            >
              {c.beta.sub}
            </Box>
            {/* Joining the open beta means creating an account. */}
            <Box
              component="form"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                navigate(
                  `${SIGNUP_PATH}&email=${encodeURIComponent(betaEmail)}`,
                );
              }}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1.25,
                width: '100%',
                mt: 1.25,
              }}
            >
              <Box component="label" htmlFor="beta-email" sx={visuallyHiddenSx}>
                {c.beta.emailLabel}
              </Box>
              <Box
                component="input"
                id="beta-email"
                type="email"
                required
                autoComplete="email"
                placeholder={c.beta.placeholder}
                value={betaEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBetaEmail(e.target.value)
                }
                sx={{
                  height: 48,
                  flex: '1 1 240px',
                  maxWidth: 340,
                  px: 1.75,
                  borderRadius: '10px',
                  border: `1px solid ${t.border}`,
                  bgcolor: t.bg,
                  color: t.text,
                  fontSize: 16,
                  '&::placeholder': { color: t.muted, opacity: 0.8 },
                }}
              />
              <ButtonBase
                type="submit"
                sx={{
                  height: 48,
                  px: 2.5,
                  borderRadius: '10px',
                  bgcolor: t.brand,
                  color: t.onBrand,
                  fontFamily: 'inherit',
                  fontSize: 16,
                  fontWeight: 600,
                  transition: 'filter 200ms ease-out',
                  '&:hover': { filter: 'brightness(1.08)' },
                }}
              >
                {c.beta.submit}
              </ButtonBase>
            </Box>
          </Reveal>
        </Box>

        {/* 10 · Pricing */}
        <Box
          component="section"
          id="precios"
          sx={{ p: sectionPad(), ...sectionBand }}
        >
          <Container>
            <Reveal
              sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Eyebrow>{c.pricing.eyebrow}</Eyebrow>
              <Box component="h2" sx={h2Sx}>
                {c.pricing.title}
              </Box>
              <BillingToggle
                annual={billing.annual}
                onToggle={billing.toggle}
              />
            </Reveal>
            <Box sx={{ mt: 6 }}>
              <PlanCards
                annual={billing.annual}
                fading={billing.fading}
                showFeatures
              />
            </Box>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <SiteLink
                to={PAGES.pricing.path}
                sx={{
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: t.brandText,
                  textDecoration: 'none',
                  '&:hover': { color: t.text },
                }}
              >
                {c.pricing.compareAll}
                <SiteIcon name="arrow_forward" size={18} />
              </SiteLink>
            </Box>
          </Container>
        </Box>

        {/* 11 · Security */}
        <Box component="section" id="seguridad" sx={{ p: sectionPad() }}>
          <Box
            sx={{
              maxWidth: 1160,
              mx: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              alignItems: 'flex-start',
            }}
          >
            <Reveal
              sx={{
                flex: '1 1 300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Eyebrow>{c.security.eyebrow}</Eyebrow>
              <Box component="h2" sx={h2Sx}>
                {c.security.title}
              </Box>
              <Box sx={{ display: 'flex', gap: 2.5, fontWeight: 600, mt: 0.5 }}>
                {(
                  [
                    ['/terms', c.security.terms],
                    ['/privacy', c.security.privacy],
                  ] as const
                ).map(([href, label]) => (
                  <SiteLink
                    key={href}
                    to={href}
                    sx={{
                      color: t.brandText,
                      textDecoration: 'none',
                      '&:hover': { color: t.text },
                    }}
                  >
                    {label}
                  </SiteLink>
                ))}
              </Box>
            </Reveal>
            <Box
              sx={{
                flex: '1.6 1 480px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 3.5,
              }}
            >
              {c.security.items.map((item, i) => (
                <Reveal
                  key={item.title}
                  index={i}
                  sx={{ display: 'flex', gap: 1.75 }}
                >
                  <IconBadge icon={item.icon} tone="neutral" iconSize={21} />
                  <Box>
                    <Box
                      component="h3"
                      sx={{ m: 0, fontSize: 16.5, fontWeight: 600 }}
                    >
                      {item.title}
                    </Box>
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        mt: 0.5,
                        color: t.muted,
                        fontSize: 15,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.desc}
                    </Box>
                  </Box>
                </Reveal>
              ))}
            </Box>
          </Box>
        </Box>

        {/* 12 · FAQ */}
        <Box
          component="section"
          id="faq"
          sx={{ px: 2.5, pb: 'clamp(72px,10cqi,112px)' }}
        >
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Reveal component="h2" sx={{ ...h2Sx, mb: 4, textAlign: 'center' }}>
              {c.faq.title}
            </Reveal>
            <Faq items={c.faq.items} />
          </Box>
        </Box>

        {/* 13 · Final CTA */}
        <Box
          component="section"
          sx={{ px: 2.5, pb: 'clamp(72px,10cqi,112px)' }}
        >
          <FinalCta
            title={c.finalCta.title}
            sub={c.finalCta.sub}
            cta={c.finalCta.cta}
            micro={c.finalCta.micro}
          />
        </Box>
      </Box>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </SiteLayout>
  );
};

/** Closing call to action, shared by the home page and every subpage. */
export const FinalCta = ({
  title,
  sub,
  cta,
  micro,
  compact = false,
}: {
  title: string;
  sub?: string;
  cta: string;
  micro: string;
  compact?: boolean;
}) => {
  const t = useSiteTokens();
  const buttons = useButtonSx();
  return (
    <Reveal
      sx={{
        maxWidth: 1160,
        mx: 'auto',
        borderRadius: '24px',
        border: `1px solid ${t.border}`,
        p: compact
          ? 'clamp(40px,7cqi,80px) 24px'
          : 'clamp(48px,8cqi,96px) 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        background: `radial-gradient(ellipse 80% 110% at 50% 0%, color-mix(in oklab, ${t.brand} 20%, transparent), transparent 72%), ${t.bg2}`,
      }}
    >
      <Box
        component="h2"
        sx={{
          ...headingSx,
          fontSize: compact
            ? 'clamp(28px,4.4cqi,44px)'
            : 'clamp(32px,5cqi,52px)',
          lineHeight: compact ? 1.1 : 1.08,
          letterSpacing: '-0.02em',
          maxWidth: compact ? '18ch' : '16ch',
        }}
      >
        {title}
      </Box>
      {sub && (
        <Box component="p" sx={{ m: 0, color: t.muted, fontSize: 17 }}>
          {sub}
        </Box>
      )}
      <SiteLink
        to={SIGNUP_PATH}
        sx={{ ...buttons.primary, mt: compact ? 1 : 1.5, px: 3.25 }}
      >
        {cta}
      </SiteLink>
      <Box component="span" sx={{ fontSize: 14, color: t.muted }}>
        {micro}
      </Box>
    </Reveal>
  );
};

export default HomePage;
