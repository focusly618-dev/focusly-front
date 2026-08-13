import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Box,
  Button,
  Avatar,
  Stack,
  InputAdornment,
  SvgIcon,
  type SvgIconProps,
} from '@mui/material';
import {
  ProfilePageContainer,
  TopBar,
  ContentContainer,
  Sidebar,
  MainContent,
  UserCard,
  MenuButton,
  SectionCard,
  DarkInput,
} from './Profile.styles';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  WorkOutline as JobIcon,
  Translate as LanguageIcon,
} from '@mui/icons-material';
import { useProfile } from './hooks/useProfile.hook';
import { ScheduleSettings } from '../Settings/components/ScheduleSettings';
import { FocusEngineSettings } from '../Settings/components/FocusEngineSettings';
import { NotificationSettings } from '../Settings/components/NotificationSettings';
import { LanguageSelector } from '@/components/ui';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const {
    user,
    fullName,
    setFullName,
    jobTitle,
    setJobTitle,
    email,
    setEmail,
    bio,
    setBio,
    handleLogout,
    getInitials,
    cancelEdit,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'schedule' | 'focus' | 'notifications'
  >('profile');

  return (
    <ProfilePageContainer>
      {/* Top Bar */}
      <TopBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BoltIcon sx={{ color: 'primary.contrastText' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {t('profile.brand')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {activeTab === 'profile' && (
            <>
              <Button
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
                onClick={cancelEdit}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                {t('common.save')}
              </Button>
            </>
          )}
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{
              width: 32,
              height: 32,
              border: '2px solid',
              borderColor: 'divider',
            }}
          >
            {getInitials(user?.name)}
          </Avatar>
        </Box>
      </TopBar>

      <ContentContainer>
        {/* Sidebar */}
        <Sidebar>
          <UserCard sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Avatar
              src={user?.picture}
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                {user?.name || 'Alex Morgan'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('profile.plan')}
              </Typography>
            </Box>
          </UserCard>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: 0.5,
              flex: 1,
              overflowX: { xs: 'auto', md: 'visible' },
              width: '100%',
              whiteSpace: 'nowrap',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <MenuButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              startIcon={<PersonIcon />}
            >
              {t('profile.nav.general')}
            </MenuButton>
            <MenuButton
              active={activeTab === 'schedule'}
              onClick={() => setActiveTab('schedule')}
              startIcon={<ScheduleIcon />}
            >
              {t('profile.nav.schedule')}
            </MenuButton>
            <MenuButton
              active={activeTab === 'focus'}
              onClick={() => setActiveTab('focus')}
              startIcon={<BoltIcon />}
            >
              {t('profile.nav.focus')}
            </MenuButton>
            <MenuButton
              active={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
              startIcon={<NotificationsIcon />}
            >
              {t('profile.nav.notifications')}
            </MenuButton>
          </Box>

          <Button
            startIcon={<LogoutIcon />}
            sx={{
              color: 'text.secondary',
              justifyContent: 'flex-start',
              textTransform: 'none',
              mt: { xs: 0, md: 2 },
              ml: { xs: 1.5, md: 0 },
              flexShrink: 0,
              '&:hover': { color: 'error.main', bgcolor: 'action.hover' },
            }}
            onClick={handleLogout}
          >
            {t('profile.nav.logout')}
          </Button>
        </Sidebar>

        {/* Main Content */}
        <MainContent>
          {activeTab === 'profile' && (
            <>
              <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {t('profile.general.title')}
                </Typography>
                <Typography color="text.secondary">
                  {t('profile.general.subtitle')}
                </Typography>
              </Box>

              {/* Profile Picture Section */}
              <SectionCard>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
                >
                  <PersonIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    {t('profile.general.picture.title')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={user?.picture}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: '#a7f3d0',
                      color: '#065f46',
                      fontSize: '2rem',
                    }}
                  >
                    <img
                      alt="avatar"
                      src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t('profile.general.picture.avatarTitle')}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={2}
                    >
                      {t('profile.general.picture.avatarDesc')}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        sx={{
                          color: 'text.secondary',
                          borderColor: 'divider',
                          textTransform: 'none',
                          bgcolor: 'action.hover',
                          '&:hover': {
                            borderColor: 'text.primary',
                            bgcolor: 'action.selected',
                          },
                        }}
                      >
                        {t('profile.general.picture.upload')}
                      </Button>
                      <Button
                        sx={{ color: 'error.main', textTransform: 'none' }}
                      >
                        {t('profile.general.picture.remove')}
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </SectionCard>

              {/* Personal Information Section */}
              <SectionCard>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
                >
                  <PersonIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    {t('profile.general.personal.title')}
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <Stack direction="row" spacing={3}>
                    <Box flex={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mb={1}
                        display="block"
                      >
                        {t('profile.general.personal.fullName')}
                      </Typography>
                      <DarkInput
                        fullWidth
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mb={1}
                        display="block"
                      >
                        {t('profile.general.personal.jobTitle')}
                      </Typography>
                      <DarkInput
                        fullWidth
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <JobIcon
                                sx={{ color: 'text.secondary', fontSize: 20 }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Stack>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mb={1}
                      display="block"
                    >
                      {t('profile.general.personal.email')}
                    </Typography>
                    <DarkInput
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon
                              sx={{ color: 'text.secondary', fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mb={1}
                      display="block"
                    >
                      {t('profile.general.personal.bio')}
                    </Typography>
                    <DarkInput
                      fullWidth
                      multiline
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      helperText={
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', float: 'right' }}
                        >
                          {t('profile.general.personal.bioCounter', {
                            count: bio.length,
                          })}
                        </Typography>
                      }
                    />
                  </Box>
                </Stack>
              </SectionCard>

              {/* Language Section */}
              <SectionCard>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LanguageIcon sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {t('settings.language.title')}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {t('settings.language.subtitle')}
                      </Typography>
                    </Box>
                  </Box>
                  <LanguageSelector variant="full" />
                </Box>
              </SectionCard>
            </>
          )}

          {activeTab === 'schedule' && <ScheduleSettings />}
          {activeTab === 'focus' && <FocusEngineSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </MainContent>
      </ContentContainer>
    </ProfilePageContainer>
  );
};

const BoltIcon = (props: SvgIconProps) => (
  <SvgIcon
    {...props}
    sx={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2, ...props.sx }}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </SvgIcon>
);

export default Profile;
