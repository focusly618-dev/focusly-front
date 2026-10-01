import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, NativeSelect } from '@mui/material';
import { ColorModeContext } from '@/context/theme/ColorModeContext';
import { LANGUAGE_OPTIONS } from '@/i18n';
import { visuallyHiddenSx } from '@/styles/mui';
import { useSiteContent } from '../content';
import { useSiteTokens } from '../tokens';
import { SiteIcon } from '../icons';
import { PAGES, type PageSlug } from '../routes';
import { SiteLink } from './ui';
import { Logo } from './SiteNavbar';
import { THEME_ICONS, THEME_ORDER } from '../theme';

const PRODUCT_LINKS: PageSlug[] = [
  'tasks',
  'calendar',
  'lumina',
  'focus',
  'insights',
  'pricing',
];
const RESOURCE_LINKS: PageSlug[] = ['help', 'changelog', 'templates'];

export const SiteFooter = () => {
  const t = useSiteTokens();
  const { c } = useSiteContent();
  const { i18n } = useTranslation();
  const colorMode = useContext(ColorModeContext);
  const lang = (i18n.language || 'es').split('-')[0];

  const columns = [
    {
      title: c.footer.product,
      links: PRODUCT_LINKS.map((slug) => ({
        label: c.items[slug].short ?? c.items[slug].name,
        href: PAGES[slug].path,
      })),
    },
    {
      title: c.footer.resources,
      links: RESOURCE_LINKS.map((slug) => ({
        label: c.items[slug].name,
        href: PAGES[slug].path,
      })),
    },
    {
      title: c.footer.legal,
      links: [
        { label: c.footer.terms, href: '/terms' },
        { label: c.footer.privacy, href: '/privacy' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{ borderTop: `1px solid ${t.border}`, px: 2.5, pt: 7, pb: 4 }}
    >
      <Box sx={{ maxWidth: 1160, mx: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Logo size={26} fontSize={19} />
            <Box
              component="p"
              sx={{ m: 0, color: t.muted, fontSize: 14.5, lineHeight: 1.5 }}
            >
              {c.footer.tagline}
            </Box>
          </Box>
          {columns.map((col) => (
            <Box
              key={col.title}
              component="nav"
              aria-label={col.title}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
            >
              <Box
                component="h3"
                sx={{
                  m: 0,
                  mb: 0.5,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: t.muted,
                }}
              >
                {col.title}
              </Box>
              {col.links.map((link) => (
                <SiteLink
                  key={link.href}
                  to={link.href}
                  sx={{
                    color: t.text,
                    fontSize: 14.5,
                    textDecoration: 'none',
                    '&:hover': { color: t.brandText },
                  }}
                >
                  {link.label}
                </SiteLink>
              ))}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: `1px solid ${t.border}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box component="span" sx={{ fontSize: 14, color: t.muted }}>
            © {new Date().getFullYear()} Focusly
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.25,
              alignItems: 'center',
            }}
          >
            <Box component="label" htmlFor="foot-lang" sx={visuallyHiddenSx}>
              {c.footer.language}
            </Box>
            <NativeSelect
              disableUnderline
              value={lang}
              onChange={(e) => void i18n.changeLanguage(e.target.value)}
              inputProps={{ id: 'foot-lang' }}
              sx={{
                height: 38,
                px: 1.25,
                borderRadius: '9px',
                border: `1px solid ${t.border}`,
                bgcolor: t.surface,
                color: t.text,
                fontSize: 14,
                '& select': { py: 0, color: t.text },
                '& svg': { color: t.muted },
              }}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.nativeLabel}
                </option>
              ))}
            </NativeSelect>
            <Box
              role="group"
              aria-label={c.footer.theme}
              sx={{
                display: 'flex',
                gap: '2px',
                p: '3px',
                borderRadius: '10px',
                border: `1px solid ${t.border}`,
              }}
            >
              {THEME_ORDER.map((mode) => {
                const on = colorMode.mode === mode;
                return (
                  <ButtonBase
                    key={mode}
                    aria-pressed={on}
                    onClick={() => colorMode.setMode(mode)}
                    sx={{
                      height: 32,
                      px: 1.25,
                      borderRadius: '7px',
                      bgcolor: on ? t.surface2 : 'transparent',
                      color: t.text,
                      fontFamily: 'inherit',
                      fontSize: 13,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.6,
                    }}
                  >
                    <SiteIcon name={THEME_ICONS[mode]} size={16} />
                    {c.themes[mode]}
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
