import { Box, ButtonBase, Typography, alpha, styled } from '@mui/material';
import { surfaceColor } from '@/context';

export const BRAND = '#008767';

export const PlanCard = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1.5, 0),
  borderRadius: 16,
  overflow: 'hidden',
  border: `1px solid ${alpha(BRAND, 0.3)}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 16px 40px ${alpha('#000', 0.35)}`
      : `0 8px 24px ${alpha('#000', 0.06)}`,
}));

export const PlanHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.75, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${alpha(BRAND, 0.08)} 0%, transparent 70%)`,
}));

export const HeaderIcon = styled(Box)({
  width: 36,
  height: 36,
  borderRadius: 12,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: BRAND,
  backgroundColor: alpha(BRAND, 0.12),
  '& svg': { fontSize: 20 },
});

export const SummaryRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
  marginTop: theme.spacing(0.75),
}));

export const PlanBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.25, 1.25, 0.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.75, 0.75, 0),
}));

/** Indented children with a guide line, under a project or document. */
export const Branch = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2.25),
  paddingLeft: theme.spacing(1.25),
  borderLeft: `2px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1.25),
    paddingLeft: theme.spacing(0.75),
  },
}));

export const ItemRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'muted' && prop !== 'tone',
})<{ muted?: boolean; tone?: 'default' | 'project' | 'danger' }>(
  ({ theme, muted, tone = 'default' }) => ({
    borderRadius: 12,
    border: `1px solid ${
      tone === 'project'
        ? alpha(BRAND, 0.28)
        : tone === 'danger'
          ? alpha(theme.palette.error.main, 0.35)
          : theme.palette.divider
    }`,
    backgroundColor:
      tone === 'project'
        ? alpha(BRAND, 0.05)
        : tone === 'danger'
          ? alpha(theme.palette.error.main, 0.05)
          : surfaceColor(theme, '#1b1c21', '#2A2A2B', '#fbfcfd'),
    opacity: muted ? 0.5 : 1,
    transition: 'opacity 0.15s ease, border-color 0.15s ease',
  }),
);

export const RowMain = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1, 1, 0.5),
}));

export const ItemIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tint',
})<{ tint?: string | null }>(({ theme, tint }) => ({
  width: 28,
  height: 28,
  borderRadius: 8,
  flexShrink: 0,
  marginTop: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 15,
  color: tint || theme.palette.text.secondary,
  backgroundColor: alpha(tint || theme.palette.text.secondary, 0.12),
  '& svg': { fontSize: 16 },
}));

export const ItemTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 650,
  lineHeight: 1.35,
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
}));

export const MetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}));

export const MetaChip = styled('span', {
  shouldForwardProp: (prop) => prop !== 'accent',
})<{ accent?: string }>(({ theme, accent }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 7px',
  borderRadius: 999,
  fontSize: '0.72rem',
  fontWeight: 600,
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
  color: accent || theme.palette.text.secondary,
  backgroundColor: accent ? alpha(accent, 0.12) : theme.palette.action.hover,
  '& svg': { fontSize: 13 },
}));

export const Details = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 1.25, 1.25, 5.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1.25),
  },
}));

export const DetailLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.72rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

export const MarkdownBox = styled(Box)(({ theme }) => ({
  maxHeight: 320,
  overflowY: 'auto',
  padding: theme.spacing(1.25, 1.5),
  borderRadius: 10,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  fontSize: '0.85rem',
}));

export const LinkButton = styled(ButtonBase)(({ theme }) => ({
  alignSelf: 'flex-start',
  gap: 4,
  padding: theme.spacing(0.25, 0.75),
  borderRadius: 6,
  fontFamily: 'inherit',
  fontSize: '0.75rem',
  fontWeight: 650,
  color: BRAND,
  '& svg': { fontSize: 15 },
  '&:hover': { backgroundColor: alpha(BRAND, 0.08) },
  '&.Mui-focusVisible': {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 1,
  },
}));

export const ChangeRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(80px, auto) 1fr',
  gap: theme.spacing(0.25, 1.25),
  alignItems: 'baseline',
  fontSize: '0.8rem',
}));

export const Before = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
  textDecorationColor: alpha(theme.palette.error.main, 0.6),
}));

export const After = styled('span')({
  color: BRAND,
  fontWeight: 650,
});

export const PlanFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(1.25, 1.5, 1.5),
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(0.75),
}));
