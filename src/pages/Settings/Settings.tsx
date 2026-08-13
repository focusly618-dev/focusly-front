import { useState } from 'react';
import { Box, Typography, Avatar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  SettingsLayout,
  SettingsSidebar,
  SidebarItem,
  ContentArea,
  ProfileHeader,
  SettingsTitle,
  SettingsDescription,
  UserProfileSummary,
  Badge,
} from './Settings.styles';
import {
  AccessTime as AccessTimeIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
  NotificationsNone as NotificationsNoneIcon,
  ShieldOutlined as SecurityIcon,
  PersonOutline as AccountIcon,
  ExtensionOutlined as IntegrationsIcon,
  PaletteOutlined as AppearanceIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { NotificationSettings } from './components/NotificationSettings';
import { FocusEngineSettings } from './components/FocusEngineSettings';
import { ScheduleSettings } from './components/ScheduleSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { AccountSettings } from './components/AccountSettings';
import { IntegrationsSettings } from './components/IntegrationsSettings';
import { AppearanceSettings } from './components/AppearanceSettings';
import { SettingsTab } from './Settings.types';

export const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>(SettingsTab.Schedule);
  const user = useSelector((state: RootState) => state.auth.user);

  const getHeaderContent = () => {
    switch (activeTab) {
      case SettingsTab.Schedule:
        return {
          title: t('settings.schedule'),
          description: t('settings.descriptions.schedule'),
        };
      case SettingsTab.Focus:
        return {
          title: t('settings.focusEngine'),
          description: t('settings.descriptions.focus'),
        };
      case SettingsTab.Notifications:
        return {
          title: t('settings.notifications'),
          description: t('settings.descriptions.notifications'),
        };
      case SettingsTab.Account:
        return {
          title: t('settings.account'),
          description: t('settings.descriptions.account'),
        };
      case SettingsTab.Integrations:
        return {
          title: t('settings.integrations'),
          description: t('settings.descriptions.integrations'),
        };
      case SettingsTab.Appearance:
        return {
          title: t('settings.appearance'),
          description: t('settings.theme.subtitle'),
        };
      case SettingsTab.Security:
        return {
          title: t('settings.security'),
          description: t('settings.descriptions.security'),
        };
      default:
        return {
          title: t('settings.title'),
          description: t('settings.descriptions.default'),
        };
    }
  };

  const header = getHeaderContent();

  const tabs = [
    {
      id: SettingsTab.Schedule,
      label: t('settings.schedule'),
      icon: <AccessTimeIcon />,
    },
    {
      id: SettingsTab.Focus,
      label: t('settings.focusEngine'),
      icon: <PrecisionManufacturingIcon />,
    },
    {
      id: SettingsTab.Notifications,
      label: t('settings.notifications'),
      icon: <NotificationsNoneIcon />,
    },
    {
      id: SettingsTab.Account,
      label: t('settings.account'),
      icon: <AccountIcon />,
    },
    {
      id: SettingsTab.Integrations,
      label: t('settings.integrations'),
      icon: <IntegrationsIcon />,
    },
    {
      id: SettingsTab.Appearance,
      label: t('settings.appearance'),
      icon: <AppearanceIcon />,
    },
    {
      id: SettingsTab.Security,
      label: t('settings.security'),
      icon: <SecurityIcon />,
    },
  ];

  return (
    <SettingsLayout>
      {/* Left Sidebar */}
      <SettingsSidebar>
        {tabs.map((tab) => (
          <SidebarItem
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </SidebarItem>
        ))}
      </SettingsSidebar>

      {/* Right Content Area */}
      <ContentArea>
        {/* Large Header */}
        <ProfileHeader>
          <SettingsTitle variant="h1">{header.title}</SettingsTitle>
          <SettingsDescription>{header.description}</SettingsDescription>
        </ProfileHeader>

        {/* Profile Summary Card at the top */}
        <UserProfileSummary>
          <Avatar
            src={user?.picture || ''}
            alt={user?.name || 'User'}
            sx={{
              width: 56,
              height: 56,
              border: '2px solid rgba(99, 102, 241, 0.2)',
            }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: 'text.primary' }}
            >
              {user?.name || 'Alex Morgan'}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 0.5 }}
            >
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontWeight: 500 }}
              >
                {user?.email || 'alex@email.com'}
              </Typography>
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                }}
              />
              <Badge
                sx={{ bgcolor: 'rgba(34, 197, 94, 0.08)', color: '#22C55E' }}
              >
                {t('settings.focusStyleBadge')}
              </Badge>
            </Stack>
          </Box>
        </UserProfileSummary>

        {/* Active Tab Panel */}
        <Box>
          {activeTab === SettingsTab.Schedule && <ScheduleSettings />}
          {activeTab === SettingsTab.Focus && <FocusEngineSettings />}
          {activeTab === SettingsTab.Notifications && <NotificationSettings />}
          {activeTab === SettingsTab.Account && <AccountSettings />}
          {activeTab === SettingsTab.Integrations && <IntegrationsSettings />}
          {activeTab === SettingsTab.Appearance && <AppearanceSettings />}
          {activeTab === SettingsTab.Security && <SecuritySettings />}
        </Box>
      </ContentArea>
    </SettingsLayout>
  );
};

export default Settings;
