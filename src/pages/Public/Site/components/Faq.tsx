import { useState } from 'react';
import { Box, ButtonBase } from '@mui/material';
import { useSiteTokens } from '../tokens';
import { SiteIcon } from '../icons';

/** Accordion of questions; the first one starts open. */
export const Faq = ({ items }: { items: [string, string][] }) => {
  const t = useSiteTokens();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Box sx={{ borderTop: `1px solid ${t.border}` }}>
      {items.map(([question, answer], i) => {
        const isOpen = open === i;
        return (
          <Box key={question} sx={{ borderBottom: `1px solid ${t.border}` }}>
            <Box component="h3" sx={{ m: 0 }}>
              <ButtonBase
                id={`faq-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                sx={{
                  width: '100%',
                  minHeight: 64,
                  py: 2,
                  color: t.text,
                  fontFamily: 'inherit',
                  fontSize: 17,
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                {question}
                <SiteIcon
                  name="add"
                  size={22}
                  sx={{
                    flexShrink: 0,
                    color: t.muted,
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                    transition: 'transform 200ms ease-out',
                  }}
                />
              </ButtonBase>
            </Box>
            <Box
              id={`faq-p${i}`}
              role="region"
              aria-labelledby={`faq-b${i}`}
              sx={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 200ms ease-out',
              }}
            >
              <Box
                sx={{
                  overflow: 'hidden',
                  visibility: isOpen ? 'visible' : 'hidden',
                }}
              >
                <Box
                  component="p"
                  sx={{
                    m: 0,
                    pr: 5,
                    pb: 2.5,
                    color: t.muted,
                    fontSize: 16,
                    lineHeight: 1.6,
                  }}
                >
                  {answer}
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
