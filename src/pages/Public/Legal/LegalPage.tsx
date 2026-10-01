import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Alert, Box, Button, Container } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { SiteLayout } from '@/pages/Public/Site/components/SiteLayout';
import { LegalContent } from './LegalPage.styles';

export type LegalDocument = 'terms' | 'privacy';

// The documents live as Markdown under src/content/legal/<lang>/<doc>.md so
// they can be edited (and reviewed) without touching any component.
const documents = import.meta.glob<string>('/src/content/legal/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// Spanish is the source version; other languages fall back to it until a
// reviewed translation exists.
const SOURCE_LANGUAGE = 'es';

const getDocument = (doc: LegalDocument, language: string) => {
  const lang = language.split('-')[0];
  const localized = documents[`/src/content/legal/${lang}/${doc}.md`];
  if (localized) return { content: localized, language: lang };
  return {
    content: documents[`/src/content/legal/${SOURCE_LANGUAGE}/${doc}.md`] ?? '',
    language: SOURCE_LANGUAGE,
  };
};

// Internal links (e.g. Terms -> /privacy) stay in the SPA; external ones open
// in a new tab.
const markdownComponents: Components = {
  a: ({ href = '', children }) =>
    href.startsWith('/') ? (
      <RouterLink to={href}>{children}</RouterLink>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
};

interface LegalPageProps {
  document: LegalDocument;
}

const LegalPage: React.FC<LegalPageProps> = ({ document: doc }) => {
  const { t, i18n } = useTranslation();
  const { content, language } = getDocument(doc, i18n.language);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.document.title = `${t(doc === 'terms' ? 'legal.termsTitle' : 'legal.privacyTitle')} · Focusly`;
  }, [doc, t]);

  return (
    <SiteLayout>
      <Box component="main">
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4, textTransform: 'none', color: 'text.secondary' }}
          >
            {t('legal.backHome')}
          </Button>

          {language !== i18n.language.split('-')[0] && (
            <Alert severity="info" sx={{ mb: 4 }}>
              {t('legal.onlySpanish')}
            </Alert>
          )}

          <LegalContent>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>
          </LegalContent>
        </Container>
      </Box>
    </SiteLayout>
  );
};

export default LegalPage;
