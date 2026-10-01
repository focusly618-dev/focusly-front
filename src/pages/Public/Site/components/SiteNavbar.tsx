import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, useMediaQuery } from '@mui/material';
import { ColorModeContext } from '@/context/theme/ColorModeContext';
import { LANGUAGE_OPTIONS } from '@/i18n';
import { blink } from '@/styles/mui';
import { FONT_HEADING, LUMINA, useSiteTokens } from '../tokens';
import { SiteIcon } from '../icons';
import { THEME_ICONS, THEME_ORDER } from '../theme';
import { useScrolled, useTicker } from '../hooks';
import { SIGNUP_PATH, PAGES } from '../routes';
import { fill } from '../content';
import { SiteLink } from './ui';
import { MobileMenu } from './MobileMenu';
import { useNavModel, type NavEntry } from './navModel';

type MenuId = 'product' | 'who' | 'resources' | 'lang';

export const Logo = ({
  size = 28,
  fontSize = 20,
}: {
  size?: number;
  fontSize?: number;
}) => {
  const t = useSiteTokens();
  return (
    <Box
      component="span"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: t.text,
        fontFamily: FONT_HEADING,
        fontWeight: 600,
        fontSize,
        letterSpacing: '-0.01em',
      }}
    >
      <Box
        component="span"
        sx={{
          width: size,
          height: size,
          borderRadius: `${Math.round(size * 0.28)}px`,
          bgcolor: t.brand,
          color: t.onBrand,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <SiteIcon name="auto_awesome" size={Math.round(size * 0.64)} />
      </Box>
      Focusly
    </Box>
  );
};

/** Typed prompt and plan bars looping inside the mega menu's Lumina card. */
const LuminaMini = ({
  prompt,
  active,
}: {
  prompt: string;
  active: boolean;
}) => {
  const { t: time, reduced } = useTicker();
  const c = !active || reduced ? 8000 : time % 10000;
  const live = c < 9400;
  const typing = c < 1600;
  const typedN =
    c < 300
      ? 0
      : c < 1500
        ? Math.ceil(((c - 300) / 1200) * prompt.length)
        : prompt.length;
  return (
    <Box
      sx={{
        bgcolor: '#18191e',
        border: '1px solid #25272e',
        borderRadius: '9px',
        p: 1.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          fontSize: 12.5,
          minHeight: 18,
          color: LUMINA.text,
        }}
      >
        <SiteIcon name="auto_awesome" size={16} sx={{ color: LUMINA.accent }} />
        {prompt.slice(0, typing ? typedN : prompt.length)}
        {typing && !reduced && (
          <Box
            component="span"
            sx={{
              width: '1.5px',
              height: 13,
              bgcolor: LUMINA.text,
              animation: `${blink} 1s steps(1) infinite`,
            }}
          />
        )}
      </Box>
      {['82%', '64%', '74%'].map((w, i) => {
        const on = c >= 2500 + i * 150 && live;
        return (
          <Box
            key={w}
            sx={{
              height: 8,
              borderRadius: '4px',
              bgcolor: LUMINA.brand,
              width: w,
              opacity: on ? 0.9 : 0,
              transform: on || reduced ? 'none' : 'translateX(-8px)',
              transition: 'opacity 250ms ease-out, transform 250ms ease-out',
            }}
          />
        );
      })}
    </Box>
  );
};

const MenuItemLink = ({
  item,
  onNavigate,
  neutralIcon,
}: {
  item: NavEntry;
  onNavigate: () => void;
  neutralIcon?: boolean;
}) => {
  const t = useSiteTokens();
  return (
    <SiteLink
      to={item.href}
      onNavigate={onNavigate}
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 1.25,
        borderRadius: '10px',
        color: t.text,
        textDecoration: 'none',
        transition: 'background-color 150ms',
        '&:hover, &:focus-visible': { bgcolor: t.surface2, color: t.text },
      }}
    >
      <Box
        component="span"
        sx={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: '9px',
          bgcolor: neutralIcon ? t.surface2 : t.brandSoft,
          color: neutralIcon ? t.text : t.brandText,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <SiteIcon name={item.icon} />
      </Box>
      <Box
        component="span"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.25,
          minWidth: 0,
        }}
      >
        <Box component="span" sx={{ fontSize: 14.5, fontWeight: 600 }}>
          {item.name}
        </Box>
        <Box
          component="span"
          sx={{ fontSize: 13, lineHeight: 1.4, color: t.muted }}
        >
          {item.desc}
        </Box>
      </Box>
    </SiteLink>
  );
};

