import type { SvgIconComponent } from '@mui/icons-material';
import {
  PersonOutline,
  ScheduleOutlined,
  NotificationsNoneOutlined,
  PaletteOutlined,
  ExtensionOutlined,
  ShieldOutlined,
  CreditCardOutlined,
} from '@mui/icons-material';

// Sections of the profile page, in sidebar order. The slug is the last URL
// segment (/profile/<slug>); labels and descriptions live under
// profilePage.nav.<key> and profilePage.descriptions.<key>.
export const PROFILE_SECTIONS = [
  { slug: 'account', key: 'account', icon: PersonOutline },
  { slug: 'billing', key: 'billing', icon: CreditCardOutlined },
  { slug: 'work-focus', key: 'workFocus', icon: ScheduleOutlined },
  {
    slug: 'notifications',
    key: 'notifications',
    icon: NotificationsNoneOutlined,
  },
  { slug: 'appearance', key: 'appearance', icon: PaletteOutlined },
  { slug: 'integrations', key: 'integrations', icon: ExtensionOutlined },
  { slug: 'privacy', key: 'privacy', icon: ShieldOutlined },
] as const satisfies readonly {
  slug: string;
  key: string;
  icon: SvgIconComponent;
}[];

export type ProfileSection = (typeof PROFILE_SECTIONS)[number];
export type ProfileSectionSlug = ProfileSection['slug'];

export const DEFAULT_PROFILE_SECTION: ProfileSectionSlug = 'account';

export const findProfileSection = (slug?: string) =>
  PROFILE_SECTIONS.find((section) => section.slug === slug) ?? null;

export const profilePath = (
  slug: ProfileSectionSlug = DEFAULT_PROFILE_SECTION,
) => `/profile/${slug}`;

/** Router state the profile page reads to know where "Back" returns. */
export interface ProfileLocationState {
  backTo?: string;
}
