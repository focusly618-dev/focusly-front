import { useSiteTokens, FONT_HEADING } from './tokens';

// Style helpers shared by the public site's sections.

export const sectionPad = (top = 112, min = 72) =>
  `clamp(${min}px,10cqi,${top}px) 20px`;

export const headingSx = {
  fontFamily: FONT_HEADING,
  fontWeight: 600,
  m: 0,
  textWrap: 'balance',
} as const;

export const h2Sx = {
  ...headingSx,
  fontSize: 'clamp(30px,4.6cqi,46px)',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
} as const;

/** Shared card look: surface, border, soft shadow and a lift on hover. */
export const useCardSx = (padding = 3) => {
  const t = useSiteTokens();
  return {
    bgcolor: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: '16px',
    p: padding,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: t.shadow,
    transition: 'transform 200ms ease-out, box-shadow 200ms ease-out',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: t.shadowH },
  } as const;
};

/** Primary (brand) and secondary (outlined) call-to-action styles. */
export const useButtonSx = () => {
  const t = useSiteTokens();
  const base = {
    height: 50,
    px: 3,
    borderRadius: '11px',
    fontSize: 16,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.75,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'filter 200ms ease-out',
  } as const;
  return {
    primary: {
      ...base,
      bgcolor: t.brand,
      color: t.onBrand,
      border: 0,
      '&:hover': { filter: 'brightness(1.08)', color: t.onBrand },
    },
    secondary: {
      ...base,
      px: 2.5,
      gap: 1,
      bgcolor: t.surface,
      color: t.text,
      border: `1px solid ${t.border}`,
      '&:hover': { filter: 'brightness(0.97)', color: t.text },
    },
  } as const;
};
