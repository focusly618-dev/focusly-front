import type { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Typography } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useProfile } from './hooks/useProfile.hook';
import {
  PROFILE_SECTIONS,
  profilePath,
  type ProfileSectionSlug,
} from './profileSections';
import {
  BackButton,
  Content,
  ContentInner,
  NavItem,
  NavList,
  PageLayout,
  Sidebar,
  UserSummary,
} from './Profile.styles';
import { AccountSection } from './sections/AccountSection';
import { BillingSection } from './sections/BillingSection';
import { WorkFocusSection } from './sections/WorkFocusSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { AppearanceSection } from './sections/AppearanceSection';
import { IntegrationsSection } from './sections/IntegrationsSection';
import { PrivacySection } from './sections/PrivacySection';

const SECTION_CONTENT: Record<ProfileSectionSlug, ComponentType> = {
  account: AccountSection,
  billing: BillingSection,
  'work-focus': WorkFocusSection,
  notifications: NotificationsSection,
  appearance: AppearanceSection,
  integrations: IntegrationsSection,
  privacy: PrivacySection,
};

const Profile = () => {
  const { t } = useTranslation();
  const { user, section, state, openSection, goBack, handleLogout } =
    useProfile();

  if (!section) {
    return <Navigate to={profilePath()} replace state={state} />;
  }

  const SectionContent = SECTION_CONTENT[section.slug];

  return (
    <PageLayout>
      <Sidebar>
        <BackButton onClick={goBack}>
          <ArrowBackIcon />
          {t('profilePage.back')}
        </BackButton>

        <UserSummary sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Avatar
            src={user?.picture || undefined}
            alt={user?.name || ''}
            sx={{ width: 40, height: 40 }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }} noWrap>
              {user?.name || t('profilePage.title')}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: 'block' }}
            >
              {user?.email}
            </Typography>
          </Box>
        </UserSummary>

        <NavList aria-label={t('profilePage.title')}>
          {PROFILE_SECTIONS.map(({ slug, key, icon: Icon }) => (
            <NavItem
              key={slug}
              active={slug === section.slug}
              aria-current={slug === section.slug ? 'page' : undefined}
              onClick={() => openSection(slug)}
            >
              <Icon />
              {t(`profilePage.nav.${key}`)}
            </NavItem>
          ))}
        </NavList>

        <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />

        <NavItem
          onClick={handleLogout}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            '&:hover': { color: 'error.main' },
          }}
        >
          <LogoutIcon />
          {t('profilePage.logout')}
        </NavItem>
      </Sidebar>

      <Content>
        <ContentInner>
          <Box component="header" sx={{ mb: 3 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {t(`profilePage.nav.${section.key}`)}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {t(`profilePage.descriptions.${section.key}`)}
            </Typography>
          </Box>
          <SectionContent />
        </ContentInner>
      </Content>
    </PageLayout>
  );
};

export default Profile;
