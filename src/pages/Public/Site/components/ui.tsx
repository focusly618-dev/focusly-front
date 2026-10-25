import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Box, useTheme, type SxProps, type Theme } from '@mui/material';
import { mergeSx } from '@/styles/mui';
import { MEDIA_BASE_URL } from '@/config/env.config';
import { FONT_MONO, stripes, useSiteTokens } from '../tokens';
import { h2Sx } from '../styles';
import { SiteIcon, type IconName } from '../icons';
import { scrollToSection, useReducedMotion } from '../hooks';

const REVEAL_EASE = 'cubic-bezier(.16,1,.3,1)';

interface RevealProps {
  component?: React.ElementType;
  /** Position within a group: each step delays the reveal by 70 ms. */
  index?: number;
  id?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Fades and lifts an element in the first time it scrolls into view.
 * Elements already on screen at load are shown as-is. It only touches the
 * element's inline style, so its own sx (hover lift, transitions) is back in
 * charge once the reveal ends.
 */
export const Reveal = ({
  component = 'div',
  index = 0,
  sx,
  children,
  ...rest
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight * 0.92)
      return;
    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.style.transition = 'none';
    el.style.opacity = '0';
    if (!reduced) el.style.transform = 'translateY(16px)';

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const delay = index * 70;
        el.style.transition = `opacity 400ms ${REVEAL_EASE} ${delay}ms, transform 400ms ${REVEAL_EASE} ${delay}ms`;
        el.style.opacity = '';
        el.style.transform = '';
        timer = setTimeout(() => {
          el.style.transition = '';
        }, 420 + delay);
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [index]);

  return (
    <Box ref={ref} component={component} sx={sx} {...rest}>
      {children}
    </Box>
  );
};

export const Container = ({
  children,
  sx,
  max = 1160,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  max?: number;
}) => <Box sx={mergeSx({ maxWidth: max, mx: 'auto' }, sx)}>{children}</Box>;

export const Eyebrow = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) => {
  const t = useSiteTokens();
  return (
    <Box
      component="span"
      sx={{
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: color ?? t.brandText,
      }}
    >
      {children}
    </Box>
  );
};

export const Lead = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) => {
  const t = useSiteTokens();
  return (
    <Box
      component="p"
      sx={{
        m: 0,
        fontSize: 'clamp(16px,1.9cqi,18px)',
        lineHeight: 1.6,
        color: color ?? t.muted,
        textWrap: 'pretty',
      }}
    >
      {children}
    </Box>
  );
};

/** Centered eyebrow + title (+ optional lead) at the top of a section. */
export const SectionHeader = ({
  eyebrow,
  title,
  lead,
  maxWidth,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  maxWidth?: number;
}) => (
  <Reveal
    sx={{
      maxWidth,
      mx: 'auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      alignItems: 'center',
    }}
  >
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <Box component="h2" sx={h2Sx}>
      {title}
    </Box>
    {lead && <Lead>{lead}</Lead>}
  </Reveal>
);

