import { useState } from 'react';
import { Box, Typography, Avatar, Stack } from '@mui/material';
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
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { NotificationSettings } from './components/NotificationSettings';
import { FocusEngineSettings } from './components/FocusEngineSettings';
import { ScheduleSettings } from './components/ScheduleSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { SettingsTab } from './Settings.types';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(SettingsTab.Schedule);
  const user = useSelector((state: RootState) => state.auth.user);

  const getHeaderContent = () => {
    switch (activeTab) {
      case SettingsTab.Schedule:
        return {
          title: 'Schedule & Energy Rhythm',
          description:
            'Configure your availability, work rhythm, and let our AI optimize your peak productivity windows.',
        };
      case SettingsTab.Focus:
        return {
          title: 'Focus Control Center',
          description:
            'Define your focus and break block duration and manage distraction shield parameters.',
        };
      case SettingsTab.Notifications:
        return {
          title: 'Notification Channels',
          description:
            'Control how and when you receive alerts for focus sessions, breaks, and digests.',
        };
      case SettingsTab.Security:
        return {
          title: 'Security & Account',
          description:
            'Manage your authentication sessions and delete or sign out of your account.',
        };
      default:
        return {
          title: 'Productivity Profile',
          description: 'Manage your focus system and identity preferences.',
        };
    }
  };

  const header = getHeaderContent();

  const tabs = [
    {
      id: SettingsTab.Schedule,
      label: 'Schedule & Energy',
      icon: <AccessTimeIcon />,
    },
    {
      id: SettingsTab.Focus,
      label: 'Focus Engine',
      icon: <PrecisionManufacturingIcon />,
    },
    {
      id: SettingsTab.Notifications,
      label: 'Notifications',
      icon: <NotificationsNoneIcon />,
    },
    { id: SettingsTab.Security, label: 'Security', icon: <SecurityIcon /> },
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
                Focus Style: Deep Work Creator
              </Badge>
            </Stack>
          </Box>
        </UserProfileSummary>

        {/* Active Tab Panel */}
        <Box>
          {activeTab === SettingsTab.Schedule && <ScheduleSettings />}
          {activeTab === SettingsTab.Focus && <FocusEngineSettings />}
          {activeTab === SettingsTab.Notifications && <NotificationSettings />}
          {activeTab === SettingsTab.Security && <SecuritySettings />}
        </Box>
      </ContentArea>
    </SettingsLayout>
  );
};

export default Settings;
