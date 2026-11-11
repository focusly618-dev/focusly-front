import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useSiteContent } from './content';
import { FONT_HEADING, useSiteTokens } from './tokens';
import { SiteIcon } from './icons';
import { PAGES, type PageSlug } from './routes';
import { SiteLayout } from './components/SiteLayout';
import {
  BillingToggle,
  ComparisonTable,
  PlanCards,
} from './components/Pricing';
import { useBilling } from './hooks';
import {
  IconBadge,
  LoopVideo,
  MediaPlaceholder,
  Reveal,
  SiteLink,
} from './components/ui';
import { headingSx, useButtonSx } from './styles';
import { FinalCta } from './HomePage';
import { useStartCta } from './components/navModel';

const sectionX = { px: 2.5 } as const;
const sectionBottom = 'clamp(64px,9cqi,104px)';

/** Any page of the site other than the home: products, use cases and pricing. */
const SitePage: React.FC<{ slug: PageSlug }> = ({ slug }) => {
  const t = useSiteTokens();
  const { c } = useSiteContent();
  const buttons = useButtonSx();
  const meta = PAGES[slug];
  const text = c.pages[slug];
  const billing = useBilling();
  const start = useStartCta();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const isLanding = !meta.type;
  const cta2Slug = meta.cta2 ?? 'pricing';
  const cta2Label = text.cta2 ?? c.page.seePricing;

  return (
    <SiteLayout title={`${text.title} · Focusly`}>
      <Box component="main" sx={{ containerType: 'inline-size' }}>
        {/* Page hero */}
        <Box
          component="section"
          sx={{
            mt: '-72px',
            p: 'calc(72px + clamp(40px,7cqi,80px)) 20px clamp(48px,7cqi,80px)',
            background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${t.brandSoft}, transparent 75%)`,
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
              component="nav"
              aria-label={c.page.breadcrumbAria}
              sx={{
                display: 'flex',
                gap: 0.75,
                alignItems: 'center',
                fontSize: 14,
                color: t.muted,
              }}
            >
              <SiteLink
                to="/"
                sx={{
                  color: t.muted,
                  textDecoration: 'none',
                  '&:hover': { color: t.text },
                }}
              >
                {c.page.home}
              </SiteLink>
              <SiteIcon name="chevron_right" size={16} />
              <span>{text.group}</span>
            </Box>
            <Box sx={{ mt: 3 }}>
              <IconBadge icon={meta.icon} size={52} iconSize={28} radius={14} />
            </Box>
            <Box
              component="h1"
              sx={{
                ...headingSx,
                fontSize: 'clamp(36px,5.6cqi,60px)',
                lineHeight: 1.06,
                letterSpacing: '-0.025em',
                mt: 2.5,
                maxWidth: '18ch',
              }}
            >
              {text.title}
            </Box>
            <Box
              component="p"
              sx={{
                m: 0,
                mt: 2.5,
                maxWidth: '38em',
                fontSize: 'clamp(17px,2cqi,19px)',
                lineHeight: 1.6,
                color: t.muted,
                textWrap: 'pretty',
              }}
            >
              {text.sub}
            </Box>

            {isLanding && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 1.5,
                    mt: 4,
                  }}
                >
                  <SiteLink to={start.to} sx={buttons.primary}>
                    {start.label}
                  </SiteLink>
                  <SiteLink to={PAGES[cta2Slug].path} sx={buttons.secondary}>
                    {cta2Label}
                    <SiteIcon name="arrow_forward" />
                  </SiteLink>
                </Box>
                {meta.media && (
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 1000,
                      mt: 6,
                      border: `1px solid ${t.border}`,
                      borderRadius: '14px',
                      overflow: 'hidden',
                      bgcolor: t.surface,
                      boxShadow: `0 40px 80px -30px rgba(0,0,0,.25),${t.shadow}`,
                    }}
                  >
                    <Box
                      sx={{
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        px: 1.75,
                        borderBottom: `1px solid ${t.border}`,
                        bgcolor: t.surface2,
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          component="span"
                          sx={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            bgcolor: t.border,
                          }}
                        />
                      ))}
                    </Box>
                    {meta.video ? (
                      <LoopVideo
                        name={meta.video}
                        alt={`${text.title}: ${text.sub}`}
                        aspect="16/9"
                        sx={{ border: 0, borderRadius: 0, boxShadow: 'none' }}
                      />
                    ) : (
                      <MediaPlaceholder
                        label={meta.media}
                        aspect="16/9"
                        sx={{ border: 0, borderRadius: 0, boxShadow: 'none' }}
                      />
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* Alternating content blocks */}
        {text.blocks && text.blocks.length > 0 && (
          <Box component="section" sx={{ p: 'clamp(48px,8cqi,96px) 20px' }}>
            <Box
              sx={{
                maxWidth: 1160,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(56px,9cqi,104px)',
              }}
            >
              {text.blocks.map(([title, desc], i) => (
                <Reveal
                  key={title}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: i % 2 ? 'row-reverse' : 'row',
                    gap: 6,
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      flex: '1 1 320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
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
                    <Box
                      component="h2"
                      sx={{
                        ...headingSx,
                        fontSize: 'clamp(26px,3.4cqi,34px)',
                        lineHeight: 1.15,
                        letterSpacing: '-0.015em',
                      }}
                    >
                      {title}
                    </Box>
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        color: t.muted,
                        fontSize: 17,
                        lineHeight: 1.6,
                        textWrap: 'pretty',
                      }}
                    >
                      {desc}
                    </Box>
                  </Box>
                  {meta.blockVideos?.[i] ? (
                    <LoopVideo
                      name={meta.blockVideos[i]}
                      alt={`${title}: ${desc}`}
                      sx={{ flex: '1.3 1 400px', minWidth: 0 }}
                    />
                  ) : (
                    <MediaPlaceholder
                      label={meta.blockMedia?.[i] ?? ''}
                      sx={{ flex: '1.3 1 400px' }}
                    />
                  )}
                </Reveal>
              ))}
            </Box>
          </Box>
        )}

        {/* Pricing page */}
        {meta.type === 'pricing' && (
          <Box component="section" sx={{ ...sectionX, pb: sectionBottom }}>
            <Box sx={{ maxWidth: 1160, mx: 'auto' }}>
              <BillingToggle
                annual={billing.annual}
                onToggle={billing.toggle}
              />
              <Box sx={{ mt: 5 }}>
                <PlanCards
                  annual={billing.annual}
                  fading={billing.fading}
                  showFeatures={false}
                  headingLevel="h2"
                />
              </Box>
              <Box
                component="h2"
                sx={{
                  ...headingSx,
                  fontSize: 'clamp(26px,3.4cqi,34px)',
                  mt: 9,
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                {c.pricing.compareTitle}
              </Box>
              <ComparisonTable />
              <Box
                component="p"
                sx={{
                  m: 0,
                  mt: 2,
                  textAlign: 'center',
                  fontSize: 14,
                  color: t.muted,
                }}
              >
                {c.pricing.note}
              </Box>
            </Box>
          </Box>
        )}

        {/* Related pages */}
        <Box
          component="section"
          sx={{
            p: 'clamp(56px,8cqi,96px) 20px',
            bgcolor: t.bg2,
            borderTop: `1px solid ${t.border}`,
          }}
        >
          <Box sx={{ maxWidth: 1160, mx: 'auto' }}>
            <Box
              component="h2"
              sx={{ ...headingSx, fontSize: 'clamp(24px,3cqi,30px)', mb: 3.5 }}
            >
              {c.page.explore}
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 2,
              }}
            >
              {meta.related.map((related, i) => (
                <Reveal key={related} index={i} sx={{ display: 'flex' }}>
                  <SiteLink
                    to={PAGES[related].path}
                    sx={{
                      flex: 1,
                      border: `1px solid ${t.border}`,
                      borderRadius: '16px',
                      p: 2.5,
                      bgcolor: t.surface,
                      color: t.text,
                      display: 'flex',
                      gap: 1.75,
                      textDecoration: 'none',
                      transition:
                        'transform 200ms ease-out, box-shadow 200ms ease-out',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: t.shadowH,
                        color: t.text,
                      },
                    }}
                  >
                    <IconBadge icon={PAGES[related].icon} />
                    <Box
                      component="span"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ fontWeight: 600, fontSize: 16 }}
                      >
                        {c.items[related].name}
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          color: t.muted,
                          fontSize: 14.5,
                          lineHeight: 1.45,
                        }}
                      >
                        {c.items[related].desc}
                      </Box>
                    </Box>
                  </SiteLink>
                </Reveal>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ p: 'clamp(56px,8cqi,96px) 20px' }}>
          <FinalCta
            title={c.page.finalTitle}
            cta={c.nav.start}
            micro={c.finalCta.micro}
            compact
          />
        </Box>
      </Box>
    </SiteLayout>
  );
};

export default SitePage;