export const IconBadge = ({
  icon,
  size = 40,
  iconSize = 22,
  radius = 10,
  tone = 'brand',
}: {
  icon: IconName;
  size?: number;
  iconSize?: number;
  radius?: number;
  tone?: 'brand' | 'neutral' | 'muted';
}) => {
  const t = useSiteTokens();
  const colors = {
    brand: { bg: t.brandSoft, color: t.brandText },
    neutral: { bg: t.surface2, color: t.text },
    muted: { bg: t.surface2, color: t.muted },
  }[tone];
  return (
    <Box
      component="span"
      sx={{
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: `${radius}px`,
        bgcolor: colors.bg,
        color: colors.color,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <SiteIcon name={icon} size={iconSize} />
    </Box>
  );
};

/** Striped box marking where a real screenshot or video still has to go. */
export const MediaPlaceholder = ({
  label,
  aspect = '16/10',
  sx,
}: {
  label: string;
  aspect?: string;
  sx?: SxProps<Theme>;
}) => {
  const t = useSiteTokens();
  return (
    <Box
      sx={mergeSx(
        {
          aspectRatio: aspect,
          borderRadius: '14px',
          border: `1px solid ${t.border}`,
          background: stripes(t),
          display: 'grid',
          placeItems: 'center',
          p: 2.5,
          boxShadow: t.shadow,
        },
        sx,
      )}
    >
      <Box
        component="span"
        sx={{
          fontFamily: FONT_MONO,
          fontSize: 12.5,
          color: t.muted,
          textAlign: 'center',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
        }}
      >
        {label}
      </Box>
    </Box>
  );
};

/**
 * Muted looping video from MEDIA_BASE_URL/videos, in the variant matching the
 * theme: `<name>-light` or `<name>-dark` (.webm, .mp4 and -poster.webp).
 * It plays only while `active` and on screen, and shows just the poster with
 * reduced motion.
 */
export const LoopVideo = ({
  name,
  alt,
  active = true,
  aspect = '16/10',
  sx,
}: {
  name: string;
  alt: string;
  active?: boolean;
  aspect?: string;
  sx?: SxProps<Theme>;
}) => {
  const t = useSiteTokens();
  const theme = useTheme();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  // graydark has no video of its own: the dark one sits fine in its frame
  const variant =
    (theme.appMode ?? theme.palette.mode) === 'light' ? 'light' : 'dark';
  const src = `${MEDIA_BASE_URL}/videos/${name}-${variant}`;
  // The backend answers with a signed link that expires. If a long-open tab
  // reloads the file with a stale one, ask again past the cached redirect.
  const [retry, setRetry] = useState(0);
  const query = retry ? `?r=${retry}` : '';

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!active) {
      video.pause();
      return;
    }
    // play() rejects when the browser blocks autoplay (the poster stays up),
    // and returns nothing where media isn't implemented (jsdom)
    const play = () => video.play()?.catch(() => {});
    if (typeof IntersectionObserver === 'undefined') {
      play();
      return;
    }
    // A page can hold several of these: only the ones on screen play
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : video.pause()),
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [active, src, reduced]);

  const frame = mergeSx(
    {
      aspectRatio: aspect,
      width: '100%',
      display: 'block',
      objectFit: 'cover',
      borderRadius: '14px',
      border: `1px solid ${t.border}`,
      bgcolor: t.surface,
      boxShadow: t.shadow,
    },
    sx,
  );

  if (reduced) {
    return (
      <Box component="img" src={`${src}-poster.webp`} alt={alt} sx={frame} />
    );
  }
  return (
    // Keyed by source: a <video> doesn't reload when its <source> children change
    <Box
      key={src + query}
      component="video"
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={`${src}-poster.webp`}
      aria-label={alt}
      sx={frame}
    >
      <source src={`${src}.webm${query}`} type="video/webm" />
      {/* The last source's error means none of them loaded */}
      <source
        src={`${src}.mp4${query}`}
        type="video/mp4"
        onError={() => setRetry((r) => (r < 2 ? r + 1 : r))}
      />
    </Box>
  );
};

/**
 * Link that understands the site's targets: "/path" navigates inside the
 * app, "#section" scrolls to a home section (from any page), anything else
 * is a normal link.
 */
export const SiteLink = ({
  to,
  children,
  sx,
  onNavigate,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  onNavigate?: () => void;
  [key: string]: unknown;
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (to.startsWith('#')) {
    const id = to.slice(1);
    return (
      <Box
        component="a"
        href={`/${to}`}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          onNavigate?.();
          if (pathname === '/' && scrollToSection(id)) {
            window.history.replaceState(null, '', `/#${id}`);
            return;
          }
          navigate(`/#${id}`);
        }}
        sx={sx}
        {...rest}
      >
        {children}
      </Box>
    );
  }

  if (to.startsWith('/')) {
    return (
      <Box
        component={RouterLink}
        to={to}
        onClick={onNavigate}
        sx={sx}
        {...rest}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box component="a" href={to} sx={sx} {...rest}>
      {children}
    </Box>
  );
};
