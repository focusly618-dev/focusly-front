import { Box, ButtonBase } from '@mui/material';
import { useSiteContent } from '../content';
import { FONT_HEADING, useSiteTokens } from '../tokens';
import { SiteIcon } from '../icons';
import { PRICING, SIGNUP_PATH, type PlanKey } from '../routes';
import { Reveal, SiteLink } from './ui';

const PLAN_ORDER: PlanKey[] = ['free', 'pro', 'business'];
const RECOMMENDED: PlanKey = 'pro';

export const BillingToggle = ({
  annual,
  onToggle,
}: {
  annual: boolean;
  onToggle: () => void;
}) => {
  const t = useSiteTokens();
  const { c } = useSiteContent();
  const p = c.pricing;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        mt: 1,
        fontSize: 15,
        fontWeight: 500,
        flexWrap: 'wrap',
      }}
    >
      <Box component="span" sx={{ color: annual ? t.muted : t.text }}>
        {p.monthly}
      </Box>
      <ButtonBase
        role="switch"
        aria-checked={annual}
        aria-label={p.annualAria}
        onClick={onToggle}
        sx={{
          width: 48,
          height: 28,
          borderRadius: '999px',
          p: '3px',
          bgcolor: annual ? t.brand : t.border,
          display: 'flex',
          justifyContent: 'flex-start',
          transition: 'background-color 200ms ease-out',
        }}
      >
        <Box
          component="span"
          sx={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,.25)',
            transform: `translateX(${annual ? 20 : 0}px)`,
            transition: 'transform 200ms ease-out',
          }}
        />
      </ButtonBase>
      <Box component="span" sx={{ color: annual ? t.text : t.muted }}>
        {p.annual}
      </Box>
      <Box
        component="span"
        sx={{
          fontSize: 12.5,
          fontWeight: 600,
          color: t.brandText,
          bgcolor: t.brandSoft,
          px: 1.1,
          py: '3px',
          borderRadius: '999px',
        }}
      >
        {p.save}
      </Box>
    </Box>
  );
};

/** The three plan cards; `showFeatures` adds each plan's feature list. */
export const PlanCards = ({
  annual,
  fading,
  showFeatures,
  headingLevel = 'h3',
}: {
  annual: boolean;
  fading: boolean;
  showFeatures: boolean;
  headingLevel?: 'h2' | 'h3';
}) => {
  const t = useSiteTokens();
  const { c } = useSiteContent();
  const p = c.pricing;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 2.5,
        alignItems: 'stretch',
      }}
    >
      {PLAN_ORDER.map((key, i) => {
        const plan = p.plans[key];
        const rec = key === RECOMMENDED;
        return (
          <Reveal
            key={key}
            component="article"
            index={i}
            sx={{
              position: 'relative',
              bgcolor: t.surface,
              border: rec ? `2px solid ${t.brand}` : `1px solid ${t.border}`,
              borderRadius: '18px',
              p: 3.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              boxShadow: rec ? t.shadowH : t.shadow,
              transition: 'transform 200ms ease-out, box-shadow 200ms ease-out',
              ...(showFeatures && {
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: t.shadowH,
                },
              }),
            }}
          >
            {rec && (
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  top: -12,
                  left: 28,
                  bgcolor: t.brand,
                  color: t.onBrand,
                  fontSize: 12,
                  fontWeight: 600,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: '999px',
                }}
              >
                {p.recommended}
              </Box>
            )}
            <Box>
              <Box
                component={headingLevel}
                sx={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 600,
                  fontSize: 22,
                  m: 0,
                }}
              >
                {plan.name}
              </Box>
              <Box
                component="p"
                sx={{ m: 0, mt: 0.5, color: t.muted, fontSize: 14.5 }}
              >
                {plan.desc}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 1,
                flexWrap: 'wrap',
                opacity: fading ? 0 : 1,
                transition: 'opacity 150ms ease-out',
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 600,
                  fontSize: 34,
                  lineHeight: 1.1,
                  bgcolor: t.surface2,
                  border: `1px dashed ${t.border}`,
                  px: 1.25,
                  borderRadius: '8px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {PRICING[key][annual ? 'annual' : 'monthly']}
              </Box>
              <Box component="span" sx={{ color: t.muted, fontSize: 14 }}>
                {annual ? p.perMonthAnnual : p.perMonth}
              </Box>
            </Box>
            <SiteLink
              to={key === 'free' ? SIGNUP_PATH : `${SIGNUP_PATH}&plan=${key}`}
              sx={{
                height: 46,
                borderRadius: '10px',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 600,
                fontSize: 15.5,
                textDecoration: 'none',
                bgcolor: rec ? t.brand : 'transparent',
                color: rec ? t.onBrand : t.text,
                border: `1px solid ${rec ? t.brand : t.border}`,
                transition: 'filter 200ms ease-out',
                '&:hover': {
                  filter: 'brightness(1.06)',
                  color: rec ? t.onBrand : t.text,
                },
              }}
            >
              {plan.cta}
            </SiteLink>
            {showFeatures && (
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  m: 0,
                  p: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                {plan.feats.map((feat) => (
                  <Box
                    key={feat}
                    component="li"
                    sx={{
                      display: 'flex',
                      gap: 1.25,
                      fontSize: 15,
                      lineHeight: 1.45,
                    }}
                  >
                    <SiteIcon
                      name="check"
                      size={19}
                      sx={{ color: t.brandText, mt: '1px' }}
                    />
                    {feat}
                  </Box>
                ))}
              </Box>
            )}
          </Reveal>
        );
      })}
    </Box>
  );
};

export const ComparisonTable = () => {
  const t = useSiteTokens();
  const { c } = useSiteContent();
  const p = c.pricing;
  const cell = { p: '14px 12px', textAlign: 'center' } as const;

  return (
    <Box
      sx={{
        overflowX: 'auto',
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        bgcolor: t.surface,
      }}
    >
      <Box
        component="table"
        sx={{
          width: '100%',
          minWidth: 640,
          borderCollapse: 'collapse',
          fontSize: 15,
        }}
      >
        <Box component="thead">
          <Box component="tr" sx={{ bgcolor: t.surface2 }}>
            <Box
              component="th"
              scope="col"
              sx={{ textAlign: 'left', p: '16px 20px', fontWeight: 600 }}
            >
              {p.feature}
            </Box>
            {PLAN_ORDER.map((key) => (
              <Box
                key={key}
                component="th"
                scope="col"
                sx={{
                  p: '16px 12px',
                  fontWeight: 600,
                  color: key === RECOMMENDED ? t.brandText : t.text,
                }}
              >
                {p.plans[key].name}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {p.table.map(([feature, free, pro, business]) => (
            <Box
              key={feature}
              component="tr"
              sx={{ borderTop: `1px solid ${t.border}` }}
            >
              <Box
                component="th"
                scope="row"
                sx={{ textAlign: 'left', p: '14px 20px', fontWeight: 500 }}
              >
                {feature}
              </Box>
              <Box component="td" sx={{ ...cell, color: t.muted }}>
                {free}
              </Box>
              <Box component="td" sx={{ ...cell, bgcolor: t.brandSoft }}>
                {pro}
              </Box>
              <Box component="td" sx={{ ...cell, color: t.muted }}>
                {business}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
