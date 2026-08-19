import React, { useState } from 'react';
import { Typography, Box, Stack, Divider, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Schedule, WbSunny, NightsStay, Lock } from '@mui/icons-material';
import {
  ProgressBarContainer,
  ProgressBarTrack,
  ProgressBarFill,
  HeroContainer,
  HeroDecoration,
  DayButton,
  TimeInputContainer,
  TimeInput,
} from '../Dashboard.styles';

import { useAppSelector } from '@/redux/hooks';
import { UserUpdate, type UserResponse } from '@/api/User/apiUser';

interface WorkHoursStepProps {
  onNext: () => void;
}

const WorkHoursStep: React.FC<WorkHoursStepProps> = ({ onNext }) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const days = [
    { label: t('onboarding.workHours.days.mon'), value: 'Mon' },
    { label: t('onboarding.workHours.days.tue'), value: 'Tue' },
    { label: t('onboarding.workHours.days.wed'), value: 'Wed' },
    { label: t('onboarding.workHours.days.thu'), value: 'Thu' },
    { label: t('onboarding.workHours.days.fri'), value: 'Fri' },
    { label: t('onboarding.workHours.days.sat'), value: 'Sat' },
    { label: t('onboarding.workHours.days.sun'), value: 'Sun' },
  ];

  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = async () => {
    if (user?.id) {
      try {
        const currentSettings = (user.settings ?? {}) as Record<
          string,
          unknown
        >;
        await UserUpdate(user.id, {
          settings: {
            ...currentSettings,
            workHoursConfig: {
              selectedDays,
              startTime,
              endTime,
            },
          },
        } as Partial<UserResponse>);
      } catch (error) {
        console.error('Failed to save work hours', error);
      }
    }
    onNext();
  };

  return (
    <>
      <ProgressBarContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight="500">
            {t('onboarding.progress.step', { current: 3, total: 4 })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('onboarding.progress.percentCompleted', { percent: 75 })}
          </Typography>
        </Box>
        <ProgressBarTrack>
          <ProgressBarFill width="75%" />
        </ProgressBarTrack>
      </ProgressBarContainer>

      <Box px={2}>
        <HeroContainer>
          <HeroDecoration />
          <Box
            position="relative"
            zIndex={10}
            p={3}
            bgcolor="background.paper"
            borderRadius="16px"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1.5}
            border="1px solid"
            borderColor="divider"
          >
            <Schedule sx={{ fontSize: 40, color: 'primary.main' }} />
            <Stack direction="row" spacing={1}>
              <Box
                width={6}
                height={6}
                borderRadius="50%"
                bgcolor="rgba(19, 127, 236, 0.4)"
              />
              <Box
                width={6}
                height={6}
                borderRadius="50%"
                bgcolor="rgba(19, 127, 236, 0.6)"
              />
              <Box width={6} height={6} borderRadius="50%" bgcolor="#137fec" />
            </Stack>
          </Box>
        </HeroContainer>

        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            fontWeight="900"
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}
          >
            {t('onboarding.workHours.heading')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('onboarding.workHours.subheading')}
          </Typography>
        </Box>

        <Box
          bgcolor="background.paper"
          p={3}
          borderRadius="12px"
          border="1px solid"
          borderColor="divider"
          boxShadow="0 1px 2px 0 rgba(0, 0, 0, 0.05)"
          mb={4}
        >
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1.5}
              >
                <Typography variant="body2" fontWeight="bold">
                  {t('onboarding.workHours.workDays')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('onboarding.workHours.monToFri')}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" gap={1}>
                {days.map((day) => (
                  <DayButton
                    key={day.value} // Value is unique (Mon, Tue, etc.)
                    selected={selectedDays.includes(day.value)}
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </DayButton>
                ))}
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="body2" fontWeight="bold" mb={1.5}>
                {t('onboarding.workHours.dailySchedule')}
              </Typography>
              <Box display="flex" gap={2}>
                <Box width="50%">
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      {t('onboarding.workHours.startTime')}
                    </Typography>
                    <TimeInputContainer>
                      <WbSunny
                        sx={{
                          position: 'absolute',
                          left: '12px',
                          fontSize: '20px',
                          color: 'text.secondary',
                        }}
                      />
                      <TimeInput
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </TimeInputContainer>
                  </Box>
                </Box>
                <Box width="50%">
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      {t('onboarding.workHours.endTime')}
                    </Typography>
                    <TimeInputContainer>
                      <NightsStay
                        sx={{
                          position: 'absolute',
                          left: '12px',
                          fontSize: '20px',
                          color: 'text.secondary',
                        }}
                      />
                      <TimeInput
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </TimeInputContainer>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{
            py: 1.5,
            bgcolor: 'primary.main',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 10px 15px -3px rgba(19, 127, 236, 0.25)',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          {t('onboarding.saveAndContinue')}
        </Button>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          mt={3}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="500"
            sx={{
              cursor: 'pointer',
              transition: 'color 0.2s',
              '&:hover': { color: 'text.primary' },
            }}
            onClick={onNext}
          >
            {t('onboarding.workHours.setLater')}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            bgcolor="background.paper"
            px={1.5}
            py={0.75}
            borderRadius="999px"
            border="1px solid"
            borderColor="divider"
          >
            <Lock sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {t('onboarding.workHours.privacyNote')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default WorkHoursStep;
