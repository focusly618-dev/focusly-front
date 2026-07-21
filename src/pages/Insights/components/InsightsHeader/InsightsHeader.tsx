import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import {
  FileDownloadOutlined,
  Add,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { HeaderContainer, ActionButton } from '../../Insights.styles';
import type { InsightsHeaderProps } from './InsightsHeader.types';

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  filter,
  filters,
  onFilterChange,
  baseDate,
  onNavigate,
  onReset,
  periodLabel,
}) => {
  return (
    <HeaderContainer>
      {/* Title and Actions Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4, width: '100%' }}
      >
        {/* Title Header */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: '28px',
            }}
          >
            {filter === 'Daily'
              ? 'Daily'
              : filter === 'Weekly'
                ? 'Weekly'
                : filter === 'Monthly'
                  ? 'Monthly'
                  : 'Yearly'}{' '}
            Insights
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 0.5, fontSize: '13px' }}
          >
            Productivity Summary & Analytics
          </Typography>
        </Box>

        {/* Actions (Export & Create Report) */}
        <Box display="flex" alignItems="center" gap={2}>
          <ActionButton>
            <FileDownloadOutlined fontSize="small" />
            Export
          </ActionButton>
          <ActionButton
            primary
            sx={{
              bgcolor: 'primary.main',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 700,
            }}
          >
            <Add fontSize="small" />
            Create Report
          </ActionButton>
        </Box>
      </Box>

      {/* Filter Tabs Pill Group */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.04)',
            borderRadius: '30px',
            p: 0.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {filters.map((f) => {
            const isSelected = filter === f;
            return (
              <Button
                key={f}
                onClick={() => onFilterChange(f)}
                sx={{
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3,
                  py: 0.75,
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  bgcolor: isSelected
                    ? (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : '#ffffff'
                    : 'transparent',
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  minWidth: '70px',
                  '&:hover': {
                    bgcolor: isSelected
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12)'
                            : '#ffffff'
                      : 'action.hover',
                  },
                }}
              >
                {f}
              </Button>
            );
          })}
        </Box>

        {filter === 'Monthly' && onNavigate && (
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            sx={{
              backgroundColor: 'action.hover',
              borderRadius: '20px',
              px: 1,
              py: 0.25,
            }}
          >
            <IconButton
              size="small"
              onClick={() => onNavigate('prev')}
              aria-label="Previous month"
              sx={{ p: 0.25 }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <Typography
              variant="caption"
              fontWeight="600"
              sx={{
                minWidth: '100px',
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {periodLabel}
            </Typography>

            <IconButton
              size="small"
              onClick={() => onNavigate('next')}
              aria-label="Next month"
              disabled={!baseDate}
              sx={{ p: 0.25 }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>

            {baseDate && onReset && (
              <Button
                size="small"
                onClick={onReset}
                variant="text"
                sx={{
                  ml: 0.5,
                  fontSize: '9px',
                  textTransform: 'none',
                  minWidth: 'auto',
                  p: 0,
                  fontWeight: 'bold',
                }}
              >
                Today
              </Button>
            )}
          </Box>
        )}
      </Box>
    </HeaderContainer>
  );
};
