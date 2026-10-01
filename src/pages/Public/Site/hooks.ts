import { useEffect, useState } from 'react';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () =>
      typeof matchMedia !== 'undefined' && matchMedia(REDUCED_QUERY).matches,
  );
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia(REDUCED_QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
};

/**
 * Milliseconds elapsed for looping demos, advancing in 100 ms steps. It
 * pauses while the tab is hidden and stays at 0 with reduced motion (demos
 * then render their final frame).
 */
export const useTicker = () => {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (!document.hidden) setT((v) => v + 100);
    }, 100);
    return () => clearInterval(id);
  }, [reduced]);
  return { t, reduced };
};

/** True once the page has scrolled past a few pixels. */
export const useScrolled = (offset = 8) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
};

/** Id of the section currently crossing the middle of the viewport. */
export const useScrollSpy = (ids: string[], enabled: boolean) => {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(',');
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) setActive(id);
          else setActive((current) => (current === id ? null : current));
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    key.split(',').forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [key, enabled]);
  return enabled ? active : null;
};

/** Locks page scroll while an overlay (mobile menu, modal) is open. */
export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
};

/** Scrolls to a home section, leaving room for the sticky navbar. */
export const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 60,
    behavior: 'smooth',
  });
  return true;
};

/** Monthly/annual state; prices fade out and back in when it flips. */
export const useBilling = () => {
  const [annual, setAnnual] = useState(false);
  const [fading, setFading] = useState(false);
  const toggle = () => {
    setFading(true);
    setTimeout(() => {
      setAnnual((v) => !v);
      setFading(false);
    }, 150);
  };
  return { annual, fading, toggle };
};
