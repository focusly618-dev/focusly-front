import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { useSiteContent } from '../content';
import { useScrollSpy } from '../hooks';
import type { IconName } from '../icons';
import {
  PAGES,
  PAGE_SLUGS,
  PRODUCT_COLUMNS,
  RESOURCE_SLUGS,
  SPY_SECTIONS,
  WHO_SLUGS,
  type NavKey,
  type PageSlug,
} from '../routes';

export interface NavEntry {
  slug: PageSlug;
  icon: IconName;
  name: string;
  desc: string;
  href: string;
}

export const slugForPath = (pathname: string): PageSlug | undefined =>
  PAGE_SLUGS.find((slug) => PAGES[slug].path === pathname);

/** Everything the navbar (desktop and mobile) needs to render. */
export const useNavModel = () => {
  const { c } = useSiteContent();
  const { pathname } = useLocation();
  const isLogged = useAppSelector((state) => state.auth.isLogged);
  const isHome = pathname === '/';
  const pageSlug = slugForPath(pathname);

  const spied = useScrollSpy(Object.keys(SPY_SECTIONS), isHome);
  const activeKey: NavKey | null = pageSlug
    ? PAGES[pageSlug].navKey
    : spied
      ? SPY_SECTIONS[spied]
      : null;

  const entry = (slug: PageSlug): NavEntry => ({
    slug,
    icon: PAGES[slug].icon,
    name: c.items[slug].name,
    desc: c.items[slug].desc,
    href: PAGES[slug].path,
  });

  return {
    c,
    isHome,
    isLogged,
    activeKey,
    productColumns: PRODUCT_COLUMNS.map((col) => ({
      title: c.nav.columns[col.key],
      items: col.slugs.map(entry),
    })),
    who: WHO_SLUGS.map(entry),
    resources: RESOURCE_SLUGS.map(entry),
    // On the home page these jump to their section; elsewhere, to their page.
    luminaHref: isHome ? '#lumina' : PAGES.lumina.path,
    pricingHref: isHome ? '#precios' : PAGES.pricing.path,
  };
};
