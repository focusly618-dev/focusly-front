import React from 'react';
import {
  Box,
  Button,
  ButtonBase,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  FileDownloadOutlined,
  Add,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { surfaceColor } from '@/context';
import { brand } from '@/styles/mui';
import type { InsightsHeaderProps } from './InsightsHeader.types';

const actionButtonSx = {
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'none',
  px: 1.5,
  py: 1,
  gap: 0.75,
  minWidth: 0,
  '& .MuiButton-startIcon': { m: 0 },
} as const;

const navButtonSx = {
  p: 0.5,
  borderRadius: '8px',
  color: 'text.secondary',
  transition: 'background-color 0.15s ease',
  '&.Mui-disabled': { opacity: 0.4 },
} as const;

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  filter,
  filters,
  onFilterChange,
  baseDate,
  onNavigate,
  onReset,
  periodLabel,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const periodKeyMap: Record<string, string> = {
    Daily: 'daily',
    Weekly: 'weekly',
    Monthly: 'monthly',
    Yearly: 'yearly',
  };
  const getPeriodLabel = (period: string) =>
    t(`insightsHeader.periods.${periodKeyMap[period] || 'yearly'}`);
  const pillBg = surfaceColor(
    theme,
    'rgba(30, 41, 59, 0.6)',
    'rgba(36, 36, 37, 0.6)',
    '#f1f5f9',
  );
  const selectedTabBg = surfaceColor(theme, '#334155', '#2A2A2C', '#ffffff');

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        mb: 3,
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              m: 0,
              fontSize: { xs: '24px', sm: '30px' },
              lineHeight: { xs: '32px', sm: '36px' },
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'text.primary',
            }}
          >
            {t('insightsHeader.title', { period: getPeriodLabel(filter) })}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: { xs: '12px', sm: '14px' },
              color: 'text.secondary',
            }}
          >
            {t('insightsHeader.subtitle')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined sx={{ fontSize: 16 }} />}
            sx={{
              ...actionButtonSx,
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          >
            {t('insightsHeader.export')}
          </Button>

          <Button
            variant="contained"
            disableElevation
            startIcon={<Add sx={{ fontSize: 16 }} />}
            sx={{
              ...actionButtonSx,
              px: 2,
              bgcolor: brand.main,
              color: '#ffffff',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              '&:hover': { bgcolor: brand.hover },
            }}
          >
            {t('insightsHeader.createReport')}
          </Button>
        </Box>
      </Box>

      {/* Filter Tabs & Date Navigation */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <ToggleButtonGroup
          exclusive
          value={filter}
          onChange={(_e, value: typeof filter | null) => {
            if (value) onFilterChange(value);
          }}
          sx={{
            p: 0.5,
            gap: 0.5,
            borderRadius: '16px',
            bgcolor: pillBg,
            border: 1,
            borderColor: 'divider',
          }}
        >
          {filters.map((f) => (
            <ToggleButton
              key={f}
              value={f}
              disableRipple
              sx={{
                px: 2,
                py: 0.75,
                border: 'none',
                borderRadius: '12px !important',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                textTransform: 'none',
                color: 'text.secondary',
                transition: 'all 0.15s ease',
                '&.Mui-selected, &.Mui-selected:hover': {
                  bgcolor: selectedTabBg,
                  color: 'primary.main',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              {getPeriodLabel(f)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {filter === 'Monthly' && onNavigate && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderRadius: '16px',
              px: 1,
              py: 0.5,
              bgcolor: pillBg,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <ButtonBase
              onClick={() => onNavigate('prev')}
              aria-label={t('insightsHeader.previousMonth')}
              sx={navButtonSx}
            >
              <ChevronLeftIcon sx={{ fontSize: 14 }} />
            </ButtonBase>

            <Typography
              component="span"
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                minWidth: 90,
                textAlign: 'center',
                userSelect: 'none',
                color: 'text.primary',
              }}
            >
              {periodLabel}
            </Typography>

            <ButtonBase
              onClick={() => onNavigate('next')}
              aria-label={t('insightsHeader.nextMonth')}
              disabled={!baseDate}
              sx={navButtonSx}
            >
              <ChevronRightIcon sx={{ fontSize: 14 }} />
            </ButtonBase>

            {baseDate && onReset && (
              <ButtonBase
                onClick={onReset}
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  px: 0.5,
                  ml: 0.5,
                  color: 'primary.main',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {t('calendar.today')}
              </ButtonBase>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
