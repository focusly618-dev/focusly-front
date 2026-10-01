import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useSiteContent } from '../content';
import { FONT_BODY, useSiteTokens } from '../tokens';
import { SiteNavbar } from './SiteNavbar';
import { SiteFooter } from './SiteFooter';

/** Navbar, page content and footer shared by every public page. */
export const SiteLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const t = useSiteTokens();
  const { lang } = useSiteContent();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  return (
    <Box
      sx={{
        bgcolor: t.bg,
        color: t.text,
        fontFamily: FONT_BODY,
        fontSize: 16,
        lineHeight: 1.5,
        position: 'relative',
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased',
        '& :focus-visible': {
          outline: `2px solid ${t.brand}`,
          outlineOffset: '2px',
          borderRadius: '6px',
        },
      }}
    >
      <SiteNavbar />
      {children}
      <SiteFooter />
    </Box>
  );
};