export const SiteNavbar = () => {
  const t = useSiteTokens();
  const nav = useNavModel();
  const { c, activeKey, isLogged } = nav;
  const { i18n } = useTranslation();
  const colorMode = useContext(ColorModeContext);
  const scrolled = useScrolled();
  const desktop = useMediaQuery('(min-width:1024px)');
  const wide = useMediaQuery('(min-width:1200px)');

  const [open, setOpen] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openedAt = useRef(0);
  const rootRef = useRef<HTMLElement>(null);

  const close = useCallback(() => setOpen(null), []);

  const openMenu = (id: MenuId) => {
    clearTimeout(leaveTimer.current);
    if (open !== id) {
      openedAt.current = Date.now();
      setOpen(id);
    }
  };
  // A click right after the hover opened the menu shouldn't close it again.
  const clickMenu = (id: MenuId) => {
    clearTimeout(leaveTimer.current);
    if (open === id && Date.now() - openedAt.current < 400) return;
    openedAt.current = 0;
    setOpen(open === id ? null : id);
  };
  const leave = () => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setOpen(null), 140);
  };

  // Escape closes, arrows move through the open menu, outside clicks close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === 'Escape' && open) {
        const id = open;
        setOpen(null);
        document.querySelector<HTMLElement>(`[data-trigger="${id}"]`)?.focus();
        return;
      }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const trigger = target.closest<HTMLElement>('[data-trigger]');
      if (trigger && e.key === 'ArrowDown') {
        e.preventDefault();
        const id = trigger.dataset.trigger as MenuId;
        setOpen(id);
        setTimeout(() => {
          document
            .querySelector<HTMLElement>(
              `[data-menu="${id}"] a, [data-menu="${id}"] button`,
            )
            ?.focus();
        }, 20);
        return;
      }
      if (!open) return;
      const items = [
        ...document.querySelectorAll<HTMLElement>(
          `[data-menu="${open}"] a, [data-menu="${open}"] button`,
        ),
      ];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (i < 0) return;
      e.preventDefault();
      items[
        (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
      ].focus();
    };
    const onDown = (e: MouseEvent) => {
      if (
        open &&
        rootRef.current &&
        !rootRef.current.contains(e.target as Node)
      )
        setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const themeIndex = Math.max(0, THEME_ORDER.indexOf(colorMode.mode));
  const nextTheme = THEME_ORDER[(themeIndex + 1) % THEME_ORDER.length];
  const themeAria = fill(c.nav.themeAria, { name: c.themes[colorMode.mode] });
  const lang = (i18n.language || 'es').split('-')[0];

  const panelSx = (id: MenuId) => {
    const isOpen = open === id;
    return {
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition:
        'opacity 180ms ease-out, transform 180ms ease-out, visibility 180ms',
    } as const;
  };
  const surfaceSx = {
    bgcolor: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: '16px',
    boxShadow: t.shadowH,
  } as const;

  const triggerSx = (id: MenuId, key: string) => {
    const isOpen = open === id;
    const active = activeKey === key;
    return {
      height: 40,
      pl: 1.5,
      pr: 1.25,
      borderRadius: '8px',
      bgcolor: active ? t.brandSoft : 'transparent',
      color: isOpen || active ? t.text : t.muted,
      fontFamily: 'inherit',
      fontSize: 15,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: 0.25,
      whiteSpace: 'nowrap',
      transition: 'background-color 150ms, color 150ms',
      '&:hover': { color: t.text },
    } as const;
  };
  const chevron = (id: MenuId) => (
    <SiteIcon
      name="expand_more"
      sx={{
        transform: open === id ? 'rotate(180deg)' : 'none',
        transition: 'transform 180ms ease-out',
      }}
    />
  );
  const plainLinkSx = (key: string) => {
    const active = activeKey === key;
    return {
      height: 40,
      px: 1.5,
      borderRadius: '8px',
      bgcolor: active ? t.brandSoft : 'transparent',
      color: active ? t.text : t.muted,
      fontSize: 15,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      alignSelf: 'center',
      whiteSpace: 'nowrap',
      textDecoration: 'none',
      transition: 'background-color 150ms, color 150ms',
      '&:hover': { color: t.text },
    } as const;
  };
  const iconButtonSx = {
    width: 40,
    height: 40,
    borderRadius: '8px',
    color: t.text,
    display: 'grid',
    placeItems: 'center',
    '&:hover': { bgcolor: t.surface2 },
  } as const;

  return (
    <>
      <Box
        component="header"
        ref={rootRef}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: scrolled ? 60 : 72,
          bgcolor: scrolled || open ? t.navBg : 'transparent',
          backdropFilter:
            scrolled || open ? 'saturate(1.4) blur(14px)' : 'none',
          borderBottom: `1px solid ${scrolled ? t.border : 'transparent'}`,
          transition:
            'height 200ms ease-out, background-color 200ms ease-out, border-color 200ms ease-out',
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            height: '100%',
            mx: 'auto',
            px: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
          }}
        >
          <SiteLink
            to="/"
            aria-label={c.nav.homeAria}
            sx={{ textDecoration: 'none', flexShrink: 0 }}
          >
            <Logo />
          </SiteLink>

          {desktop ? (
            <>
              <Box
                component="nav"
                aria-label={c.nav.mainAria}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2px',
                  height: '100%',
                }}
              >
                {/* Producto: mega menu */}
                <Box
                  onMouseEnter={() => openMenu('product')}
                  onMouseLeave={leave}
                  sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
                >
                  <ButtonBase
                    data-trigger="product"
                    aria-expanded={open === 'product'}
                    aria-controls="menu-product"
                    onClick={() => clickMenu('product')}
                    sx={triggerSx('product', 'product')}
                  >
                    {c.nav.product}
                    {chevron('product')}
                  </ButtonBase>
                  <Box
                    id="menu-product"
                    data-menu="product"
                    sx={{
                      ...panelSx('product'),
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      width: 'min(1140px, calc(100vw - 40px))',
                      pt: 0.75,
                      transform: `translate(-50%, ${open === 'product' ? '0px' : '8px'})`,
                    }}
                  >
                    <Box
                      sx={{
                        ...surfaceSx,
                        p: 2,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) 260px',
                        gap: 1,
                      }}
                    >
                      {nav.productColumns.map((col) => (
                        <Box
                          key={col.title}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              letterSpacing: '.08em',
                              textTransform: 'uppercase',
                              color: t.muted,
                              px: 1.25,
                              pt: 1,
                              pb: 0.75,
                            }}
                          >
                            {col.title}
                          </Box>
                          {col.items.map((item) => (
                            <MenuItemLink
                              key={item.slug}
                              item={item}
                              onNavigate={close}
                            />
                          ))}
                        </Box>
                      ))}
                      <SiteLink
                        to={PAGES.lumina.path}
                        onNavigate={close}
                        sx={{
                          bgcolor: t.lumBg,
                          color: LUMINA.text,
                          borderRadius: '12px',
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                          border: `1px solid ${t.lumBorder}`,
                          textDecoration: 'none',
                          '&:hover': { color: '#ffffff' },
                        }}
                      >
                        <LuminaMini
                          prompt={c.nav.luminaCard.prompt}
                          active={open === 'product'}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              fontFamily: FONT_HEADING,
                              fontWeight: 600,
                              fontSize: 17,
                              color: LUMINA.heading,
                            }}
                          >
                            {c.nav.luminaCard.title}
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              fontSize: 13,
                              lineHeight: 1.45,
                              color: LUMINA.muted,
                            }}
                          >
                            {c.nav.luminaCard.desc}
                          </Box>
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            mt: 'auto',
                            fontSize: 14,
                            fontWeight: 600,
                            color: LUMINA.accent,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {c.nav.luminaCard.cta}
                          <SiteIcon name="arrow_forward" size={18} />
                        </Box>
                      </SiteLink>
                    </Box>
                  </Box>
                </Box>

                <SiteLink
                  to={nav.luminaHref}
                  aria-current={activeKey === 'lumina' ? 'true' : undefined}
                  sx={plainLinkSx('lumina')}
                >
                  {c.nav.lumina}
                </SiteLink>

                {(
                  [
                    ['who', c.nav.who, nav.who, 540, false],
                    ['resources', c.nav.resources, nav.resources, 320, true],
                  ] as const
                ).map(([id, label, items, width, neutral]) => (
                  <React.Fragment key={id}>
                    <Box
                      onMouseEnter={() => openMenu(id)}
                      onMouseLeave={leave}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ButtonBase
                        data-trigger={id}
                        aria-expanded={open === id}
                        aria-controls={`menu-${id}`}
                        onClick={() => clickMenu(id)}
                        sx={triggerSx(id, id)}
                      >
                        {label}
                        {chevron(id)}
                      </ButtonBase>
                      <Box
                        id={`menu-${id}`}
                        data-menu={id}
                        sx={{
                          ...panelSx(id),
                          position: 'absolute',
                          top: '100%',
                          left: -8,
                          width,
                          pt: 1.5,
                          transform: `translateY(${open === id ? '0px' : '8px'})`,
                        }}
                      >
                        <Box
                          sx={{
                            ...surfaceSx,
                            p: 1.25,
                            display: 'grid',
                            gridTemplateColumns: neutral ? '1fr' : '1fr 1fr',
                            gap: '2px',
                          }}
                        >
                          {items.map((item) => (
                            <MenuItemLink
                              key={item.slug}
                              item={item}
                              onNavigate={close}
                              neutralIcon={neutral}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    {id === 'who' && (
                      <SiteLink
                        to={nav.pricingHref}
                        aria-current={
                          activeKey === 'pricing' ? 'true' : undefined
                        }
                        sx={plainLinkSx('pricing')}
                      >
                        {c.nav.pricing}
                      </SiteLink>
                    )}
                  </React.Fragment>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  flexShrink: 0,
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <ButtonBase
                    data-trigger="lang"
                    aria-label={c.nav.language}
                    aria-expanded={open === 'lang'}
                    aria-controls="menu-lang"
                    onClick={() => clickMenu('lang')}
                    sx={iconButtonSx}
                  >
                    <SiteIcon name="translate" />
                  </ButtonBase>
                  <Box
                    id="menu-lang"
                    data-menu="lang"
                    sx={{
                      ...panelSx('lang'),
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      width: 180,
                      pt: 1,
                      transform: `translateY(${open === 'lang' ? '0px' : '8px'})`,
                    }}
                  >
                    <Box
                      sx={{
                        ...surfaceSx,
                        borderRadius: '12px',
                        p: 0.75,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {LANGUAGE_OPTIONS.map((option) => (
                        <ButtonBase
                          key={option.code}
                          lang={option.code}
                          aria-pressed={lang === option.code}
                          onClick={() => {
                            void i18n.changeLanguage(option.code);
                            setOpen(null);
                          }}
                          sx={{
                            height: 38,
                            px: 1.25,
                            borderRadius: '8px',
                            color: t.text,
                            fontFamily: 'inherit',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'left',
                            '&:hover, &:focus-visible': { bgcolor: t.surface2 },
                          }}
                        >
                          {option.nativeLabel}
                          <SiteIcon
                            name="check"
                            size={18}
                            sx={{
                              color: t.brandText,
                              opacity: lang === option.code ? 1 : 0,
                            }}
                          />
                        </ButtonBase>
                      ))}
                    </Box>
                  </Box>
                </Box>
                <ButtonBase
                  aria-label={themeAria}
                  onClick={() => colorMode.setMode(nextTheme)}
                  sx={iconButtonSx}
                >
                  <SiteIcon name={THEME_ICONS[colorMode.mode]} />
                </ButtonBase>

                {isLogged ? (
                  <SiteLink
                    to="/dashboard"
                    sx={{
                      height: 40,
                      px: 2,
                      ml: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      borderRadius: '9px',
                      bgcolor: t.brand,
                      color: t.onBrand,
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'filter 200ms ease-out',
                      '&:hover': {
                        filter: 'brightness(1.08)',
                        color: t.onBrand,
                      },
                    }}
                  >
                    {c.nav.openApp}
                  </SiteLink>
                ) : (
                  <>
                    {wide ? (
                      <SiteLink
                        to="/login"
                        sx={{
                          height: 40,
                          px: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: 15,
                          fontWeight: 500,
                          color: t.text,
                          borderRadius: '8px',
                          whiteSpace: 'nowrap',
                          textDecoration: 'none',
                          '&:hover': { bgcolor: t.surface2, color: t.text },
                        }}
                      >
                        {c.nav.login}
                      </SiteLink>
                    ) : (
                      <SiteLink
                        to="/login"
                        aria-label={c.nav.login}
                        sx={{ ...iconButtonSx, textDecoration: 'none' }}
                      >
                        <SiteIcon name="login" />
                      </SiteLink>
                    )}
                    <SiteLink
                      to={SIGNUP_PATH}
                      sx={{
                        height: 40,
                        px: 2,
                        ml: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        borderRadius: '9px',
                        bgcolor: t.brand,
                        color: t.onBrand,
                        fontSize: 15,
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'filter 200ms ease-out',
                        '&:hover': {
                          filter: 'brightness(1.08)',
                          color: t.onBrand,
                        },
                      }}
                    >
                      {c.nav.start}
                    </SiteLink>
                  </>
                )}
              </Box>
            </>
          ) : (
            <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
              <ButtonBase
                aria-label={themeAria}
                onClick={() => colorMode.setMode(nextTheme)}
                sx={{
                  ...iconButtonSx,
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                }}
              >
                <SiteIcon name={THEME_ICONS[colorMode.mode]} size={22} />
              </ButtonBase>
              <ButtonBase
                aria-label={c.nav.openMenu}
                aria-expanded={mobileOpen && !desktop}
                aria-controls="menu-mobile"
                onClick={() => setMobileOpen(true)}
                sx={{
                  ...iconButtonSx,
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                }}
              >
                <SiteIcon name="menu" size={24} />
              </ButtonBase>
            </Box>
          )}
        </Box>
      </Box>

      <MobileMenu
        open={mobileOpen && !desktop}
        onClose={() => setMobileOpen(false)}
        model={nav}
      />
    </>
  );
};
