import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Typography } from '@mui/material';

type Children = { children?: ReactNode };

// Lumina's replies as real Markdown (bold, lists, tables…), mapped onto MUI
// primitives so they match the bubble's typography instead of the browser's
// bare defaults.
const components = {
  p: ({ children }: Children) => (
    <Typography
      variant="body2"
      sx={{ mb: 0.75, lineHeight: 'inherit', '&:last-child': { mb: 0 } }}
    >
      {children}
    </Typography>
  ),
  a: ({ children, href }: Children & { href?: string }) => (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ color: 'primary.main', textDecoration: 'underline' }}
    >
      {children}
    </Box>
  ),
  strong: ({ children }: Children) => (
    <Box component="strong" sx={{ fontWeight: 700 }}>
      {children}
    </Box>
  ),
  em: ({ children }: Children) => (
    <Box component="em" sx={{ fontStyle: 'italic' }}>
      {children}
    </Box>
  ),
  ul: ({ children }: Children) => (
    <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 0.75, listStyle: 'disc' }}>
      {children}
    </Box>
  ),
  ol: ({ children }: Children) => (
    <Box component="ol" sx={{ pl: 2.5, m: 0, mb: 0.75, listStyle: 'decimal' }}>
      {children}
    </Box>
  ),
  li: ({ children }: Children) => (
    <Typography component="li" variant="body2" sx={{ mb: 0.25 }}>
      {children}
    </Typography>
  ),
  blockquote: ({ children }: Children) => (
    <Box
      component="blockquote"
      sx={{
        m: 0,
        mb: 0.75,
        pl: 1.25,
        borderLeft: '3px solid',
        borderColor: 'primary.main',
        color: 'text.secondary',
      }}
    >
      {children}
    </Box>
  ),
  code: ({ children }: Children) => (
    <Box
      component="code"
      sx={{
        fontFamily: 'ui-monospace, monospace',
        bgcolor: 'action.hover',
        px: 0.5,
        py: 0.1,
        borderRadius: '4px',
        fontSize: '0.85em',
      }}
    >
      {children}
    </Box>
  ),
  pre: ({ children }: Children) => (
    <Box
      component="pre"
      sx={{
        m: 0,
        mb: 0.75,
        p: 1,
        borderRadius: '8px',
        bgcolor: 'action.hover',
        overflowX: 'auto',
        fontSize: '0.85em',
        lineHeight: 1.5,
        '& code': { bgcolor: 'transparent', p: 0 },
      }}
    >
      {children}
    </Box>
  ),
  h1: ({ children }: Children) => (
    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.75, mt: 1 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }: Children) => (
    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 0.75, mt: 1 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }: Children) => (
    <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5, mt: 0.75 }}>
      {children}
    </Typography>
  ),
  table: ({ children }: Children) => (
    <Box
      sx={{
        overflowX: 'auto',
        mb: 0.75,
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        component="table"
        sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}
      >
        {children}
      </Box>
    </Box>
  ),
  thead: ({ children }: Children) => (
    <Box component="thead" sx={{ bgcolor: 'action.hover' }}>
      {children}
    </Box>
  ),
  tr: ({ children }: Children) => (
    <Box
      component="tr"
      sx={{
        '&:not(:last-of-type)': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {children}
    </Box>
  ),
  th: ({ children }: Children) => (
    <Box
      component="th"
      sx={{ textAlign: 'left', fontWeight: 700, px: 1, py: 0.6 }}
    >
      {children}
    </Box>
  ),
  td: ({ children }: Children) => (
    <Box component="td" sx={{ px: 1, py: 0.6, verticalAlign: 'top' }}>
      {children}
    </Box>
  ),
};

export const ReplyMarkdown = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
    {children}
  </ReactMarkdown>
);
