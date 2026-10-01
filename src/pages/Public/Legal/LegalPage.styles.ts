import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Typography for the rendered Markdown of the legal documents.
export const LegalContent = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.975rem',
  lineHeight: 1.75,
  '& h1': {
    fontSize: '2.25rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    margin: theme.spacing(0, 0, 2),
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  '& h2': {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: theme.spacing(5, 0, 1.5),
    paddingTop: theme.spacing(3),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  '& p, & li': {
    color: theme.palette.text.secondary,
  },
  '& p': {
    margin: theme.spacing(0, 0, 2),
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(3),
    margin: theme.spacing(0, 0, 2),
  },
  '& ul': {
    listStyle: 'disc',
  },
  '& ol': {
    listStyle: 'decimal',
  },
  '& li': {
    marginBottom: theme.spacing(0.75),
  },
  '& strong': {
    color: theme.palette.text.primary,
  },
  '& a': {
    color: theme.palette.primary.main,
    wordBreak: 'break-word',
  },
  '& blockquote, & em': {
    color: theme.palette.text.secondary,
  },
  '& table': {
    display: 'block',
    width: '100%',
    overflowX: 'auto',
    borderCollapse: 'collapse',
    margin: theme.spacing(0, 0, 3),
    fontSize: '0.9rem',
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 1.5),
    textAlign: 'left',
    verticalAlign: 'top',
  },
  '& th': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
    fontWeight: 700,
  },
  '& td': {
    color: theme.palette.text.secondary,
  },
}));
