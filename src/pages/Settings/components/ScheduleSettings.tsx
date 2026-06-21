import { useState } from 'react';
import { Box, Switch, Typography } from '@mui/material';
import {
  CalendarMonthOutlined as CalendarIcon,
  BoltOutlined as EnergyIcon,
} from '@mui/icons-material';
import {
  SectionCard,
  AICard,
  SectionHeader,
  SectionTitle,
  Badge,
  WeeklyContainer,
  DayPill,
  SmartToggleCard,
  SmartCardTitle,
  SmartCardDesc,
  SliderHeader,
  SliderLabel,
  SliderValue,
  PremiumSlider,
} from '../Settings.styles';

export const ScheduleSettings = () => {
  // Work Rhythm States
  const [activeDays, setActiveDays] = useState<string[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ]);
  const [workHours, setWorkHours] = useState<number[]>([9, 17]);
  const [lunchProtected, setLunchProtected] = useState(true);
  const [protectGoldenHours, setProtectGoldenHours] = useState(true);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleHoursChange = (_e: Event, newValue: number | number[]) => {
    setWorkHours(newValue as number[]);
  };

  const formatHour = (hourVal: number) => {
    const period = hourVal >= 12 ? 'PM' : 'AM';
    let displayHour = hourVal % 12;
    if (displayHour === 0) displayHour = 12;
    return `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
  };

  const switchStyles = {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#6366F1',
      '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#6366F1',
    },
  };

  return (
    <Box>
      {/* Work Rhythm Card */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <CalendarIcon />
            </Box>
            <Typography>Your Work Rhythm</Typography>
          </SectionTitle>
        </SectionHeader>

        {/* Work Days Pill Selector */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}
          >
            Work Days
          </Typography>
          <WeeklyContainer>
            {daysOfWeek.map((day) => {
              const isActive = activeDays.includes(day);
              return (
                <DayPill
                  key={day}
                  active={isActive}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </DayPill>
              );
            })}
          </WeeklyContainer>
        </Box>

        {/* Daily Schedule Timeline Slider */}
        <Box sx={{ mb: 4 }}>
          <SliderHeader>
            <SliderLabel>Daily Schedule</SliderLabel>
            <SliderValue>
              {formatHour(workHours[0])} — {formatHour(workHours[1])}
            </SliderValue>
          </SliderHeader>
          <PremiumSlider
            value={workHours}
            onChange={handleHoursChange}
            min={5}
            max={22}
            step={1}
            valueLabelDisplay="off"
          />
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mt: -0.5 }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              05:00 AM
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              10:00 PM
            </Typography>
          </Box>
        </Box>

        {/* Lunch Protection */}
        <SmartToggleCard>
          <Box>
            <SmartCardTitle>Protect recovery time</SmartCardTitle>
            <SmartCardDesc>Smart flexible 45 min lunch window</SmartCardDesc>
          </Box>
          <Switch
            checked={lunchProtected}
            onChange={(e) => setLunchProtected(e.target.checked)}
            sx={switchStyles}
          />
        </SmartToggleCard>
      </SectionCard>

      {/* Energy Section - AI Golden Hours */}
      <AICard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper" sx={{ color: '#F59E0B' }}>
              <EnergyIcon />
            </Box>
            <Typography>Your Golden Hours</Typography>
          </SectionTitle>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Badge
              sx={{ bgcolor: 'rgba(99, 102, 241, 0.08)', color: '#6366F1' }}
            >
              AI BETA
            </Badge>
            <Badge
              sx={{ bgcolor: 'rgba(34, 197, 94, 0.08)', color: '#22C55E' }}
            >
              High Confidence
            </Badge>
          </Box>
        </SectionHeader>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            09:00 AM - 11:30 AM
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            This is your highest energy window. Focusly schedules deep focus
            work during this period.
          </Typography>

          {/* Custom SVG Curve representing energy peaks */}
          <Box
            sx={{
              height: 120,
              width: '100%',
              bgcolor: 'rgba(99, 102, 241, 0.01)',
              borderRadius: '16px',
              border: '1px solid rgba(99, 102, 241, 0.04)',
              p: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 500 80"
              preserveAspectRatio="none"
              style={{ display: 'block', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.25)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0.00)" />
                </linearGradient>
              </defs>

              {/* Energy peak path filled */}
              <path
                d="M0,80 Q70,75 120,20 T200,80 T300,75 T420,40 Q460,78 500,80 L500,80 L0,80 Z"
                fill="url(#curveGradient)"
              />

              {/* Peak energy curve line */}
              <path
                d="M0,80 Q70,75 120,20 T200,80 T300,75 T420,40 Q460,78 500,80"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Dotted indicator for Golden Hours */}
              <line
                x1="120"
                y1="20"
                x2="120"
                y2="80"
                stroke="#6366F1"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <circle cx="120" cy="20" r="4" fill="#6366F1" />
            </svg>

            {/* Labels overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 15,
                left: '25%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{ fontSize: '9px', fontWeight: 800, color: '#6366F1' }}
              >
                ENERGY PEAK
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}
            >
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                09:00 AM
              </Typography>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                01:00 PM
              </Typography>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                05:00 PM
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Protect Golden Hours Toggle Card */}
        <SmartToggleCard
          sx={{
            bgcolor: 'rgba(99, 102, 241, 0.02)',
            borderColor: 'rgba(99, 102, 241, 0.08)',
          }}
        >
          <Box>
            <SmartCardTitle>Auto-protect Golden Hours</SmartCardTitle>
            <SmartCardDesc>
              Focusly will automatically protect your highest performance hours.
            </SmartCardDesc>
          </Box>
          <Switch
            checked={protectGoldenHours}
            onChange={(e) => setProtectGoldenHours(e.target.checked)}
            sx={switchStyles}
          />
        </SmartToggleCard>
      </AICard>
    </Box>
  );
};
