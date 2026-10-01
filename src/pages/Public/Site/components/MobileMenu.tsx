import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase } from '@mui/material';
import { LANGUAGE_OPTIONS } from '@/i18n';
import { useSiteTokens } from '../tokens';
import { SiteIcon } from '../icons';
import { useBodyScrollLock, useReducedMotion } from '../hooks';
import { SIGNUP_PATH } from '../routes';
import { SiteLink } from './ui';
import type { NavEntry, useNavModel } from './navModel';
import { Logo } from './SiteNavbar';

type Section =
  | { kind: 'link'; label: string; href: string }
  | { kind: 'accordion'; key: string; label: string; items: NavEntry[] };

export const MobileMenu = ({
  open,
  onClose,
  model,
}: {
  open: boolean;
  onClose: () => void;
  model: ReturnType<typeof useNavModel>;
}) => {
  const t = useSiteTokens();
  const reduced = useReducedMotion();
  const { i18n } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const { c, isLogged } = model;
  const lang = (i18n.language || 'es').split('-')[0];
  useBodyScrollLock(open);

  const sections: Section[] = [
    {
      kind: 'accordion',
      key: 'product',
      label: c.nav.product,
      items: model.productColumns.flatMap((col) => col.items),
    },
    { kind: 'link', label: c.nav.lumina, href: model.luminaHref },
    { kind: 'accordion', key: 'who', label: c.nav.who, items: model.who },
    { kind: 'link', label: c.nav.pricing, href: model.pricingHref },
    {
      kind: 'accordion',
      key: 'resources',
      label: c.nav.resources,
      items: model.resources,
    },
  ];

  return (
    <Box
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label={c.nav.menu}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        bgcolor: t.bg,
        color: t.text,
        display: 'flex',
        flexDirection: 'column',
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        transform: `translateY(${open || reduced ? '0px' : '8px'})`,
        transition:
          'opacity 200ms ease-out, transform 200ms ease-out, visibility 200ms',
      }}
    >
      <Box
        sx={{
          height: 60,
          flexShrink: 0,
          pl: 2.5,
          pr: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <Logo />
        <ButtonBase
          aria-label={c.nav.closeMenu}
          onClick={onClose}
          sx={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            color: t.text,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <SiteIcon name="close" size={24} />
        </ButtonBase>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, pt: 1, pb: 3 }}>
        {sections.map((section) => (
          <Box
            key={section.label}
            sx={{ borderBottom: `1px solid ${t.border}` }}
          >
            {section.kind === 'link' ? (
              <SiteLink
                to={section.href}
                onNavigate={onClose}
                sx={{
                  minHeight: 56,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 17,
                  fontWeight: 600,
                  color: t.text,
                  textDecoration: 'none',
                }}
              >
                {section.label}
              </SiteLink>
            ) : (
              <>
                <ButtonBase
                  id={`macc-${section.key}`}
                  aria-expanded={expanded === section.key}
                  aria-controls={`mpan-${section.key}`}
                  onClick={() =>
                    setExpanded(expanded === section.key ? null : section.key)
                  }
                  sx={{
                    width: '100%',
                    minHeight: 56,
                    color: t.text,
                    fontFamily: 'inherit',
                    fontSize: 17,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {section.label}
                  <SiteIcon
                    name="expand_more"
                    size={22}
                    sx={{
                      transform:
                        expanded === section.key ? 'rotate(180deg)' : 'none',
                      transition: 'transform 180ms ease-out',
                    }}
                  />
                </ButtonBase>
                <Box
                  id={`mpan-${section.key}`}
                  role="region"
                  aria-labelledby={`macc-${section.key}`}
                  sx={{
                    display: 'grid',
                    gridTemplateRows: expanded === section.key ? '1fr' : '0fr',
                    transition: 'grid-template-rows 200ms ease-out',
                  }}
                >
                  <Box
                    sx={{
                      overflow: 'hidden',
                      visibility:
                        expanded === section.key ? 'visible' : 'hidden',
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', pb: 1.5 }}
                    >
                      {section.items.map((item) => (
                        <SiteLink
                          key={item.slug}
                          to={item.href}
                          onNavigate={onClose}
                          sx={{
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'center',
                            minHeight: 52,
                            py: 0.75,
                            color: t.text,
                            textDecoration: 'none',
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              flexShrink: 0,
                              width: 36,
                              height: 36,
                              borderRadius: '9px',
                              bgcolor: t.brandSoft,
                              color: t.brandText,
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <SiteIcon name={item.icon} />
                          </Box>
                          <Box
                            component="span"
                            sx={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <Box
                              component="span"
                              sx={{ fontSize: 15, fontWeight: 600 }}
                            >
                              {item.name}
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                fontSize: 13,
                                color: t.muted,
                                lineHeight: 1.4,
                              }}
                            >
                              {item.desc}
                            </Box>
                          </Box>
                        </SiteLink>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        ))}

        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2.5 }}
        >
          <Box
            component="span"
            sx={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: t.muted,
            }}
          >
            {c.nav.language}
          </Box>
          <Box
            role="group"
            aria-label={c.nav.language}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0.5,
              p: 0.5,
              borderRadius: '12px',
              bgcolor: t.surface2,
            }}
          >
            {LANGUAGE_OPTIONS.map((option) => {
              const on = lang === option.code;
              return (
                <ButtonBase
                  key={option.code}
                  lang={option.code}
                  aria-pressed={on}
                  onClick={() => void i18n.changeLanguage(option.code)}
                  sx={{
                    height: 44,
                    borderRadius: '9px',
                    bgcolor: on ? t.surface : 'transparent',
                    boxShadow: on ? t.shadow : 'none',
                    color: t.text,
                    fontFamily: 'inherit',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {option.nativeLabel}
                </ButtonBase>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          px: 2.5,
          pt: 1.5,
          pb: 'calc(12px + env(safe-area-inset-bottom))',
          borderTop: `1px solid ${t.border}`,
          display: 'grid',
          gridTemplateColumns: isLogged ? '1fr' : '1fr 1fr',
          gap: 1.25,
          bgcolor: t.bg,
        }}
      >
        {isLogged ? (
          <SiteLink
            to="/dashboard"
            onNavigate={onClose}
            sx={{
              height: 48,
              borderRadius: '10px',
              bgcolor: t.brand,
              color: t.onBrand,
              display: 'grid',
              placeItems: 'center',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {c.nav.openApp}
          </SiteLink>
        ) : (
          <>
            <SiteLink
              to="/login"
              onNavigate={onClose}
              sx={{
                height: 48,
                borderRadius: '10px',
                border: `1px solid ${t.border}`,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 600,
                color: t.text,
                textDecoration: 'none',
              }}
            >
              {c.nav.login}
            </SiteLink>
            <SiteLink
              to={SIGNUP_PATH}
              onNavigate={onClose}
              sx={{
                height: 48,
                borderRadius: '10px',
                bgcolor: t.brand,
                color: t.onBrand,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {c.nav.start}
            </SiteLink>
          </>
        )}
      </Box>
    </Box>
  );
};
