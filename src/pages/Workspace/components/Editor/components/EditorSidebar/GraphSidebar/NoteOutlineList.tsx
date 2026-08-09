import { Box, Typography } from '@mui/material';
import type { HeadingItem } from './markdownHeadings';

interface NoteOutlineListProps {
  headings: HeadingItem[];
  onJump: (pos: number) => void;
}

export const NoteOutlineList = ({ headings, onJump }: NoteOutlineListProps) => {
  if (headings.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        No headings in this note yet. Add a <code># Heading</code> to build an
        outline.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      {headings.map((h) => (
        <Box
          key={h.pos}
          onClick={() => onJump(h.pos)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            pl: (h.level - 1) * 1.5 + 0.5,
            pr: 1,
            py: 0.6,
            borderRadius: '8px',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: 'text.disabled',
              flexShrink: 0,
            }}
          />
          <Typography
            noWrap
            sx={{
              fontSize: h.level === 1 ? '13px' : '12.5px',
              fontWeight: h.level === 1 ? 700 : 500,
              color: h.level === 1 ? 'text.primary' : 'text.secondary',
            }}
          >
            {h.text || 'Untitled'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
